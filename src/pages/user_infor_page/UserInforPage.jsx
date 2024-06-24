import { useState, useEffect } from "react";
import { request } from "@/utils/request";
import { Link, useNavigate } from "react-router-dom";
import { Spin, notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import avatarUser from "@public/images/user-avatar.jpg";
import { Form, Input, Button, Typography } from "antd";

import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";

const { Text } = Typography;

const UserInforPage = () => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();

  const [translations, setTranslations] = useState(null);

  useEffect(() => {
    import(`@/Languages/${language}.json`)
      .then((module) => {
        setTranslations(module.default);
      })
      .catch((error) => {
        console.error("Error importing translations:", error);
      });
  }, [language]);

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

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const response = await request.get("/user", {
          headers: { token },
        });
        setUserInfo(response.data.message);
        setEditForm({
          displayname: response.data.message.displayname,
          phone: response.data.message.phone,
        });
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
    setIsEditing(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm((prevForm) => ({
      ...prevForm,
      [name]: value,
    }));
    setValidationError(null);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    if (editForm.phone.length !== 10) {
      setValidationError(translations["Số điện thoại không đúng 10 chữ số!"]);
      return;
    }

    const changes = {};
    if (editForm.displayname !== userInfo.displayname)
      changes.displayname = editForm.displayname;
    if (editForm.phone !== userInfo.phone) changes.phone = editForm.phone;

    if (Object.keys(changes).length === 0) {
      setIsEditing(false);
      return;
    }

    try {
      const response = await request.post("/updateInformation", changes, {
        params: { token },
      });

      if (response.data.success) {
        setUserInfo((prevUserInfo) => ({
          ...prevUserInfo,
          ...changes,
        }));
        setIsEditing(false);
        notification.success({
          message: translations["Cập nhật thông tin thành công!"],
        });
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      if (
        error.response &&
        error.response.data[0].includes("The phone has already been taken.")
      ) {
        notification.error({
          message:
            translations["Số điện thoại đã tồn tại, vui lòng nhập số khác"],
        });
      } else {
        setError(error.response ? error.response.data : error.message);
      }
    }
  };

  const formatDate = (dateString) => {
    const options = { day: "2-digit", month: "2-digit", year: "numeric" };
    return new Date(dateString).toLocaleDateString("vi-VN", options);
  };

  const handleLogout = () => {
    clearToken();
    navigate("/dang-nhap");
  };

  if (loading) {
    return (
      <p>
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="loading-text text-4xl font-bold text-gray-500">
            <Spin size="large" />
          </div>
        </div>
      </p>
    );
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <section className="mx-auto my-20 max-w-3xl">
      <section className="flex flex-col gap-4 md:flex-row">
        <div
          className={`w-full rounded-2xl border border-dashed border-gray-500 bg-white ${
            isDarkMode ? "dark:bg-darkPrimary dark:text-white" : "bg-white"
          } p-5 text-center md:w-1/3`}
        >
          <div className="mx-auto">
            <img
              src={avatarUser}
              alt="Ảnh đại diện"
              className="mx-auto w-32 rounded-full"
            />
          </div>
          <div className="mt-3">
            <p className="py-2 text-xl font-bold text-primary">
              {userInfo.displayname}
            </p>
            <p className="text-lg">{userInfo.phone}</p>
          </div>
          {!isEditing && (
            <Button
              type="primary"
              onClick={handleEditClick}
              className={` mt-3 rounded-2xl ${
                isDarkMode
                  ? "dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500"
                  : ""
              }`}
            >
              {translations["Cập nhật"]}
            </Button>
          )}
        </div>
        <div className="w-full rounded-2xl border border-dashed border-gray-500 bg-white p-5 dark:bg-darkPrimary dark:text-white md:w-2/3">
          <div className="text-2xl font-bold">
            {translations["Thông tin cập nhật"]}
          </div>
          {isEditing ? (
            <Form onSubmit={handleFormSubmit}>
              <Form.Item>
                <Input
                  type="text"
                  name="displayname"
                  value={editForm.displayname}
                  onChange={handleInputChange}
                  placeholder={translations["Nhập họ và tên"]}
                  className="mt-8 dark:border-blue-500 dark:text-black"
                />
              </Form.Item>
              <Form.Item>
                <Input
                  type="text"
                  name="phone"
                  value={editForm.phone}
                  onChange={handleInputChange}
                  className="dark:border-blue-500 dark:text-black"
                  placeholder={translations["Số điện thoại"]}
                />
              </Form.Item>
              {validationError && <Text type="danger">{validationError}</Text>}
              <div className="flex flex-col md:flex-row">
                <Button
                  type="primary"
                  onClick={handleFormSubmit}
                  className="mb-2 w-full rounded-2xl dark:bg-blue-600 md:mb-0 md:mr-2 md:w-40"
                >
                  {translations["Lưu thay đổi"]}
                </Button>
                <Button
                  type="default"
                  onClick={() => setIsEditing(false)}
                  className="w-full rounded-2xl border border-primary text-primary dark:border-red-600 dark:text-red-600 md:w-40"
                >
                  {translations["Hủy"]}
                </Button>
              </div>
            </Form>
          ) : (
            <div className="mt-8">
              <div className="my-5 rounded-2xl border border-dashed border-gray-500 px-8 py-2">
                <p className="text-base">{translations["Họ và tên"]}</p>
                <p className="mt-1 text-xl font-medium">
                  {userInfo.displayname}
                </p>
              </div>
              <div className="my-5 rounded-2xl border border-dashed border-gray-500 px-8 py-2">
                <p className="text-base">{translations["Số điện thoại"]}</p>
                <p className="mt-1 text-xl font-medium">{userInfo.phone}</p>
              </div>
            </div>
          )}
        </div>
      </section>
      <section className="mt-4 rounded-2xl border border-dashed border-gray-500 bg-white p-5 dark:bg-darkPrimary dark:text-white">
        <div className="text-2xl font-bold">
          {translations["Thông tin thêm"]}
        </div>
        <div className="flex justify-between gap-4">
          <div className="my-5 w-full rounded-2xl border border-dashed border-gray-500 px-8 py-2">
            <p>{translations["Email"]}</p>
            <p className="pt-2">
              {userInfo.email || translations["Chưa cập nhật"]}
            </p>
          </div>{" "}
          <div className="my-5 w-full rounded-2xl border border-dashed border-gray-500 px-8 py-2">
            <p>{translations["Ngày tạo"]}</p>
            <p className="pt-2">{formatDate(userInfo.created_at)}</p>
          </div>
        </div>
        <div className="mt-4 flex gap-5 md:mt-0">
          <Link
            to="/thay-doi-mat-khau"
            className="flex w-full items-center justify-center rounded-2xl border border-primary bg-primary text-white dark:border-blue-600 dark:bg-blue-600 dark:hover:bg-blue-500 dark:hover:text-white md:w-40"
          >
            {translations["Thay đổi mật khẩu"]}
          </Link>
          <Button
            type="primary"
            danger
            onClick={handleLogout}
            className="w-full rounded-2xl bg-red-600 text-white dark:border-red-700 dark:bg-red-700 md:w-40"
          >
            {translations["Đăng xuất"]}
          </Button>
        </div>
      </section>
    </section>
  );
};

export default UserInforPage;
