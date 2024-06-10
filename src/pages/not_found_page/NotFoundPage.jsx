import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
  const navigate = useNavigate();

  return (
    <div className="relative flex h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-9xl font-bold text-red-500">404</h1>
        <p className="text-xl font-semibold text-gray-700">Page Not Found</p>
        <Button
          type="primary"
          onClick={() => navigate("/")}
          style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
          className="mt-8 flex items-center justify-center px-16 py-5 text-lg"
        >
          Trở về trang chủ
        </Button>
      </div>
    </div>
  );
};

export default NotFoundPage;
