import { useState, useEffect, useMemo } from "react";
import { fetchLinks, createLink, removeLink, pinLink } from "../api";
import LinkCard from "../components/LinkCard";
import AddLinkModal from "../components/AddLinkModal";

const CATEGORIES = ["All", "Work", "Learning", "Design", "Dev", "Tools", "News", "Finance", "Entertainment", "Other"];
const SORT_OPTIONS = ["Newest", "Oldest", "A-Z"];

const Home = ({ externalModalOpen, onExternalModalClose }) => {
  const [links, setLinks] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [sortBy, setSortBy] = useState("Newest");
  const [modalOpen, setModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  useEffect(() => {
    if (externalModalOpen) setModalOpen(true);
  }, [externalModalOpen]);

  useEffect(() => {
    const loadLinks = async () => {
      try {
        const { data } = await fetchLinks();
        setLinks(data);
      } catch (err) {
        console.error("Failed to fetch links:", err);
      } finally {
        setFetching(false);
      }
    };
    loadLinks();
  }, []);

  const handleAdd = async (formData) => {
    setLoading(true);
    try {
      const { data } = await createLink(formData);
      setLinks([data, ...links]);
      setModalOpen(false);
      onExternalModalClose?.();
    } catch (err) {
      console.error("Failed to add link:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await removeLink(id);
      setLinks(links.filter((l) => l._id !== id));
    } catch (err) {
      console.error("Failed to delete link:", err);
    }
  };

  const handlePin = async (id) => {
    try {
      const { data } = await pinLink(id);
      setLinks(links.map((l) => (l._id === id ? data : l)));
    } catch (err) {
      console.error("Failed to pin link:", err);
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(links, null, 2);
    const blob = new Blob([dataStr], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkvault-export.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportCSV = () => {
    const headers = ["title", "url", "category", "pinned", "createdAt"];
    const rows = links.map((l) =>
      headers.map((h) => `"${String(l[h] ?? "").replace(/"/g, '""')}"`).join(",")
    );
    const csv = [headers.join(","), ...rows].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "linkvault-export.csv";
    a.click();
    URL.revokeObjectURL(url);
  };

  const filteredLinks = useMemo(() => {
    let result = links.filter((link) => {
      const matchesSearch =
        link.title.toLowerCase().includes(search.toLowerCase()) ||
        link.url.toLowerCase().includes(search.toLowerCase());
      const matchesCategory =
        activeCategory === "All" || link.category === activeCategory;
      return matchesSearch && matchesCategory;
    });

    if (sortBy === "Newest") result = [...result].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    if (sortBy === "Oldest") result = [...result].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    if (sortBy === "A-Z") result = [...result].sort((a, b) => a.title.localeCompare(b.title));

    // pinned always on top
    return [...result.filter((l) => l.pinned), ...result.filter((l) => !l.pinned)];
  }, [links, search, activeCategory, sortBy]);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="font-display text-3xl font-bold text-white">Your Links</h1>
          <p className="mt-1 text-sm text-muted">
            {links.length} link{links.length !== 1 ? "s" : ""} saved
          </p>
        </div>
        {links.length > 0 && (
          <div className="flex items-center gap-2">
            <button
              onClick={handleExport}
              className="rounded-xl border border-ink-800 px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:border-accent/30 hover:text-accent"
            >
              ↓ JSON
            </button>
            <button
              onClick={handleExportCSV}
              className="rounded-xl border border-ink-800 px-4 py-2 text-sm font-medium text-gray-400 transition-all hover:border-accent/30 hover:text-accent"
            >
              ↓ CSV
            </button>
          </div>
        )}
      </div>

      {/* Search + Sort */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-muted text-sm">🔍</span>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search links..."
            className="w-full rounded-xl border border-ink-800 bg-ink-900 py-3 pl-10 pr-4 text-sm text-white placeholder-muted outline-none transition-colors focus:border-accent/50"
          />
        </div>
        <div className="flex gap-2">
          {SORT_OPTIONS.map((opt) => (
            <button
              key={opt}
              onClick={() => setSortBy(opt)}
              className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
                sortBy === opt
                  ? "bg-ink-800 text-white"
                  : "border border-ink-800 text-muted hover:text-gray-300"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="mb-8 flex flex-wrap gap-2">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`rounded-xl px-4 py-2 text-sm font-medium transition-all ${
              activeCategory === cat
                ? "bg-accent text-ink-950 font-bold"
                : "border border-ink-800 text-muted hover:border-accent/30 hover:text-gray-300"
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      {fetching ? (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl bg-ink-900 border border-ink-800" />
          ))}
        </div>
      ) : filteredLinks.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-center">
          <div className="mb-4 text-5xl">{links.length === 0 ? "🗂️" : "🔍"}</div>
          <h3 className="font-display text-xl font-bold text-white">
            {links.length === 0 ? "No links yet" : "No results found"}
          </h3>
          <p className="mt-2 text-sm text-muted">
            {links.length === 0 ? "Hit '+ Add Link' to save your first URL." : "Try a different search or category."}
          </p>
          {links.length === 0 && (
            <button
              onClick={() => setModalOpen(true)}
              className="mt-6 rounded-xl bg-accent px-6 py-3 font-display text-sm font-bold text-ink-950 hover:bg-accent-dim transition-colors"
            >
              + Add your first link
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredLinks.map((link, i) => (
            <div
              key={link._id}
              style={{ animationDelay: `${i * 40}ms` }}
              className="opacity-0 animate-fade-up [animation-fill-mode:forwards]"
            >
              <LinkCard link={link} onDelete={handleDelete} onPin={handlePin} />
            </div>
          ))}
        </div>
      )}

      <AddLinkModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); onExternalModalClose?.(); }}
        onSubmit={handleAdd}
        loading={loading}
      />
    </div>
  );
};

export default Home;