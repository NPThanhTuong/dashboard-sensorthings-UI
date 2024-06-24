import { useState, useEffect } from "react";
import { Form, Input, Button, Select, notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { addDataStream } from "@/apis/DataStreamAPI";
import { fetchSensors } from "@/apis/SensorAPI";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";
import { useTheme } from "@/context/ThemeContext";

const { Option } = Select;
const { TextArea } = Input;

const AddDataStream = () => {
  const { language } = useLanguage(); // Lấy ngôn ngữ hiện tại từ context LanguageContext
  const translations = useTranslations(language); // Lấy các bản dịch dựa trên ngôn ngữ hiện tại
  const { isDarkMode } = useTheme(); // Lấy trạng thái chế độ tối

  const { token } = useAuth(); // Lấy token xác thực từ context AuthContext
  const { thingId } = useParams(); // Lấy tham số thingId từ URL
  const { state } = useLocation(); // Lấy state từ location
  const thingName = state?.thingName; // Lấy tên thing từ state
  const [loading, setLoading] = useState(false); // Trạng thái tải dữ liệu
  const [sensors, setSensors] = useState([]); // Danh sách các cảm biến
  const navigate = useNavigate(); // Điều hướng

  useEffect(() => {
    const loadSensors = async () => {
      try {
        setLoading(true); // Bắt đầu tải dữ liệu
        const sensorData = await fetchSensors(token); // Gọi API lấy danh sách cảm biến
        setSensors(sensorData); // Cập nhật danh sách cảm biến
      } catch (error) {
        console.error(translations["Lỗi"], error); // Xử lý lỗi nếu có
      } finally {
        setLoading(false); // Kết thúc tải dữ liệu
      }
    };

    loadSensors(); // Gọi hàm loadSensors khi component được mount
  }, [token, translations]);

  const onFinish = async (values) => {
    setLoading(true); // Bắt đầu tải dữ liệu
    try {
      const data = {
        Sensor: values.sensor, // ID của cảm biến
        Thing: thingId, // ID của thing
        name: values.name, // Tên của data stream
        description: values.description, // Mô tả của data stream
      };
      const response = await addDataStream(data, token); // Gọi API thêm data stream

      if (response.message === "success") {
        notification.success({
          message: translations["Thành công"], // Thông báo thành công
          description: translations["Thêm quan trắc thành công"], // Mô tả thông báo thành công
        });
        navigate(-1, { state: { thingName: thingName } }); // Điều hướng về trang trước đó
      } else {
        notification.error({
          message: translations["Lỗi"], // Thông báo lỗi
          description: translations["Thêm quan trắc không thành công"], // Mô tả thông báo lỗi
        });
      }
    } catch (error) {
      notification.error({
        message: translations["Lỗi"], // Thông báo lỗi
        description: translations["Thêm quan trắc không thành công"], // Mô tả thông báo lỗi
      });
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu
    }
  };

  if (!translations) {
    return null; // Nếu chưa có bản dịch, không hiển thị gì
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
        {translations["Thêm quan trắc"]}
      </h1>
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ sensor: "", name: "", description: "" }} // Giá trị khởi tạo của form
      >
        <Form.Item
          label={translations["Tên quan trắc"]}
          name="name"
          rules={[
            {
              required: true,
              message: translations["Vui lòng nhập tên quan trắc!"],
            },
          ]}
        >
          <Input
            placeholder={translations["Nhập tên quan trắc"]}
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
            placeholder={translations["Nhập mô tả quan trắc"]}
            rows={4}
            className={`custom-input ${
              isDarkMode
                ? "dark:bg-darkInput dark:border-darkInput dark:text-white"
                : ""
            }`}
          />
        </Form.Item>
        <Form.Item
          label={translations["Cảm biến"]}
          name="sensor"
          rules={[
            {
              required: true,
              message: translations["Vui lòng chọn cảm biến!"],
            },
          ]}
        >
          <Select
            loading={loading}
            placeholder={translations["Chọn cảm biến"]}
            className={
              isDarkMode ? "select-dark-mode" : "bg-white focus:border-primary"
            }
            dropdownClassName={isDarkMode ? "select-dark-mode" : ""}
          >
            {sensors.map((sensor) => (
              <Option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item>
          <Button
            type="primary"
            htmlType="submit"
            className={`mt-5 w-full rounded-2xl bg-primary font-bold ${
              isDarkMode
                ? "dark:bg-darkButton dark:m-0 dark:border-darkPrimary dark:text-white dark:shadow-md dark:shadow-white"
                : ""
            }`}
            loading={loading}
          >
            {translations["Thêm"]}
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default AddDataStream;
