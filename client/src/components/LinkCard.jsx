import { useState } from "react";

const LinkCard = ({ link, onDelete, onPin }) => {
  const [copied, setCopied] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [faviconError, setFaviconError] = useState(false);

  const handleCopy = async () => {
    if (!link?.url) return;
    try {
      await navigator.clipboard.writeText(link.url);
    } catch {
      const textarea = document.createElement("textarea");
      textarea.value = link.url;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand("copy");
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setTimeout(() => onDelete(link._id), 300);
  };

  const getDomain = (url) => {
    try {
      return new URL(url).hostname.replace("www.", "");
    } catch {
      return url || "";
    }
  };

  const getFavicon = (url) => {
    try {
      const domain = new URL(url).origin;
      return `https://www.google.com/s2/favicons?domain=${domain}&sz=32`;
    } catch {
      return null;
    }
  };

  const getCategoryIcon = (cat) => {
    const map = {
      Work: "💼",
      Learning: "📚",
      Design: "🎨",
      Dev: "⚙️",
      Tools: "🔧",
      News: "📰",
      Finance: "💰",
      Entertainment: "🎬",
      Other: "🔗",
    };
    return map[cat] || "🔗";
  };

  if (!link) return null;

  const domain = getDomain(link.url);
  const favicon = getFavicon(link.url);

  return (
    <div
      className={`group relative flex flex-col gap-3 rounded-2xl border bg-ink-900 p-5 transition-all duration-300 hover:shadow-lg hover:shadow-accent/5 animate-fade-up ${
        link.pinned
          ? "border-accent/40"
          : "border-ink-800 hover:border-accent/30"
      } ${deleting ? "opacity-0 scale-95 pointer-events-none" : ""}`}
    >
      {/* Top bar */}
      <div className="flex items-center justify-between">
        <span className="flex items-center gap-1.5 rounded-lg bg-ink-800 px-2.5 py-1 text-xs font-medium text-gray-400">
          <span>{getCategoryIcon(link.category)}</span>
          {link.category || "Other"}
        </span>
        <div className="flex items-center gap-1">
          {/* Pin button */}
          <button
            onClick={() => onPin(link._id)}
            className={`rounded-lg p-1.5 text-sm transition-all ${
              link.pinned
                ? "text-accent opacity-100"
                : "text-muted opacity-0 group-hover:opacity-100 hover:text-accent"
            }`}
            title={link.pinned ? "Unpin" : "Pin"}
          >
            📌
          </button>
          {/* Delete button */}
          <button
            onClick={handleDelete}
            className="rounded-lg p-1.5 text-muted opacity-0 transition-all group-hover:opacity-100 hover:bg-red-500/10 hover:text-red-400"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Pinned badge */}
      {link.pinned && (
        <span className="absolute top-3 right-14 text-[10px] font-bold text-accent/70 tracking-widest uppercase">
          pinned
        </span>
      )}

      {/* Title */}
      <h3 className="font-display text-base font-bold text-white line-clamp-1">
        {link.title || "Untitled"}
      </h3>

      {/* Domain with Favicon */}
      <div className="flex items-center gap-2">
        {favicon && !faviconError ? (
          <img
            src={favicon}
            alt=""
            width={14}
            height={14}
            className="rounded-sm opacity-70"
            onError={() => setFaviconError(true)}
          />
        ) : (
          <span className="text-xs text-muted">🌐</span>
        )}
        <p className="text-sm text-muted truncate">{domain}</p>
      </div>

      {/* Actions */}
      <div className="mt-1 flex gap-2">
        <a
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 rounded-xl border border-ink-800 py-2 text-center text-sm font-medium text-gray-300 transition-all hover:border-accent/50 hover:text-accent"
        >
          Open ↗
        </a>
        <button
          onClick={handleCopy}
          className={`rounded-xl border px-4 py-2 text-sm font-medium transition-all ${
            copied
              ? "border-accent/50 text-accent bg-accent/10"
              : "border-ink-800 text-gray-400 hover:border-accent/30 hover:text-gray-300"
          }`}
        >
          {copied ? "Copied!" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export default LinkCard;