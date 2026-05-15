import { useState } from "react";
import { Search } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ onSearch, showSearch }) => {
  const [input, setInput] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && input.trim() !== "") {
      onSearch(input);
    }
  };

  const isActive = (path) => location.pathname === path;

  const navStyle = (path) =>
    `px-3 py-1 rounded-md text-sm transition-all duration-200
     ${
       isActive(path)
         ? "bg-purple-600 text-white shadow-md"
         : "text-gray-400 hover:text-white hover:bg-white/10"
     }`;

  return (
    <div className="w-full h-16 flex items-center px-6 
                    bg-[#0b1220] border-b border-gray-800">

      <div className="flex items-center gap-6 min-w-[300px]">

        <div
          onClick={() => navigate("/")}
          className="text-xl font-semibold tracking-wide cursor-pointer"
        >
          <span className="text-white">Clip</span>
          <span className="text-purple-400">Query</span>
        </div>

        <div className="flex gap-2">

          <button
            onClick={() => navigate("/")}
            className={navStyle("/")}
          >
            Home
          </button>

          <button
            onClick={() => navigate("/clips")}
            className={navStyle("/clips")}
          >
            Clips
          </button>

          <button
            onClick={() => navigate("/dashboard")}
            className={navStyle("/dashboard")}
          >
            Dashboard
          </button>

        </div>
      </div>

      {showSearch && (
        <div className="flex-1 flex justify-center">
          <div className="relative w-[520px]">

            <Search
              size={18}
              className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search moments..."
              className="w-full bg-[#111827] text-gray-300 pl-11 pr-5 py-2 rounded-full outline-none border border-gray-700 placeholder-gray-500 focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30 transition"
            />
          </div>
        </div>
      )}

      <div className="min-w-[300px]" />

    </div>
  );
};

export default Navbar;