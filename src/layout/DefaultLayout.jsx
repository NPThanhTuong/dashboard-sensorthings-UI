import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "@/components/sidebar_component/Sidebar";
import { ConfigProvider, Layout } from "antd";
import { useTheme } from "@/context/ThemeContext";

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { isDarkMode } = useTheme();

  const lightTheme = {
    token: {
      colorPrimary: "#00BB00", // màu xanh lá chính
      colorInfo: "#00BB00", // màu xanh lá chính
      colorLink: "#36DA6D", // màu xanh nhạt đậm
      colorTextBase: "#2a2a2a", // màu đen mờ
    },
  };

  const darkTheme = {
    token: {
      colorPrimary: "#0A84FF", // Dark blue for primary actions
      colorInfo: "#0A84FF", // Dark blue for information messages
      colorLink: "#36DA6D", // màu xanh nhạt đậm
      colorTextBase: "#ffffff", // Light grey text
      backgroundColor: "#1F1F1F", // Background color for dark mode
      borderColor: "#2E2E2E", // Border color for dark mode
    },
  };

  return (
    <ConfigProvider theme={isDarkMode ? darkTheme : lightTheme}>
      <Layout className="flex h-screen">
        <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />
        <div
          className={`h-full w-full overflow-auto sm:p-1 md:p-2 lg:p-3 ${
            isDarkMode
              ? "dark:border-darkPrimary dark:bg-darkSecondary dark:text-white"
              : "border-white bg-gray-300"
          }`}
        >
          <Outlet />
        </div>
      </Layout>
    </ConfigProvider>
  );
};

export default DefaultLayout;
