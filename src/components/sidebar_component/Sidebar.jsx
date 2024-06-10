import { Link } from "react-router-dom";
import { HomeOutlined, UserOutlined } from "@ant-design/icons";
import { Divider, Image, Layout, Menu } from "antd";
// import "./sidebar.css";

const { Sider } = Layout;

function getItem(label, key, icon, children) {
  return {
    key,
    icon,
    children,
    label,
  };
}

const Sidebar = ({ collapsed, setCollapsed }) => {
  const items = [
    {
      key: "1",
      label: <Link to="/">Danh sách Thing</Link>,
      icon: <HomeOutlined />,
    },
    {
      key: "2",
      label: <Link to="/thong-tin-nguoi-dung">Tài khoản</Link>,
      icon: <UserOutlined />,
    },
  ];

  return (
    <Sider
      theme="light"
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
          className="w-full object-contain"
        />
        {!collapsed && (
          <h1 className="mt-2 hidden text-center text-2xl font-semibold text-headline opacity-0 lg:block lg:opacity-100">
            SensorThing
          </h1>
        )}
      </Link>
      <Divider />
      <Menu defaultSelectedKeys={["1"]} mode="inline" items={items} />
    </Sider>
  );
};

export default Sidebar;
