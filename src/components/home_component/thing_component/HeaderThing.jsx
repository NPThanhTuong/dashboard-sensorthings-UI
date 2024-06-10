import { useState, useEffect } from "react";
//import { useAuth } from "@/context/AuthContext";
import { Button, InputNumber, Skeleton } from "antd";
import AddThing from "./AddThing";
import SearchInput from "./SearchInput";

const HeaderThing = () => {
  //const { intervalTime, setIntervalTime } = useAuth();

  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);

  const [showAddThing, setShowAddThing] = useState(false);

  const showAddThingModal = () => {
    setShowAddThing(true);
  };

  useEffect(() => {
    const updateGreetingAndTime = () => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const seconds = now.getSeconds();
      const day = now.getDate();
      const month = now.getMonth() + 1;
      const year = now.getFullYear();

      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
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
      setLoading(false); // Cập nhật biến loading thành false sau khi dữ liệu đã được tải xong
    };

    updateGreetingAndTime();
    const timer = setInterval(updateGreetingAndTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  return (
    <>
      <section className="flex items-center justify-between rounded-xl bg-white p-4 shadow-md">
        {loading ? (
          <Skeleton active />
        ) : (
          <>
            <div>
              <h1 className="text-2xl font-bold">{greeting}</h1>
              <p className="text-gray-500">{currentTime}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="">
                <Button
                  size="large"
                  className="ant-btn-primary px-10"
                  onClick={showAddThingModal}
                >
                  + Thing
                </Button>
              </div>
              <div>
                <SearchInput />
              </div>
            </div>
            {/* <div className="flex items-center">
              <span className="mr-2">Thời gian gửi dữ liệu (phút):</span>
              <InputNumber
                min={1}
                value={intervalTime} // Sử dụng intervalTime từ AuthContext
                onChange={(value) => setIntervalTime(value)} // Sử dụng setIntervalTime từ AuthContext
              />
            </div> */}
          </>
        )}
      </section>
      {showAddThing && (
        <AddThing
          visible={showAddThing}
          onClose={() => setShowAddThing(false)} // Đóng form khi người dùng nhấn nút đóng
        />
      )}
    </>
  );
};

export default HeaderThing;
