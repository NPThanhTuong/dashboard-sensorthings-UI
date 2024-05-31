import  { useState } from 'react';
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from 'react-toastify';
import {  useNavigate } from "react-router-dom";



const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const { token } = useAuth();
 
  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      toast('Mật khẩu mới và mật khẩu xác nhận không khớp.');
      return;
    }

    // Call API to change password
    try {
     
      const response = await axios.post('/api/resetPassword', {
        password:currentPassword,
        newPassword:newPassword,
        rePassword:confirmPassword, token
      });
    
      if (response.status !== 200) {
        toast('Đã xảy ra lỗi khi thay đổi mật khẩu.');
      }
    
      toast('Mật khẩu đã được thay đổi thành công.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setError('');
      navigate('/dang-nhap');
    } catch (error) {
      toast('Mật khẩu trùng với mật khẩu cũ')
    }
  };

  return (
    <div className=''>
      
      <form onSubmit={handleChangePassword} className='form-container mx-auto mt-16 w-96 max-w-lg rounded-xl bg-white px-8 py-10 shadow-lg'>
        {error && <div style={{ color: 'red' }}>{error}</div>}
        
        <h2 className="mb-4 text-center text-2xl font-bold text-blue-500">Thay đổi mật khẩu</h2>
        
        <div>
          <label className="mb-2 block text-lg text-gray-700"
              htmlFor="username">Mật khẩu hiện tại:</label>
          <input
           className='focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none '
            
              
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete= "current-password"
          />
        </div>
        <div>
          <label className="mb-2 block text-lg text-gray-700"
              htmlFor="username">Mật khẩu mới:</label>
          <input
            className='focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none '
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="mb-2 block text-lg text-gray-700"
              htmlFor="username">Xác nhận mật khẩu mới:</label>
          <input
            className='focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none mb-5'
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button type="submit"  className="focus:shadow-outline w-full rounded bg-gradient-to-t from-cyan-400 to-blue-500 px-2 py-2 font-semibold text-white focus:outline-none"
              >Thay đổi mật khẩu</button>
        
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

export default ChangePassword;
