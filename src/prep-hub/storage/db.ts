import { AnswerEvent, PracticeSession } from "../domain/types";

const DB_NAME = "CAU_PREP_HUB_DB";
const DB_VERSION = 1;

export class PrepHubDb {
  private db: IDBDatabase | null = null;
  private initPromise: Promise<IDBDatabase> | null = null;

  async getDb(): Promise<IDBDatabase> {
    if (this.db) return this.db;
    if (this.initPromise) return this.initPromise;

    if (typeof indexedDB === "undefined") {
      throw new Error("IndexedDB is not supported in this environment");
    }

    this.initPromise = new Promise<IDBDatabase>((resolve, reject) => {
      const request = indexedDB.open(DB_NAME, DB_VERSION);

      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result;

        // 1. Answer events (immutable records)
        if (!db.objectStoreNames.contains("answer_events")) {
          const store = db.createObjectStore("answer_events", { keyPath: "id" });
          store.createIndex("by_question", "questionId", { unique: false });
          store.createIndex("by_skill", "skill", { unique: false });
          store.createIndex("by_errorTag", "errorTag", { unique: false });
          store.createIndex("by_timestamp", "timestamp", { unique: false });
          store.createIndex("by_session", "sessionId", { unique: false });
        }

        // 2. Sessions
        if (!db.objectStoreNames.contains("sessions")) {
          const store = db.createObjectStore("sessions", { keyPath: "id" });
          store.createIndex("by_mode", "mode", { unique: false });
          store.createIndex("by_level", "level", { unique: false });
        }

        // 3. Mastery records
        if (!db.objectStoreNames.contains("mastery")) {
          db.createObjectStore("mastery", { keyPath: "id" });
        }

        // 4. Mistakes / Review queue
        if (!db.objectStoreNames.contains("mistakes")) {
          const store = db.createObjectStore("mistakes", { keyPath: "questionId" });
          store.createIndex("by_errorTag", "errorTag", { unique: false });
        }
      };

      request.onsuccess = (event) => {
        this.db = (event.target as IDBOpenDBRequest).result;
        resolve(this.db);
      };

      request.onerror = (event) => {
        reject((event.target as IDBOpenDBRequest).error);
      };
    });

    return this.initPromise;
  }

  async saveAnswerEvent(event: AnswerEvent): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["answer_events", "mistakes"], "readwrite");
      const eventStore = tx.objectStore("answer_events");
      const mistakeStore = tx.objectStore("mistakes");

      eventStore.put(event);

      if (!event.correct) {
        mistakeStore.put({
          questionId: event.questionId,
          errorTag: event.errorTag,
          lastFailedAt: event.timestamp,
          reviewCount: 0,
        });
      } else {
        // If answered correctly, remove or demote in review queue
        mistakeStore.delete(event.questionId);
      }

      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllAnswerEvents(): Promise<AnswerEvent[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("answer_events", "readonly");
      const store = tx.objectStore("answer_events");
      const request = store.getAll();

      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async saveSession(session: PracticeSession): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sessions", "readwrite");
      tx.objectStore("sessions").put(session);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  async getAllSessions(): Promise<PracticeSession[]> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("sessions", "readonly");
      const request = tx.objectStore("sessions").getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async getMistakes(): Promise<Array<{ questionId: string; errorTag: string; lastFailedAt: number }>> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction("mistakes", "readonly");
      const request = tx.objectStore("mistakes").getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
    });
  }

  async clearAllData(): Promise<void> {
    const db = await this.getDb();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(["answer_events", "sessions", "mastery", "mistakes"], "readwrite");
      tx.objectStore("answer_events").clear();
      tx.objectStore("sessions").clear();
      tx.objectStore("mastery").clear();
      tx.objectStore("mistakes").clear();
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }
}

export const prepDb = new PrepHubDb();
