import React from "react";

const LoadingEffect = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center">
    <div className="loading-text text-4xl font-bold text-gray-500">
      {"SENSORTHING".split("").map((letter, index) => (
        <span key={index}>{letter}</span>
      ))}
    </div>
  </div>
);

export default LoadingEffect;
