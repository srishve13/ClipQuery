import Navbar from "../components/Navbar";
import { useState, useEffect } from "react";
import SearchPanel from "../components/SearchPanel";
import VideoPlayer from "../components/VideoPlayer";
import ResultsPanel from "../components/ResultsPanel";
import { useLocation } from "react-router-dom";
import TimelineBar from "../components/TimelineBar";

const SearchPage = () => {
  const location = useLocation();

  const [results, setResults] = useState([]);
  const [selectedResult, setSelectedResult] = useState(null);
  const [videoSrc, setVideoSrc] = useState(null);
  const [videoFile, setVideoFile] = useState(null);
  const [queryText, setQueryText] = useState("");
  const [loading, setLoading] = useState(false);
  const [summary, setSummary] = useState("");
  const [extractingTime, setExtractingTime] = useState(null);
  const [minTime, setMinTime] = useState("00:00");

  useEffect(() => {
    if (location.state?.query && videoFile) {
      handleSearch(location.state.query);
    }
  }, [location.state, videoFile]);

  const timeToSeconds = (timeStr) => {
    const parts = timeStr.split(":").map(Number);
    return parts[0] * 60 + parts[1];
  };

  const handleSearch = async (query) => {
    setSelectedResult(null);

    if (!videoFile) {
      alert("Please upload a video first");
      return;
    }

    setQueryText(query);
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("query", query);
      formData.append("video", videoFile);

      const response = await fetch("http://clipquery-production.up.railway.app/process", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      const filtered = (data.results || []).filter((r) => {
        const start = r.time.split(" - ")[0];
        return timeToSeconds(start) >= timeToSeconds(minTime);
      });

      setResults(filtered);
      setSummary(data.summary || "");

      const prevHistory = JSON.parse(localStorage.getItem("history")) || [];

      const newEntry = {
        query: query,
        type: "video",
        time: new Date().toLocaleTimeString(),
      };

      const updatedHistory = [
        newEntry,
        ...prevHistory.filter((item) => item.query !== query),
      ];

      localStorage.setItem("history", JSON.stringify(updatedHistory.slice(0, 10)));

    } catch (error) {
      console.error("FETCH ERROR:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSelectResult = (result) => {
    setSelectedResult(result);
  };

  const handleVideoUpload = (file) => {
    const url = URL.createObjectURL(file);

    setSelectedResult(null);
    setResults([]);

    setVideoSrc(url);
    setVideoFile(file);
  };

  const handleExtractClip = async (time) => {
    setExtractingTime(time);

    try {
      const response = await fetch("http://clipquery-production.up.railway.app/extract", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ time }),
      });

      if (!response.ok) {
        alert("Extraction failed");
        setExtractingTime(null);
        return;
      }

      const startTime = time.split(" - ")[0];
      const safeTime = startTime.replace(/[:]/g, "_");

      const clipUrl = `http://clipquery-production.up.railway.app/clips/clip_${safeTime}.mp4`;

      await new Promise((res) => setTimeout(res, 800));

      const newClip = { url: clipUrl, time };
      const prev = JSON.parse(localStorage.getItem("clips")) || [];
      localStorage.setItem("clips", JSON.stringify([newClip, ...prev]));

      const link = document.createElement("a");
      link.href = clipUrl;
      link.download = `clip_${safeTime}.mp4`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      alert("Clip extracted successfully!");

    } catch (error) {
      console.error("Extract error:", error);
      alert("Failed to connect to backend");
    } finally {
      setExtractingTime(null);
    }
  };

  return (
    <div className="min-h-screen flex flex-col text-white 
                    bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#0a0a0a]">

      <Navbar onSearch={handleSearch} showSearch={true} />

      <div className="flex flex-1">

        <div className="w-[280px] border-r border-gray-800 p-6">
          <SearchPanel
            onSearch={handleSearch}
            onUpload={handleVideoUpload}
            setMinTime={setMinTime}
          />
        </div>

        <div className="flex-1 flex flex-col items-center px-6 pt-10">

          <div className="w-full max-w-6xl mb-4">
            <h2 className="text-sm text-gray-400">Video Analysis</h2>
          </div>

          <div className="w-full max-w-6xl bg-[#111111] rounded-2xl p-6 border border-gray-700 shadow-[0_0_40px_rgba(99,102,241,0.15)]">

            <VideoPlayer
              key={videoSrc}
              selectedResult={selectedResult}
              videoSrc={videoSrc}
            />

            {results.length > 0 && (
              <TimelineBar
                results={results}
                onJump={handleSelectResult}
              />
            )}

            {summary && (
              <div className="mt-6 bg-[#111827] border border-gray-800 rounded-2xl p-5">
                <h3 className="text-gray-300 mb-2">
                  AI-generated summary from video frames
                </h3>

                <p className="text-gray-400 text-sm leading-relaxed max-h-24 overflow-y-auto">
                  {summary}
                </p>
              </div>
            )}
          </div>

          <div className="w-full max-w-6xl mt-6 grid grid-cols-3 gap-4">
            <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Frames Extracted</p>
              <h3 className="text-lg mt-1">~{results.length * 10}</h3>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Matches Found</p>
              <h3 className="text-lg mt-1">{results.length}</h3>
            </div>

            <div className="bg-[#111827] p-4 rounded-xl border border-gray-800">
              <p className="text-xs text-gray-400">Query</p>
              <h3 className="text-sm mt-1 truncate">{queryText || "None"}</h3>
            </div>
          </div>

        </div>

        <div className="w-[340px] border-l border-gray-800">
          <ResultsPanel
            results={results}
            onSelect={handleSelectResult}
            query={queryText}
            loading={loading}
            selectedResult={selectedResult}
            onExtract={handleExtractClip}
            extractingTime={extractingTime}
          />
        </div>

      </div>
    </div>
  );
};

export default SearchPage;