import lamp from "@public/images/icons/lamp.png";
import pump from "@public/images/icons/pump.png";

export const iconConfig = {
  Valve: (
    <img
      src={pump}
      alt="Pump"
      className="h-12 w-12 rounded-full border border-blue-700 bg-blue-50 p-2"
    />
  ),
  LED: (
    <img
      src={lamp}
      alt="Lamp"
      className="h-12 w-12 rounded-full border border-yellow-500 bg-yellow-50 p-2"
    />
  ),
};

export const renderIcon = (actuatorName) => {
  return iconConfig[actuatorName] || null;
};

export const colorConfig = {
  Valve: {
    bgColor: "linear-gradient(135deg, #FAFFFC, #CFD8FF)",
    borderColor: "#3B82F6",
    switchColor: "#C0C0C0",
    selectColor: "#3B82F6",
    inputBgColor: "#3B82F6",
    inputBorderColor: "#3B82F6",
  },
  LED: {
    bgColor: "linear-gradient(135deg, #FAFFFC, #F4FA58)",
    borderColor: "#F59E0B",
    switchColor: "#C0C0C0",
    selectColor: "#F59E0B",
    inputBgColor: "#F59E0B",
    inputBorderColor: "#F59E0B",
  },
};
