

let calendarDom = document.getElementById("chart-container-calendar");
let calendarChart = echarts.init(calendarDom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let app = {};

let mode = localStorage.getItem("theme") || "light";

let option;

// creating virtual data for calendar heatmap, working on after to get real data from backend
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

// chart options
function getChartOptions(theme) {
  const isDark = theme === "dark";
  const langTranslations = translations[currentLang] || translations.en;
  return {
    title: {
      top: 30,
      left: "center",
      text: translations[currentLang].calendartitle,
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    tooltip: {
      backgroundColor: isDark ? "#161616" : "#f2f2f2",
      textStyle: {
        color: isDark ? "#f9fafb" : "#212121",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    visualMap: {
      min: 0,
      max: 10000,
      type: "piecewise",
      orient: "horizontal",
      left: "center",
      top: 65,
      textStyle: {
        color: isDark ? "#f9fafb" : "#212121",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      inRange: {
        color: isDark
          ? ["#3F1E5E", "#5D2E8C", "#7439AD", "#9148D9", "#AC54FF"]
          : ["#C9BCE3", "#AD94E3", "#996FE3", "#8750E5", "#7C3AED"],
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
        color: isDark ? "#161616" : "#f2f2f2", // base cell color
      },
      dayLabel: {
        nameMap: langTranslations.calendarDays,
        color: isDark ? "#f9fafb" : "#212121",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      }, // Mon, Tue...
      monthLabel: {
        nameMap: langTranslations.calendarMonths,
        color: isDark ? "#f9fafb" : "#212121",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      }, // Jan, Feb...
      yearLabel: {
        show: false,
        color: isDark ? "#f9fafb" : "#212121",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    series: {
      type: "heatmap",
      coordinateSystem: "calendar",
      data: getVirtualData("2026"),
    },
  };
}
window.addEventListener("resize", calendarChart.resize);

//creating a bar chart for Pomodoro timer
let pomodoroDom = document.getElementById("chart-container-pomodoro");
let pomodoroChart = echarts.init(pomodoroDom, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let pomodoroApp = {};

const posList = [
  "left",
  "right",
  "top",
  "bottom",
  "inside",
  "insideTop",
  "insideLeft",
  "insideRight",
  "insideBottom",
  "insideTopLeft",
  "insideTopRight",
  "insideBottomLeft",
  "insideBottomRight",
];
pomodoroApp.configParameters = {
  rotate: {
    min: -90,
    max: 90,
  },
  align: {
    options: {
      left: "left",
      center: "center",
      right: "right",
    },
  },
  verticalAlign: {
    options: {
      top: "top",
      middle: "middle",
      bottom: "bottom",
    },
  },
  position: {
    options: posList.reduce(function (map, pos) {
      map[pos] = pos;
      return map;
    }, {}),
  },
  distance: {
    min: 0,
    max: 100,
  },
};
pomodoroApp.config = {
  rotate: 90,
  align: "left",
  verticalAlign: "middle",
  position: "insideBottom",
  distance: 15,
  onChange: function () {
    const labelOption = {
      rotate: pomodoroApp.config.rotate,
      align: pomodoroApp.config.align,
      verticalAlign: pomodoroApp.config.verticalAlign,
      position: pomodoroApp.config.position,
      distance: pomodoroApp.config.distance,
    };
    pomodoroChart.setOption({
      series: [
        {
          label: labelOption,
        },
        {
          label: labelOption,
        },
        {
          label: labelOption,
        },
        {
          label: labelOption,
        },
      ],
    });
  },
};
const labelOption = {
  show: true,
  position: pomodoroApp.config.position,
  distance: pomodoroApp.config.distance,
  align: pomodoroApp.config.align,
  verticalAlign: pomodoroApp.config.verticalAlign,
  rotate: pomodoroApp.config.rotate,
  formatter: "{c}  {name|{a}}",
  fontSize: 16,
  rich: {
    name: {},
  },
};
function getPomodoroOptions(theme) {
  const isDark = theme === "dark";
  const barLabelOption = {
    show: false,
    position: pomodoroApp.config.position,
    distance: pomodoroApp.config.distance,
    align: pomodoroApp.config.align,
    verticalAlign: pomodoroApp.config.verticalAlign,
    rotate: pomodoroApp.config.rotate,
    formatter: "{c} {name|{a}}",
    fontSize: 16,
    color: isDark ? "#f2f2f2" : "#161616",
    fontFamily: "'Concert One', 'AA-ANIQ', cursive",
    rich: {
      name: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
  };
  return {
    title: {
      text: translations[currentLang].pomodorotitle,
      left: "center",
      top: 20,
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      backgroundColor: isDark ? "#161616" : "#f2f2f2",
    },
    legend: {
      data: [
        translations[currentLang].work,
        translations[currentLang].break,
        translations[currentLang].longBreak,
      ],
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    toolbox: {
      show: true,
      orient: "vertical",
      left: "right",
      top: "center",
      feature: {
        mark: { show: true },
        magicType: { show: true, type: ["stack"] },
        restore: { show: true },
        saveAsImage: { show: true },
      },
    },
    xAxis: [
      {
        type: "category",
        axisTick: { show: false },
        axisLabel: {
          color: isDark ? "#f2f2f2" : "#161616",
          fontFamily: "'Concert One', 'AA-ANIQ', cursive",
        },
        data: ["2012", "2013", "2014", "2015", "2016"],
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: isDark ? "#f2f2f2" : "#161616",
          fontFamily: "'Concert One', 'AA-ANIQ', cursive",
        },
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
    series: [
      {
        name: translations[currentLang].work,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: [220, 182, 191, 234, 290],
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
      {
        name: translations[currentLang].break,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: [150, 232, 201, 154, 190],
        color: isDark ? "#9148D9" : "#8750E5",
      },
      {
        name: translations[currentLang].longBreak,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: [98, 77, 101, 99, 40],
        color: isDark ? "#7439AD" : "#996FE3",
      },
    ],
  };
}

window.addEventListener("resize", pomodoroChart.resize);

// creating Bar Chart for Session track

let domSession = document.getElementById("chart-container-session");
let sessionChart = echarts.init(domSession, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let sessionApp = {};

function getSessionOptions(theme) {
  const isDark = theme === "dark";
  return {
    title: {
      text: translations[currentLang].title,
      left: "center",
      top: 20,
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      backgroundColor: isDark ? "#161616" : "#f2f2f2",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: translations[currentLang].days,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: isDark ? "#f2f2f2" : "#161616",
          fontFamily: "'Concert One', 'AA-ANIQ', cursive",
        },
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: isDark ? "#f2f2f2" : "#161616",
          fontFamily: "'Concert One', 'AA-ANIQ', cursive",
        },
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
    series: [
      {
        name: translations[currentLang].barname,
        type: "bar",
        barWidth: "60%",
        data: [10, 52, 200, 334, 390, 330, 220],
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
    ],
  };
}

window.addEventListener("resize", sessionChart.resize);

// creating Bar Chart for sound track

let domSound = document.getElementById("chart-container-sound");
let soundChart = echarts.init(domSound, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let soundApp = {};

function getSoundOptions(theme) {
  const isDark = theme === "dark";
  return {
    title: {
      text: translations[currentLang].soundCTitle,
      left: "center",
      top: 20,
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      backgroundColor: isDark ? "#161616" : "#f2f2f2",
    },
    grid: {
      left: "3%",
      right: "4%",
      bottom: "3%",
      containLabel: true,
    },
    xAxis: [
      {
        type: "category",
        data: translations[currentLang].days,
        axisTick: {
          alignWithLabel: true,
        },
        axisLabel: {
          color: isDark ? "#f2f2f2" : "#161616",
          fontFamily: "'Concert One', 'AA-ANIQ', cursive",
        },
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
    yAxis: [
      {
        type: "value",
        axisLabel: {
          color: isDark ? "#f2f2f2" : "#161616",
          fontFamily: "'Concert One', 'AA-ANIQ', cursive",
        },
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
    series: [
      {
        name: translations[currentLang].sbarname,
        type: "bar",
        barWidth: "60%",
        data: [10, 52, 200, 334, 390, 330, 220],
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
    ],
  };
}

window.addEventListener("resize", soundChart.resize);

// for tracking the tasks progress
let domTasks = document.getElementById("chart-container-totalTasks");
let tasksChart = echarts.init(domTasks, null, {
  renderer: "canvas",
  useDirtyRect: false,
});
let tasksApp = {};

function getTasksOptions(theme) {
  const isDark = theme === "dark";
  return {
    title: {
      text: translations[currentLang].tasksCTitle,
      left: "center",
      top: 20,
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    tooltip: {
      trigger: "axis",
      axisPointer: {
        type: "shadow",
      },
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      backgroundColor: isDark ? "#161616" : "#f2f2f2",
    },
    legend: {
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    xAxis: {
      type: "value",
      axisLabel: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      fontFamily: "'Concert One', 'AA-ANIQ', cursive",
    },
    yAxis: {
      type: "category",
      data: translations[currentLang].calendarDays,
      axisTick: {
        alignWithLabel: true,
      },
      axisLabel: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      fontFamily: "'Concert One', 'AA-ANIQ', cursive",
    },
    series: [
      {
        name: translations[currentLang].completed,
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: [320, 302, 301, 334, 390, 330, 320],
        color: isDark ? "#AC54FF" : "#7C3AED",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      {
        name: translations[currentLang].pending,
        type: "bar",
        stack: "total",
        emphasis: {
          focus: "series",
        },
        data: [120, 132, 101, 134, 90, 230, 210],
        color: isDark ? "#7439AD" : "#996FE3",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
  };
}

window.addEventListener("resize", tasksChart.resize);

let modeIcon = document.getElementById("modeIcon");

// apply theme and save it to localStorage
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
  calendarChart.setOption(getChartOptions(theme));
  pomodoroChart.setOption(getPomodoroOptions(theme), true);
  sessionChart.setOption(getSessionOptions(theme), true);
  soundChart.setOption(getSoundOptions(theme), true);
  tasksChart.setOption(getTasksOptions(theme), true);
}

// for language changes selection
let currentLang = localStorage.getItem("settings.language") || "en";

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;

  // RTL support for Arabic
  document.documentElement.setAttribute("dir", lang === "ar" ? "rtl" : "ltr");
  document.documentElement.setAttribute("lang", lang);

  // Page title
  document.title = t.pageTitle;

  // Cards
  const titles = document.querySelectorAll(".Card_info .title");
  const keys = ["card1", "card2", "card3", "card4"];
  titles.forEach((el, i) => (el.textContent = t[keys[i]]));

  // Timeframe labels
  document.querySelectorAll(".timeLable").forEach((el, i) => {
    el.textContent = t.timeframes[i];
  });

  // Save and re-render charts with new labels
  currentLang = lang;
  localStorage.setItem("settings.language", lang);
  applyTheme(mode);
}

applyLanguage(currentLang);

const langSelect = document.getElementById("language-select");

// Set initial value from storage
langSelect.value = currentLang;
applyLanguage(currentLang);

langSelect.addEventListener("change", function () {
  applyLanguage(this.value);
});

let modeSelect = document.getElementById("dark-mode-toggle");

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

// getting the clicked data, working on after :)
document
  .querySelector(".Timeframe")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("timeLable")) {
      document.querySelectorAll(".timeLable").forEach((el) => {
        el.classList.remove("activeI");
      });
      event.target.classList.add("activeI");
    }
  });
