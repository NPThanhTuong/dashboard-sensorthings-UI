import { useState, useEffect } from "react";
import { Button } from "antd";
import AddThing from "./AddThing";
import FilteredThings from "./FilteredThings";
import { AiOutlinePlus } from "react-icons/ai";

import ThemeLightDark from "@/components/theme_component/ThemeLightDark";
import LanguageSelector from "@/components/language_component/LanguageSelector";

import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const HeaderThing = ({ searchQuery, setSearchQuery }) => {
  const [greeting, setGreeting] = useState("");
  const [currentTime, setCurrentTime] = useState("");
  const [loading, setLoading] = useState(true);
  const [showAddThing, setShowAddThing] = useState(false);

  // phần chuyển đổi ngôn ngữ
  const { language } = useLanguage();
  const translations = useTranslations(language);

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
      setLoading(false);
    };

    updateGreetingAndTime();
    const timer = setInterval(updateGreetingAndTime, 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  if (!translations) {
    return null;
  }
  return (
    <>
      <section className="flex flex-col items-center justify-between rounded-2xl bg-white p-4 shadow-md dark:bg-darkPrimary sm:flex-row">
        {loading ? (
          <div className="flex w-full items-center justify-center"></div>
        ) : (
          <>
            <div className="mb-4 sm:mb-0">
              <h1 className="text-2xl font-bold dark:text-textDark">
                {translations["Trang chủ"]}
              </h1>
              <p className="dark:text-textDark">{currentTime}</p>
            </div>
            <div className="flex flex-col items-center gap-5 sm:flex-row">
              <div className="mb-4 sm:mb-0">
                <Button
                  type="primary"
                  className={`flex w-40 items-center justify-center gap-1 rounded-full bg-primary font-semibold text-white dark:bg-darkButton dark:shadow-sm dark:shadow-white`}
                  onClick={showAddThingModal}
                  style={{ height: "40px" }}
                >
                  <AiOutlinePlus /> {translations["Đối tượng"]}
                </Button>
              </div>
              <div>
                <FilteredThings setSearchQuery={setSearchQuery} />
              </div>
              <div>
                <ThemeLightDark />
              </div>
              <div>
                <LanguageSelector />
              </div>
            </div>
          </>
        )}
      </section>
      {showAddThing && (
        <AddThing
          visible={showAddThing}
          onClose={() => setShowAddThing(false)}
        />
      )}
    </>
  );
};

export default HeaderThing;
