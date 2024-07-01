import { GiValve } from "react-icons/gi";
import { FaRegLightbulb } from "react-icons/fa";

export const iconConfig = {
  Valve: {
    on: <GiValve style={{ fontSize: "48px", color: "blue" }} />,
    off: (
      <GiValve
        style={{ fontSize: "48px", color: "black", filter: "grayscale(100%)" }}
      />
    ),
  },
  LED: {
    on: <FaRegLightbulb style={{ fontSize: "48px", color: "yellow" }} />,
    off: (
      <FaRegLightbulb
        style={{ fontSize: "48px", color: "black", filter: "grayscale(100%)" }}
      />
    ),
  },
};

export const renderIcon = (actuatorName, checked) => {
  const actuatorIcon = iconConfig[actuatorName];
  return actuatorIcon ? (checked ? actuatorIcon.on : actuatorIcon.off) : null;
};
