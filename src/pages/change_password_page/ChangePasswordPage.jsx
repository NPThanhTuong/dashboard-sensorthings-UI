import { useState } from "react";
import { request } from "@/utils/request";
import { useAuth } from "@/context/AuthContext";
import { notification } from "antd";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/context/LanguageContext"; // Import useLanguage
import { useTranslations } from "@/config/useTranslations"; // Import useTranslations
import { useTheme } from "@/context/ThemeContext";

const ChangePasswordPage = () => {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại từ context
  const translations = useTranslations(language); // Lấy các bản dịch dựa trên ngôn ngữ hiện tại
  const { isDarkMode } = useTheme();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const { token } = useAuth();

  const handleChangePassword = async (e) => {
    e.preventDefault();

    // Validate passwords
    if (newPassword !== confirmPassword) {
      notification.error({
        message: translations["Mật khẩu mới và mật khẩu xác nhận không khớp!"],
      });
      return;
    }

    // Call API to change password
    try {
      const response = await request.post("/resetPassword", {
        password: currentPassword,
        newPassword: newPassword,
        rePassword: confirmPassword,
        token,
      });

      if (response.status !== 200) {
        notification.error({
          message: translations["Đã xảy ra lỗi khi thay đổi mật khẩu"],
        });
        return;
      }

      notification.success({
        message: translations["Thay đổi mật khẩu thành công!"],
      });
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setError("");
      navigate("/dang-nhap");
    } catch (error) {
      notification.error({
        message: translations["Thay đổi mật khẩu thất bại!"],
      });
    }
  };

  if (!translations) {
    return null;
  }

  return (
    <div className={``}>
      <form
        onSubmit={handleChangePassword}
        className={`form-container mx-auto mt-16 w-96 max-w-lg rounded-xl bg-white px-8 py-10 shadow-lg ${
          isDarkMode
            ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white dark:shadow-xl dark:shadow-white"
            : "bg-white"
        }`}
      >
        {error && <div style={{ color: "red" }}>{error}</div>}

        <h2 className="dark:text-darkButton mb-4 text-center text-2xl font-bold text-primary">
          {translations["Thay đổi mật khẩu"]}
        </h2>

        <div>
          <label
            className="my-2 block text-lg text-gray-700 dark:text-white"
            htmlFor="current-password"
          >
            {translations["Mật khẩu hiện tại:"]}
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
            autoComplete="current-password"
          />
        </div>
        <div>
          <label
            className="my-2 block text-lg text-gray-700 dark:text-white"
            htmlFor="new-password"
          >
            {translations["Mật khẩu mới:"]}
          </label>
          <input
            className="focus:shadow-outline w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <div>
          <label
            className="my-2 block text-lg text-gray-700 dark:text-white"
            htmlFor="confirm-password"
          >
            {translations["Xác nhận mật khẩu mới:"]}
          </label>
          <input
            className="focus:shadow-outline mb-5 w-full appearance-none rounded border border-gray-300 px-3 py-2 leading-tight text-gray-700 focus:outline-none"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            autoComplete="new-password"
          />
        </div>
        <button
          type="submit"
          className="focus:shadow-outline dark:bg-darkButton w-full rounded bg-primary px-2 py-2 font-semibold text-white focus:outline-none"
        >
          {translations["Thay đổi mật khẩu"]}
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordPage;
