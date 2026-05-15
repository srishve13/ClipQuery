import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SearchPage from "./pages/SearchPage";
import DashboardPage from "./pages/DashboardPage";
import ClipsPage from "./pages/ClipsPage";

function App() {
  return (
    <Router>
      <Routes>

        <Route path="/" element={<SearchPage />} />

        <Route path="/clips" element={<ClipsPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/search" element={<SearchPage />} />

      </Routes>
    </Router>
  );
}

export default App;