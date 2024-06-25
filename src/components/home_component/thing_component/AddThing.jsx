import React, { useEffect } from "react";
import { Modal, Form, Input, Select, Upload, Button, notification } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { addThing } from "@/apis/ThingAPI";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";
import { useTheme } from "@/context/ThemeContext";

const { Option } = Select;

const AddThing = ({ visible, onClose }) => {
  const { token, user } = useAuth();
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  const navigate = useNavigate();
  const [form] = Form.useForm();

  useEffect(() => {
    if (user && user.message && user.message.id) {
      form.setFieldsValue({ id_user: user.message.id });
    }
  }, [user, form]);

  const handleSubmit = async (values) => {
    const data = new FormData();
    data.append("name", values.name);
    data.append("description", values.description);
    data.append("id_user", values.id_user);
    data.append("id_location", values.id_location);
    if (values.avt_image) {
      data.append("avt_image", values.avt_image.file);
    }

    try {
      await addThing(data, token);
      notification.success({
        message: translations["Thêm đối tượng thành công!"],
      });
      navigate("/");
    } catch (error) {
      console.error("Lỗi thêm đối tượng:", error);
      notification.error({ message: translations["Thêm đối tượng thất bại!"] });
    }
  };

  if (!translations) {
    return null;
  }

  return (
    <Modal
      title={null}
      open={visible}
      onCancel={onClose}
      closable={false}
      footer={null}
      className={`rounded-2xl p-6 ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
          : "bg-white"
      }`}
    >
      <div
        className={`-m-10 rounded-2xl p-6 ${
          isDarkMode
            ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
            : "bg-white"
        }`}
      >
        <h1
          className={`text-center text-xl font-bold ${
            isDarkMode
              ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
              : "bg-white"
          }`}
        >
          {translations["Thêm đối tượng"]}
        </h1>
        <Form
          form={form}
          onFinish={handleSubmit}
          layout="vertical"
          className={
            isDarkMode
              ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
              : "bg-white focus:border-primary"
          }
        >
          <Form.Item
            label={translations["Vị trí"]}
            name="id_location"
            rules={[
              {
                required: true,
                message: translations["Vui lòng chọn vị trí!"],
              },
            ]}
            className={
              isDarkMode
                ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
                : "bg-white focus:border-primary"
            }
          >
            <Select
              placeholder={translations["Lựa chọn vị trí"]}
              className={
                isDarkMode
                  ? "select-dark-mode"
                  : "bg-white focus:border-primary"
              }
              dropdownClassName={isDarkMode ? "select-dark-mode" : ""}
            >
              <Option value="1">1</Option>
              {/* Add more options if needed */}
            </Select>
          </Form.Item>

          <Form.Item
            label={translations["Tên đối tượng"]}
            name="name"
            rules={[
              {
                required: true,
                message: translations["Vui lòng nhập tên đối tượng!"],
              },
            ]}
          >
            <Input
              placeholder={translations["Nhập tên đối tượng"]}
              className={`custom-input ${
                isDarkMode
                  ? "dark:border-darkInput dark:bg-darkInput dark:text-white"
                  : "bg-white"
              }`}
            />
          </Form.Item>

          <Form.Item
            label={translations["Mô tả"]}
            name="description"
            rules={[
              { required: true, message: translations["Vui lòng nhập mô tả!"] },
            ]}
          >
            <Input.TextArea
              placeholder={translations["Mô tả"]}
              rows={4}
              className={`custom-input ${
                isDarkMode
                  ? "dark:bg-darkInput dark:border-darkInput dark:text-white"
                  : ""
              }`}
            />
          </Form.Item>

          <Form.Item label={translations["Hình ảnh"]} name="avt_image">
            <Upload beforeUpload={() => false} maxCount={1} listType="picture">
              <Button
                icon={<UploadOutlined />}
                className={`custom-input ${
                  isDarkMode
                    ? "dark:bg-darkInput dark:border-darkInput dark:text-white"
                    : ""
                }`}
              >
                {translations["Tải lên hình ảnh"]}
              </Button>
            </Upload>
          </Form.Item>

          <Form.Item name="id_user" hidden>
            <Input />
          </Form.Item>

          <Form.Item>
            <Button
              type="primary"
              htmlType="submit"
              className={`w-full ${
                isDarkMode
                  ? "dark:bg-darkButton dark:m-0 dark:border-darkPrimary dark:text-white dark:shadow-md dark:shadow-white"
                  : ""
              }`}
            >
              {translations["Thêm"]}
            </Button>
          </Form.Item>
        </Form>
      </div>
    </Modal>
  );
};

export default AddThing;
