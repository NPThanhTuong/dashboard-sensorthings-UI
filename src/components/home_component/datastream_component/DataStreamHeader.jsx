import { Button, Modal, InputNumber, Skeleton } from "antd";
import { useState, useEffect } from "react";
import AddDataStream from "@/components/home_component/datastream_component/AddDataStream";
import TaskingCapabilityForm from "@/components/home_component/taskingcapability_component/TaskingCapabilityForm";
import { useAuth } from "@/context/AuthContext";

const DataStreamHeader = () => {
  const { intervalTime, setIntervalTime } = useAuth(); // Sử dụng intervalTime từ AuthContext
  const [isAddDataStreamModalOpen, setIsAddDataStreamModalOpen] =
    useState(false);
  const [isTaskingCapabilityModalOpen, setIsTaskingCapabilityModalOpen] =
    useState(false);
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true); // Trạng thái loading

  const showAddDataStreamModal = () => {
    setIsAddDataStreamModalOpen(true);
  };

  const showTaskingCapabilityModal = () => {
    setIsTaskingCapabilityModalOpen(true);
  };

  const handleCancel = () => {
    setIsAddDataStreamModalOpen(false);
    setIsTaskingCapabilityModalOpen(false);
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

      const formattedTime = `${hours
        .toString()
        .padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds
        .toString()
        .padStart(2, "0")}`;
      const formattedDate = `${day.toString().padStart(2, "0")}/${month
        .toString()
        .padStart(2, "0")}/${year}`;
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

    // Giả lập thời gian tải dữ liệu
    setTimeout(() => {
      setLoading(false); // Đặt trạng thái loading là false sau khi dữ liệu được tải
    }, 2000); // Giả sử dữ liệu tải trong 2 giây

    return () => {
      clearInterval(timer);
    };
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
          className="button-primary"
          onClick={showTaskingCapabilityModal}
        >
          + Tasking Capability
        </Button>
        <Button
          style={{ backgroundColor: "#ff8e3c", borderColor: "#ff8e3c" }}
          shape="round"
          size="large"
          className="button-primary"
          onClick={showAddDataStreamModal}
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
        open={isAddDataStreamModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <AddDataStream />
      </Modal>
      <Modal
        title="Thêm Tasking Capability"
        open={isTaskingCapabilityModalOpen}
        onCancel={handleCancel}
        footer={null}
      >
        <TaskingCapabilityForm />
      </Modal>
    </section>
  );
};

export default DataStreamHeader;
