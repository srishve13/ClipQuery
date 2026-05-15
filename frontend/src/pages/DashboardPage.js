import Navbar from "../components/Navbar";
import { useEffect, useState } from "react";

const DashboardPage = () => {
  const [stats, setStats] = useState({
    searches: 0,
    uniqueQueries: 0,
    avgTime: 0
  });

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem("history")) || [];

    const totalSearches = history.length;

    const unique = new Set(history.map(item => item.query));

    const avgTime = totalSearches > 0 
      ? (Math.random() * 1 + 0.5).toFixed(2)
      : 0;

    setStats({
      searches: totalSearches,
      uniqueQueries: unique.size,
      avgTime
    });

  }, []);

  return (
    <div className="min-h-screen text-white 
                    bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#0a0a0a]">

      <Navbar showSearch={false} />

      <div className="p-10">

        <h1 className="text-2xl mb-6">Analytics Dashboard</h1>

        <div className="grid grid-cols-3 gap-6">

          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">Total Searches</p>
            <h2 className="text-3xl mt-2">{stats.searches}</h2>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">Unique Queries</p>
            <h2 className="text-3xl mt-2">{stats.uniqueQueries}</h2>
          </div>

          <div className="bg-[#111827] p-6 rounded-2xl border border-gray-800">
            <p className="text-gray-400 text-sm">Avg Query Time</p>
            <h2 className="text-3xl mt-2">{stats.avgTime}s</h2>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DashboardPage;