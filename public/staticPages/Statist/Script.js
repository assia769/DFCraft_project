let dom = document.getElementById("chart-container");
let myChart = echarts.init(dom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let app = {};

let mode = localStorage.getItem("theme") || "light";

let option;

function getVirtualData(year) {
  const date = +echarts.time.parse(year + "-01-01");
  const end = +echarts.time.parse(+year + 1 + "-01-01");
  const dayTime = 3600 * 24 * 1000;
  const data = [];
  for (let time = date; time < end; time += dayTime) {
    data.push([
      echarts.time.format(time, "{yyyy}-{MM}-{dd}", false),
      Math.floor(Math.random() * 10000),
    ]);
  }
  return data;
}
option = {
  title: {
    top: 30,
    left: "center",
    text: "Daily Step Count",
    textStyle: {
      color: "#e5e7eb", // title text color
      fontFamily: "Arial, sans-serif", // title font family
    },
  },
  tooltip: {
    backgroundColor: "#111827", // tooltip box
    textStyle: { color: "#f9fafb" }, // tooltip text
  },
  visualMap: {
    min: 0,
    max: 10000,
    type: "piecewise",
    orient: "horizontal",
    left: "center",
    top: 65,
    textStyle: { color: "#d1d5db" }, // visualMap text
    inRange: {
      color: ["#C8A0EF", "#B46CFA", "#A855F7"], // low -> high colors
    },
  },
  calendar: {
    top: 120,
    left: 30,
    right: 30,
    cellSize: ["auto", 13],
    range: "2026",
    itemStyle: {
      borderWidth: 0.5,
      borderColor: "#374151", // cell border
      color: "#1f2937", // base cell color
    },
    dayLabel: { color: "#9ca3af" }, // Mon, Tue...
    monthLabel: { color: "#9ca3af" }, // Jan, Feb...
    yearLabel: { show: false, color: "#9ca3af" },
  },
  series: {
    type: "heatmap",
    coordinateSystem: "calendar",
    data: getVirtualData("2026"),
  },
};

if (option && typeof option === "object") {
  myChart.setOption(option);
}

window.addEventListener("resize", myChart.resize);

function applyTheme(theme) {
  if (theme === "light") {
    modeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-brightness-high-fill" id="langIcon" viewBox="0 0 16 16">
  <path d="M12 8a4 4 0 1 1-8 0 4 4 0 0 1 8 0M8 0a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 0m0 13a.5.5 0 0 1 .5.5v2a.5.5 0 0 1-1 0v-2A.5.5 0 0 1 8 13m8-5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2a.5.5 0 0 1 .5.5M3 8a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1 0-1h2A.5.5 0 0 1 3 8m10.657-5.657a.5.5 0 0 1 0 .707l-1.414 1.415a.5.5 0 1 1-.707-.708l1.414-1.414a.5.5 0 0 1 .707 0m-9.193 9.193a.5.5 0 0 1 0 .707L3.05 13.657a.5.5 0 0 1-.707-.707l1.414-1.414a.5.5 0 0 1 .707 0m9.193 2.121a.5.5 0 0 1-.707 0l-1.414-1.414a.5.5 0 0 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .707M4.464 4.465a.5.5 0 0 1-.707 0L2.343 3.05a.5.5 0 1 1 .707-.707l1.414 1.414a.5.5 0 0 1 0 .708"/>
</svg>`;
  } else if (theme === "dark") {
    modeIcon.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-moon" id="langIcon" viewBox="0 0 16 16">
  <path d="M6 .278a.77.77 0 0 1 .08.858 7.2 7.2 0 0 0-.878 3.46c0 4.021 3.278 7.277 7.318 7.277q.792-.001 1.533-.16a.79.79 0 0 1 .81.316.73.73 0 0 1-.031.893A8.35 8.35 0 0 1 8.344 16C3.734 16 0 12.286 0 7.71 0 4.266 2.114 1.312 5.124.06A.75.75 0 0 1 6 .278M4.858 1.311A7.27 7.27 0 0 0 1.025 7.71c0 4.02 3.279 7.276 7.319 7.276a7.32 7.32 0 0 0 5.205-2.162q-.506.063-1.029.063c-4.61 0-8.343-3.714-8.343-8.29 0-1.167.242-2.278.681-3.286"/>
</svg>`;
  }
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem("theme", theme);
}

let modeSelect = document.getElementById("dark-mode-toggle");
let modeIcon = document.getElementById("modeIcon");

const savedTheme = localStorage.getItem("theme");
const systemPrefersDark = window.matchMedia(
  "(prefers-color-scheme: dark)",
).matches;
const initialTheme = savedTheme || (systemPrefersDark ? "dark" : "light");

applyTheme(initialTheme);

modeSelect.addEventListener("click", function () {
  mode = mode == "dark" ? "light" : "dark";
  applyTheme(mode);
});
