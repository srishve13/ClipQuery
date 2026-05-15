import ResultCard from "./ResultCard";

const ResultsPanel = ({
  results = [],
  onSelect,
  query,
  loading,
  selectedResult,
  onExtract,
  extractingTime
}) => {
  return (
    <div className="h-full bg-[#0f0f0f] p-6 border-l border-gray-800 flex flex-col">

      <div className="mb-4">
        <h2 className="text-lg font-semibold">Top Results</h2>
        <p className="text-xs text-gray-400 mt-1">
          Ranked by semantic similarity
        </p>
      </div>

      <div className="flex flex-col gap-4 overflow-y-auto">

        {loading ? (
          <div className="text-gray-400 flex items-center gap-2">
            <span className="animate-pulse font-medium">Analyzing video</span>
            <span className="flex gap-1">
              <span className="animate-bounce">.</span>
              <span className="animate-bounce [animation-delay:0.2s]">.</span>
              <span className="animate-bounce [animation-delay:0.4s]">.</span>
            </span>
          </div>

        ) : !results || results.length === 0 ? (
          <div className="text-gray-500 text-sm flex flex-col items-center mt-10">
            <div className="text-3xl mb-2">😕</div>

            <div>
              {query
                ? `No strong matches found for "${query}"`
                : "Upload a video and search to see results"}
            </div>
          </div>

        ) : (
          results.map((item, index) => (
            <div
              key={index}
            >
              <ResultCard
                time={item.time}
                text={item.caption}
                score={item.score}
                isSelected={selectedResult && item.time === selectedResult.time}
                isTop={index === 0}
                onExtract={onExtract}
                onJump={() => onSelect(item)}
                query={query}
                isExtracting={extractingTime === item.time}
              />
            </div>
          ))
        )}

      </div>
    </div>
  );
};

export default ResultsPanel;