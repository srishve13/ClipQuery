import { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import { Trash2, Download, Plus } from "lucide-react";

const ClipsPage = () => {
  const [clips, setClips] = useState([]);
  const [tagInput, setTagInput] = useState({});

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("clips")) || [];
    setClips(saved);
  }, []);

  const updateStorage = (updated) => {
    setClips(updated);
    localStorage.setItem("clips", JSON.stringify(updated));
  };

  const handleDelete = (index) => {
    const updated = clips.filter((_, i) => i !== index);
    updateStorage(updated);
  };

  const handleDownload = (url, index) => {
    const link = document.createElement("a");
    link.href = url;
    link.download = `clip_${index}.mp4`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleNoteChange = (index, value) => {
    const updated = [...clips];
    updated[index].note = value;
    updateStorage(updated);
  };

  const handleAddTag = (index) => {
    const input = tagInput[index];
    if (!input) return;

    const updated = [...clips];
    if (!updated[index].tags) updated[index].tags = [];

    updated[index].tags.push(input);
    updateStorage(updated);

    setTagInput({ ...tagInput, [index]: "" });
  };

  const handleRemoveTag = (clipIndex, tagIndex) => {
    const updated = [...clips];
    updated[clipIndex].tags.splice(tagIndex, 1);
    updateStorage(updated);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0a0a] via-[#0f172a] to-[#0a0a0a] text-white">

      <Navbar showSearch={false} />

      <div className="p-8">

        <div className="mb-6">
          <h1 className="text-2xl font-semibold">Saved Clips</h1>
          <p className="text-sm text-gray-400 mt-1">
            Organize and annotate your extracted clips
          </p>
        </div>

        {clips.length === 0 ? (
          <div className="flex flex-col items-center justify-center mt-20 text-gray-400">
            <div className="text-5xl mb-4">🎬</div>
            <p>No clips saved yet</p>
            <p className="text-xs mt-2">
              Extract clips from search results to see them here
            </p>
          </div>
        ) : (

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {clips.map((clip, index) => (
              <div
                key={index}
                className="bg-[#111827] rounded-2xl border border-gray-800 
                           overflow-hidden shadow-lg hover:shadow-purple-500/20 
                           transition duration-300"
              >

                <div className="relative">
                  <video
                    key={clip.url}
                    src={clip.url}
                    controls
                    className="w-full h-48 object-cover"
                    onError={(e) =>  console.log("Video failed:", clip.url)}
                  />

                  <div className="absolute top-2 left-2 text-xs bg-black/70 px-2 py-1 rounded">
                    {clip.time}
                  </div>
                </div>

                <div className="p-4 flex flex-col gap-3">

                  <textarea
                    placeholder="Add note..."
                    value={clip.note || ""}
                    onChange={(e) =>
                      handleNoteChange(index, e.target.value)
                    }
                    className="w-full bg-[#0f172a] text-sm p-2 rounded border border-gray-700 
                               focus:outline-none focus:border-purple-500 resize-none"
                    rows={2}
                  />

                  <div className="flex flex-wrap gap-2">
                    {(clip.tags || []).map((tag, i) => (
                      <span
                        key={i}
                        className="bg-purple-500/20 text-purple-300 text-xs px-2 py-1 rounded flex items-center gap-1"
                      >
                        {tag}
                        <button
                          onClick={() => handleRemoveTag(index, i)}
                          className="text-red-400 hover:text-red-500 text-xs"
                        >
                          ✕
                        </button>
                      </span>
                    ))}
                  </div>

                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add tag"
                      value={tagInput[index] || ""}
                      onChange={(e) =>
                        setTagInput({
                          ...tagInput,
                          [index]: e.target.value,
                        })
                      }
                      className="flex-1 bg-[#0f172a] text-xs px-2 py-1 rounded border border-gray-700 focus:outline-none"
                    />

                    <button
                      onClick={() => handleAddTag(index)}
                      className="bg-purple-600 hover:bg-purple-700 px-2 rounded"
                    >
                      <Plus size={14} />
                    </button>
                  </div>

                  <div className="flex justify-between items-center mt-2">

                    <span className="text-xs text-gray-400">
                      Clip {index + 1}
                    </span>

                    <div className="flex gap-3">

                      <button
                        onClick={() => handleDownload(clip.url, index)}
                        className="text-gray-400 hover:text-white"
                      >
                        <Download size={16} />
                      </button>

                      <button
                        onClick={() => handleDelete(index)}
                        className="text-gray-400 hover:text-red-400"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>
                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default ClipsPage;