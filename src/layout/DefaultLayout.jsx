import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "@/components/sidebar_component/Sidebar";
import { useAuth } from "@/context/AuthContext";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import "./default_layout.css";

const DefaultLayout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/dang-nhap");
    }
  }, [token, navigate]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 767) {
        setIsSidebarOpen(true);
      } else {
        setIsSidebarOpen(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div
        className={`relative h-full ${
          isSidebarOpen ? "w-60" : "w-10"
        } border bg-white transition-all duration-300`}
      >
        <div className="toggle-icon-container absolute right-0 top-1/2 -translate-y-1/2 transform cursor-pointer">
          {isSidebarOpen ? (
            <FiChevronLeft onClick={toggleSidebar} />
          ) : (
            <FiChevronRight onClick={toggleSidebar} />
          )}
        </div>
        <div className={`sidebar ${isSidebarOpen ? "block" : "hidden"}`}>
          <Sidebar />
        </div>
      </div>
      <div className="main-content h-full w-full overflow-auto bg-gray-100 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
