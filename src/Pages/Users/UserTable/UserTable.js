import { Divider, Radio, Table } from "antd";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUserApi } from "../../../Services/API/user.api";
import { fetchAllUser } from "../../../Services/slices/user.slice";

const UserTable = () => {
    const { users } = useSelector((state) => state.user);
    useEffect(() => {
        console.log(users);
    }, [users]);
    const dispatch = useDispatch();
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    const [dataLoaded, setDataLoaded] = useState([]);
    useEffect(() => {
        dispatch(fetchAllUser({ page: page, limit: limit }));
    }, [dispatch]);

    
    const columns = [
        {
            title: "User name",
            dataIndex: "user_name",
            render: (text) => <a>{text}</a>,
        },
        {
            title: "Role",
            dataIndex: "role",
        },
        {
            title: "Email",
            dataIndex: "email",
        },
        {
            title: "Phone",
            dataIndex: "phone",
        },
        // {
        //     title: "Permission",
        //     dataIndex: "permission"
        // },
        {
            title: "Status",
            dataIndex: "status",
        },
        {
            title: "Action",
            dataIndex: "action",
        },
    ];

    return (
        <div>
            
        </div>
    );
};

export default UserTable;
