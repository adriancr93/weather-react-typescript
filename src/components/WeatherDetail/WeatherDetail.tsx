import type { Weather } from "../../hook/useWeather"

type WeatherDetailProps = {
    weather: Weather
}

export default function WeatherDetail({weather} : WeatherDetailProps) {
  return (
    <div>WeatherDetail</div>
  )
}
