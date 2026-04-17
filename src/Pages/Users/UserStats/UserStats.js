import React, { useEffect, useState } from "react";
import "./UserStats.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStatistics } from "../../../Services/slices/user.slice";
import { Skeleton } from "antd";

const UserStats = () => {
    const { statistics, isStatsLoading } = useSelector((state) => state.user);
    const dispatch = useDispatch();
    useEffect(() => {
        console.log(statistics, isStatsLoading);
    }, [statistics, isStatsLoading]);
    useEffect(() => {
        dispatch(fetchUserStatistics());
    }, [dispatch]);
    const allDivs = [
        {
            name: "Total Users",
            value: statistics?.totalUser,
            color: "#111827",
        },
        {
            name: "Active",
            value: statistics?.activeUser,
            color: "#16a34a",
        },
        {
            name: "Deactivated",
            value: statistics?.deactivateUser,
            color: "#dc2626",
        },
        {
            name: "Admins",
            value: statistics?.admin,
            color: "#2563eb",
        },
    ];

    return (
        <div className="container-fluid">
            {isStatsLoading ? (
                <Skeleton active />
            ) : (
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
            )}
        </div>
    );
};

export default UserStats;
