import {
    DashboardOutlined,
    MenuFoldOutlined,
    MenuUnfoldOutlined,
    UploadOutlined,
    UserOutlined,
    VideoCameraOutlined,
} from "@ant-design/icons";
import { lazy } from "react";
export const pathDeclaration = [
    {
        key: "/dashboard",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        key: "/dashboard/user",
        icon: <UserOutlined />,
        label: "Users",
        path: "/dashboard/user",
    },
];
