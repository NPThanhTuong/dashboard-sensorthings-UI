import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar_component/Sidebar"; // Import Sidebar component
import { ConfigProvider, Layout } from "antd";
//import "./default_layout.css";

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <ConfigProvider
      theme={{
        token: {
          // Seed Token
          colorPrimary: "#ff8e3c",
          colorInfo: "#ff8e3c",
          colorLink: "#d9376e",
          colorTextBase: "#2a2a2a",
        },
      }}
    >
      <Layout className="flex h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div className="main-content h-full w-full overflow-auto bg-gray-100 lg:p-4">
          <Outlet />
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;
