import { Scissors, Play } from "lucide-react";

const ResultCard = ({
  time,
  text,
  score,
  isSelected,
  isTop,
  onExtract,
  onJump,
  query,
  isExtracting
}) => {

  const highlightText = (text, query) => {
    if (!query) return text;

    const words = query.toLowerCase().split(" ").filter(Boolean);

    const regex = new RegExp(`(${words.join("|")})`, "gi");
    const parts = text.split(regex);

    return parts.map((part, index) => {
      const isMatch = words.some(
        (w) => part.toLowerCase() === w.toLowerCase()
      );

      return isMatch ? (
        <span
          key={index}
          className="bg-purple-500/30 text-purple-200 px-1 rounded-md"
        >
          {part}
        </span>
      ) : (
        part
      );
    });
  };

  return (
    <div
      className={`p-4 rounded-xl transition-all duration-300 border

        ${isSelected
          ? "border-purple-500 bg-[#1f2937] shadow-[0_0_20px_rgba(139,92,246,0.4)]"
          : isTop
          ? "border-purple-400 bg-gradient-to-br from-[#1f1b2e] to-[#111827]"
          : "border-gray-800 bg-[#111827]"
        }
      `}
    >

      {isTop && !isSelected && (
        <div className="text-xs text-purple-400 mb-1">
          Top Match
        </div>
      )}

      <div className="text-sm text-gray-400 mb-1">
        {time}
      </div>

      <div className="text-gray-200 text-sm mb-3 leading-relaxed">
        {highlightText(text, query)}
      </div>

      <div className="w-full h-2 bg-gray-700 rounded-full overflow-hidden mb-1">
        <div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
          style={{ width: `${Math.min(score * 100, 100)}%` }}
        />
      </div>

      <div className="text-xs text-gray-400 mb-3">
        Confidence: {(score * 100).toFixed(0)}%
      </div>

      <div className="flex gap-2">

        <button
          onClick={() => onJump && onJump(time)}
          className="flex items-center gap-1 text-xs px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md"
        >
          <Play size={14} />
          Jump
        </button>

        <button
          onClick={() => onExtract && onExtract(time)}
          disabled={isExtracting}
          className={`flex items-center gap-1 text-xs px-3 py-1 rounded-md
            ${isExtracting
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-purple-600 hover:bg-purple-700"
            }
          `}
        >
          <Scissors size={14} />
          {isExtracting ? "Extracting..." : "Extract"}
        </button>

      </div>

    </div>
  );
};

export default ResultCard;