import axios from "axios";
import { useEffect } from "react";
import { toast } from "react-toastify";
import { useAuth } from "@/context/AuthContext";
import { useNavigate } from "react-router-dom";
import { Form, Input, Select, Upload, Button, Modal } from "antd";
import { UploadOutlined } from "@ant-design/icons";

const { Option } = Select;

const AddThing = ({ visible, onClose }) => {
  const { token, user } = useAuth();
  const navigate = useNavigate();

  const [form] = Form.useForm();

  useEffect(() => {
    if (user) {
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
      await axios.post("/api/post/things", data, {
        headers: {
          "Content-Type": "multipart/form-data",
          token: token,
        },
      });
      toast.success("Thêm thing thành công");
      navigate("/");
    } catch (error) {
      console.error("Lỗi thêm thing:", error);
      toast.error("Thêm thing thất bại");
    }
  };

  return (
    <Modal
      title="Thêm Thing"
      visible={visible}
      onCancel={onClose}
      footer={null}
    >
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Form.Item
          label="Vị trí"
          name="id_location"
          rules={[{ required: true, message: "Vui lòng chọn vị trí" }]}
        >
          <Select placeholder="Lựa chọn vị trí">
            <Option value="1">1</Option>
          </Select>
        </Form.Item>

        <Form.Item
          label="Tên Thing"
          name="name"
          rules={[{ required: true, message: "Vui lòng nhập tên Thing" }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          label="Mô tả"
          name="description"
          // rules={[{ required: true, message: "Vui lòng nhập mô tả" }]}
        >
          <Input.TextArea rows={4} />
        </Form.Item>

        <Form.Item label="Hình ảnh" name="avt_image">
          <Upload beforeUpload={() => false} maxCount={1} listType="picture">
            <Button icon={<UploadOutlined />}>Tải lên hình ảnh</Button>
          </Upload>
        </Form.Item>

        <Form.Item name="id_user" hidden>
          <Input />
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit" className="w-full">
            Thêm
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default AddThing;
