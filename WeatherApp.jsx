import "./WeatherApp.css";
import { Fragment, useState } from "react";

//import images for weather app
import searchIcon from '../weather_app/weather_images/search.png';
import clearIcon from '../weather_app/weather_images/clear.png';
import cloudIcon from '../weather_app/weather_images/cloud.png';
import drizzleIcon from '../weather_app/weather_images/drizzle.png';
import humidityIcon from '../weather_app/weather_images/humidity.png';
import rainIcon from '../weather_app/weather_images/rain.png';
import snowIcon from '../weather_app/weather_images/snow.png';
import windIcon from '../weather_app/weather_images/wind.png';
import logoIcon from '../weather_app/weather_images/logo.png';


const WeatherDetails = ({icon,temp,city,country,lat,log,hum,wind})=>{
    return(
        <Fragment>

            <div className="weatherImageContainer">
                <img src={icon} alt="image" />
            </div>

            <div className="temperature">{temp}°C</div>

            <div className="cityLocation">{city}</div>

            <div className="countryLocation">{country}</div>

            <div className="cord">
                <div>
                    <span className="lat">Latitude</span>
                    <span>{lat}</span>
                </div>
                <div>
                    <span className="log">Longitude</span>
                    <span>{log}</span>
                </div>
            </div>

            <div className="dataContainer">
                <div className="element">
                    <img src={humidityIcon} alt="image" className="icon"/>
                    <div className="data">
                        <div className="value">{hum}%</div>
                        <div className="text">Humidity</div>
                    </div>
                </div>
                <div className="element">
                    <img src={windIcon} alt="image" className="icon"/>
                    <div className="data">
                        <div className="value">{wind} km/h</div>
                        <div className="text">WindSpeed</div>
                    </div>
                </div>
            </div>

        </Fragment>
    )
}

export const WeatherApp = ()=>{

    let apiKey = "c1020eaece6d73e51a1787f16ea61ede";

    const [text,setText] = useState("");
    const [cityNotFount,setCityNotFound] = useState(false);
    const [loading,setLoading] = useState(false);

    const [icon,setIcon] = useState(logoIcon);
    const [temp,setTemp] = useState(0);
    const [city,setCity] = useState("YOUR CITY");
    const [country,setCountry] = useState("UC");
    const [lat,setLat] = useState(0);
    const [log,setLog] = useState(0);
    const [hum,setHum] = useState(0);
    const [wind,setWind] = useState(0);

    const weatherIconMap = {
        "01d" : clearIcon,
        "01n" : clearIcon,
        "02n" : cloudIcon,
        "02n" : cloudIcon,
        "03d" : drizzleIcon,
        "03n" : drizzleIcon,
        "04d" : drizzleIcon,
        "04n" : drizzleIcon,
        "09d" : rainIcon,
        "09n" : rainIcon,
        "10d" : rainIcon,
        "10n" : rainIcon,
        "13n" : snowIcon,
        "13d" : snowIcon,
    };


    const searchApi = async() => {
        setLoading(true);

        let weatherUrl = `https://api.openweathermap.org/data/2.5/weather?q=${text}&appid=${apiKey}&units=Metric`;

        try{
            let res = await fetch(weatherUrl);
            let data = await res.json();

            if(data.cod === "404"){
                console.error("City not Found");
                setCityNotFound(true);
                setLoading(false);
                return;
            }

            setHum(data.main.humidity);
            setWind(data.wind.speed);
            setTemp(Math.floor(data.main.temp));
            setCity(data.name);
            setCountry(data.sys.country);
            setLat(data.coord.lat);
            setLog(data.coord.lon);

            const weatherIconCode = data.weather[0].code;
            setIcon(weatherIconMap[weatherIconCode] || drizzleIcon);
            setCityNotFound(false);

        }catch(err){
            console.error("An error occurred:",err.message);
        }finally{
            setLoading(false);
        }
    }

    const cityHandler = (event)=>{
        setText(event.target.value);
    }

    const keyDownFun = (event) => {
        if(event.key === "Enter"){
            searchApi();
        }
    }

    return(
        <div className="container">
            <div className="inputContainer">
                <input type="text" className="searchInput" placeholder="Search city" onChange={cityHandler} value={text} onKeyDown={keyDownFun}/>
                <div className="search" onClick={searchApi}>
                    <img src={searchIcon} alt="search" />
                </div>
            </div>

            {loading && <div className="loadingMessage">loading...</div>}
            {cityNotFount && <div className="cityNotFound">City Not Found</div>}

            {!loading && !cityNotFount && <WeatherDetails icon={icon} temp={temp} city={city} country={country} lat={lat} log={log} hum={hum} wind={wind}/>}

            <p className="copyright">© 2024 | WeatherApp.com</p>

        </div>
    )
}
