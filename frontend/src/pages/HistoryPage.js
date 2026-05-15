import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

const HistoryPage = () => {
  const [history, setHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const storedHistory = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(storedHistory);
  }, []);

  const handleClick = (query) => {
    navigate("/", { state: { query } });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white">

      <Navbar showSearch={false} />

      <div className="p-10">

        <h1 className="text-3xl font-semibold mb-6">Search History</h1>

        {history.length === 0 ? (
          <div className="text-gray-400">No history yet</div>
        ) : (
          <div className="flex flex-col gap-3">

            {history.map((item, index) => {
                const query = typeof item === "string" ? item : item.query;
                const time = item.time || "";
                const type = item.type || "video";

                return (
                    <div
                        key={index}
                        onClick={() => handleClick(query)}
                        className="p-4 rounded-xl bg-[#1e293b] border border-gray-600 cusor-pointer hover:bg-[#334155] transition flex justify-between items-center"
                    >

                        <div>
                            <div className="ext-white font-medium">
                                {query}
                            </div>

                            <div className="text-sm text-gray-400">
                                {time}
                            </div>
                        </div>

                        <div className="text-xs px-2 py-1 rounded bg-purple-500/20 text-purple-400">
                            {type}
                        </div>
                    
                    </div>
                );
            })}

          </div>
        )}

      </div>

    </div>
  );
};

export default HistoryPage;