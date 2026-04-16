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
const tableBody = document.getElementById("tableBody");
const countEl = document.getElementById("count");
const totalChickensEl = document.getElementById("totalChickens");
const avgEggsEl = document.getElementById("avgEggs");
const emptyMsg = document.querySelector(".empty");
const alertBox = document.getElementById("alertBox");

/* SAVE DATA */
function saveData() {
  localStorage.setItem("records", JSON.stringify(records));
}

/* ADD RECORD */
document.getElementById("addRecord").addEventListener("click", () => {
  const day = document.getElementById("day").value;
  const chickens = +document.getElementById("chickens").value;
  const eggs = +document.getElementById("eggs").value;
  const feed = +document.getElementById("feed").value;
  const temp = +document.getElementById("temperature").value;

  if (!day || !chickens || !eggs || !feed || !temp) {
    return alert("Please fill all fields");
  }

  records.push({ day, chickens, eggs, feed, temp });

  saveData();
  render();

  document.getElementById("day").value = "";
  document.getElementById("chickens").value = "";
  document.getElementById("eggs").value = "";
  document.getElementById("feed").value = "";
  document.getElementById("temperature").value = "";
});

/* RENDER */
function render(data = records) {
  tableBody.innerHTML = "";

  emptyMsg.style.display = data.length ? "none" : "block";

  data.forEach(r => {
    tableBody.innerHTML += `
      <tr>
        <td>${r.day}</td>
        <td>${r.chickens}</td>
        <td>${r.eggs}</td>
        <td>${r.feed}</td>
        <td>${r.temp}°C</td>
      </tr>
    `;
  });

  countEl.textContent = `${records.length} records`;

  /* INSIGHTS */
  const totalChickens = records.reduce((s, r) => s + r.chickens, 0);
  const totalEggs = records.reduce((s, r) => s + r.eggs, 0);

  const avgEggs = records.length
    ? (totalEggs / records.length).toFixed(1)
    : 0;

  totalChickensEl.textContent = totalChickens;
  avgEggsEl.textContent = avgEggs;

  generateAlerts();
}
function detectEnvironmentStatus(records) {
  const latest = records[records.length - 1];
  if (!latest) return { score: 0, issues: [] };

  let score = 100;
  let issues = [];

  // 🌡️ Temperature check
  if (latest.temp > 32) {
    score -= 25;
    issues.push("🔥 Heat stress risk (too hot for chickens)");
  } else if (latest.temp < 18) {
    score -= 15;
    issues.push("❄️ Cold stress risk (too cold)");
  }

  // 🥚 Egg productivity check
  const expectedEggs = latest.chickens * 0.7; // normal expectation

  if (latest.eggs < expectedEggs * 0.5) {
    score -= 25;
    issues.push("🥚 Severe drop in egg production");
  } else if (latest.eggs < expectedEggs) {
    score -= 10;
    issues.push("⚠️ Slightly low egg production");
  }

  // 🌾 Feed efficiency check
  const feedEfficiency = latest.eggs / (latest.feed || 1);

  if (feedEfficiency < 2) {
    score -= 20;
    issues.push("🌾 Poor feed efficiency (high feed, low eggs)");
  }

  // 🐔 Overcrowding check (simple rule)
  if (latest.chickens > 200) {
    score -= 10;
    issues.push("🐔 Possible overcrowding risk");
  }

  return { score: Math.max(0, score), issues };
}
function showFarmHealth() {
  const { score, issues } = detectEnvironmentStatus(records);

  const alertBox = document.getElementById("alertBox");
  alertBox.innerHTML = "<h2>Smart Farm Health</h2>";

  // Health score
  const scoreDiv = document.createElement("div");
  scoreDiv.className = "alert";
  scoreDiv.innerHTML = `🏥 Farm Health Score: <b>${score}/100</b>`;
  alertBox.appendChild(scoreDiv);

  // Issues
  if (issues.length === 0) {
    const ok = document.createElement("div");
    ok.className = "alert";
    ok.textContent = "✅ Environment is optimal";
    alertBox.appendChild(ok);
  } else {
    issues.forEach(i => {
      const div = document.createElement("div");
      div.className = "alert";
      div.textContent = i;
      alertBox.appendChild(div);
    });
  }
}

/* SMART ALERTS */
function generateAlerts() {
  alertBox.innerHTML = "<h2>Smart Alerts</h2>";

  const latest = records[records.length - 1];
  if (!latest) return;

  if (latest.temp > 32) {
    addAlert("⚠️ Heat stress risk: Temperature too high!");
  }
  if (latest.temp<25) {
    addAlert( "Too cold :keep in a warmer place !!!")
  }

  if (latest.eggs < latest.chickens * 0.5) {
    addAlert("⚠️ Low egg production detected!");
  }

  if (latest.feed > latest.eggs * 0.5) {
    addAlert("⚠️ Feed inefficiency detected!");
  }
}

function addAlert(msg) {
  const div = document.createElement("div");
  div.className = "alert";
  div.textContent = msg;
  alertBox.appendChild(div);
}

/* SEARCH */
document.getElementById("search").addEventListener("input", (e) => {
  const val = e.target.value.toLowerCase();

  const filtered = records.filter(r =>
    r.day.toLowerCase().includes(val) ||
    String(r.chickens).includes(val) ||
    String(r.eggs).includes(val) ||
    String(r.feed).includes(val) ||
    String(r.temp).includes(val)
  );

  render(filtered);
});  
/* WEATHER */
document.getElementById("fetchWeather").addEventListener("click", () => {
  const temp = (18 + Math.random() * 15).toFixed(1);
  document.getElementById("temp").textContent = temp + "°C";

  if (temp > 32) {
    alert("⚠️ Heat warning: Protect your chickens!");
  }
});

/* INIT */
render();