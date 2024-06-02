import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";

const UserInforPage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationError, setValidationError] = useState(null);
  const { token, clearToken } = useAuth();
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

  const handleLogout = () => {
    clearToken();
    navigate("/dang-nhap");
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="container mx-auto flex max-w-lg items-center py-6">
        <div className="rounded-lg bg-white p-6 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold">{headerTitle}</h2>
          {isEditing ? (
            <form onSubmit={handleFormSubmit} className="space-y-4">
              <div>
                <label className="block text-gray-700">Họ và Tên:</label>
                <input
                  type="text"
                  name="displayname"
                  value={editForm.displayname}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700">Số điện thoại:</label>
                <input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 shadow-sm focus:outline-none focus:ring focus:ring-blue-500"
                />
                {validationError && (
                  <p className="text-red-600">{validationError}</p>
                )}
              </div>
              <div className="flex items-center justify-between gap-4">
                <button
                  type="submit"
                  className="w-full rounded-md bg-blue-600  py-2 text-white transition hover:bg-blue-700"
                  disabled={validationError}
                >
                  Lưu
                </button>
                <button
                  type="button"
                  className="w-full rounded-md bg-gray-300  py-2 text-gray-700 transition hover:bg-gray-400"
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
                  className="w-full rounded-md bg-yellow-500  py-2 text-white transition hover:bg-yellow-600"
                  onClick={() => navigate("/thay-doi-mat-khau")}
                >
                  Thay đổi mật khẩu
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-4">
              <div className="flex justify-between border-b py-2">
                <span className="font-semibold text-gray-600">
                  Tên đăng nhập:
                </span>
                <span>{userInfo.username}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="font-semibold text-gray-600">Họ và Tên:</span>
                <span>{userInfo.displayname}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="font-semibold text-gray-600">
                  Số điện thoại:
                </span>
                <span>{userInfo.phone}</span>
              </div>
              <div className="flex justify-between border-b py-2">
                <span className="font-semibold text-gray-600">Ngày tạo:</span>
                <span>{formatDate(userInfo.created_at)}</span>
              </div>
              <div className="flex justify-between gap-4 py-2">
                <button
                  className="flex h-12 w-full items-center justify-start rounded-md bg-green-800 pl-5 text-white transition-colors duration-200 ease-in-out hover:bg-green-600"
                  onClick={handleEditClick}
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={handleLogout}
                  className="flex h-12 w-full items-center justify-start rounded-md bg-red-800 pl-5 text-white transition-colors duration-200 ease-in-out hover:bg-red-600"
                >
                  <span className="text-md ml-3 font-medium">Đăng xuất</span>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserInforPage;
