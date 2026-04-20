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
      {
        key: "/dashboard/sales",
        icon: <DashboardOutlined />,
        label: "New Sales",
        path: "/dashboard/sales",
      },
      {
        key: "/dashboard/sales-history",
        icon: <DashboardOutlined />,
        label: "Sales History",
        path: "/dashboard/sales-history",
      }
  ];