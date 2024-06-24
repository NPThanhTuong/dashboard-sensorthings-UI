const API_KEY = "e5a6f540e0f4451ec67c55235fc4cb28";

export const fetchWeatherData = async (city) => {
  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/forecast?q=${encodeURIComponent(city)}&appid=${API_KEY}&units=metric`,
    );
    const data = await response.json();
    if (response.ok) {
      return {
        forecast: data.list,
        cityDetails: {
          name: data.city.name,
          country: data.city.country,
          coordinates: data.city.coord,
          population: data.city.population,
        },
      }; //
    } else {
      throw new Error(data.message || "Error fetching data");
    }
  } catch (error) {
    console.error("Failed to fetch forecast data:", error);
    throw error;
  }
};
