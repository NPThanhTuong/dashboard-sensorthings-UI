import { Button, InputNumber } from "antd";
import { useTheme } from "@/context/ThemeContext";
import { useLanguage } from "@/context/LanguageContext";
import { useTranslations } from "@/config/useTranslations";

const HeaderSettingThing = ({
  thingId,
  intervalTimes,
  setIntervalTime,
  showModal,
  showTaskingCapabilityModal,
}) => {
  const { isDarkMode } = useTheme();
  const { language } = useLanguage();
  const translations = useTranslations(language);

  if (!translations) {
    return null;
  }

  return (
    <section
      className={`flex flex-col items-center justify-between rounded-2xl bg-white p-4 shadow-md sm:flex-row sm:p-8 ${
        isDarkMode
          ? "dark:border-darkPrimary dark:bg-darkPrimary dark:text-white"
          : "border-white bg-white"
      }`}
    >
      <div className="flex flex-col gap-4 sm:flex-row">
        <Button
          type="primary"
          onClick={showModal}
          className="dark:bg-darkButton w-full rounded-2xl dark:shadow-sm dark:shadow-white sm:w-40"
        >
          {translations["Thêm quan trắc"]}
        </Button>
        <Button
          type="primary"
          onClick={showTaskingCapabilityModal}
          className="dark:bg-darkButton w-full rounded-2xl dark:shadow-sm dark:shadow-white sm:w-40"
        >
          {translations["Thêm nhiệm vụ"]}
        </Button>
      </div>
      <div className="mt-4 flex w-full flex-col items-center sm:mt-0 sm:w-auto sm:flex-row">
        <span className="mb-2 sm:mb-0 sm:mr-2">
          {translations["Thời gian nhận dữ liệu (phút):"]}
        </span>
        <InputNumber
          className={`w-full border border-primary sm:w-auto ${
            isDarkMode
              ? "dark:border-darkPrimary dark:bg-darkSecondary dark:text-white dark:shadow-sm dark:shadow-white"
              : ""
          }`}
          min={1}
          value={intervalTimes[thingId] || 5} // Mặc định là 5 nếu không được đặt
          onChange={(value) => setIntervalTime(thingId, value)}
        />
      </div>
    </section>
  );
};

export default HeaderSettingThing;
