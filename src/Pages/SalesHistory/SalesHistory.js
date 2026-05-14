import React from "react";
import "./SalesHistory.css";
import SalesTable from "./components/SalesTable";
import SalesStats from "./components/SalesStats";

const SalesHistory = () => {
    return (
        <div className="container-fluid sales-page">

            {/* STATS */}
            <div className="mb-3">
                <SalesStats />
            </div>

            {/* TABLE */}
            <div>
                <SalesTable />
            </div>

        </div>
    );
};

export default SalesHistory;