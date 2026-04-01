import { useState, useEffect } from "react";

const CATEGORIES = ["Work", "Learning", "Design", "Dev", "Tools", "News", "Finance", "Entertainment", "Other"];

const AddLinkModal = ({ isOpen, onClose, onSubmit, loading }) => {
  const [form, setForm] = useState({ title: "", url: "", category: "Dev" });
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isOpen) { setForm({ title: "", url: "", category: "Dev" }); setError(""); }
  }, [isOpen]);

  useEffect(() => {
    const handleKey = (e) => { if (e.key === "Escape") onClose(); };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.title.trim() || !form.url.trim()) return setError("Title and URL are required.");
    try { new URL(form.url); } catch { return setError("Please enter a valid URL (include https://)"); }
    await onSubmit(form);
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fade-up"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-md rounded-2xl border border-ink-800 bg-ink-900 p-6 animate-scale-in">
        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-display text-xl font-bold text-white">Add New Link</h2>
          <button onClick={onClose} className="rounded-lg p-1.5 text-muted hover:bg-ink-800 hover:text-white transition-colors">✕</button>
        </div>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Title</label>
            <input name="title" value={form.title} onChange={handleChange} placeholder="e.g. Tailwind Docs"
              className="w-full rounded-xl border border-ink-800 bg-ink-800 px-4 py-3 text-sm text-white placeholder-muted transition-colors focus:border-accent/50 focus:bg-ink-700 outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">URL</label>
            <input name="url" value={form.url} onChange={handleChange} placeholder="https://example.com"
              className="w-full rounded-xl border border-ink-800 bg-ink-800 px-4 py-3 text-sm text-white placeholder-muted transition-colors focus:border-accent/50 focus:bg-ink-700 outline-none" />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-gray-400">Category</label>
            <select name="category" value={form.category} onChange={handleChange}
              className="w-full rounded-xl border border-ink-800 bg-ink-800 px-4 py-3 text-sm text-white outline-none focus:border-accent/50 cursor-pointer">
              {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
          {error && <p className="rounded-xl bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">{error}</p>}
          <div className="mt-2 flex gap-3">
            <button type="button" onClick={onClose}
              className="flex-1 rounded-xl border border-ink-800 py-3 text-sm font-medium text-gray-400 transition-colors hover:text-white hover:border-ink-700">Cancel</button>
            <button type="submit" disabled={loading}
              className="flex-1 rounded-xl bg-accent py-3 text-sm font-bold text-ink-950 transition-all hover:bg-accent-dim disabled:opacity-50 disabled:cursor-not-allowed">
              {loading ? "Saving..." : "Save Link"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddLinkModal;