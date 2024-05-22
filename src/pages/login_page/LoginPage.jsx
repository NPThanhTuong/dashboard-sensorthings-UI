import { useState } from "react";
import "./login-page.css";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    phone: "",
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const navigate = useNavigate();

  const { saveToken } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/login", formData);
      const { token } = response.data;
      saveToken(token);
      toast("Đăng nhập thành công!");
      navigate("/");
    } catch (error) {
      toast(error);
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleLogin}
        className="w-full max-w-sm rounded-lg bg-white p-8 shadow-md"
      >
        <div className="mb-4">
          <label htmlFor="username" className="mb-2 block text-gray-700">
            Tên đăng nhập
          </label>
          <input
            type="text"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div className="mb-6">
          <label htmlFor="password" className="mb-2 block text-gray-700">
            Mật khẩu
          </label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
            className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          Đăng nhập
        </button>
        <div className="flex justify-between px-1 py-2">
          <span>Chưa có tài khoản?</span>
          <Link to={"/dang-ky"} className="underline">
            Đăng ký
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginPage;
