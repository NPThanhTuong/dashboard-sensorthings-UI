import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar_component/Sidebar"; // Import Sidebar component
//import "./default_layout.css";

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="flex h-screen">
      <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
      <div className="main-content h-full w-full overflow-auto bg-gray-100 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
