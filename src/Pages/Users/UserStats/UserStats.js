import React, { useEffect, useState } from "react";
import "./UserStats.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserStatistics } from "../../../Services/slices/user.slice";
import { Skeleton } from "antd";

const UserStats = () => {
  const { statistics, isStatsLoading } = useSelector((state) => state.user);
  const { user, isLoading } = useSelector((state) => state.auth.auth);
  const dispatch = useDispatch();
  useEffect(() => {
    console.log(statistics, isStatsLoading, user);
  }, [statistics, isStatsLoading, user]);
  useEffect(() => {
    if (user) {
      dispatch(fetchUserStatistics());
    }
  }, [dispatch, user, isLoading]);
  const allDivs = [
    {
      name: "Total Users",
      value: statistics?.totalUser,
      type: "default",
    },
    {
      name: "Active",
      value: statistics?.activeUser,
      type: "success",
    },
    {
      name: "Deactivated",
      value: statistics?.deactivateUser,
      type: "danger",
    },
    {
      name: "Admins",
      value: statistics?.admin,
      type: "info",
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
                <p className={`stats-value ${item.type}`}>
                    {item.value ?? 0}
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
