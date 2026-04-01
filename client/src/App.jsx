import { useState } from "react";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";

const App = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-ink-950">
      <Navbar onAdd={() => setModalOpen(true)} />
      <Home
        externalModalOpen={modalOpen}
        onExternalModalClose={() => setModalOpen(false)}
      />
    </div>
  );
};

export default App;