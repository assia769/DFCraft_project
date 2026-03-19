const browserAPI = (() => {
  if (typeof browser !== "undefined" && browser.runtime) return browser;
  if (typeof chrome !== "undefined" && chrome.runtime) {
    return {
      storage: {
        local: {
          get: (keys) =>
            new Promise((resolve) => chrome.storage.local.get(keys, resolve)),
        },
      },
    };
  }
  return { storage: { local: { get: () => Promise.resolve({}) } } };
})();

let theme = localStorage.getItem("theme") || "light";
let globalData = null;
let devidedData = [];
const timeFrame = [7, 30, 90, 180];

async function initStatisticsPage() {
  const result = await browserAPI.storage.local.get(["statistics"]);
  globalData = result.statistics;

  if (globalData && globalData.days) {
    const today = new Date().toISOString().split("T")[0];
    const todayStats = globalData.days.find((d) => d.date === today) || {};

    // Update Info Cards
    const workSeconds = todayStats.totalWorkTime || 0;
    document.getElementById("todayFocus").textContent =
      `${Math.floor(workSeconds / 3600)}h ${Math.floor((workSeconds % 3600) / 60)}m`;
    document.getElementById("tasksSmashed").textContent =
      todayStats.tasksCompleted || 0;
    document.getElementById("quietTime").textContent =
      `${Math.floor((todayStats.totalListenTime || 0) / 60)}min`;
    document.getElementById("blocksDeflected").textContent =
      todayStats.totalDeflectionsAttempted || 0;

    const lables = document.querySelectorAll(".timeLable");
    if (lables.length > 0) {
      lables[0].classList.add("activeI");
      updateDividedData(0);
    }

    renderAllCharts();
  }
}

function getCalendarChartData() {
  if (globalData && globalData.days) {
    return globalData.days.map((day) => {
      const minutes = Math.floor(
        (day.totalWorkTime + day.totalBreakTime + day.totalLongBreakTime || 0) /
          60,
      );
      const list = [day.date, minutes];
      console.warn("Calendar data point:", list);
      return list;
    });
  } else return [];
}

function renderAllCharts() {
  renderCalendarChart();
  renderDependedCharts();
}

function renderCalendarChart() {
  let calendarDom = document.getElementById("chart-container-calendar");
  let calendarChart = echarts.init(calendarDom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });

  // creating virtual data for calendar heatmap, working on after to get real data from backend
  const year = new Date().getFullYear();
  const progress = getCalendarChartData();

  // chart options
  const isDark = theme === "dark";
  const langTranslations = translations[currentLang] || translations.en;
  const calendarOptions = {
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
      min: 1,
      max: 121,
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
      range: year,
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
      data: progress,
    },
  };
  window.addEventListener("resize", calendarChart.resize);
  calendarChart.setOption(calendarOptions);
}

function updateDividedData(index) {
  const numDays = timeFrame[index];
  if (globalData && globalData.days) {
    const sortedDays = [...globalData.days].sort(
      (a, b) => new Date(b.date) - new Date(a.date),
    );
    devidedData = sortedDays.slice(0, numDays).reverse();
    renderDependedCharts();
  }
}

function renderDependedCharts() {
  if (!devidedData || devidedData.length === 0) {
    console.warn("data may not be loaded yet, cannot render charts");
    return;
  }

  renderPomodoroChart();
  renderSessionChart();
  renderSoundChart();
  renderTasksChart();
  renderTasksPriorityChart();
  renderBlockedPagesChart();
}

function renderPomodoroChart() {
  const dates = devidedData.map((d) => d.date);
  const workData = devidedData.map((d) =>
    Math.floor((d.totalWorkTime || 0) / 60),
  );
  const breakData = devidedData.map((d) =>
    Math.floor((d.totalBreakTime || 0) / 60),
  );
  const longBreakData = devidedData.map((d) =>
    Math.floor((d.totalLongBreakTime || 0) / 60),
  );
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
  const pomodoroOptions = {
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
        data: dates,
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
        data: workData,
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
      {
        name: translations[currentLang].break,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: breakData,
        color: isDark ? "#9148D9" : "#8750E5",
      },
      {
        name: translations[currentLang].longBreak,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: longBreakData,
        color: isDark ? "#7439AD" : "#996FE3",
      },
    ],
  };

  window.addEventListener("resize", pomodoroChart.resize);
  pomodoroChart.setOption(pomodoroOptions);
}

function renderSessionChart() {
  const dates = devidedData.map((d) => d.date);
  const sessionData = devidedData.map((d) => d.totalSessions || 0);

  let domSession = document.getElementById("chart-container-session");
  let sessionChart = echarts.init(domSession, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let sessionApp = {};

  const isDark = theme === "dark";
  const sessionOptions = {
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
        data: dates,
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
        data: sessionData,
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
    ],
  };

  window.addEventListener("resize", sessionChart.resize);
  sessionChart.setOption(sessionOptions);
}

function renderSoundChart() {
  const dates = devidedData.map((d) => d.date);
  const soundData = devidedData.map(
    (d) => Math.floor(d.totalListenTime || 0) / 60,
  );
  console.warn("Sound chart data:", soundData);

  // creating Bar Chart for sound track

  let domSound = document.getElementById("chart-container-sound");
  let soundChart = echarts.init(domSound, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let soundApp = {};
  const isDark = theme === "dark";
  const soundOptions = {
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
        data: dates,
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
        data: soundData,
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
    ],
  };

  window.addEventListener("resize", soundChart.resize);
  soundChart.setOption(soundOptions);
}

function renderTasksChart() {
  const dates = devidedData.map((d) => d.date);
  const completedTasksData = devidedData.map((d) => d.tasksCompleted || 0);
  const pendingTasksData = devidedData.map((d) => d.tasksPending || 0);

  // for tracking the tasks progress
  let domTasks = document.getElementById("chart-container-totalTasks");
  let tasksChart = echarts.init(domTasks, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let tasksApp = {};
  const isDark = theme === "dark";
  const tasksOptions = {
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
      data: dates,
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
        data: completedTasksData,
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
        data: pendingTasksData,
        color: isDark ? "#7439AD" : "#996FE3",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    ],
  };

  window.addEventListener("resize", tasksChart.resize);
  tasksChart.setOption(tasksOptions);
}

function renderTasksPriorityChart() {
  const dates = devidedData.map((d) => d.date);
  const highPriorityData = devidedData.map((d) => d.tasksCompleted_high || 0);
  const mediumPriorityData = devidedData.map(
    (d) => d.tasksCompleted_medium || 0,
  );
  const lowPriorityData = devidedData.map((d) => d.tasksCompleted_low || 0);

  let completedTasksDom = document.getElementById(
    "chart-container-completedTasks",
  );
  let completedTasksChart = echarts.init(completedTasksDom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let completedTasksApp = {};

  const tasksposList = [
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
  completedTasksApp.configParameters = {
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
      options: tasksposList.reduce(function (map, pos) {
        map[pos] = pos;
        return map;
      }, {}),
    },
    distance: {
      min: 0,
      max: 100,
    },
  };
  completedTasksApp.config = {
    rotate: 90,
    align: "left",
    verticalAlign: "middle",
    position: "insideBottom",
    distance: 15,
    onChange: function () {
      const labelOption = {
        rotate: completedTasksApp.config.rotate,
        align: completedTasksApp.config.align,
        verticalAlign: completedTasksApp.config.verticalAlign,
        position: completedTasksApp.config.position,
        distance: completedTasksApp.config.distance,
      };
      completedTasksChart.setOption({
        series: [
          {
            label: taskslabelOption,
          },
          {
            label: taskslabelOption,
          },
          {
            label: taskslabelOption,
          },
          {
            label: taskslabelOption,
          },
        ],
      });
    },
  };
  const taskslabelOption = {
    show: true,
    position: completedTasksApp.config.position,
    distance: completedTasksApp.config.distance,
    align: completedTasksApp.config.align,
    verticalAlign: completedTasksApp.config.verticalAlign,
    rotate: completedTasksApp.config.rotate,
    formatter: "{c}  {name|{a}}",
    fontSize: 16,
    rich: {
      name: {},
    },
  };
  const isDark = theme === "dark";
  const barLabelOption = {
    show: false,
    position: completedTasksApp.config.position,
    distance: completedTasksApp.config.distance,
    align: completedTasksApp.config.align,
    verticalAlign: completedTasksApp.config.verticalAlign,
    rotate: completedTasksApp.config.rotate,
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
  const tasksOptions = {
    title: {
      text: translations[currentLang].completedTasksTitle,
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
        translations[currentLang].high,
        translations[currentLang].medium,
        translations[currentLang].low,
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
        data: dates,
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
        name: translations[currentLang].high,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: highPriorityData,
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
      {
        name: translations[currentLang].medium,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: mediumPriorityData,
        color: isDark ? "#9148D9" : "#8750E5",
      },
      {
        name: translations[currentLang].low,
        type: "bar",
        label: barLabelOption,
        emphasis: {
          focus: "series",
        },
        data: lowPriorityData,
        color: isDark ? "#7439AD" : "#996FE3",
      },
    ],
  };

  window.addEventListener("resize", completedTasksChart.resize);
  completedTasksChart.setOption(tasksOptions);
}

function renderBlockedPagesChart() {
  const dates = devidedData.map((d) => d.date);
  const blockedPagesData = devidedData.map(
    (d) => d.totalDeflectionsAttempted || 0,
  );

  let blockedDom = document.getElementById("chart-container-blockedPages");
  let blockedPagesChart = echarts.init(blockedDom, null, {
    renderer: "canvas",
    useDirtyRect: false,
  });
  let blockedPagesApp = {};

  const isDark = theme === "dark";
  const blockedPagesOptions = {
    title: {
      text: translations[currentLang].blockedPagesTitle,
      left: "center",
      top: 20,
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    tooltip: {
      trigger: "axis",
      textStyle: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
      backgroundColor: isDark ? "#161616" : "#f2f2f2",
    },
    xAxis: {
      type: "category",
      data: dates,
      axisLabel: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    yAxis: {
      type: "value",
      axisLabel: {
        color: isDark ? "#f2f2f2" : "#161616",
        fontFamily: "'Concert One', 'AA-ANIQ', cursive",
      },
    },
    series: [
      {
        data: blockedPagesData,
        type: "line",
        smooth: true,
        color: isDark ? "#AC54FF" : "#7C3AED",
      },
    ],
  };

  window.addEventListener("resize", blockedPagesChart.resize);
  blockedPagesChart.setOption(blockedPagesOptions, true);
}

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
  renderAllCharts(globalData);
}

// for language changes selection
let currentLang = localStorage.getItem("settings.language") || "en";

function applyLanguage(lang) {
  const t = translations[lang];
  if (!t) return;
  const mode = localStorage.getItem("theme") || "light";

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
  theme = theme == "dark" ? "light" : "dark";
  applyTheme(theme);
});

// getting the clicked data, working on after :)
document
  .querySelector(".Timeframe")
  .addEventListener("click", function (event) {
    if (event.target.classList.contains("timeLable")) {
      const lables = Array.from(document.querySelectorAll(".timeLable"));
      document.querySelectorAll(".timeLable").forEach((el) => {
        el.classList.remove("activeI");
      });
      event.target.classList.add("activeI");
      // Here you can handle the timeframe change, e.g., update charts or fetch new data
      const index = lables.indexOf(event.target);
      updateDividedData(index);
    }
  });

initStatisticsPage();
