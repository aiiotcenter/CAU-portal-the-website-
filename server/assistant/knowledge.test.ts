import { describe, expect, it } from "vitest";
import {
  CAU_ASSISTANT_SYSTEM_PROMPT,
  CAU_SOURCES,
  createFallbackAnswer,
  sourcesForIds,
} from "./knowledge";

describe("CAU assistant verified knowledge", () => {
  it("distinguishes the documented student-affairs role from an unverified dean title", () => {
    const response = createFallbackAnswer("Who is the dean of students?");

    expect(response.answer).toContain("could not verify a staff member with the exact title");
    expect(response.answer).toContain("Burcu TUNAY");
    expect(response.sources).toContainEqual(CAU_SOURCES["student-affairs"]);
  });

  it("keeps sources constrained to the verified CAU source map", () => {
    const sources = sourcesForIds(["student-affairs", "not-an-official-source", "student-affairs"]);

    expect(sources).toEqual([CAU_SOURCES["student-affairs"]]);
  });

  it("responds warmly to conversation without attaching an unrelated source", () => {
    const response = createFallbackAnswer("How are you doing?");

    expect(response.answer).toContain("CAU’s public information assistant");
    expect(response.sources).toEqual([]);
  });

  it("provides the verified CAU overview when asked what the university is", () => {
    const response = createFallbackAnswer("What is CAU?");

    expect(response.answer).toContain("established in 2013");
    expect(response.sources).toEqual(expect.arrayContaining([CAU_SOURCES["about-cau"], CAU_SOURCES.home]));
  });

  it("contains the official programme catalogue coverage and unavailable-information rule", () => {
    expect(CAU_ASSISTANT_SYSTEM_PROMPT).toMatch(/48-record|47-record/);
    expect(CAU_ASSISTANT_SYSTEM_PROMPT).toContain("programme catalogue");
    expect(CAU_ASSISTANT_SYSTEM_PROMPT).toContain("I could not verify that detail");
    expect(CAU_ASSISTANT_SYSTEM_PROMPT).toContain("admission@cau.edu.tr");
  });

  it("identifies Frah Badawi with official role, email, and extension", () => {
    const response = createFallbackAnswer("Who is Frah?");

    expect(response.answer).toContain("Frah Badawi");
    expect(response.answer).toContain("fbadawi@cau.edu.tr");
    expect(response.answer).toContain("2104");
    expect(response.answer).toContain("Admissions & Settlement");
  });

  it("provides accurate, official handbook tuition schedule for Computer Engineering", () => {
    const response = createFallbackAnswer("What is the tuition fee for computer engineering?");

    expect(response.answer).toContain("Computer Engineering");
    expect(response.answer).toContain("$10,600");
    expect(response.answer).toContain("$5,600");
    expect(response.answer).toContain("$1,250");
    expect(response.answer).toContain("Hikmet Ş. Aybar");
  });

  it("identifies Mohamed Khattab with official title and email", () => {
    const response = createFallbackAnswer("Who is Mohamed Khattab?");

    expect(response.answer).toContain("Mohamed Khattab");
    expect(response.answer).toContain("mkhattab@cau.edu.tr");
    expect(response.answer).toContain("2103");
  });

  it("provides accurate dual-campus schedule for Dentistry", () => {
    const response = createFallbackAnswer("What are the fees for dentistry?");

    expect(response.answer).toContain("Dentistry");
    expect(response.answer).toContain("$22,600");
    expect(response.answer).toContain("$11,600");
    expect(response.answer).toContain("$37,100");
    expect(response.answer).toContain("Cem Kurtoğlu");
  });
});
