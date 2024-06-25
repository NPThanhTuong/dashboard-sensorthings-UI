import temperatureIcon from "@public/images/icons/temperature.png";
import humidityIcon from "@public/images/icons/humidity.png";
import { GoClock } from "react-icons/go";

// Icon cho thẻ
export const getFieldIcon = (fieldName) => {
  switch (fieldName) {
    case "temperature":
      return (
        <img
          src={temperatureIcon}
          alt="Temperature Icon"
          className="h-12 w-12 rounded-full border border-green-700 bg-green-50 p-2"
        />
      );
    case "humidity":
      return (
        <img
          src={humidityIcon}
          alt="Humidity Icon"
          className="h-12 w-12 rounded-full border border-blue-700 bg-blue-50 p-2"
        />
      );
    default:
      return <GoClock className="text-black" />;
  }
};

// Border cho thẻ
export const borderClasses = {
  temperature: "bg-green-700",
  humidity: "bg-blue-700",
  default: "",
};

// Background cho thẻ
export const backgroundClasses = {
  temperature: "linear-gradient(135deg, #FAFFFC 0%, #DFFFE9 100%)",
  humidity: "linear-gradient(135deg, #EDF0FE 0%, #CFD8FF 100%)",
  default: "linear-gradient(135deg, #f0f0f0 0%, #a0a0a0 100%)",
};

// Background cho thẻ trong dark mode
export const darkBackgroundClasses = {
  temperature: "linear-gradient(135deg, #213E5E 50%, #213E5E 100%)",
  humidity: "linear-gradient(135deg, #213E5E 50%, #213E5E 100%)",
  default: "linear-gradient(135deg, #2a2a2a 0%, #1a1a1a 100%)",
};

// Màu cho kết quả
export const resultClasses = {
  temperature: "text-green-500",
  humidity: "text-blue-500",
  default: "text-white",
};
