import React, { useState } from 'react';
import "./UserStats.css";

const UserStats = () => {
    const [page, setPage]= useState(1);
    const [limit, setLimit]= useState(10);
    
    const allDivs = [
        {
            name: "Total Users",
            value: 7,
            color: "#111827",
        },
        {
            name: "Active",
            value: 6,
            color: "#16a34a",
        },
        {
            name: "Deactivated",
            value: 1,
            color: "#dc2626",
        },
        {
            name: "Admins",
            value: 1,
            color: "#2563eb",
        },
    ];

    return (
        <div className="container-fluid">
    <div className="row">
        {allDivs.map((item, key) => (
            <div className="col-12 col-md-4 col-lg-3" key={key}>
                <div className="stats-card">
                    <h6 className="stats-title">{item.name}</h6>
                    <p
                        className="stats-value"
                        style={{ color: item.color }}
                    >
                        {item.value}
                    </p>
                </div>
            </div>
        ))}
    </div>
</div>
    );
};

export default UserStats;