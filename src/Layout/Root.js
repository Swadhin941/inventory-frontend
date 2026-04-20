import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu, theme } from "antd";
import React, { useState } from "react";
import "./Root.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { pathDeclaration } from "./Path";

const { Header, Sider, Content } = Layout;

const Root = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const {
        token: { colorBgContainer, borderRadiusLG },
    } = theme.useToken();
    const handleNavigationClick = (e) => {
        console.log(e);
        const findPath = pathDeclaration.find(
            (item) => item.key === e.key,
        ).path;
        navigate(findPath);
    };

    return (
        <Layout style={{ minHeight: "100vh", background: "#fff" }}>
            <Sider
                trigger={null}
                collapsible
                collapsed={collapsed}
                style={{ background: "#fff" }}
            >
                <div className={`brand-card ${collapsed ? "collapsed" : ""}`}>
                    <div className="logo">
                        <span>Q</span>
                    </div>

                    {!collapsed && (
                        <div className="text">
                            <h1>
                                QuddusShop{" "}
                                <span className="location">Doha, Qatar</span>
                            </h1>
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
            <Layout>
                <Header
                    style={{
                        padding: 0,
                        background: colorBgContainer,
                    }}
                >
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

                <Content
                    style={{
                        margin: "24px 16px",
                        padding: 24,
                        background: colorBgContainer,
                        borderRadius: borderRadiusLG,
                        flex: 1,
                    }}
                >
                    <Outlet></Outlet>
                </Content>
            </Layout>
        </Layout>
    );
};

export default Root;
