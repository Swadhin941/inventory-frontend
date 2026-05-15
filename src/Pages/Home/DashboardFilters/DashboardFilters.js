import React from "react";
import { Card, DatePicker } from "antd";

const { RangePicker } = DatePicker;

const DashboardFilters = ({ dateRange, setDateRange }) => {
    return (
        <Card className="dashboard-card dashboard-filter-card">
            <div className="dashboard-filter-wrapper">
                <h2>Business Dashboard</h2>

                <RangePicker
                    value={dateRange}
                    onChange={(dates) => setDateRange(dates)}
                />
            </div>
        </Card>
    );
};

export default DashboardFilters;
