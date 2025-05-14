let sequence = [];
let currentTimer = null;
let alarm = document.getElementById("alarm-sound");
let time = 0;

function startSequence() {
  const work = parseTime(document.getElementById("work-time").value);
  const shortBreak = parseTime(document.getElementById("short-break-time").value);
  const longBreak = parseTime(document.getElementById("long-break-time").value);

  if (work === null || shortBreak === null || longBreak === null) {
    alert("Por favor, ingresa los tiempos en formato HH:MM:SS.");
    return;
  }

  sequence = [
    { label: "Estudio 1", duration: work },
    { label: "Descanso Corto 1", duration: shortBreak },
    { label: "Estudio 2", duration: work },
    { label: "Descanso Corto 2", duration: shortBreak },
    { label: "Estudio 3", duration: work },
    { label: "Descanso Largo", duration: longBreak }
  ];

  runNextPhase();
}

function parseTime(timeStr) {
  const regex = /^([0-9]{2}):([0-9]{2}):([0-9]{2})$/;  // Regex para formato HH:MM:SS
  const match = timeStr.match(regex);

  if (!match) return null;

  const [, h, m, s] = match;
  const hours = parseInt(h);
  const minutes = parseInt(m);
  const seconds = parseInt(s);

  // Validar que los valores sean correctos
  if (hours < 0 || minutes < 0 || seconds < 0 || minutes > 59 || seconds > 59) {
    return null;
  }

  return hours * 3600 + minutes * 60 + seconds;
}

function runNextPhase() {
  if (sequence.length === 0) {
    document.getElementById("current-phase").textContent = "Estudio completado 🎉";
    document.getElementById("time-display").textContent = "00:00:00";
    return;
  }

  const phase = sequence.shift();
  document.getElementById("current-phase").textContent = "Fase: " + phase.label;

  runTimer(phase.duration, () => {
    alarm.currentTime = 0;
    alarm.play();
    alarm.onended = () => {
      runNextPhase();
    };
  });
}

function runTimer(duration, callback) {
  clearInterval(currentTimer);
  time = duration;
  updateDisplay();

  currentTimer = setInterval(() => {
    time--;
    updateDisplay();

    if (time <= 0) {
      clearInterval(currentTimer);
      callback();
    }
  }, 1000);
}

function updateDisplay() {
  let hrs = Math.floor(time / 3600).toString().padStart(2, '0');
  let mins = Math.floor((time % 3600) / 60).toString().padStart(2, '0');
  let secs = (time % 60).toString().padStart(2, '0');
  document.getElementById("time-display").textContent = `${hrs}:${mins}:${secs}`;
}

function resetTimer() {
  clearInterval(currentTimer);
  sequence = [];
  document.getElementById("current-phase").textContent = "Fase: --";
  document.getElementById("time-display").textContent = "00:00:00";
  alarm.pause();
  alarm.currentTime = 0;
}
