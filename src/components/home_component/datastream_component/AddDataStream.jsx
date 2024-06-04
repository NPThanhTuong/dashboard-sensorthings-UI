import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Select, notification, Card } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useParams, useNavigate, useLocation } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const AddDataStream = () => {
  const { token } = useAuth();
  const { thingId } = useParams(); // Chỉ lấy thingId từ URL params
  const { state } = useLocation(); // Lấy state từ location
  const thingName = state?.thingName; // Lấy thingName từ state nếu có
  const [loading, setLoading] = useState(false);
  const [sensors, setSensors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        const response = await axios.get("/api/get/sensors?top=all", {
          headers: {
            token: token,
          },
        });
        setSensors(response.data);
      } catch (error) {
        console.error("Lỗi", error);
      }
    };

    fetchSensors();
  }, [token]);

  const onFinish = async (values) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "/api/post/datastreams",
        {
          Sensor: values.sensor,
          Thing: thingId, // Sử dụng thingId từ params
          name: values.name,
          description: values.description,
        },
        {
          headers: {
            token: token,
          },
        },
      );

      if (response.data.message === "success") {
        notification.success({
          message: "Thành công",
          description: "Thêm luồng dữ liệu thành công",
        });
        navigate(-1, { state: { thingName: thingName } }); // Quay lại trang trước đó với state
      } else {
        notification.error({
          message: "Lỗi",
          description: "Thêm không thành công",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Thêm không thành công",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card
      title="Thêm Luồng Dữ Liệu"
      bordered={false}
      style={{ maxWidth: 600, margin: "0 auto", marginTop: 50 }}
    >
      <Form
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ sensor: "", name: "", description: "" }}
      >
        <Form.Item
          label="Sensor"
          name="sensor"
          rules={[{ required: true, message: "Vui lòng chọn sensor!" }]}
        >
          <Select placeholder="Chọn sensor">
            {sensors.map((sensor) => (
              <Option key={sensor.id} value={sensor.id}>
                {sensor.name}
              </Option>
            ))}
          </Select>
        </Form.Item>
        <Form.Item
          label="Tên"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên luồng!" }]}
        >
          <Input placeholder="Nhập tên luồng dữ liệu" />
        </Form.Item>
        <Form.Item
          label="Mô tả"
          name="description"
          rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
        >
          <TextArea placeholder="Nhập mô tả" rows={4} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" loading={loading}>
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Card>
  );
};

export default AddDataStream;
