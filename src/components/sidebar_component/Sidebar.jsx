import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Divider, Image, Layout, Menu } from "antd";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const { Sider } = Layout;

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const items = translations
    ? [
        {
          key: "1",
          label: <Link to="/"> {translations["Danh sách Thing"]}</Link>,
          icon: <HomeOutlined />,
        },
        {
          key: "2",
          label: (
            <Link to="/thong-tin-nguoi-dung">{translations["Tài khoản"]}</Link>
          ),
          icon: <UserOutlined />,
        },
      ]
    : [];

  const logoTextStyle = {
    color: isDarkMode ? "#ffffff" : "#000099",
    fontWeight: "bold",
    transition: "opacity 0.3s ease-in-out",
    fontFamily: "Soul Gaze",
  };

  const siderStyle = {
    background: isDarkMode ? "#001529" : "#ffffff",
  };

  const menuStyle = {
    background: isDarkMode ? "#001529" : "#ffffff",
  };

  return (
    <Sider
      style={siderStyle}
      theme={isDarkMode ? "dark" : "light"}
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
      breakpoint="xl"
    >
      <Link to="/" className="my-4 block px-3 transition-all">
        <Image
          preview={false}
          src="/images/cusc-logo.png"
          alt="Logo"
          className="w-40 object-contain"
        />
        {!collapsed && (
          <h1
            style={logoTextStyle}
            className="mt-2 text-center text-lg font-semibold uppercase tracking-widest"
          >
            SensorThings
          </h1>
        )}
      </Link>
      <Divider />
      <Menu
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items} // Pass items only if translations is defined
        style={menuStyle}
        theme={isDarkMode ? "dark" : "light"}
      />
    </Sider>
  );
};

export default Sidebar;
