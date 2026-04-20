import React, { useState } from "react";
import "./SalesTable.css";

const dummyData = [
    {
        id: "#TXN-00248",
        customer: "Ahmed Al-Rashid",
        product: "Samsung A55",
        qty: 1,
        amount: 895,
        profit: 275,
        status: "Completed",
    },
    {
        id: "#TXN-00247",
        customer: "Sara Mansoori",
        product: "iPhone 15 Pro",
        qty: 2,
        amount: 4620,
        profit: 980,
        status: "Completed",
    },
];

const SalesTable = () => {
    const [activeFilter, setActiveFilter] = useState("All");

    return (
        <div className="sales-table-container">

            {/* FILTERS */}
            <div className="filter-section">
                {["All", "Completed", "Processing", "Refunded"].map((item) => (
                    <button
                        key={item}
                        className={`filter-btn ${activeFilter === item ? "active" : ""}`}
                        onClick={() => setActiveFilter(item)}
                    >
                        {item}
                    </button>
                ))}
            </div>

            {/* TABLE */}
            <table className="sales-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Customer</th>
                        <th>Product</th>
                        <th>QTY</th>
                        <th>Amount</th>
                        <th>Profit</th>
                        <th>Status</th>
                    </tr>
                </thead>

                <tbody>
                    {dummyData.map((item, index) => (
                        <tr key={index}>
                            <td>{item.id}</td>
                            <td>{item.customer}</td>
                            <td>{item.product}</td>
                            <td>{item.qty}</td>
                            <td>QAR {item.amount}</td>
                            <td>QAR {item.profit}</td>
                            <td>
                                <span className={`status ${item.status.toLowerCase()}`}>
                                    {item.status}
                                </span>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    );
};

export default SalesTable;