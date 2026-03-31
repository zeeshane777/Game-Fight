let audioContext = null;
let masterGain = null;
let menuLoopHandle = null;
let unlockBound = false;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const Context = window.AudioContext || window.webkitAudioContext;
  if (!Context) {
    return null;
  }

  if (!audioContext) {
    audioContext = new Context();
    masterGain = audioContext.createGain();
    masterGain.gain.value = 0.18;
    masterGain.connect(audioContext.destination);
  }

  return audioContext;
}

async function resumeAudio() {
  const context = getAudioContext();
  if (!context) {
    return null;
  }

  if (context.state === "suspended") {
    try {
      await context.resume();
    } catch (error) {
      return null;
    }
  }

  return context;
}

function bindUnlockListeners() {
  if (unlockBound || typeof window === "undefined") {
    return;
  }

  const unlock = async () => {
    const context = await resumeAudio();
    if (context && context.state === "running") {
      window.removeEventListener("pointerdown", unlock);
      window.removeEventListener("keydown", unlock);
      unlockBound = false;
    }
  };

  unlockBound = true;
  window.addEventListener("pointerdown", unlock, { once: true });
  window.addEventListener("keydown", unlock, { once: true });
}

function playTone({
  frequency,
  duration = 0.14,
  type = "sine",
  volume = 0.12,
  attack = 0.005,
  release = 0.12,
  when = 0,
}) {
  const context = getAudioContext();
  if (!context || !masterGain || context.state !== "running") {
    return;
  }

  const startAt = context.currentTime + when;
  const endAt = startAt + duration;
  const oscillator = context.createOscillator();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();

  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, startAt);
  filter.type = "lowpass";
  filter.frequency.setValueAtTime(1800, startAt);
  gainNode.gain.setValueAtTime(0.0001, startAt);
  gainNode.gain.exponentialRampToValueAtTime(volume, startAt + attack);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, endAt + release);

  oscillator.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);

  oscillator.start(startAt);
  oscillator.stop(endAt + release + 0.02);
}

function playNoiseHit(volume = 0.08) {
  const context = getAudioContext();
  if (!context || !masterGain || context.state !== "running") {
    return;
  }

  const bufferSize = context.sampleRate * 0.08;
  const buffer = context.createBuffer(1, bufferSize, context.sampleRate);
  const data = buffer.getChannelData(0);

  for (let index = 0; index < bufferSize; index += 1) {
    data[index] = (Math.random() * 2 - 1) * (1 - index / bufferSize);
  }

  const source = context.createBufferSource();
  const gainNode = context.createGain();
  const filter = context.createBiquadFilter();
  const startAt = context.currentTime;

  source.buffer = buffer;
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(980, startAt);
  gainNode.gain.setValueAtTime(volume, startAt);
  gainNode.gain.exponentialRampToValueAtTime(0.0001, startAt + 0.12);

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(masterGain);
  source.start(startAt);
  source.stop(startAt + 0.12);
}

function playPunchThump(baseFrequency = 120, volume = 0.09) {
  playTone({
    frequency: baseFrequency,
    duration: 0.045,
    type: "square",
    volume,
    attack: 0.001,
    release: 0.06,
  });
  playTone({
    frequency: baseFrequency * 1.9,
    duration: 0.03,
    type: "triangle",
    volume: volume * 0.65,
    attack: 0.001,
    release: 0.04,
    when: 0.01,
  });
  playNoiseHit(volume * 0.55);
}

function scheduleMenuLoop() {
  if (menuLoopHandle) {
    clearInterval(menuLoopHandle);
  }

  const playPattern = () => {
    playTone({ frequency: 220, duration: 0.22, type: "triangle", volume: 0.05 });
    playTone({ frequency: 277.18, duration: 0.18, type: "triangle", volume: 0.04, when: 0.24 });
    playTone({ frequency: 329.63, duration: 0.2, type: "triangle", volume: 0.05, when: 0.48 });
    playTone({ frequency: 164.81, duration: 0.32, type: "sawtooth", volume: 0.03, when: 0.72 });
    playTone({ frequency: 220, duration: 0.18, type: "triangle", volume: 0.045, when: 1.1 });
    playTone({ frequency: 246.94, duration: 0.2, type: "triangle", volume: 0.04, when: 1.34 });
    playTone({ frequency: 329.63, duration: 0.24, type: "triangle", volume: 0.05, when: 1.6 });
    playTone({ frequency: 196, duration: 0.38, type: "sawtooth", volume: 0.03, when: 1.92 });
  };

  playPattern();
  menuLoopHandle = window.setInterval(playPattern, 2600);
}

export async function startMenuMusic() {
  bindUnlockListeners();
  const context = await resumeAudio();
  if (!context || context.state !== "running") {
    return;
  }

  if (!menuLoopHandle) {
    scheduleMenuLoop();
  }
}

export function stopMenuMusic() {
  if (menuLoopHandle) {
    clearInterval(menuLoopHandle);
    menuLoopHandle = null;
  }
}

export async function playHitSound(effect = "punch") {
  bindUnlockListeners();
  const context = await resumeAudio();
  if (!context || context.state !== "running") {
    return;
  }

  if (effect === "projectile") {
    playPunchThump(105, 0.06);
    playTone({ frequency: 360, duration: 0.05, type: "square", volume: 0.03, when: 0.03 });
    return;
  }

  if (effect === "uppercut") {
    playPunchThump(110, 0.1);
    playPunchThump(150, 0.05);
    return;
  }

  if (effect === "kick") {
    playPunchThump(95, 0.085);
    return;
  }

  if (effect === "ultimate") {
    playPunchThump(92, 0.11);
    playPunchThump(138, 0.07);
    return;
  }

  playPunchThump(125, 0.09);
}
