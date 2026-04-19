import "./ProductStats.css";

const ProductStats = () => {
  const stats = [
    { title: "Total Products", value: 284, color: "#111827" },
    { title: "In Stock", value: 241, color: "#16a34a" },
    { title: "Low Stock", value: 28, color: "#f59e0b" },
    { title: "Out of Stock", value: 15, color: "#dc2626" },
  ];

  return (
    <div className="stats-container">
      {stats.map((item, i) => (
        <div className="stats-card" key={i}>
          <p className="stats-title">{item.title}</p>
          <h2 style={{ color: item.color }}>{item.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;