import { useState, useEffect } from "react";
import { Form, Input, Button, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import { request } from "@/utils/request";
import { useTheme } from "@/context/ThemeContext";
import "@public/styles/observation-table-content.css";

import { useLanguage } from "@/context/LanguageContext"; // Import context ngôn ngữ
import { useTranslations } from "@/config/useTranslations"; // Import hook để lấy bản dịch

const { Option } = Select;
const { TextArea } = Input;

const TaskingCapabilityForm = () => {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại từ context LanguageContext
  const translations = useTranslations(language); // Lấy các bản dịch dựa trên ngôn ngữ hiện tại

  const { isDarkMode } = useTheme(); // Lấy trạng thái chế độ tối từ context ThemeContext
  const { token } = useAuth(); // Lấy token xác thực từ context AuthContext
  const { thingId } = useParams(); // Lấy tham số thingId từ URL
  const [form] = Form.useForm(); // Tạo đối tượng form của Ant Design
  const [actuators, setActuators] = useState([]); // Tạo trạng thái cho danh sách actuators
  const [loading, setLoading] = useState(true); // Tạo trạng thái loading
  const navigate = useNavigate(); // Tạo đối tượng điều hướng

  useEffect(() => {
    const fetchActuators = async () => {
      try {
        const response = await request.get("/get/actuator?top=all", {
          headers: { token: token }, // Gửi token trong headers
        });
        setActuators(response.data); // Cập nhật danh sách actuators
        setLoading(false); // Tắt trạng thái loading
      } catch (error) {
        console.error(translations["Lỗi lấy dữ liệu actuators:"], error); // Xử lý lỗi
        setLoading(false); // Tắt trạng thái loading
      }
    };

    fetchActuators(); // Gọi hàm fetchActuators khi component được mount
  }, [token, translations]);

  const onFinish = (values) => {
    const payload = {
      taskingParameters: {
        mode: "on/off",
        parameters: { on: "-1", off: "0" },
      },
      name: values.name, // Lấy giá trị tên từ form
      description: values.description, // Lấy giá trị mô tả từ form
      thing_id: thingId, // Lấy giá trị thingId từ URL
      actuator_id: values.actuator_id, // Lấy giá trị actuator_id từ form
      token,
    };

    request
      .post(`/post/taskingcapability`, payload) // Gửi yêu cầu POST đến API
      .then((response) => {
        if (response.status === 201) {
          message.success(translations["Thêm nhiệm vụ thành công!"]); // Hiển thị thông báo thành công
          form.resetFields(); // Reset form
          navigate(-1); // Điều hướng về trang trước đó
        } else {
          message.error(translations["Thêm nhiệm vụ thất bại!"]); // Hiển thị thông báo lỗi
        }
      })
      .catch((error) => {
        message.error(translations["Lỗi: "] + error.message); // Hiển thị thông báo lỗi
      });
  };

  if (!translations) {
    return null;
  }

  return (
    <div
      className={`-m-10  rounded-2xl p-6 ${
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
        {translations["Thêm nhiệm vụ điều khiển"]}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        className={isDarkMode ? "dark-mode" : ""} // Áp dụng lớp CSS chế độ tối nếu isDarkMode là true
      >
        <Form.Item
          label={translations["Tên nhiệm vụ"]}
          name="name"
          rules={[
            {
              required: true,
              message: translations["Vui lòng nhập tên nhiệm vụ!"],
            },
          ]}
        >
          <Input
            placeholder={translations["Nhập tên nhiệm vụ điều khiển"]}
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
          <TextArea
            placeholder={translations["Mô tả"]}
            rows={4}
            className={`custom-input ${
              isDarkMode
                ? "dark:bg-darkInput dark:border-darkInput dark:text-white"
                : ""
            }`}
          />
        </Form.Item>
        <Form.Item
          label={translations["Thiết bị"]}
          name="actuator_id"
          rules={[
            {
              required: true,
              message: translations["Vui lòng chọn thiết bị!"],
            },
          ]}
        >
          <Select
            loading={loading}
            placeholder={translations["Chọn thiết bị điều khiển"]}
            className={
              isDarkMode ? "select-dark-mode" : "bg-white focus:border-primary"
            }
            dropdownClassName={isDarkMode ? "select-dark-mode" : ""}
          >
            {actuators?.map((actuator) => (
              <Option key={actuator.id} value={actuator.id}>
                {actuator.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={`mt-5 w-full rounded-2xl font-bold ${
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
  );
};

export default TaskingCapabilityForm;
