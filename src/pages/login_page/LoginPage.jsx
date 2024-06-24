import { useState } from "react";
import "./login-page.css";
import { Link, useNavigate } from "react-router-dom";
import { notification } from "antd";
import { useAuth } from "@/context/AuthContext";

import { request } from "@/utils/request";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const { saveToken } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);
    setFormData({ ...formData, [name]: value });
  };

  const handleClick = (e) => {
    const { name } = e.target;
    const newErrors = { ...errors };
    delete newErrors[name];
    setErrors(newErrors);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        const response = await request.post("/login", formData);
        const { token } = response.data;
        saveToken(token);
        notification.success({ message: "Đăng nhập thành công!" });
        navigate("/");
      } catch (error) {
        notification.error({ message: "Đăng nhập không thành công!" });
      }
    }
  };

  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="form-container mx-auto mt-16 w-96 max-w-lg rounded-xl bg-white px-8 py-10 shadow-lg"
      >
        <h2 className="mb-4 text-center text-2xl font-bold text-blue-500">
          Đăng nhập tài khoản
        </h2>

        <div className="w-50 mb-4 rounded-md border border-gray-300 bg-gray-100 px-8 pb-8 pt-6">
          <div className="mb-3">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${
                errors.username ? "border-red-500" : ""
              }`}
              id="username"
              type="text"
              placeholder="Tên đăng nhập"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onClick={handleClick}
              autoComplete="username"
            />
            {errors.username && (
              <p className="text-sm italic text-red-500">{errors.username}</p>
            )}
          </div>
          <div className="mb-3">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="input-container">
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${
                  errors.password ? "border-red-500" : ""
                }`}
                id="password"
                placeholder="Mật khẩu"
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onClick={handleClick}
                autoComplete="current-password"
              />
            </div>
            {errors.password && (
              <p className="text-sm italic text-red-500">{errors.password}</p>
            )}
          </div>

          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded bg-blue-500 px-4 py-2 font-semibold text-white focus:outline-none"
              type="submit"
            >
              Đăng nhập
            </button>
          </div>
        </div>
        <div className="w-50 mb-4 flex justify-between rounded-md border border-gray-300 px-8 pb-8 pt-6">
          <span>Chưa có tài khoản?</span>
          <Link to="/dang-ky">
            <span className="font-semibold text-blue-500">Đăng ký</span>
          </Link>
        </div>
      </form>

      {/* Thêm sóng ở đây */}
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
    </div>
  );
};

export default LoginPage;
