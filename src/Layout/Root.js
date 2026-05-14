import {
    MenuFoldOutlined,
    MenuUnfoldOutlined,
} from "@ant-design/icons";
import { Button, Layout, Menu } from "antd";
import React, { useState } from "react";
import "./Root.css";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { pathDeclaration } from "./Path";
import { useSelector } from "react-redux";
import { getBusinessSettings } from "../Utils/businessSettings";

const { Header, Sider, Content } = Layout;

const Root = () => {
    const [collapsed, setCollapsed] = useState(false);
    const navigate = useNavigate();
    const location = useLocation();
    const { businessInfo } = useSelector((state) => state.business);
    const { storeInformation } = getBusinessSettings(businessInfo);
    const storeName = storeInformation.storeName?.trim() || "QuddusShop";
    const storeAddress = storeInformation.address?.trim() || "Doha, Qatar";
    const logoUrl =
        storeInformation.logo ||
        storeInformation.logoUrl ||
        storeInformation.storeLogo;
    const logoInitial = storeName.charAt(0).toUpperCase();
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
                        {logoUrl ? (
                            <img src={logoUrl} alt={storeName} />
                        ) : (
                            <span>{logoInitial}</span>
                        )}
                    </div>

                    {!collapsed && (
                        <div className="brand-text">
                            <h1>{storeName}</h1>
                            <span className="location">{storeAddress}</span>
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
