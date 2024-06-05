// eslint-disable-next-line no-unused-vars
import React from "react";
import "./Inspect.css";

// eslint-disable-next-line react/prop-types
const Inspect = ({ title, value, unit, icon, backgroundColor, color }) => {
  const cardStyle = {
    background: backgroundColor || 'linear-gradient(to right, #6a11cb, #2575fc)',
    color: color || 'white',
  };

  return (
    <div className="inspect-card" style={cardStyle}>
      <div className="inspect-title">{title}</div>
      <div className="inspect-content">
        <div className="inspect-icon">
          <img src={icon} alt={title} />
        </div>
        <div className="inspect-data">
          <div className="inspect-value-unit">
            {value} {unit}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Inspect;
