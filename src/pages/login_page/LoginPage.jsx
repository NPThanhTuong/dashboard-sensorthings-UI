import { useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { Link } from "react-router-dom";




const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: '',
    password: '',
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
  
    if (!formData.username.trim()) {
      newErrors.username = 'Vui lòng nhập tên đăng nhập';
    }
    if (formData.password.length < 8) {
      newErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
   
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
    } else {

     

      try {
        const response = await axios.post("/api/login",formData);
        const { token, user } = response.data;
        Cookies.set("token", token, { expires: 7 });
        
        console.log("Đăng nhập với người dùng:", user);
      } catch (error) {
        console.error('Đăng nhập không thành công:', error);

      }
    }
  };
  return (
    <div className="items-center min-h-full overflow-hidden">
      <form onSubmit={handleSubmit} className="w-96 max-w-lg mx-auto mt-16">
        <h2 className="text-center text-2xl font-bold mb-4 text-blue-500">Đăng nhập tài khoản</h2>

        <div className="bg-gray-100 border border-gray-300  rounded-md px-8 pt-6 pb-8 mb-4 w-50">
          
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
              autoComplete="username"
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
              autoComplete="current-password"

            />
            {errors.password && <p className="text-red-500 text-sm italic">{errors.password}</p>}
          </div>
          
          <div className="flex items-center justify-between">
            <button
              className="w-full bg-gradient-to-t from-cyan-400 to-blue-500  text-white font-semibold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Đăng nhập
            </button>
          </div>

        </div>
        <div className=' border border-gray-300  rounded-md px-8 pt-6 pb-8 mb-4 w-50'>
          <label>Chưa có tài khoản?
          <Link to='/dang-ky'>
              <span className='text-blue-500 font-semibold'>Đăng ký tài khoản</span>
            </Link>
          </label>
        </div>

      </form>

    </div>
  );
};

export default LoginPage;

