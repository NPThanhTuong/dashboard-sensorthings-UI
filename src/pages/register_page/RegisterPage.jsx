import { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    displayName: "",
    phone: "",
  });

  const navigate = useNavigate();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/register", formData);
      toast("Đăng ký thành công!");
      navigate("/dang-nhap");
    } catch (error) {
      toast("Đăng ký không thành công. Vui lòng thử lại sau.");
    }
  };

  return (
    <form
      onSubmit={handleRegister}
      className="w-full max-w-md rounded-lg bg-white p-8 shadow-md"
    >
      <div className="mb-4">
        <label htmlFor="displayname" className="mb-2 block text-gray-700">
          Họ và tên
        </label>
        <input
          type="text"
          name="displayname"
          value={formData.displayname}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
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
      <div className="mb-4">
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

      <div className="mb-6">
        <label htmlFor="phone" className="mb-2 block text-gray-700">
          Số điện thoại
        </label>
        <input
          type="text"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          required
          className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-md bg-blue-500 py-2 text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
      >
        Đăng ký
      </button>
      <div className="flex justify-between px-1 py-2">
        <span>Đã có tài khoản?</span>
        <Link to={"/dang-nhap"} className="underline">
          Đăng nhập
        </Link>
      </div>
    </form>
  );
};

export default RegisterPage;
