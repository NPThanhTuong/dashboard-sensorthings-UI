import axios from "axios";
import { Form, Input, Button, message } from "antd";
import { useAuth } from "@/context/AuthContext";
import { useParams } from "react-router-dom";

const { TextArea } = Input;

const TaskingCapabilityForm = () => {
  const { token } = useAuth();
  const { thingId } = useParams();
  const [form] = Form.useForm();

  const onFinish = (values) => {
    const payload = {
      taskingParameters: {
        mode: "on/off",
        parameters: {
          on: "1",
          off: "0",
        },
      },
      name: values.name,
      description: values.description,
      thing_id: thingId,
      actuator_id: values.actuator_id,
      token: token,
    };

    axios
      .post(`/api/post/taskingcapability`, payload)
      .then((response) => {
        if (response.status === 201) {
          message.success("Tasking capability tạo thành công!");
          form.resetFields();
        } else {
          message.error("Tạo Tasking capability thất bại.");
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
        label="Actuator ID"
        name="actuator_id"
        rules={[{ required: true, message: "Vui lòng nhập ID của Actuator!" }]}
      >
        <Input type="number" />
      </Form.Item>
      <Form.Item>
        <Button type="primary" htmlType="submit">
          Tạo nhiệm vụ
        </Button>
      </Form.Item>
    </Form>
  );
};

export default TaskingCapabilityForm;
