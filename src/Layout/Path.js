import {
    DashboardOutlined,
    ProductOutlined,
    UserOutlined,
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
      {
          key: "/dashboard/product",
          icon: <ProductOutlined />,
          label: "Products",
          path: "/dashboard/product",
      },
  ];