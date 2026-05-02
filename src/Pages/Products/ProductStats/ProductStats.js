import "./ProductStats.css";

const ProductStats = () => {
  const stats = [
    { title: "Total Products", value: 284, type: "default" },
    { title: "In Stock", value: 241, type: "success" },
    { title: "Low Stock", value: 28, type: "warning" },
    { title: "Out of Stock", value: 15, type: "danger" },
  ];

  return (
    <div className="stats-container">
      {stats.map((item, i) => (
        <div className="stats-card" key={i}>
          <p className="stats-title">{item.title}</p>
          <h2 className={`stats-value ${item.type}`}>{item.value}</h2>
        </div>
      ))}
    </div>
  );
};

export default ProductStats;
