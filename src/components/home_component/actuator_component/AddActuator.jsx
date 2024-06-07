import { useState } from "react";
import { Modal, Button, Form, Input, message } from "antd";
import axios from "axios";
import { useAuth } from "@/context/AuthContext";

const AddActuator = () => {
  const { token } = useAuth();
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleOk = () => {
    form
      .validateFields()
      .then((values) => {
        axios
          .post(`/api/post/actuator`, {
            ...values,
            token: token,
          })
          .then((response) => {
            if (response.status === 201) {
              message.success("Actuator added successfully");
              handleCancel();
            } else {
              message.error("Failed to add actuator");
            }
          })
          .catch((error) => {
            message.error("Error: " + error.message);
          });
      })
      .catch((info) => {
        console.log("Validate Failed:", info);
      });
  };

  return (
    <>
      <Button
        type="primary"
        onClick={showModal}
        style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
      >
        + Actuator
      </Button>
      <Modal
        title="Thêm Actuator"
        visible={isModalVisible}
        onCancel={handleCancel}
        onOk={handleOk}
      >
        <Form
          form={form}
          layout="vertical"
          name="add_actuator_form"
          initialValues={{
            encodingType: 1,
          }}
        >
          <Form.Item
            name="name"
            label="Tên thiết bị"
            rules={[{ required: true, message: "Vui lòng nhập tên thiết bị!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
            rules={[{ required: true, message: "Vui lòng nhập mô tả!" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="encodingType"
            label="Loại mã hóa"
            rules={[{ required: true, message: "Vui lòng nhập loại mã hóa!" }]}
          >
            <Input type="number" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default AddActuator;
