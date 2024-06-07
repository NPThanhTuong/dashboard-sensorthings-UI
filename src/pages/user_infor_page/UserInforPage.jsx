import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import './UserInforPage.css';

const UserInforPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line no-unused-vars
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null);
  // eslint-disable-next-line no-unused-vars
  const [avatarFile, setAvatarFile] = useState(null);
  const { token, clearToken } = useAuth();
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    displayname: "",
    phone: "",
  });

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/user", {
          headers: {
            token: token,
          },
        });
        setUserInfo(response.data.message);
      } catch (error) {
        console.error("Error fetching user info:", error.response || error.message);
        setError(error.response ? error.response.data : error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [token]);

  const handleEditClick = () => {
    setEditForm({
      displayname: userInfo.displayname,
      phone: userInfo.phone,
    });
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
    setValidationError(null);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setAvatarUrl(e.target.result);
      };
      reader.readAsDataURL(file);
      setAvatarFile(file);
    }
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    const changes = {};
    if (editForm.displayname !== userInfo.displayname)
      changes.displayname = editForm.displayname;
    if (editForm.phone !== userInfo.phone) changes.phone = editForm.phone;
    // Trước khi gửi request, kiểm tra số điện thoại có đúng độ dài không
if (editForm.phone.length !== 10) {
  setValidationError("Số điện thoại không đúng"); // Thông báo số điện thoại không đủ độ dài
  return; // Dừng xử lý tiếp theo
}

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      // eslint-disable-next-line no-undef
      setHeaderTitle("THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG");
      window.location.reload();
      return;
    }
  
    try {
      const response = await axios.post("/api/updateInformation", changes, {
        params: {
          token: token,
        },
      });
  
     // Sau khi cập nhật thành công
if (response.data.success) {
  setUserInfo((prevUserInfo) => ({
      ...prevUserInfo,
      ...changes,
  }));
  setIsEditing(false);
  toast.success("Cập nhật thông tin thành công!"); // Thêm thông báo thành công
} else {
  throw new Error(response.data.message);
}

} catch (error) {
  if (error.response.data[0].includes("The phone has already been taken.")) {
      toast.error("Số điện thoại đã tồn tại, vui lòng nhập số khác");
  } else {
      setError(error.response ? error.response.data : error.message);
  }
}

  };
  
  if (loading) {
    return <p className="loading-message">Đang tải thông tin người dùng...</p>;
  }

  if (!userInfo) {
    return <p className="no-info-message">Không có thông tin người dùng.</p>;
  }

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleLogout = () => {
    clearToken();
    navigate("/dang-nhap");
  };

  return (
    <div className="user-info-page">
      <div className="avatar-section">
        <label htmlFor="avatar-upload" className="upload-button">
          <img 
            src={avatarUrl || "https://img.freepik.com/premium-photo/male-female-profile-avatar-user-avatars-gender-icons_1020867-75342.jpg"} 
            alt="Avatar" 
            className="avatar"
          />
          <input
            type="file"
            id="avatar-upload"
            accept="image/*"
            onChange={handleAvatarUpload}
            style={{ display: "none" }}
          />
        </label>
        <div className="username">{userInfo.displayname}</div>
        <div className="phone-number">{userInfo.phone}</div>
      </div>
      <div className="info-section">
        {isEditing ? (
          <form onSubmit={handleFormSubmit} className="edit-form">
            <div className="input-group">
              <label htmlFor="displayname">Họ và tên:</label>
              <input
                type="text"
                id="displayname"
                name="displayname"
                value={editForm.displayname}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            <div className="input-group">
              <label htmlFor="phone">Số điện thoại:</label>
              <input
                type="text"
                id="phone"
                name="phone"
                value={editForm.phone}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>
            {validationError && (
              <div className="error-message">{validationError}</div>
            )}
            <div className="button-group">
              <button
              type="button"
              className="action-button cancel-button"
              onClick={() => setIsEditing(false)}
              >
                Hủy
              </button>
              <button type="submit" className="action-button save-button">
                Lưu thay đổi
              </button>
              <button
                  type="button"
                  className="action-button change-password-button"
                  onClick={() => navigate("/thay-doi-mat-khau")}
                >
                  Thay đổi mật khẩu
                </button>
            </div>

          </form>
        ) : (
          <div className="general-info">
            <div className="info-row">
              <label>Họ và tên:</label>
              <span>{userInfo.displayname}</span>
            </div>
            <div className="info-row">
              <label>Số điện thoại:</label>
              <span>{userInfo.phone}</span>
            </div>
            <div className="info-row">
              <label>Ngày tạo:</label>
              <span>{formatDate(userInfo.created_at)}</span>
            </div>
            <div className="info-row">
              <label>Mật khẩu:</label>
              <span>*********</span>
            </div>
            <div className="button-group">
              <button
                className="action-button edit-button"
                onClick={handleEditClick}
              >
                Chỉnh sửa
              </button>
              <button
                className="action-button logout-button"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserInforPage;
