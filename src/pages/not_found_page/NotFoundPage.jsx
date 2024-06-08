import { Button } from "antd";
import { useNavigate } from "react-router-dom";

const NotFoundPage = () => {
    const navigate = useNavigate();

    return (
        <div className="relative flex flex-col items-center justify-center h-screen bg-gray-100">
            <div className="text-center">
                <h1 className="text-9xl font-bold text-red-500 mb-4">404</h1>
                <p className="text-xl font-semibold text-gray-700">Page Not Found</p>
            </div>
            <Button
                type="primary"
                onClick={() => navigate('/')}
                style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
                className="absolute bottom-4 right-4"
            >
                Trở về trang chủ
            </Button>
        </div>
    );
};

export default NotFoundPage;
