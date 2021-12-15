import { Routes, Route } from "react-router-dom";

// pages & components
import Home from "./pages/Home";
import Battle from "./pages/Battle";
import Details from "./pages/Details";
import BattleDetails from "./pages/BattleDetails";
import NotFound from "./pages/NotFound";
import Layout from "./components/layout/Layout";

function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="battle" element={<Battle />} />
        <Route path="crabs/:id" element={<Details />} />
        <Route path="battles/:id" element={<BattleDetails />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}

export default App;
