import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const ProtectedRoute = () => {
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/dang-nhap"); // Chuyển hướng đến trang đăng nhập nếu không có token
    }
  }, [token, navigate]);

  if (!token) {
    // Nếu không có token, có thể return null hoặc chuyển hướng tạm thời sang trang loading
    return null;
  }

  return <Outlet />;
};

export default ProtectedRoute;
