import React, { useEffect, useState } from "react";

function GFG() {
  const [heatmapSVG, setHeatmapSVG] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useSelector((state) => state.auth);
  useEffect(() => {
    const fetchHeatmap = async () => {
      try {
        const response = await fetch(`http://localhost:4000/api/gfg/${user?.platforms.codeforces}`);
        const data = await response.json();
        if (data.heatmapSVG) {
          setHeatmapSVG(data.heatmapSVG);
        } else {
          setError("Heatmap data not found.");
        }
      } catch (error) {
        setError("Error fetching heatmap.");
        console.error("Error fetching heatmap:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchHeatmap();
  }, [username]);

  return (
    <div style={{ textAlign: "center", padding: "20px" }}>
      <h2>GeeksforGeeks Heatmap</h2>
      {loading ? (
        <p>Loading heatmap...</p>
      ) : error ? (
        <p style={{ color: "red" }}>{error}</p>
      ) : (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            overflowX: "auto",
            padding: "10px",
            border: "1px solid #ddd",
            borderRadius: "5px",
            background: "#fff",
          }}
          dangerouslySetInnerHTML={{ __html: heatmapSVG }}
        />
      )}
    </div>
  );
}

export default GFG;
