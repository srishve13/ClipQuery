const Timeline = ({ results, onSelect }) => {

  const data = (results && results.length > 0)
    ? results
    : [
        { score: 0.7 },
        { score: 0.5 },
        { score: 0.3 },
        { score: 0.2 }
      ];

  return (
    <div style={{
      width: "100%",
      marginTop: "20px"
    }}>

      <div style={{
        width: "100%",
        height: "30px",
        backgroundColor: "#444",
        display: "flex",
        alignItems: "stretch"
      }}>

        {data.map((item, index) => {
          const score = Number(item.score) || 0.2;

          let color = "#666";

          if (score > 0.5) {
            color = "purple";
          } else if (score > 0.3) {
            color = "blue";
          }

          return (
            <div
              key={index}
              onClick={() => onSelect && onSelect(item)}
              style={{
                width: `${100 / data.length}%`,
                backgroundColor: color,
                border: "1px solid black",
                minHeight: "100%"
              }}
            />
          );
        })}

      </div>

    </div>
  );
};

export default Timeline;