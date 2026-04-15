import {
    DashboardOutlined,
    ProductOutlined,
    UserOutlined,
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
      path: "/dashboard/user",
    },
    {
      key: "3",
      icon: <ProductOutlined />,
      label: "Products",
      path: "/dashboard/product",
    },
  ];