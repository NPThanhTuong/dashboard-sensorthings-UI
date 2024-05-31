/*Author:Le Vu Luan*/
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; 
import "./UserInfor_page.css"; 
import { useAuth } from "../../context/AuthContext";

const UserInforPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null); 
  const { token } = useAuth();
  const navigate = useNavigate(); 

  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    username: "",
    displayname: "",
    phone: "",
  });
  const [headerTitle, setHeaderTitle] = useState("THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG");

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await axios.get("/api/user", {
          headers: {
            'token': token,
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
      username: userInfo.username,
      displayname: userInfo.displayname,
      phone: userInfo.phone,
    });
    setIsEditing(true);
    setHeaderTitle("CẬP NHẬT THÔNG TIN NGƯỜI DÙNG");
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm({
      ...editForm,
      [name]: value,
    });
    setValidationError(null); 
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    
    const changes = {};
    if (editForm.username !== userInfo.username) changes.username = editForm.username;
    if (editForm.displayname !== userInfo.displayname) changes.displayname = editForm.displayname;
    if (editForm.phone !== userInfo.phone) changes.phone = editForm.phone;

    if (Object.keys(changes).length === 0) {
      //nếu người dùng không có thay đổi gì thì refresh lại trang thông tin user
      window.location.reload();
      return;
    }

    try {
      console.log("Sending update request with data:", changes);
      const response = await axios.post("/api/updateInformation", changes, {
        params: {
          'token': token,
        },
      });
      console.log("Update response:", response);
      setUserInfo((prevUserInfo) => ({
        ...prevUserInfo,
        ...changes,
      }));
      setIsEditing(false);
      setHeaderTitle("THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG");
      window.location.reload(); 
    } catch (error) {
      console.error("Error updating user info:", error.response || error.message);
      if (error.response && error.response.data && error.response.data.message === "The phone has already been taken") {
        alert("Lỗi: Số điện thoại đã tồn tại!"); // Nếu số điện thoại đã tồn tại ở 1 user khác thì báo lỗi
        window.location.reload(); 
      } else {
        setError(error.response ? error.response.data : error.message);
      }
    }
  };

  if (loading) {
    return <p className="loading-message">Đang tải thông tin người dùng...</p>;
  }

  if (error) {
    return <p className="error-message">Lỗi: {error}</p>;
  }

  if (!userInfo) {
    return <p className="no-info-message">Không có thông tin người dùng.</p>;
  }

  return (
    <div className="user-info-container">
      <h2>{headerTitle}</h2>
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <div>
            <label>Tên đăng nhập:  </label>
            <input
              type="text"
              name="username"
              value={editForm.username}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Họ và Tên:  </label>
            <input
              type="text"
              name="displayname"
              value={editForm.displayname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Số điện thoại:  </label>
            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleInputChange}
            />
          </div>
          {validationError && <p className="error-message">{validationError}</p>} {/* Display validation error */}
          <button type="submit" className="save-button">Lưu</button>
          <button type="button" className="cancel-button" onClick={() => {
            setIsEditing(false);
            setHeaderTitle("THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG");
            window.location.reload(); // Refresh page when cancelling edit
          }}>Hủy</button>
          <button type="button" className="change-password-button" onClick={() => navigate("/change-password")}>
            Thay đổi mật khẩu
          </button>
        </form>
      ) : (
        <table className="user-info-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tên đăng nhập</th>
              <th>Họ và Tên</th>
              <th>Số điện thoại</th>
              <th>Ngày tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{userInfo.id}</td>
              <td>{userInfo.username}</td>
              <td>{userInfo.displayname}</td>
              <td>{userInfo.phone}</td>
              <td>{userInfo.created_at}</td>
              <td>
                <button className="edit-button" onClick={handleEditClick}>Chỉnh sửa</button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <button onClick={() => navigate("/")}>Quay Về Trang Chủ</button>
      <div className="ocean">
        <div className="wave"></div>
        <div className="wave wave2"></div>
        <div className="wave wave3"></div>
      </div>
    </div>
  );
};

export default UserInforPage;
