import React, { useState, useEffect } from "react";
import axios from "axios";
import { Form, Input, Button, message, Select } from "antd";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";

const { Option } = Select;
const { TextArea } = Input;

const TaskingCapabilityForm = () => {
  const { token } = useAuth();
  const { thingId } = useParams();
  const [form] = Form.useForm();
  const [actuators, setActuators] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchActuators = async () => {
      try {
        const response = await axios.get("/api/get/actuator?top=all", {
          headers: { token: token },
        });
        setActuators(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu actuators:", error);
        setLoading(false);
      }
    };

    fetchActuators();
  }, [token]);

  const onFinish = (values) => {
    const payload = {
      taskingParameters: {
        mode: "on/off",
        parameters: { on: "1", off: "0" },
      },
      name: values.name,
      description: values.description,
      thing_id: thingId,
      actuator_id: values.actuator_id,
      token,
    };

    axios
      .post(`/api/post/taskingcapability`, payload)
      .then((response) => {
        if (response.status === 201) {
          message.success("Tạo Tasking capability thành công!");
          form.resetFields();
          navigate(-1);
        } else {
          message.error("Tạo tasking capability thất bại.");
        }
      })
      .catch((error) => {
        message.error("Error: " + error.message);
      });
  };

  return (
    <Form form={form} layout="vertical" onFinish={onFinish}>
      <Form.Item
        label="Tên"
        name="name"
        rules={[{ required: true, message: "Vui lòng nhập tên!" }]}
      >
        <Input />
      </Form.Item>
      <Form.Item
        label="Mô tả"
        name="description"
        rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
      >
        <TextArea rows={4} />
      </Form.Item>
      <Form.Item
        label="Actuator"
        name="actuator_id"
        rules={[{ required: true, message: "Vui lòng chọn actuator!" }]}
      >
        <Select loading={loading} placeholder="Chọn actuator">
          {actuators?.map((actuator) => (
            <Option key={actuator.id} value={actuator.id}>
              {actuator.name}
            </Option>
          ))}
        </Select>
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Tạo
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskingCapabilityForm;
