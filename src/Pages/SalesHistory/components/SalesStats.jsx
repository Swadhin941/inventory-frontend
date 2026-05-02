import React from "react";
import "./SalesStats.css";

const stats = [
    { title: "Total Transactions", value: "248", growth: "+12.4%" },
    { title: "Total Amount", value: "QAR 94,230", growth: "+4.7%" },
    { title: "Total Profit", value: "QAR 21,840", growth: "+2.1%" },
    { title: "Avg. Order Value", value: "QAR 380", growth: "+8%" },
];

const SalesStats = () => {
    return (
        <div className="row">
            {stats.map((item, index) => (
                <div className="col-12 col-md-6 col-lg-3" key={index}>
                    <div className="sales-card">
                        <h6>{item.title}</h6>
                        <h3>{item.value}</h3>
                        <p className="growth">↑ {item.growth} this month</p>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default SalesStats;