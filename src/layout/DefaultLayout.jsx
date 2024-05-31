import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar_component/Sidebar";
import { useAuth } from "../context/AuthContext";
import { FiMenu } from "react-icons/fi";
import "./default_layout.css";

const DefaultLayout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/dang-nhap");
    }
  }, [token, navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsSidebarOpen(true); // Nếu màn hình lớn hơn 767px, mở sidebar
      } else {
        setIsSidebarOpen(false); // Nếu màn hình nhỏ hơn hoặc bằng 767px, đóng sidebar
      }
    };

    handleResize(); // Gọi hàm handleResize lần đầu để đặt trạng thái ban đầu

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  return (
    <div className="flex">
      <div className={` ${isSidebarOpen ? "w-60" : ""} h-dvh rounded-sm border bg-white`}>
        <div className="icon-menu p-2"><FiMenu onClick={toggleSidebar} /></div>

        <div>
          <div className={`w-full sidebar ${isSidebarOpen ? "block w-60" : ""}`}><Sidebar /></div>
        </div>
      </div>
      <div className="w-full bg-gray-100 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;