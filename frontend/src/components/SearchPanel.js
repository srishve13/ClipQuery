import { useRef, useState, useEffect } from "react";

const SearchPanel = ({ onSearch, onUpload, setMinTime }) => {
  const fileInputRef = useRef();

  const [history, setHistory] = useState([]);
  const [time, setTime] = useState("00:00");

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("history")) || [];
    setHistory(saved);
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file);
    }
  };

  const handleTimeChange = (value) => {
    setTime(value);
    setMinTime(value); 
  };

  return (
    <div className="flex flex-col gap-6">

      <div className="bg-[#111827] p-5 rounded-2xl border border-gray-800">
        <h3 className="text-gray-300 text-sm mb-3">Upload Video</h3>

        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full py-2 rounded-lg bg-gradient-to-r from-purple-500 to-blue-500 text-white text-sm"
        >
          Select Video File
        </button>
      </div>

      <div className="bg-[#111827] p-5 rounded-2xl border border-gray-800">
        <h3 className="text-gray-300 text-sm mb-3">Filter by Time</h3>

        <input
          type="text"
          value={time}
          onChange={(e) => handleTimeChange(e.target.value)}
          placeholder="mm:ss (e.g. 00:30)"
          className="w-full bg-[#1f2937] text-white px-3 py-2 rounded-md text-sm outline-none"
        />

        <p className="text-xs text-gray-500 mt-2">
          Show results after this time
        </p>
      </div>

      <div className="bg-[#111827] p-5 rounded-2xl border border-gray-800">
        <h3 className="text-gray-300 text-sm mb-3">Recent Searches</h3>

        {history.length === 0 ? (
          <p className="text-xs text-gray-500">No recent searches yet</p>
        ) : (
          <div className="flex flex-col gap-2">
            {history.map((item, index) => (
              <div
                key={index}
                onClick={() => onSearch(item.query)}
                className="text-xs bg-[#1f2937] px-3 py-2 rounded-md cursor-pointer hover:bg-[#2a2a2a]"
              >
                {item.query}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default SearchPanel;