import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
//import Navbar from "../components/navbar_component/Navbar";
import Sidebar from "../components/sidebar_component/Sidebar";
import UserRoutes from "../routes/UserRoutes";
import { useAuth } from "../context/AuthContext";
import LoginPage from "../pages/login_page/LoginPage";

const DefaultLayout = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/dang-nhap");
    }
  }, [token, navigate]);

  if (!token) {
    return <LoginPage />;
  }

  return (
    <div className="flex">
      <div className="h-dvh w-[10%] rounded-sm border bg-white">
        <Sidebar />
      </div>
      <div className="w-[90%] bg-gray-100 p-2">
        {/* <Navbar /> */}
        <UserRoutes />
      </div>
    </div>
  );
};

export default DefaultLayout;
