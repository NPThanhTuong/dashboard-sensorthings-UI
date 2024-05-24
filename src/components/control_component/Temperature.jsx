const Temperature = () => {
  return (
    <div className="flex w-full items-center border-4 border-pink-400 px-4 py-3">
      <div className="text-xl">
        <span>Nhiệt độ: </span>
        {/* <span className="font-bold">
          {soilHumidity !== null ? `${soilHumidity} (%)` : "Đang tải..."}
        </span> */}
      </div>
    </div>
  );
};

export default Temperature;
