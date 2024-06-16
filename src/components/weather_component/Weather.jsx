import { useState, useEffect } from "react";
import { fetchWeatherData } from "@/apis/WeatherAPI";
import "./weather.css";

const Weather = () => {
  const [forecast, setForecast] = useState([]);
  const [city, setCity] = useState("Can Tho");
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchForecast = async () => {
      try {
        const { forecast } = await fetchWeatherData(city);
        setForecast(forecast);
      } catch (error) {
        setError(error);
      }
    };

    fetchForecast();
  }, [city]);

  const handleFilter = (list) => {
    return list.filter((item) => {
      const itemDate = new Date(item.dt * 1000).toISOString().substring(0, 10);
      return itemDate === new Date().toISOString().substring(0, 10);
    });
  };

  const getWeatherIcon = (main) => {
    switch (main.toLowerCase()) {
      case "clouds":
        return <span className="weather-icon icon-clouds">🌥️</span>;
      case "rain":
        return <span className="weather-icon icon-rain">🌧️</span>;
      case "clear":
        return <span className="weather-icon icon-clear">☀️</span>;
      default:
        return <span className="weather-icon">🌍</span>;
    }
  };

  const getBackgroundClass = (main) => {
    switch (main.toLowerCase()) {
      case "clouds":
        return "bg-white";
      case "rain":
        return "bg-gray-500 text-white";
      case "clear":
        return "bg-blue-200";
      default:
        return "bg-gray-200";
    }
  };
  //
  return (
    <section
      className={`h-full rounded-2xl p-5 ${forecast.length > 0 && getBackgroundClass(forecast[0].weather[0].main)}`}
    >
      <section className="flex items-center justify-between gap-5">
        <div>
          <h3 className="text-xl font-bold">Thời tiết</h3>
        </div>
        <div>
          <input
            className="mr-2 rounded-3xl border border-gray-300 bg-primary py-1 pl-6 text-lg font-semibold"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Nhập địa điểm"
          />
        </div>
      </section>
      <section className="my-8 flex justify-between gap-10">
        {forecast.length > 0 && (
          <>
            <div className="flex w-2/3 gap-2">
              <div className="text-7xl">
                {getWeatherIcon(forecast[0].weather[0].main)}
              </div>
              <div>
                <p className="text-5xl font-bold">{forecast[0].main.temp}°C</p>
                <p className="my-4 text-xl">{forecast[0].weather[0].main}</p>
              </div>
            </div>
            <div className="w-1/2 text-lg">
              <div>Nhiệt độ cao nhất: {forecast[0].main.temp_max}°C</div>
              <div>Độ ẩm: {forecast[0].main.humidity}%</div>
              <div className="my-4">
                Không khí: {forecast[0].weather[0].description}
              </div>
            </div>
          </>
        )}
      </section>
      <section>
        <div className="overflow-x-auto">
          <ul className="flex gap-5" style={{ overflowX: "scroll" }}>
            {handleFilter(forecast)?.map((item, index) => (
              <li key={index} className="mb-2 flex-shrink-0">
                <span className="font-bold">
                  {new Date(item.dt * 1000).toLocaleTimeString("en-US", {
                    hour: "numeric",
                    hour12: true,
                  })}
                </span>{" "}
                <div className="flex items-center">
                  <span className="text-2xl">
                    {getWeatherIcon(item.weather[0].main)}
                  </span>
                  <span className="ml-1">
                    <span className="font-bold">{item.main.temp}°C</span>
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </section>
  );
};

export default Weather;
