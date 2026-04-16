let records = JSON.parse(localStorage.getItem("records")) || [];
document.getElementById("fetchWeather").addEventListener("click", () => {

  const apiKey = "YOUR_API_KEY_HERE";

  fetch(`https://api.openweathermap.org/data/2.5/weather?q=Nairobi&units=metric&appid=${apiKey}`)
    .then(res => res.json())
    .then(data => {

      const temp = data.main.temp;
      const max = data.main.temp_max;

      document.getElementById("temp").textContent = temp + "°C";

      // 🌡️ Smart alert integration
      if (temp > 32) {
        alert("⚠️ Heat stress risk! Take action for your chickens.");
      }

    })
    .catch(err => {
      console.error(err);
      alert("Failed to fetch weather data");
    });

});