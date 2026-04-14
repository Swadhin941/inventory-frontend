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
        key: "1",
        icon: <DashboardOutlined />,
        label: "Dashboard",
        path: "/dashboard",
    },
    {
        key: "2",
        icon: <UserOutlined />,
        label: "Users",
        path: "/dashboard/user"
    },
];
