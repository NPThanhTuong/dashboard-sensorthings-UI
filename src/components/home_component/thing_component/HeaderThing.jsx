import { useState, useEffect } from "react";
import { Button, Skeleton } from "antd";
import AddThing from "./AddThing";
import FilteredThings from "./FilteredThings";
import { AiOutlinePlus } from "react-icons/ai";

const HeaderThing = ({ searchQuery, setSearchQuery }) => {
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
            <div className="flex items-center gap-5">
              <div className="">
                <Button
                  className="ant-btn-primary flex items-center gap-1 px-10 py-5 text-base font-semibold"
                  onClick={showAddThingModal}
                >
                  <AiOutlinePlus /> Thing
                </Button>
              </div>
              <div>
                <FilteredThings setSearchQuery={setSearchQuery} />
              </div>
            </div>
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
