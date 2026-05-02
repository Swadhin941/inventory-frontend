import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import React, { useState } from "react";
import "./Root.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { pathDeclaration } from "./Path";

const { Header, Sider, Content } = Layout;

const Root = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const handleNavigationClick = (e) => {
        console.log(e);
        const findPath = pathDeclaration.find(
            (item) => item.key === e.key,
        ).path;
        navigate(findPath);
    };

    return (
        <Layout className="app-layout">
            <Sider
                className="app-sidebar"
                trigger={null}
                collapsible
                collapsed={collapsed}
                breakpoint="lg"
                collapsedWidth={80}
                onBreakpoint={(broken) => setCollapsed(broken)}
            >
                <div className={`brand-card ${collapsed ? "collapsed" : ""}`}>
                    <div className="logo">
                        <span>Q</span>
                    </div>

                    {!collapsed && (
                        <div className="brand-text">
                            <h1>QuddusShop</h1>
                            <span className="location">Doha, Qatar</span>
                        </div>
                    )}
                </div>
                <div className="demo-logo-vertical" />
                <Menu
                    theme="light"
                    mode="inline"
                    defaultSelectedKeys={location.pathname}
                    onClick={(e) => handleNavigationClick(e)}
                    items={pathDeclaration.map((item) => item)}
                />
            </Sider>
            <Layout className="app-main">
                <Header className="app-header">
                    <Button
                        type="text"
                        icon={
                            collapsed ? (
                                <MenuUnfoldOutlined />
                            ) : (
                                <MenuFoldOutlined />
                            )
                        }
                        onClick={() => setCollapsed(!collapsed)}
                        style={{
                            fontSize: "16px",
                            width: 64,
                            height: 64,
                        }}
                    />
                </Header>

                <Content className="app-content">
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Root;
