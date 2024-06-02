/* Author: Le Vu Luan */
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
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
    displayname: "",
    phone: "",
  });
  const [headerTitle, setHeaderTitle] = useState(
    "THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG",
  );

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
        console.error(
          "Error fetching user info:",
          error.response || error.message,
        );
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
    if (editForm.displayname !== userInfo.displayname)
      changes.displayname = editForm.displayname;
    if (editForm.phone !== userInfo.phone) changes.phone = editForm.phone;

    if (Object.keys(changes).length === 0) {
      window.location.reload();
      return;
    }

    try {
      const response = await axios.post("/api/updateInformation", changes, {
        params: {
          token: token,
        },
      });

      // Check if the update was successful
      if (response.data.success) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          ...changes,
        }));
        setIsEditing(false);
        setHeaderTitle("THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG");
        toast.success("Cập nhật thông tin thành công!");
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (
        error.response.data[0].includes("The phone has already been taken.")
      ) {
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

  return (
    <div className="user-info-container">
      <ToastContainer />
      <h2>{headerTitle}</h2>
      {isEditing ? (
        <form onSubmit={handleFormSubmit} className="edit-form">
          <div>
            <label>Họ và Tên: </label>
            <input
              type="text"
              name="displayname"
              value={editForm.displayname}
              onChange={handleInputChange}
            />
          </div>
          <div>
            <label>Số điện thoại: </label>
            <input
              type="text"
              name="phone"
              value={editForm.phone}
              onChange={handleInputChange}
            />
            {validationError && (
              <p className="error-message">{validationError}</p>
            )}
          </div>
          <button
            type="submit"
            className="save-button"
            disabled={validationError}
          >
            Lưu
          </button>
          <button
            type="button"
            className="cancel-button"
            onClick={() => {
              setIsEditing(false);
              setHeaderTitle("THÔNG TIN TÀI KHOẢN NGƯỜI DÙNG");
              window.location.reload();
            }}
          >
            Hủy
          </button>
          <button
            type="button"
            className="change-password-button"
            onClick={() => navigate("/thay-doi-mat-khau")}
          >
            Thay đổi mật khẩu
          </button>
        </form>
      ) : (
        <table className="user-info-table">
          <thead>
            <tr>
              <th>Tên đăng nhập</th>
              <th>Họ và Tên</th>
              <th>Số điện thoại</th>
              <th>Ngày tạo</th>
              <th>Thao Tác</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>{userInfo.username}</td>
              <td>{userInfo.displayname}</td>
              <td>{userInfo.phone}</td>
              <td>{formatDate(userInfo.created_at)}</td>
              <td>
                <button className="edit-button" onClick={handleEditClick}>
                  Chỉnh sửa
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      )}
      <button onClick={() => navigate("/")}>Quay Về Trang Chủ</button>
    </div>
  );
};

export default UserInforPage;
