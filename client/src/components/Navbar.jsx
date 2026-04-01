const Navbar = ({ onAdd }) => {
  return (
    <nav className="sticky top-0 z-50 border-b border-ink-800 bg-ink-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <span className="text-accent text-2xl">⬡</span>
          <span className="font-display text-xl font-bold tracking-tight text-white">
            Link<span className="text-accent">Vault</span>
          </span>
        </div>
        <button
          onClick={onAdd}
          className="flex items-center gap-2 rounded-xl bg-accent px-5 py-2.5 font-display text-sm font-bold text-ink-950 transition-all hover:bg-accent-dim hover:scale-105 active:scale-95"
        >
          <span className="text-lg leading-none">+</span>
          Add Link
        </button>
      </div>
    </nav>
  );
};

export default Navbar;