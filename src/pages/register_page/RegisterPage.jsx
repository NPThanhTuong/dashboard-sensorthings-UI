import React, { useState } from 'react';
import axios from 'axios';
import { Link } from "react-router-dom";
import { toast } from "react-toastify";

const RegisterPage = () => {
  const [formData, setFormData] = useState({
    displayname: '',
    username: '',
    password: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});

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
      newErrors.displayname = 'Vui lòng nhập họ và tên';
    }
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';

    } else if (formData.username.length < 4) {
      newErrors.username = 'Tên đăng nhập phải có ít nhất 4 ký tự';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Vui lòng nhập số điện thoại';
    } else if (formData.phone.length > 0) {
      const phoneRegex = /^(0?)(3[2-9]|5[6|8|9]|7[0|6-9]|8[0-6|8|9]|9[0-4|6-9])[0-9]{7}$/;
      if (!phoneRegex.test(formData.phone)) {
        newErrors.phone = 'Số điện thoại không hợp lệ';
      }
    }
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {

      try {

        const response = await axios.post("http://127.0.0.1:8000/api/register", formData);
        toast("Đăng ký thành công!");

      } catch (error) {

        toast('Đăng ký không thành công!');
        if (error.response && error.response.data[0]) {
          const { data } = error.response;

          data[0].forEach(err => {

            toast(err);

          });
        }
      }
    }
  };
  return (
    <div className="items-center min-h-full overflow-hidden">
      <form onSubmit={handleSubmit} className="w-96 max-w-lg mx-auto mt-16">
        <h2 className="text-center text-2xl font-bold mb-4 text-blue-500">Đăng ký tài khoản</h2>

        <div className="bg-gray-100 border border-gray-300  rounded-md px-8 pt-6 pb-8 mb-4 w-50">
          <div className="mb-3">
            <label className="block text-gray-700 text-lg   mb-2" htmlFor="fullName">
              Họ và tên
            </label>
            <input
              className={` appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.fullName ? 'border-red-500' : ''
                }`}
              id="displayname"
              type="text"
              placeholder="Họ và tên"
              name="displayname"
              value={formData.displayname}
              onChange={handleChange}
              onClick={handleClick}
            />
            {errors.displayname && <p className="text-red-500 text-sm italic">{errors.displayname}</p>}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="username">
              Tên đăng nhập
            </label>
            <input
              className={` appearance-none  border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.username ? 'border-red-500' : ''
                }`}
              id="username"
              type="text"
              placeholder="Tên đăng nhập"
              name="username"
              value={formData.username}
              onChange={handleChange}
              onClick={handleClick}

            />
            {errors.username && <p className="text-red-500 text-sm italic">{errors.username}</p>}
          </div>
          <div className="mb-3">
            <label className="block text-gray-700 text-lg mb-2" htmlFor="password">
              Mật khẩu
            </label>
            <input
              className={` border border-gray-300 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.password ? 'border-red-500' : ''
                }`}
              id="password"
              type="password"
              placeholder="Mật khẩu"
              name="password"
              value={formData.password}
              onChange={handleChange}
              onClick={handleClick}

            />
            {errors.password && <p className="text-red-500 text-sm italic">{errors.password}</p>}
          </div>
          <div className="mb-8">
            <label className="block text-gray-700 text-lg  mb-2" htmlFor="phoneNumber">
              Số điện thoại
            </label>
            <input
              className={` border border-gray-300 appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline ${errors.phone ? 'border-red-500' : ''
                }`}
              id="phone"
              type="text"
              placeholder="Số điện thoại"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              onClick={handleClick}

            />
            {errors.phone && <p className="text-red-500 text-sm italic">{errors.phone}</p>}
          </div>
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-gradient-to-t from-cyan-400 to-blue-500  text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Đăng ký
            </button>
          </div>

        </div>
        <div className=' border border-gray-300  rounded-md px-8 pt-6 pb-8 mb-4 w-50'>
          <label>Đã có tài khoản?
            <Link to='/dang-nhap'>
              <span className='text-blue-500 font-semibold'>Đăng Nhập</span>
            </Link>
          </label>
        </div>

      </form>

    </div>
  );
};

export default RegisterPage;
