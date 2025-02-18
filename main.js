const api = {
  key: "fcc8de7015bbb202209bbf0261babf4c",
  base: "https://api.openweathermap.org/data/2.5/"
};

const searchbox = document.querySelector('.search-box');
searchbox.addEventListener('keypress', setQuery);

const navLinks = document.querySelectorAll('.nav-link');

// Set up event listener for each navigation link to show the appropriate section
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const section = e.target.getAttribute('data-section');
    showSection(section);
  });
});

function showSection(section) {
  const sections = document.querySelectorAll('.section');
  sections.forEach(sec => sec.classList.add('hidden')); // Hide all sections
  document.getElementById(section).classList.remove('hidden'); // Show the selected section
}

// Default city set to Mogadishu
window.onload = () => {
  getResults("Mogadishu");
  updateDateTime();
  setInterval(updateDateTime, 1000); // Update time every second
  setInterval(() => getResults("Mogadishu"), 600000); // Refresh weather every 10 minutes
};

function setQuery(evt) {
  if (evt.keyCode == 13) {
    getResults(searchbox.value);
  }
}

function getResults(query) {
  fetch(`${api.base}weather?q=${query}&units=metric&APPID=${api.key}`)
    .then(weather => weather.json())
    .then(displayResults)
    .catch(error => {
      console.error("Error fetching weather data:", error);
    });
}

function displayResults(weather) {
  if (weather.cod === "404") {
    alert("City not found. Please try again.");
    return;
  }

  let city = document.querySelector('.location .city');
  city.innerText = `${weather.name}, ${weather.sys.country}`;

  let now = new Date();
  let date = document.querySelector('.location .date');
  date.innerText = dateBuilder(now);

  let temp = document.querySelector('.current .temp');
  temp.innerHTML = `${Math.round(weather.main.temp)}<span>°c</span>`;

  let weather_el = document.querySelector('.current .weather');
  weather_el.innerText = weather.weather[0].main;

  let hilow = document.querySelector('.hi-low');
  hilow.innerText = `${Math.round(weather.main.temp_min)}°c / ${Math.round(weather.main.temp_max)}°c`;

  let clouds = document.querySelector('.clouds .cloudiness');
  clouds.innerText = `${weather.clouds.all}%`;

  let wind = document.querySelector('.wind .wind-speed');
  wind.innerText = `${Math.round(weather.wind.speed)} km/h`;

  let humidity = document.querySelector('.humidity .humidity-level');
  humidity.innerText = `${weather.main.humidity}%`;

  updateBackground(weather.weather[0].main);
}

function updateBackground(weatherCondition) {
  document.body.classList.remove('sunny', 'rainy', 'cloudy');
  switch (weatherCondition.toLowerCase()) {
    case 'clear':
    case 'sunny':
      document.body.classList.add('sunny');
      break;
    case 'rain':
    case 'drizzle':
      document.body.classList.add('rainy');
      break;
    case 'clouds':
      document.body.classList.add('cloudy');
      break;
    default:
      document.body.classList.add('cloudy');
      break;
  }
}

function dateBuilder(d) {
  let months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  let days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  let day = days[d.getDay()];
  let date = d.getDate();
  let month = months[d.getMonth()];
  let year = d.getFullYear();

  return `${day} ${date} ${month} ${year}`;
}

function updateDateTime() {
  let now = new Date();
  let timeElement = document.querySelector('.time');
  timeElement.innerText = now.toLocaleTimeString();
}
