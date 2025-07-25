import axios from "axios";
import React, { useEffect, useState } from "react";
import { BsCloudFog2 } from "react-icons/bs";
import { FaRegSnowflake, FaSearch } from "react-icons/fa";
import { IoThunderstormOutline } from "react-icons/io5";
import {
  TiWeatherCloudy,
  TiWeatherShower,
  TiWeatherSunny,
} from "react-icons/ti";
import type { IWeatherData } from "../interfaces/weather";
import "../styles/MainLayout.css";
import logo from "/logo.svg";

const Mainlayout = () => {
  const [city, setCity] = useState("");
  const [weatherData, setWeatherData] = useState<IWeatherData | null>(null);
  const [err, setError] = useState<string | null>(null);
  const APIKEY: string = "5370701fb073915493534e245d929588";

  useEffect(() => {
    if (city.trim() === "") {
      setWeatherData(null);
      setError(null);
      return;
    }

    const controller = new AbortController();

    const fetchWeatherData = async () => {
      try {
        const res = await axios.get(
          `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${APIKEY}`,
          { signal: controller.signal }
        );

        if (res.status !== 200) {
          throw new Error(res.statusText);
        }

        setWeatherData(res.data);
        setError(null);
      } catch (err: Error | any) {
        if (axios.isCancel(err)) {
          console.log("Request cancelled");
        } else {
          setError(err.message);
        }
      }
    };

    const timerId = setTimeout(() => fetchWeatherData(), 1000);

    return () => {
      clearTimeout(timerId);
      controller.abort();
    };
  }, [city]);

  const formatDateTime = (timestamp: number) => {
    const date = new Date(timestamp * 1000);
    const options: Intl.DateTimeFormatOptions = {
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    };

    return date.toLocaleDateString("en-US", options);
  };

  const handleInputChange = (e?: React.ChangeEvent<HTMLInputElement>) => {
    if (!e) {
      console.warn("Событие onChange не передано");
      return;
    }
    setCity(e.target.value);
  };

  const getWeatherBg = () => {
    if (!weatherData)
      return {
        cssClass: "bg-default",
        icon: <TiWeatherSunny className="size-[70px]" />,
      };

    const weatherCondition = weatherData.weather[0].main.toLowerCase();

    switch (weatherCondition) {
      case "clear":
        return {
          cssClass: "bg-clear",
          icon: <TiWeatherSunny className="size-[70px]" />,
        };
      case "clouds":
        return {
          cssClass: "bg-clouds",
          icon: <TiWeatherCloudy className="size-[70px]" />,
        };
      case "rain":
      case "drizzle":
        return {
          cssClass: "bg-rain",
          icon: <TiWeatherShower className="size-[70px]" />,
        };
      case "snow":
        return {
          cssClass: "bg-snow",
          icon: <FaRegSnowflake className="size-[70px]" />,
        };
      case "thunderstorm":
        return {
          cssClass: "bg-storm",
          icon: <IoThunderstormOutline className="size-[70px]" />,
        };
      case "mist":
      case "smoke":
      case "haze":
      case "dust":
      case "fog":
      case "sand":
      case "ash":
      case "squall":
      case "tornado":
        return {
          cssClass: "bg-mist",
          icon: <BsCloudFog2 className="size-[70px]" />,
        };
      default:
        return {
          cssClass: "bg-default",
          icon: <TiWeatherSunny className="size-[70px]" />,
        };
    }
  };

  const { cssClass, icon: weatherIcon } = getWeatherBg();

  return (
    <section
      className={`${cssClass} h-screen relative text-white flex items-center`}
    >
      <img src={logo} alt="logo" className="absolute left-[120px] top-[37px]" />

      <div className="left-side h-full w-3/5 flex items-end justify-start ">
        <ul className="ml-[118px] mb-[122px] flex items-center gap-2.5">
          <li>
            <p className="showTemperature">
              {weatherData?.main?.temp !== undefined
                ? Math.round(weatherData.main.temp - 273.15) + "°"
                : "~"}
            </p>
          </li>

          <li className="flex flex-col items-center gap-1">
            <h2 className="text-6xl">
              {weatherData?.name?.toUpperCase() ?? "~"}
            </h2>

            <p className="text-lg">
              {weatherData?.dt ? formatDateTime(weatherData!.dt) : "~"}
            </p>
          </li>

          <li>{weatherData ? weatherIcon : ""}</li>
        </ul>
      </div>

      <div className="right-side h-screen w-2/5">
        <div className="flex items-center border-b w-[90%] mt-10 mx-auto border-b-white gap-2.5 py-4">
          <input
            type="text"
            name="citySearch"
            className="text-xl outline-none border-none w-[90%]"
            placeholder="Search location..."
            value={city}
            onChange={handleInputChange}
          />
          <FaSearch className="size-7" />
        </div>

        <div className="weatherDetails"></div>
      </div>
    </section>
  );
};

export default Mainlayout;
