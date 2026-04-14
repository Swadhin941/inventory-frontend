import "./UserTable.css";
import { Table, Drawer, Form, Input, Button } from "antd";
import { Select } from "antd";
import React, { useState } from "react";
import EditButton from "../../../Components/Buttons/EditButton";

const UserTable = () => {
  // ✅ Dummy Data
  const dummyUsers = [
    {
      _id: "1",
      user_name: "Wbdul Quddus",
      subtitle: "Owner",
      role: "Admin",
      email: "admin@example.com",
      phone: "+974 5512 3344",
      status: "Active",
      permission: ["Full Access"],
    },
    {
      _id: "2",
      user_name: "Mohammed Khalil",
      subtitle: "Store Manager",
      role: "Manager",
      email: "manager@example.com",
      phone: "+974 6620 1122",
      status: "Active",
      permission: ["Sales", "Products", "Reports"],
    },
  ];

  // ✅ Drawer State
  const [open, setOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  // ✅ 👉 MOVE THIS UP
  const [activeFilter, setActiveFilter] = useState("All");

  // ✅ 👉 PUT FILTER LOGIC HERE
  const filteredUsers = dummyUsers.filter((user) => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Admin") return user.role === "Admin";
    if (activeFilter === "Manager") return user.role === "Manager";
    if (activeFilter === "Sales Associate")
      return user.role === "Sales Associate";
    if (activeFilter === "Deactivated") return user.status !== "Active";

    return true;
  });

  const [form] = Form.useForm();

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
    setOpen(false);
  };

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

    {
      title: "PERMISSIONS",
      dataIndex: "permission",
      render: (permissions) =>
        permissions?.map((p, i) => (
          <span key={i} className="permission-tag">
            {p}
          </span>
        )),
    },

    {
      title: "STATUS",
      dataIndex: "status",
      render: (status) => (
        <span
          className={status === "Active" ? "status-active" : "status-inactive"}
        >
          ● {status}
        </span>
      ),
    },

    {
      title: "ACTIONS",
      render: (_, record) => (
        <div className="action-group">
          <EditButton onClick={() => handleEdit(record)} />

          {record.status === "Active" ? (
            <button className="action-btn-danger">Deactivate</button>
          ) : (
            <button className="action-btn">Activate</button>
          )}
        </div>
      ),
    },
  ];

  return (
    <div className="user-table-container">
      {/* Filters */}
      <div className="filter-section">
        {["All", "Admin", "Manager", "Sales Associate", "Deactivated"].map(
          (item) => (
            <button
              key={item}
              className={`filter-btn ${activeFilter === item ? "active" : ""}`}
              onClick={() => setActiveFilter(item)}
            >
              {item}
            </button>
          )
        )}
      </div>

      <Table columns={columns} dataSource={filteredUsers} rowKey="_id" />

      {/* Drawer */}
      <Drawer title="Edit User" width={400} onClose={onClose} open={open}>
        <Form layout="vertical" form={form} onFinish={onFinish}>
          <Form.Item name="user_name" label="User Name">
            <Input />
          </Form.Item>

          <Form.Item name="email" label="Email">
            <Input />
          </Form.Item>

          <Form.Item name="phone" label="Phone">
            <Input />
          </Form.Item>

          <Form.Item name="role" label="Role">
            <Input />
          </Form.Item>

          <Form.Item name="permission" label="Permissions">
            <Select mode="multiple" placeholder="Select permissions">
              <Select.Option value="Full Access">Full Access</Select.Option>
              <Select.Option value="Sales">Sales</Select.Option>
              <Select.Option value="Products">Products</Select.Option>
              <Select.Option value="Reports">Reports</Select.Option>
            </Select>
          </Form.Item>

          <Form.Item name="status" label="Status">
            <Input />
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
