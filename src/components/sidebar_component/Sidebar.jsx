import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { AiOutlineLineChart } from "react-icons/ai";
import { Layout, Menu } from "antd";
import avatar from "@public/images/user-avatar.jpg";
import { useAuth } from "@/context/AuthContext";
import "./sidebar.css";

const { Sider } = Layout;

function getItem(label, key, icon, to) {
  return {
    key,
    icon,
    label,
    to,
  };
}

const Sidebar = ({ collapsed, setCollapsed }) => {
  const { user } = useAuth();

  const items = [
    getItem(
      <Link
        to={"/thong-tin-nguoi-dung"}
        className="user-info flex flex-col items-center justify-center p-2"
      >
        <img
          src={avatar}
          alt={user?.message.displayname}
          className="h-12 w-12 rounded-full object-cover"
        />
        <p className="user-name text-2xl font-semibold">
          {user?.message.displayname}
        </p>
      </Link>,
      "0",
      null,
      "/",
    ),
    getItem(<Link to={"/"}>Trang chủ</Link>, "1", <IoHomeOutline />, "/"),
    getItem(
      <Link to={"/quan-sat"}>Quan sát</Link>,
      "2",
      <LuMonitorSpeaker />,
      "/quan-sat",
    ),
    getItem(
      <Link to={"/ban-do"}>Bản đồ</Link>,
      "3",
      <SiOpenstreetmap />,
      "/ban-do",
    ),
    getItem(
      <Link to={"/bieu-do-do-am-dat"}>Thống kê</Link>,
      "4",
      <AiOutlineLineChart />,
      "/bieu-do-do-am-dat",
    ),
    getItem(
      <Link to={"/them-actuator"}>Actuator</Link>,
      "5",
      <AiOutlineLineChart />,
      "/them-actuator",
    ),
  ];

  return (
    <Sider
      breakpoint="xxl"
      collapsible
      collapsed={collapsed}
      onCollapse={(value) => setCollapsed(value)}
    >
      <div className="demo-logo-vertical" />
      <div className="user-avatar">{items[0].label}</div>
      <div className="spacer" />
      <Menu
        className=""
        theme="light"
        defaultSelectedKeys={["1"]}
        mode="inline"
        items={items.slice(1)} // Bỏ đi phần tài khoản, chỉ hiển thị menu
      />
    </Sider>
  );
};

export default Sidebar;
