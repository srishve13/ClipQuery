const TimelineBar = ({ results, onJump }) => {

  const getPosition = (timeStr) => {
    const start = timeStr.split(" - ")[0];
    const [min, sec] = start.split(":").map(Number);
    const seconds = min * 60 + sec;

    return (seconds / 60) * 100;
  };

  return (
    <div className="w-full mt-6">

      <div className="text-xs text-gray-400 mb-2">
        Timeline of Matches
      </div>

      <div className="relative w-full h-3 bg-gray-700 rounded-full">

        {results.map((r, i) => (
          <div
            key={i}
            onClick={() => onJump(r)}
            className="absolute top-0 w-3 h-3 bg-purple-500 rounded-full cursor-pointer hover:scale-125 transition"
            style={{ left: `${getPosition(r.time)}%` }}
          />
        ))}

      </div>

    </div>
  );
};

export default TimelineBar;