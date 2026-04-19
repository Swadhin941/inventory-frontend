import "./UserTable.css";
import { Table, Drawer, Form, Input, Button, Skeleton, Empty } from "antd";
import { Select } from "antd";
import React, { useEffect, useState } from "react";
import EditButton from "../../../Components/Buttons/EditButton";
import { useDispatch, useSelector } from "react-redux";
import { getAllRolesApi } from "../../../Services/slices/auth.slice";
import { hasFormSubmit } from "@testing-library/user-event/dist/utils";
import {
    fetchAllUser,
    updateUserInfoApi,
} from "../../../Services/slices/user.slice";

const UserTable = () => {
    const [userList, setUserList] = useState([]);
    const [statusOption, setStatusOption] = useState([
        {
            name: "Active",
            value: true,
        },
        {
            name: "Inactive",
            value: false,
        },
    ]);
    const { user, roles, isRolesLoading } = useSelector(
        (state) => state.auth.auth,
    );
    const { users, isLoading, updateUserData, isUpdateUserLoading } =
        useSelector((state) => state.user);
    const [roleList, setRoleList] = useState([]);
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(20);
    const dispatch = useDispatch();
    // ✅ Drawer State
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);

    // ✅ 👉 MOVE THIS UP
    const [activeFilter, setActiveFilter] = useState("All");

    const [form] = Form.useForm();

    useEffect(() => {
        console.log(users, "user list", isLoading);
        if (users.length !== 0) {
            let tempUsers = [];
            tempUsers = users.map((item) => ({
                _id: item._id,
                user_name: item.username,
                subtitle: item.subtitle || "",
                role: item.role,
                email: item.email,
                phone: item.contactNo || "",
                status: item.accountApproved,
            }));
            setUserList(tempUsers);
            console.log(userList);
        }
        if (users.length === 0) {
            setUserList([]);
        }
    }, [users, isLoading]);

    // Update user effect
    useEffect(() => {
        if (updateUserData) {
            let tempUsers = [...userList];
            tempUsers.forEach((item)=>{
                if(item._id === updateUserData._id){
                    item.user_name = updateUserData.username;
                    item.status = updateUserData.accountApproved;
                    item.role = updateUserData.role;
                    item.email = updateUserData.email;
                    item.phone = updateUserData.contactNo;
                }
            })

            setUserList(tempUsers);
        }
    }, [updateUserData, isUpdateUserLoading]);

    useEffect(() => {
        if (user && roles.length === 0) {
            dispatch(getAllRolesApi());
            if (!isLoading) {
                dispatch(
                    fetchAllUser({
                        search: activeFilter,
                        page: page,
                        limit: limit,
                    }),
                );
            }
        }
    }, [user, isLoading]);

    useEffect(() => {
        if (roles.length !== 0) {
            setRoleList(["All", ...roles]);
        }
    }, [roles]);

    const handleFilterChange = (value) => {
        setPage(1);
        setLimit(20);
        setActiveFilter(value);
        dispatch(
            fetchAllUser({
                search: value,
                page: page,
                limit: limit,
            }),
        );
    };

    // ✅ Handle Edit
    const handleEdit = (user) => {
        setSelectedUser(user);
        setOpen(true);
        form.setFieldsValue(user);
    };

    // ✅ Close Drawer
    const onClose = () => {
        setOpen(false);
        setSelectedUser(null);
    };

    // ✅ Submit Update
    const onFinish = (values) => {
        console.log("Updated User:", values);
        const _id = userList.find((item) => item.email === values.email)._id;
        const payload = {
            _id,
            username: values.user_name,
            contactNo: values.phone,
            accountApproved: values.status,
            role: values.role,
            email: values.email,
        };
        dispatch(updateUserInfoApi(payload));
        setOpen(false);
    };

    const handleActivate= (value)=>{
        const findObject = userList.find((item) => item.email === value.email);
        
        const payload =  {
            _id: findObject._id,
            username: findObject.user_name,
            contactNo: findObject.phone,
            accountApproved: value.status,
            role: findObject.role,
            email: findObject.email,
        };
        dispatch(updateUserInfoApi(payload));
    }

    // ✅ Columns
    const columns = [
        {
            title: "USER",
            render: (_, record) => (
                <div className="user-cell">
                    <div className="avatar">
                        {record.user_name
                            ?.split(" ")
                            .map((n) => n[0])
                            .join("")}
                    </div>

                    <div>
                        <div className="user-name">{record.user_name}</div>
                        <div className="user-subtitle">{record.subtitle}</div>
                    </div>
                </div>
            ),
        },

        {
            title: "ROLE",
            dataIndex: "role",
            render: (role) => (
                <span className={`role-tag ${role.toLowerCase()}`}>{role}</span>
            ),
        },

        {
            title: "EMAIL",
            dataIndex: "email",
            render: (email) => <a className="user-email">{email}</a>,
        },

        {
            title: "PHONE",
            dataIndex: "phone",
        },

        // {
        //     title: "PERMISSIONS",
        //     dataIndex: "permission",
        //     render: (permissions) =>
        //         permissions?.map((p, i) => (
        //             <span key={i} className="permission-tag">
        //                 {p}
        //             </span>
        //         )),
        // },

        {
            title: "STATUS",
            dataIndex: "status",
            render: (status) => (
                <span className={status ? "status-active" : "status-inactive"}>
                    ● {status ? "Active" : "Inactive"}
                </span>
            ),
        },

        {
            title: "ACTIONS",
            render: (_, record) => (
                <div className="action-group">
                    <EditButton
                        onClick={() => handleEdit(record)}
                        disabled={record.email === user?.email}
                    />

                    {record.status ? (
                        <button
                            className="action-btn-danger"
                            onClick={() =>
                                handleActivate({
                                    email: record?.email,
                                    status: false,
                                })
                            }
                            disabled={record.email === user?.email}
                        >
                            Deactivate
                        </button>
                    ) : (
                        <button
                            className="action-btn"
                            onClick={() =>
                                handleActivate({
                                    email: record?.email,
                                    status: true,
                                })
                            }
                            disabled={record.email === user?.email}
                        >
                            Activate
                        </button>
                    )}
                </div>
            ),
        },
    ];

    return (
        <div className="user-table-container">
            {/* Filters */}
            {isRolesLoading ? (
                <Skeleton active />
            ) : (
                <div className="filter-section">
                    {roleList.map((item) => (
                        <button
                            key={item}
                            className={`filter-btn ${activeFilter === item ? "active" : ""}`}
                            onClick={() => handleFilterChange(item)}
                        >
                            {item}
                        </button>
                    ))}
                </div>
            )}
            {isLoading ? (
                <Skeleton active />
            ) : userList.length === 0 ? (
                <Empty />
            ) : (
                <Table columns={columns} dataSource={userList} rowKey="_id" />
            )}

            {/* Drawer */}
            <Drawer title="Edit User" width={400} onClose={onClose} open={open}>
                <Form layout="vertical" form={form} onFinish={onFinish}>
                    <Form.Item name="user_name" label="User Name">
                        <Input />
                    </Form.Item>

                    <Form.Item name="email" label="Email">
                        <Input readOnly />
                    </Form.Item>

                    <Form.Item name="phone" label="Phone">
                        <Input />
                    </Form.Item>

                    <Form.Item name="role" label="Role">
                        <Select placeholder="Select permissions">
                            {roleList.map(
                                (role, index) =>
                                    role !== "All" && (
                                        <Select.Option key={index} value={role}>
                                            {role}
                                        </Select.Option>
                                    ),
                            )}
                        </Select>
                    </Form.Item>

                    {/* <Form.Item name="permission" label="Permissions">
                        <Select
                            mode="multiple"
                            placeholder="Select permissions"
                        >
                            <Select.Option value="Full Access">
                                Full Access
                            </Select.Option>
                            <Select.Option value="Sales">Sales</Select.Option>
                            <Select.Option value="Products">
                                Products
                            </Select.Option>
                            <Select.Option value="Reports">
                                Reports
                            </Select.Option>
                        </Select>
                    </Form.Item> */}

                    <Form.Item name="status" label="Status">
                        <Select placeholder="Select Status">
                            {statusOption.map((item, index) => (
                                <Select.Option key={index} value={item.value}>
                                    {item.name}
                                </Select.Option>
                            ))}
                        </Select>
                    </Form.Item>

                    <Button type="primary" htmlType="submit" block>
                        Update User
                    </Button>
                </Form>
            </Drawer>
        </div>
    );
};

export default UserTable;
