import React, { useState, useId } from "react";
import { trpc } from "@/lib/trpc";
import DashboardLayout from "./DashboardLayout";
import { Newspaper, Plus, Edit2, Trash2, Calendar, User, Eye, X, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const fieldCls = "w-full px-3 py-2 rounded-md border text-xs outline-none transition-colors bg-transparent";
const fieldStyle = { borderColor: "var(--cau-border)" };

// ── Skeleton Card ─────────────────────────────────────────────────────────────
function SkeletonNewsCard() {
  return (
    <div className="ds-card overflow-hidden flex flex-col">
      <div className="ds-skeleton w-full h-40" style={{ borderRadius: 0 }} />
      <div className="p-5 flex-1">
        <div className="flex items-center gap-2 mb-3">
          <div className="ds-skeleton h-2.5 w-20 rounded" />
          <div className="ds-skeleton h-2.5 w-2.5 rounded-full" />
          <div className="ds-skeleton h-2.5 w-24 rounded" />
        </div>
        <div className="ds-skeleton h-4 w-full rounded mb-1.5" />
        <div className="ds-skeleton h-4 w-4/5 rounded mb-3" />
        <div className="ds-skeleton h-3 w-full rounded mb-1" />
        <div className="ds-skeleton h-3 w-3/4 rounded" />
      </div>
      <div className="p-4 pt-0 border-t flex items-center justify-between" style={{ borderColor: "var(--cau-border)" }}>
        <div className="ds-skeleton h-3 w-20 rounded" />
        <div className="ds-skeleton h-6 w-16 rounded" />
      </div>
    </div>
  );
}

const categories = ["Academic", "Campus Life", "International", "Research", "Announcements"] as const;
type Category = typeof categories[number];

export default function NewsPage() {
  const { data: newsList, isLoading, refetch } = trpc.cms.news.list.useQuery();
  const [isModalOpen, setIsModalOpen]           = useState(false);
  const [selectedNews, setSelectedNews]          = useState<any | null>(null);
  const [deleteTarget, setDeleteTarget]          = useState<{ id: string; title: string } | null>(null);
  const titleId = useId();

  const [formData, setFormData] = useState({
    title:    "",
    category: "Academic" as Category,
    summary:  "",
    content:  "",
    author:   "CAU Media Relations",
    image:    "/assets/untitled2-13-24f9b4bd8b_652e8d35.jpg",
    status:   "published" as "published" | "draft" | "archived",
  });

  const upsertMutation = trpc.cms.news.upsert.useMutation({
    onSuccess: () => {
      toast.success(selectedNews ? "Announcement updated." : "New announcement published.");
      refetch();
      setIsModalOpen(false);
    },
    onError: (err) => toast.error(`Failed to save: ${err.message}`),
  });

  const deleteMutation = trpc.cms.news.delete.useMutation({
    onSuccess: () => {
      toast.success("News item deleted.");
      setDeleteTarget(null);
      refetch();
    },
    onError: (err) => toast.error(`Failed to delete: ${err.message}`),
  });

  const handleEdit = (item: any) => {
    setSelectedNews(item);
    setFormData({ title: item.title, category: item.category, summary: item.summary, content: item.content, author: item.author, image: item.image || "/assets/untitled2-13-24f9b4bd8b_652e8d35.jpg", status: item.status });
    setIsModalOpen(true);
  };

  const handleCreate = () => {
    setSelectedNews(null);
    setFormData({ title: "", category: "Academic", summary: "", content: "", author: "CAU Media Relations", image: "/assets/untitled2-13-24f9b4bd8b_652e8d35.jpg", status: "published" });
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) { toast.error("Please provide a title."); return; }
    upsertMutation.mutate({ id: selectedNews?.id, ...formData });
  };

  const statusStyle = (status: string) =>
    status === "published"
      ? { backgroundColor: "#059669", color: "#fff" }
      : { backgroundColor: "#d97706", color: "#fff" };

  return (
    <DashboardLayout
      title="News & Campus Announcements"
      subtitle="Publish press releases, event announcements, and research milestones."
      action={
        <Button onClick={handleCreate} size="sm" className="text-xs h-9 font-semibold text-white"
          style={{ backgroundColor: "var(--cau-brand)" }}
          onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
          onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}>
          <Plus className="w-3.5 h-3.5 mr-1.5" /> Post Announcement
        </Button>
      }
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {isLoading ? (
            [1,2,3].map(i => <SkeletonNewsCard key={i} />)
          ) : !newsList?.length ? (
            <div className="col-span-3">
              <div className="ds-card ds-empty">
                <div className="ds-empty-icon"><Newspaper className="w-6 h-6" /></div>
                <p className="ds-h3 text-sm">No announcements yet</p>
                <p className="ds-caption">Post your first campus announcement to keep the university informed.</p>
                <Button size="sm" className="mt-1 text-xs text-white" style={{ backgroundColor: "var(--cau-brand)" }} onClick={handleCreate}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Post First Announcement
                </Button>
              </div>
            </div>
          ) : (
            newsList.map((item) => (
              <div key={item.id} className="ds-card ds-card-hover overflow-hidden flex flex-col justify-between">
                <div>
                  {/* Image */}
                  <div className="h-40 overflow-hidden relative" style={{ backgroundColor: "#18181b" }}>
                    <img
                      src={item.image} alt={item.title}
                      className="w-full h-full object-cover opacity-90 hover:scale-105 transition-transform duration-300"
                    />
                    <span
                      className="absolute top-3 left-3 px-2 py-0.5 rounded text-white text-[10px] font-bold uppercase tracking-wider"
                      style={{ backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)" }}
                    >
                      {item.category}
                    </span>
                    <span
                      className="absolute top-3 right-3 px-2 py-0.5 rounded text-[10px] font-bold"
                      style={statusStyle(item.status)}
                    >
                      {item.status}
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-5">
                    <div className="flex items-center gap-2 text-[11px] mb-2" style={{ color: "var(--cau-text-secondary)" }}>
                      <Calendar className="w-3 h-3" />
                      <span>{item.publishedAt}</span>
                      <span>•</span>
                      <User className="w-3 h-3" />
                      <span>{item.author}</span>
                    </div>
                    <h3 className="ds-h3 text-sm line-clamp-2">{item.title}</h3>
                    <p className="ds-caption mt-2 line-clamp-3 leading-relaxed">{item.summary}</p>
                  </div>
                </div>

                {/* Footer */}
                <div className="p-4 pt-0 border-t flex items-center justify-between text-xs" style={{ borderColor: "var(--cau-border)" }}>
                  <a href="/news.html" target="_blank" rel="noopener noreferrer"
                    className="font-semibold hover:underline inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 rounded"
                    style={{ color: "var(--cau-brand)" }}>
                    View on Site <Eye className="w-3 h-3" />
                  </a>
                  <div className="flex items-center gap-1">
                    <button type="button" onClick={() => handleEdit(item)}
                      className="ds-btn-icon text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30"
                      title="Edit article" aria-label={`Edit: ${item.title}`}>
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button type="button" onClick={() => setDeleteTarget({ id: item.id, title: item.title })}
                      className="ds-btn-icon text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30"
                      title="Delete article" aria-label={`Delete: ${item.title}`}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Accessible Delete Confirmation ── */}
      <AlertDialog open={!!deleteTarget} onOpenChange={(open) => { if (!open) setDeleteTarget(null); }}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Announcement</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete <strong>"{deleteTarget?.title}"</strong>? This will remove it from the live site immediately.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteTarget && deleteMutation.mutate({ id: deleteTarget.id })}
              className="bg-rose-600 hover:bg-rose-700 text-white"
              disabled={deleteMutation.isPending}
            >
              {deleteMutation.isPending ? "Deleting…" : "Yes, Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* ── Article Editor Modal ── */}
      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
          style={{ backgroundColor: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)" }}
          role="dialog" aria-modal="true" aria-labelledby={titleId}
        >
          <div className="ds-modal w-full max-w-xl p-6 my-8 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-4 border-b mb-4" style={{ borderColor: "var(--cau-border)" }}>
              <h2 id={titleId} className="ds-h2">
                {selectedNews ? "Edit Campus Announcement" : "Create Campus Announcement"}
              </h2>
              <button type="button" onClick={() => setIsModalOpen(false)}
                className="ds-btn-icon rounded-full" aria-label="Close editor">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div>
                <label htmlFor="news-title" className="block font-bold text-foreground mb-1">Headline / Title *</label>
                <Input id="news-title" type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. CAU Welcomes International Scholars for Fall 2026 Term"
                  className="text-xs" />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="news-category" className="block font-bold text-foreground mb-1">Category</label>
                  <select id="news-category" value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value as Category })}
                    className={fieldCls} style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}>
                    {categories.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
                <div>
                  <label htmlFor="news-status" className="block font-bold text-foreground mb-1">Status</label>
                  <select id="news-status" value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className={fieldCls + " font-semibold"} style={{ ...fieldStyle, backgroundColor: "var(--cau-surface-1)" }}>
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="news-summary" className="block font-bold text-foreground mb-1">Brief Lead / Summary *</label>
                <textarea id="news-summary" rows={2} required value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="1-2 sentences summarizing the announcement..."
                  className={fieldCls + " resize-none"} style={fieldStyle} />
              </div>

              <div>
                <label htmlFor="news-content" className="block font-bold text-foreground mb-1">Detailed Content</label>
                <textarea id="news-content" rows={5} value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="Full article body..."
                  className={fieldCls + " leading-relaxed resize-none"} style={fieldStyle} />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="news-author" className="block font-bold text-foreground mb-1">Author / Office</label>
                  <Input id="news-author" type="text" value={formData.author}
                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                    className="text-xs" />
                </div>
                <div>
                  <label htmlFor="news-image" className="block font-bold text-foreground mb-1">Banner Image Path</label>
                  <Input id="news-image" type="text" value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="text-xs font-mono" />
                </div>
              </div>

              <div className="pt-4 border-t flex justify-end gap-2" style={{ borderColor: "var(--cau-border)" }}>
                <Button type="button" variant="outline" size="sm" onClick={() => setIsModalOpen(false)}
                  className="text-xs h-8">Cancel</Button>
                <Button type="submit" size="sm" disabled={upsertMutation.isPending}
                  aria-busy={upsertMutation.isPending}
                  className="text-xs h-8 font-semibold text-white" style={{ backgroundColor: "var(--cau-brand)" }}
                  onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand-hover)"; }}
                  onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.backgroundColor = "var(--cau-brand)"; }}>
                  <Save className="w-3.5 h-3.5 mr-1" />
                  {upsertMutation.isPending ? "Saving…" : "Save Announcement"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
