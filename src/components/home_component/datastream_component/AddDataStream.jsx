import { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, Select, notification } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useParams, useLocation, useNavigate } from "react-router-dom";

const { Option } = Select;
const { TextArea } = Input;

const AddDataStream = () => {
  const { token } = useAuth();
  const { thingId } = useParams();
  const { state } = useLocation();
  const thingName = state?.thingName;
  const [loading, setLoading] = useState(false);
  const [sensors, setSensors] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSensors = async () => {
      try {
        setLoading(true);
        const response = await axios.get("/api/get/sensors?top=all", {
          headers: {
            token: token,
          },
        });
        setSensors(response.data);
      } catch (error) {
        console.error("Lỗi", error);
      } finally {
        setLoading(false);
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
          Thing: thingId,
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
        navigate(-1, { state: { thingName: thingName } });
      } else {
        notification.error({
          message: "Lỗi",
          description: "Thêm luồng dữ liệu không thành công",
        });
      }
    } catch (error) {
      notification.error({
        message: "Lỗi",
        description: "Thêm luồng dữ liệu không thành công",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      layout="vertical"
      onFinish={onFinish}
      initialValues={{ sensor: "", name: "", description: "" }}
    >
      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên luồng!" }]}
      >
        <Input placeholder="Nhập tên luồng dữ liệu" className="custom-input" />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <TextArea placeholder="Nhập mô tả" rows={4} className="custom-input" />
      </Form.Item>
      <Form.Item
        label="Sensor"
        name="sensor"
        rules={[{ required: true, message: "Vui lòng chọn sensor!" }]}
      >
        <Select loading={loading} placeholder="Chọn sensor">
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
          className="mt-5 w-48 rounded-full border-orange-500 bg-orange-500 font-bold text-white hover:border-orange-600 hover:bg-orange-600"
          loading={loading}
        >
          Thêm
        </Button>
      </Form.Item>
    </Form>
  );
};

export default AddDataStream;
