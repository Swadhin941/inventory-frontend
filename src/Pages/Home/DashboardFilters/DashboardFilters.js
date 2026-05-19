import React from "react";
import { Card, DatePicker } from "antd";
import dayjs from "dayjs";

const { RangePicker } = DatePicker;

const DashboardFilters = ({ dateRange, setDateRange }) => {
    return (
        <Card className="dashboard-card dashboard-filter-card">
            <div className="dashboard-filter-wrapper">
                <h2>Business Dashboard</h2>

                <RangePicker
                    value={dateRange || [dayjs().subtract(6, "day"), dayjs()]}
                    onChange={(dates) => setDateRange(dates)}
                    disabledDate={(current) =>
                        current && current > dayjs().endOf("day")
                    }
                    allowClear={false}
                />
            </div>
        </Card>
    );
};

export default DashboardFilters;
