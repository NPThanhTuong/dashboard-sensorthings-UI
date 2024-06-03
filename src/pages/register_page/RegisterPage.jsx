import { useState } from "react";
import "./register_page.css";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { FaEye, FaEyeSlash } from 'react-icons/fa';

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    displayname: "",
    username: "",
    password: "",
    phone: "",
    confirmPassword: ""
  });
  const [errors, setErrors] = useState({});
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
    if (!formData.displayname.trim()) {
      newErrors.displayname = "Vui lòng nhập họ và tên";
    }
    if (!formData.username.trim()) {
      newErrors.username = "Vui lòng nhập tên đăng nhập";
    } else if (formData.username.length < 4) {
      newErrors.username = "Tên đăng nhập phải có ít nhất 4 ký tự";
    }
    if (!formData.phone.trim()) {
      newErrors.phone = "Vui lòng nhập số điện thoại";
    } else if (formData.phone.length > 0) {
      const phoneRegex =
        /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = "Số điện thoại không hợp lệ";
      }
    }
    if (!formData.password.trim()) {
      newErrors.password = "Vui lòng nhập mật khẩu";
    }
    if (!formData.confirmPassword.trim()) {
      newErrors.confirmPassword = "Vui lòng nhập lại mật khẩu";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Mật khẩu và mật khẩu xác nhận không khớp";
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {
      try {
        await axios.post("/api/register", formData);
        toast("Đăng ký thành công!");
        navigate('/dang-nhap');
      } catch (error) {
        toast("Đăng ký không thành công!");
        if (error.response && error.response.data[0]) {
          const { data } = error.response;

          data[0].forEach((err) => {
            toast(err);
          });
        }
      }
    }
  };
  const [showPassword, setShowPassword] = useState(false);
  const [showPasswordConf, setShowPasswordConf] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  const togglePasswordConfVisibility = () => {
    setShowPasswordConf(!showPasswordConf);
  };
  return (
    <div className="">
      <form
        onSubmit={handleSubmit}
        className="form-container mx-auto mt-16 w-96 max-w-lg rounded-xl bg-white px-8 py-10 shadow-lg"
      >
        <h2 className="mb-6 text-center text-3xl font-bold text-blue-500">
          Đăng ký tài khoản
        </h2>

        <div className="w-50 mb-4 rounded-md border border-gray-300 bg-gray-100 px-8 pb-8 pt-6">
          <div className="mb-4">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="displayname"
            >
              Họ và tên
            </label>
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${errors.displayname ? "border-red-500" : ""
                }`}
              id="displayname"
              type="text"
              placeholder="Họ và tên"
              name="displayname"
              value={formData.displayname}
              onChange={handleChange}
              onClick={handleClick}
            />
            {errors.displayname && (
              <p className="text-sm italic text-red-500">
                {errors.displayname}
              </p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="username"
            >
              Tên đăng nhập
            </label>
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${errors.username ? "border-red-500" : ""
                }`}
              id="username"
              type="text"
              placeholder="Tên đăng nhập"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onClick={handleClick}
            />
            {errors.username && (
              <p className="text-sm italic text-red-500">{errors.username}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="password"
            >
              Mật khẩu
            </label>
            <div className="relative flex items-center">
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${errors.password ? "border-red-500" : ""
                  }`}
                id="password"
                type={showPassword ? 'text' : 'password'}
                placeholder="Mật khẩu"
                name="password"
                value={formData.password}
                onChange={handleChange}
                onClick={handleClick}
              />
              <div
                className="absolute  right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordVisibility}
              >
                {showPassword ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>

            {errors.password && (
              <p className="text-sm italic text-red-500">{errors.password}</p>
            )}
          </div>
          <div className="mb-4">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="confirmPassword"
            >
              Nhập lại mật khẩu
            </label>
            <div className="relative flex items-center">
              <input
                className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${errors.confirmPassword ? "border-red-500" : ""
                  }`}
                id="confirmPassword"
                type={showPasswordConf ? 'text' : 'password'}
                placeholder="Mật khẩu"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                onClick={handleClick}
              />
              <div
                className="absolute  right-0 pr-3 flex items-center cursor-pointer"
                onClick={togglePasswordConfVisibility}
              >
                {showPasswordConf ? <FaEye /> : <FaEyeSlash />}
              </div>
            </div>
            {errors.confirmPassword && (
              <p className="text-sm italic text-red-500">{errors.confirmPassword}</p>
            )}
          </div>
          <div className="mb-8">
            <label
              className="mb-2 block text-lg text-gray-700"
              htmlFor="phoneNumber"
            >
              Số điện thoại
            </label>
            <input
              className={`focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none ${errors.phone ? "border-red-500" : ""
                }`}
              id="phone"
              type="text"
              placeholder="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onClick={handleClick}
            />
            {errors.phone && (
              <p className="text-sm italic text-red-500">{errors.phone}</p>
            )}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="focus:shadow-outline w-full rounded bg-gradient-to-t from-cyan-400 to-blue-500 px-4 py-2 font-semibold text-white focus:outline-none"
              type="submit"
            >
              Đăng ký
            </button>
          </div>
        </div>
        <div className="w-50 mb-4 flex justify-between rounded-md border border-gray-300 px-8 pb-8 pt-6">
          <span>Đã có tài khoản?</span>
          <Link to="/dang-nhap">
            <span className="font-semibold text-blue-500">Đăng nhập</span>
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

export default RegisterPage;
