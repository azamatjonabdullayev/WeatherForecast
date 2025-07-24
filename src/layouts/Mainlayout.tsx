import axios from "axios";
import React, { useEffect, useState } from "react";
import type { IWeatherData } from "../interfaces/weather";
import "../styles/MainLayout.css";
import logo from "/logo.svg";
import { TiWeatherSunny } from "react-icons/ti";
import { TiWeatherCloudy } from "react-icons/ti";
import { TiWeatherShower } from "react-icons/ti";
import { FaRegSnowflake } from "react-icons/fa";
import { IoThunderstormOutline } from "react-icons/io5";
import { BsCloudFog2 } from "react-icons/bs";

const Mainlayout = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [err, setError] = useState(null);
  const APIKEY: string = "5370701fb073915493534e245d929588";

  useEffect(() => {
    if (city.trim() === "") {
      setWeatherData(null);
      setError(null);
      return;
    }

    const fetchWeatherData = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`
        );

        if (res.status !== 200) {
          throw new Error(res.statusText);
        }

        setWeatherData(res.data);
        setError(null);
      } catch (err: Error | any) {
        setError(err.message);
        setWeatherData(null);
      }
    };

    const timerId = setTimeout(() => fetchWeatherData(), 1000);

    return () => clearTimeout(timerId);
  }, [city]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
  };

  const getWeatherBg = (): string | (string | React.JSX.Element)[] => {
    if (!weatherData) return "bg-default";

    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    switch (weatherCondition) {
      case "clear":
        return ["bg-clear", <TiWeatherSunny />];

      case "clouds":
        return ["bg-cloudy", <TiWeatherCloudy />];

      case "rain":
      case "drizzle":
        return ["bg-rain", <TiWeatherShower />];

      case "snow":
        return ["bg-snow", <FaRegSnowflake />];

      case "thunderstorm":
        return ["bg-thunderstorm", <IoThunderstormOutline />];

      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
      case "sand":
      case "ash":
      case "squall":
      case "tornado":
        return ["bg-mist", <BsCloudFog2 />];

      default:
        return ["bg-default", <TiWeatherSunny />];
    }
  };

  const [weatherBackground, weatherIcon] = getWeatherBg();

  return (
    <section className={`${getWeatherBg()[0]} h-screen relative`}>
      <img src={logo} alt="logo" className="absolute left-[120px] top-[37px]" />
    </section>
  );
};

export default Mainlayout;
