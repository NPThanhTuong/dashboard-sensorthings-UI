import "./data-stream-header.css";
import { Button, Select, Modal } from "antd";
import { useState, useEffect } from "react";
import { SearchOutlined } from "@ant-design/icons";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";

const { Option } = Select;

const DataStreamHeader = ({ dataStreams, handleDataStreamChange }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");

  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const day = now.getDate();
      const month = now.getMonth() + 1; // months are 0-indexed
      const year = now.getFullYear();

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
      const formattedDate = `${day.toString().padStart(2, "0")}/${month.toString().padStart(2, "0")}/${year}`;
      const formattedDateTime = `${formattedTime} ${formattedDate}`;

      let greetingMessage = "Xin chào";
      if (hours >= 5 && hours < 12) {
        greetingMessage = "Chào buổi sáng";
      } else if (hours >= 12 && hours < 18) {
        greetingMessage = "Chào buổi chiều";
      } else if (hours >= 18 && hours < 21) {
        greetingMessage = "Chào buổi tối";
      } else {
        greetingMessage = "Chúc ngủ ngon";
      }

      setGreeting(greetingMessage);
      setCurrentTime(formattedDateTime);
    };

    updateGreetingAndTime();
    const timer = setInterval(updateGreetingAndTime, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
      <div>
        <h1 className="text-2xl font-bold">{greeting}</h1>
        <p className="text-gray-500">{currentTime}</p>
      </div>
      <div className="flex items-center gap-4">
        <Button
          style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
          shape="round"
          size="large"
          className="ant-btn-primary"
        >
          + Actuator
        </Button>
        <Button
          style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
          shape="round"
          size="large"
          className="ant-btn-primary"
          onClick={showModal}
        >
          + Luồng dữ liệu
        </Button>
        <Select
          placeholder={
            <span className="custom-placeholder text-black">
              Chọn luồng dữ liệu
            </span>
          }
          className="custom-select w-48"
          size="large"
          onChange={handleDataStreamChange}
        >
          {dataStreams?.map((dataStream) => (
            <Option key={dataStream.id} value={dataStream.id}>
              {dataStream.name}
            </Option>
          ))}
        </Select>
        <div className="custom-input-container">
          <input type="text" placeholder="Tìm" className="custom-input" />
          <SearchOutlined className="custom-input-icon" />
        </div>
      </div>
      <Modal
        title="Thêm Luồng Dữ Liệu"
        visible={isModalVisible}
        onCancel={handleCancel}
        footer={null}
      >
        <AddDataStream />
      </Modal>
    </section>
  );
};

export default DataStreamHeader;
