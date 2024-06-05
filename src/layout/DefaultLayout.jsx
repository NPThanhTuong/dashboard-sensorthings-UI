import {  useState } from "react";
import { Outlet } from "react-router-dom";
// import Sidebar from "@/components/sidebar_component/Sidebar";
// import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { Link } from "react-router-dom";
import { IoHomeOutline } from "react-icons/io5";
import { LuMonitorSpeaker } from "react-icons/lu";
import { SiOpenstreetmap } from "react-icons/si";
import { AiOutlineLineChart } from "react-icons/ai";
import "./default_layout.css";
import { useAuth } from "@/context/AuthContext";
import avatar from "@public/images/user-avatar.jpg";


import {  Layout, Menu,  } from 'antd';
const { Sider } = Layout;

function getItem(label, key, icon, to) {
  return {
    key,
    icon,
    label,
    to,
  };
}

const DefaultLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const { user } = useAuth();
  console.log(user);

  const items = [
    getItem(<Link
      to={"/thong-tin-nguoi-dung"}
      className="p-2 pt-2 flex flex-col items-center justify-start">
      <p className="text-2xl font-semibold">{user?.message.displayname}</p>
    </Link>, '0',
      <img
        src={avatar}
        alt={user?.message.displayname}
        className="h-12 w-12 rounded-full object-cover"
      />,
      '/'),
    getItem((<Link to={'/'}>Trang chủ</Link>), '1', <IoHomeOutline />, '/'),
    getItem((<Link to={'/quan-sat'}>Quan sát</Link>), '2', <LuMonitorSpeaker />, '/quan-sat'),
    getItem((<Link to={'/ban-do'}>Bản đồ</Link>), '3', <SiOpenstreetmap />, '/ban-do'),
    getItem((<Link to={'/bieu-do-do-am-dat'}>Thống kê</Link>), '4', <AiOutlineLineChart />, '/bieu-do-do-am-dat'),
  ];
  return (
    <div className="flex h-screen">
      <Sider breakpoint="xxl" collapsible collapsed={collapsed} onCollapse={(value) => setCollapsed(value)}>
        <div className="demo-logo-vertical" />
        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" items={items} />
      </Sider>
      <div className="main-content h-full w-full overflow-auto bg-gray-100 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;