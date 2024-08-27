import { useEffect, useState } from "react";
import Search from "../search";
import { WiDaySunny, WiWindy, WiHumidity } from "react-icons/wi";
import { FaSun, FaMoon, FaLanguage } from "react-icons/fa"; // Icono de idioma

export default function Weather() {
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [darkMode, setDarkMode] = useState(false); // Estado para el modo oscuro
  const [language, setLanguage] = useState("en"); // Estado para el idioma

  async function fetchWeatherData(param) {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${param}&appid=e34b4c51d8c2b7bf48d5217fe52ff79e&lang=${language}` // Añadir el idioma a la solicitud
      );

      const data = await response.json();
      if (data) {
        setWeatherData(data);
        setLoading(false);
      }
    } catch (e) {
      setLoading(false);
      console.log(e);
    }
  }

  async function handleSearch() {
    fetchWeatherData(search);
  }

  function getCurrentDate() {
    return new Date().toLocaleDateString(language === "en" ? "en-us" : "es-ES", {
      weekday: "long",
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  }

  useEffect(() => {
    fetchWeatherData("panama");
  }, [language]);

  function toggleLanguage() {
    setLanguage(language === "en" ? "es" : "en");
  }

  return (
    <div className={darkMode ? "weather-app dark-mode" : "weather-app"}>
      <div className="controls">
        <button onClick={() => setDarkMode(!darkMode)} className="dark-mode-toggle">
          {darkMode ? <FaSun size={20} /> : <FaMoon size={20} />} {/* Icono de Sol o Luna */}
          {darkMode ? (language === "en" ? " Light Mode" : " Modo Claro") : (language === "en" ? " Dark Mode" : " Modo Oscuro")}
        </button>
        <button onClick={toggleLanguage} className="language-toggle">
          <FaLanguage size={20} /> {/* Icono de idioma */}
          {language === "en" ? " Español" : " English"}
        </button>
      </div>

      <Search
        search={search}
        setSearch={setSearch}
        handleSearch={handleSearch}
      />

      {loading ? (
        <div className="loading">{language === "en" ? "Loading..." : "Cargando..."}</div>
      ) : (
        <div>
          <div className="city-name">
            <h2>
              {weatherData?.name}, <span>{weatherData?.sys?.country}</span>
            </h2>
          </div>
          <div className="date">
            <span>{getCurrentDate()}</span>
          </div>
          <div className="temp">
            <WiDaySunny size={50} />
            {weatherData?.main?.temp}°C
          </div>
          <p className="description">
            {weatherData && weatherData.weather && weatherData.weather[0]
              ? weatherData.weather[0].description
              : ""}
          </p>
          <div className="weather-info">
            <div className="column">
              <div>
                <WiWindy size={40} />
                <p className="wind">{weatherData?.wind?.speed} m/s</p>
                <p>{language === "en" ? "Wind Speed" : "Velocidad del Viento"}</p>
              </div>
            </div>
            <div className="column">
              <div>
                <WiHumidity size={40} />
                <p className="humidity">{weatherData?.main?.humidity}%</p>
                <p>{language === "en" ? "Humidity" : "Humedad"}</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
