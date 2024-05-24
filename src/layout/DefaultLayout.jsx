import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/sidebar_component/Sidebar";
import { useAuth } from "../context/AuthContext";

const DefaultLayout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/dang-nhap");
    }
  }, [token, navigate]);

  return (
    <div className="flex">
      <div className="h-dvh w-[10%] rounded-sm border bg-white">
        <Sidebar />
      </div>
      <div className="w-[90%] bg-gray-100 p-2">
        <Outlet />
      </div>
    </div>
  );
};

export default DefaultLayout;
