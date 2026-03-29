// ===== BEAT ZONE - script.js =====

// ===== SONG DATA =====
const SONGS = [
  {
    id: 0, name: "MOONLIGHT SONATA RMX", genre: "classic", icon: "🎹",
    bpm: 120, duration: 80,
    desc: "クラシック / Classic",
    diff: { easy: 2, normal: 4, hard: 7 },
    musicType: "classic_moonlight"
  },
  {
    id: 1, name: "NEON WALTZ", genre: "classic", icon: "🎻",
    bpm: 138, duration: 75,
    desc: "クラシック / Classic",
    diff: { easy: 2, normal: 5, hard: 8 },
    musicType: "classic_waltz"
  },
  {
    id: 2, name: "BAROQUE CIRCUIT", genre: "classic", icon: "🎼",
    bpm: 128, duration: 72,
    desc: "クラシック / Classic",
    diff: { easy: 3, normal: 5, hard: 9 },
    musicType: "classic_baroque"
  },
  {
    id: 3, name: "ARIA PROTOCOL", genre: "classic", icon: "🎵",
    bpm: 100, duration: 80,
    desc: "クラシック / Classic",
    diff: { easy: 1, normal: 3, hard: 6 },
    musicType: "classic_aria"
  },
  {
    id: 4, name: "FUGUE OVERDRIVE", genre: "classic", icon: "🎶",
    bpm: 144, duration: 70,
    desc: "クラシック / Classic",
    diff: { easy: 3, normal: 6, hard: 10 },
    musicType: "classic_fugue"
  },
  {
    id: 5, name: "ACID RAVE 303", genre: "club", icon: "🎛",
    bpm: 140, duration: 75,
    desc: "クラブ / Club",
    diff: { easy: 2, normal: 5, hard: 8 },
    musicType: "club_acid"
  },
  {
    id: 6, name: "SYNTHWAVE EXPRESS", genre: "club", icon: "🌆",
    bpm: 120, duration: 80,
    desc: "クラブ / Club",
    diff: { easy: 2, normal: 4, hard: 7 },
    musicType: "club_synthwave"
  },
  {
    id: 7, name: "TECHNO PULSE", genre: "club", icon: "⚡",
    bpm: 150, duration: 70,
    desc: "クラブ / Club",
    diff: { easy: 3, normal: 6, hard: 9 },
    musicType: "club_techno"
  },
  {
    id: 8, name: "DEEP HOUSE NOVA", genre: "club", icon: "🌌",
    bpm: 124, duration: 80,
    desc: "クラブ / Club",
    diff: { easy: 2, normal: 4, hard: 7 },
    musicType: "club_deephouse"
  },
  {
    id: 9, name: "JUNGLE STATIC", genre: "club", icon: "🔊",
    bpm: 160, duration: 72,
    desc: "クラブ / Club",
    diff: { easy: 3, normal: 6, hard: 10 },
    musicType: "club_jungle"
  }
];

// ===== AUDIO ENGINE =====
const AudioEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let musicNodes = [];
  let isPlaying = false;
  let startTime = 0;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.6;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  // Low-pass filter helper
  function lpf(freq) {
    const f = ctx.createBiquadFilter();
    f.type = 'lowpass';
    f.frequency.value = freq;
    return f;
  }

  // Reverb helper (simple convolver)
  function createReverb(time = 1.5) {
    const conv = ctx.createConvolver();
    const len = ctx.sampleRate * time;
    const buf = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let c = 0; c < 2; c++) {
      const d = buf.getChannelData(c);
      for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 2);
    }
    conv.buffer = buf;
    return conv;
  }

  // Compressor
  function createComp() {
    const c = ctx.createDynamicsCompressor();
    c.threshold.value = -18;
    c.knee.value = 10;
    c.ratio.value = 4;
    c.attack.value = 0.003;
    c.release.value = 0.25;
    return c;
  }

  // Oscillator note
  function osc(type, freq, startT, dur, vol = 0.3, detune = 0) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type;
    o.frequency.value = freq;
    o.detune.value = detune;
    o.connect(g);
    g.connect(masterGain);
    g.gain.setValueAtTime(0, startT);
    g.gain.linearRampToValueAtTime(vol, startT + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, startT + dur);
    o.start(startT);
    o.stop(startT + dur + 0.05);
    musicNodes.push(o, g);
    return { osc: o, gain: g };
  }

  // Kick drum
  function kick(t, vol = 0.7) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(0.001, t + 0.35);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + 0.4);
    musicNodes.push(o, g);
  }

  // Snare
  function snare(t, vol = 0.25) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const f = lpf(4000);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.15);
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(t); src.stop(t + 0.2);
    musicNodes.push(src, g, f);
  }

  // Hi-hat
  function hat(t, vol = 0.12, open = false) {
    const buf = ctx.createBuffer(1, ctx.sampleRate * (open ? 0.3 : 0.05), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource();
    src.buffer = buf;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter();
    f.type = 'highpass';
    f.frequency.value = 8000;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + (open ? 0.3 : 0.05));
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(t); src.stop(t + 0.35);
    musicNodes.push(src, g, f);
  }

  // Bass note
  function bass(freq, t, dur, vol = 0.35) {
    osc('sawtooth', freq, t, dur, vol);
    osc('sine', freq, t, dur, vol * 0.5);
  }

  // Piano-like tone
  function piano(freq, t, dur, vol = 0.2) {
    const o = ctx.createOscillator();
    const o2 = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = 'triangle';
    o2.type = 'sine';
    o.frequency.value = freq;
    o2.frequency.value = freq * 2;
    o.connect(g); o2.connect(g);
    g.connect(masterGain);
    g.gain.setValueAtTime(vol, t);
    g.gain.setValueAtTime(vol * 0.7, t + 0.05);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.1);
    o2.start(t); o2.stop(t + dur + 0.1);
    musicNodes.push(o, o2, g);
  }

  // Pad chord
  function pad(freqs, t, dur, vol = 0.08) {
    freqs.forEach(f => osc('sine', f, t, dur, vol, (Math.random() - 0.5) * 10));
  }

  // ===== MUSIC PATTERNS =====
  // Note: these generate looping patterns for the given duration

  const NOTES = {
    C3:130.81, D3:146.83, E3:164.81, F3:174.61, G3:196, A3:220, B3:246.94,
    C4:261.63, D4:293.66, E4:329.63, F4:349.23, G4:392, A4:440, B4:493.88,
    C5:523.25, D5:587.33, E5:659.25, F5:698.46, G5:783.99, A5:880,
    Bb3:233.08, Bb4:466.16, F3s:185, Ab3:207.65, Eb4:311.13, Ab4:415.30
  };

  function generateMusic(type, startT, duration, bpm) {
    const beat = 60 / bpm;
    const bar = beat * 4;
    const bars = Math.ceil(duration / bar) + 2;

    switch (type) {
      case 'classic_moonlight': genMoonlight(startT, bars, bar, beat); break;
      case 'classic_waltz':     genWaltz(startT, bars, bar, beat); break;
      case 'classic_baroque':   genBaroque(startT, bars, bar, beat); break;
      case 'classic_aria':      genAria(startT, bars, bar, beat); break;
      case 'classic_fugue':     genFugue(startT, bars, bar, beat); break;
      case 'club_acid':         genAcid(startT, bars, bar, beat); break;
      case 'club_synthwave':    genSynthwave(startT, bars, bar, beat); break;
      case 'club_techno':       genTechno(startT, bars, bar, beat); break;
      case 'club_deephouse':    genDeephouse(startT, bars, bar, beat); break;
      case 'club_jungle':       genJungle(startT, bars, bar, beat); break;
      default: genTechno(startT, bars, bar, beat);
    }
  }

  function genMoonlight(st, bars, bar, beat) {
    const mel = [NOTES.E4, NOTES.G4, NOTES.C5, NOTES.G4, NOTES.E4, NOTES.D5, NOTES.G4, NOTES.C5];
    const bass_notes = [NOTES.C3, NOTES.C3, NOTES.G3, NOTES.G3, NOTES.A3, NOTES.A3, NOTES.F3, NOTES.F3];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      const bassNote = bass_notes[b % bass_notes.length];
      bass(bassNote, t, bar * 0.95, 0.3);
      for (let i = 0; i < 6; i++) {
        const mn = mel[(b * 6 + i) % mel.length];
        piano(mn, t + i * beat * 0.67, beat * 0.6, 0.18);
      }
      if (b % 2 === 0) {
        pad([NOTES.C4, NOTES.E4, NOTES.G4], t, bar, 0.05);
      }
    }
  }

  function genWaltz(st, bars, bar, beat) {
    const mel = [NOTES.A4, NOTES.C5, NOTES.E5, NOTES.D5, NOTES.B4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.A4];
    const bassN = [NOTES.A3, NOTES.F3, NOTES.G3, NOTES.C4];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      bass(bassN[b % bassN.length], t, beat * 0.9, 0.28);
      // waltz feel - 3/4-ish
      for (let i = 0; i < 3; i++) {
        const mn = mel[(b * 3 + i) % mel.length];
        piano(mn, t + i * beat * 1.33, beat, 0.15);
        if (i > 0) {
          const mn2 = mel[(b * 3 + i + 2) % mel.length];
          piano(mn2, t + i * beat * 1.33 + beat * 0.5, beat * 0.4, 0.08);
        }
      }
    }
  }

  function genBaroque(st, bars, bar, beat) {
    const seq = [NOTES.C4, NOTES.E4, NOTES.G4, NOTES.E4, NOTES.F4, NOTES.A4, NOTES.C5, NOTES.A4,
                  NOTES.G4, NOTES.B4, NOTES.D5, NOTES.B4, NOTES.C5, NOTES.E5, NOTES.G5, NOTES.E5];
    const bassSeq = [NOTES.C3, NOTES.G3, NOTES.A3, NOTES.F3];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      bass(bassSeq[b % bassSeq.length], t, bar, 0.3);
      for (let i = 0; i < 8; i++) {
        const mn = seq[(b * 8 + i) % seq.length];
        piano(mn, t + i * beat * 0.5, beat * 0.45, 0.16);
      }
    }
  }

  function genAria(st, bars, bar, beat) {
    const mel = [NOTES.E4, NOTES.F4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.F4,
                  NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4, NOTES.E4, NOTES.E4];
    const bassN = [NOTES.C3, NOTES.G3, NOTES.F3, NOTES.G3];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      bass(bassN[b % bassN.length], t, bar * 0.95, 0.25);
      pad([NOTES.C4, NOTES.E4, NOTES.G4], t, bar, 0.04);
      for (let i = 0; i < 4; i++) {
        const mn = mel[(b * 4 + i) % mel.length];
        piano(mn, t + i * beat, beat * 0.85, 0.2);
      }
    }
  }

  function genFugue(st, bars, bar, beat) {
    const subj = [NOTES.C4, NOTES.D4, NOTES.E4, NOTES.F4, NOTES.G4, NOTES.F4, NOTES.E4, NOTES.D4];
    const subjB = [NOTES.G3, NOTES.A3, NOTES.B3, NOTES.C4, NOTES.D4, NOTES.C4, NOTES.B3, NOTES.A3];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      for (let i = 0; i < 8; i++) {
        piano(subj[(b * 8 + i) % subj.length], t + i * beat * 0.5, beat * 0.45, 0.14);
        if (b >= 2) {
          const offset = beat * 2;
          piano(subjB[(b * 8 + i) % subjB.length], t + i * beat * 0.5 - offset, beat * 0.45, 0.1);
        }
      }
      bass(NOTES.C3, t, bar, 0.25);
    }
  }

  function genAcid(st, bars, bar, beat) {
    const seq = [NOTES.C3, NOTES.C3, NOTES.Bb3, NOTES.C3, NOTES.G3, NOTES.C3, NOTES.F3, NOTES.G3];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      kick(t); kick(t + beat * 2);
      snare(t + beat); snare(t + beat * 3);
      for (let i = 0; i < 16; i++) hat(t + i * beat * 0.25, 0.08);
      for (let i = 0; i < 8; i++) {
        const n = seq[(b * 8 + i) % seq.length];
        const acidO = ctx.createOscillator();
        const acidG = ctx.createGain();
        const acidF = ctx.createBiquadFilter();
        acidO.type = 'sawtooth';
        acidO.frequency.value = n;
        acidF.type = 'lowpass';
        acidF.frequency.setValueAtTime(800, t + i * beat * 0.5);
        acidF.frequency.exponentialRampToValueAtTime(4000, t + i * beat * 0.5 + 0.1);
        acidF.Q.value = 10;
        acidG.gain.setValueAtTime(0.25, t + i * beat * 0.5);
        acidG.gain.exponentialRampToValueAtTime(0.001, t + i * beat * 0.5 + 0.4);
        acidO.connect(acidF); acidF.connect(acidG); acidG.connect(masterGain);
        acidO.start(t + i * beat * 0.5);
        acidO.stop(t + i * beat * 0.5 + 0.5);
        musicNodes.push(acidO, acidG, acidF);
      }
    }
  }

  function genSynthwave(st, bars, bar, beat) {
    const melody = [NOTES.E4, NOTES.G4, NOTES.A4, NOTES.G4, NOTES.E4, NOTES.D4, NOTES.C4, NOTES.D4];
    const chords = [[NOTES.C4,NOTES.E4,NOTES.G4],[NOTES.A3,NOTES.C4,NOTES.E4],
                    [NOTES.F3,NOTES.A3,NOTES.C4],[NOTES.G3,NOTES.B3,NOTES.D4]];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      kick(t); kick(t + beat * 2);
      snare(t + beat); snare(t + beat * 3);
      for (let i = 0; i < 8; i++) hat(t + i * beat * 0.5, 0.07);
      bass(NOTES.C3 * [1,0.84,0.67,0.75][b % 4], t, bar * 0.9, 0.3);
      pad(chords[b % 4], t, bar, 0.07);
      for (let i = 0; i < 4; i++) {
        osc('sawtooth', melody[(b * 4 + i) % melody.length], t + i * beat, beat * 0.9, 0.12);
      }
    }
  }

  function genTechno(st, bars, bar, beat) {
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      kick(t); kick(t + beat); kick(t + beat * 2); kick(t + beat * 3);
      snare(t + beat); snare(t + beat * 3);
      for (let i = 0; i < 16; i++) hat(t + i * beat * 0.25, i % 2 === 0 ? 0.1 : 0.06);
      if (b % 2 === 0) hat(t + beat * 3.75, 0.15, true);
      const bassSeq = [NOTES.C3, NOTES.C3, NOTES.Bb3, NOTES.Ab3, NOTES.C3, NOTES.C3, NOTES.G3, NOTES.C3];
      for (let i = 0; i < 8; i++) {
        bass(bassSeq[i % bassSeq.length], t + i * beat * 0.5, beat * 0.45, 0.28);
      }
    }
  }

  function genDeephouse(st, bars, bar, beat) {
    const mel = [NOTES.A4, NOTES.G4, NOTES.E4, NOTES.F4, NOTES.G4, NOTES.A4, NOTES.C5, NOTES.B4];
    const bassN = [NOTES.A3, NOTES.A3, NOTES.G3, NOTES.F3];
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      kick(t); kick(t + beat * 2);
      snare(t + beat); snare(t + beat * 3);
      for (let i = 0; i < 8; i++) hat(t + i * beat * 0.5, 0.06, i === 7);
      bass(bassN[b % bassN.length], t, bar, 0.28);
      pad([NOTES.A3,NOTES.C4,NOTES.E4,NOTES.G4], t, bar, 0.05);
      if (b % 2 === 1) {
        for (let i = 0; i < 4; i++) {
          osc('sine', mel[(b * 4 + i) % mel.length], t + i * beat, beat * 0.8, 0.1);
        }
      }
    }
  }

  function genJungle(st, bars, bar, beat) {
    for (let b = 0; b < bars; b++) {
      const t = st + b * bar;
      // Broken beat / jungle pattern
      kick(t);
      kick(t + beat * 0.375);
      kick(t + beat * 2.5);
      snare(t + beat * 1);
      snare(t + beat * 1.5);
      snare(t + beat * 3);
      for (let i = 0; i < 32; i++) hat(t + i * beat * 0.125, 0.05 + (i % 4 === 0 ? 0.06 : 0));
      const bassN = [NOTES.C3, NOTES.C3, NOTES.Bb3, NOTES.G3, NOTES.F3, NOTES.G3, NOTES.Ab3, NOTES.G3];
      for (let i = 0; i < 8; i++) {
        bass(bassN[i % bassN.length], t + i * beat * 0.5, beat * 0.4, 0.25);
      }
    }
  }

  function play(song, startT, duration) {
    init();
    resume();
    stop();
    startTime = startT;
    generateMusic(song.musicType, startT, duration, song.bpm);
    isPlaying = true;
  }

  function stop() {
    musicNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
    musicNodes = [];
    isPlaying = false;
  }

  // Sound effects
  function sfx(type) {
    if (!ctx) return;
    resume();
    if (type === 'perfect') {
      osc('sine', 1200, ctx.currentTime, 0.08, 0.15);
      osc('sine', 1600, ctx.currentTime + 0.03, 0.06, 0.1);
    } else if (type === 'good') {
      osc('triangle', 800, ctx.currentTime, 0.08, 0.1);
    } else if (type === 'miss') {
      const n = ctx.createBufferSource();
      const b = ctx.createBuffer(1, ctx.sampleRate * 0.05, ctx.sampleRate);
      const d = b.getChannelData(0);
      for (let i = 0; i < d.length; i++) d[i] = (Math.random() * 2 - 1) * (1 - i / d.length);
      n.buffer = b;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      n.connect(g); g.connect(masterGain);
      n.start();
      musicNodes.push(n, g);
    }
  }

  return { init, resume, now, play, stop, sfx };
})();

// ===== NOTE CHART GENERATOR =====
function generateChart(song, difficulty) {
  const bpm = song.bpm;
  const duration = song.duration;
  const beat = 60 / bpm;

  // Note density per beat based on difficulty
  const density = { easy: 0.6, normal: 1.2, hard: 2.0 }[difficulty];
  const chanceDouble = { easy: 0, normal: 0.15, hard: 0.35 }[difficulty];

  const notes = [];
  let t = beat * 2; // start after 2 beats

  const patterns_easy = [
    [0], [1], [2], [3], [4], [0,2], [1,3], [2,4]
  ];
  const patterns_normal = [
    [0], [1], [2], [3], [4],
    [0,2], [1,3], [2,4], [0,4],
    [0,1,2], [2,3,4]
  ];
  const patterns_hard = [
    [0], [1], [2], [3], [4],
    [0,1], [1,2], [2,3], [3,4],
    [0,2,4], [1,3], [0,1,2], [2,3,4],
    [0,1,2,3], [1,2,3,4]
  ];
  const patterns = { easy: patterns_easy, normal: patterns_normal, hard: patterns_hard }[difficulty];

  let id = 0;
  let prevLane = -1;

  while (t < duration - beat * 2) {
    const step = beat / density;
    const pattern = patterns[Math.floor(Math.random() * patterns.length)];

    // Avoid repeating same single note
    let finalPattern = pattern;
    if (pattern.length === 1 && pattern[0] === prevLane && Math.random() < 0.7) {
      const others = [0,1,2,3,4].filter(x => x !== prevLane);
      finalPattern = [others[Math.floor(Math.random() * others.length)]];
    }

    finalPattern.forEach(lane => {
      notes.push({ id: id++, time: t, lane });
    });

    if (finalPattern.length === 1) prevLane = finalPattern[0];
    t += step;
  }

  return notes;
}

// ===== GAME ENGINE =====
const Game = (() => {
  let currentSong = null;
  let currentDiff = 'easy';
  let chart = [];
  let noteElements = {};
  let score = 0;
  let combo = 0;
  let maxCombo = 0;
  let health = 100;
  let perfect = 0, good = 0, miss = 0;
  let gameRunning = false;
  let gamePaused = false;
  let gameStartTime = 0;
  let noteSpeed = 400; // px per second (playfield height)
  let judgeWindow = { perfect: 0.09, good: 0.16 };
  let animFrame = null;
  let judgeTimer = null;
  let playfieldH = 0;
  let pendingNotes = [];
  let activeNotes = []; // notes currently on screen
  let hitNotes = new Set();

  // Key mappings
  const KEY_MAP = { 's': 0, 'd': 1, 'z': 2, 'x': 3, 'c': 4 };
  const keyState = { 0:false, 1:false, 2:false, 3:false, 4:false };

  // ===== SCREENS =====
  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }

  function showTitle() {
    AudioEngine.stop();
    showScreen('screen-title');
  }

  function showSongSelect() {
    AudioEngine.stop();
    buildSongList();
    showScreen('screen-select');
  }

  function buildSongList() {
    const list = document.getElementById('song-list');
    list.innerHTML = '';
    SONGS.forEach(song => {
      const stars = '★'.repeat(song.diff[currentDiff]) + '☆'.repeat(10 - song.diff[currentDiff]);
      const card = document.createElement('div');
      card.className = `song-card genre-${song.genre}`;
      card.innerHTML = `
        <div class="song-icon">${song.icon}</div>
        <div class="song-info">
          <div class="song-name">${song.name}</div>
          <div class="song-meta">${song.desc} · BPM ${song.bpm}</div>
        </div>
        <div>
          <div class="song-bpm">${song.duration}s</div>
          <div class="song-diff-stars ${currentDiff}">${stars.substring(0,7)}</div>
        </div>
      `;
      card.addEventListener('click', () => startGame(song));
      card.addEventListener('touchend', (e) => { e.preventDefault(); startGame(song); });
      list.appendChild(card);
    });
  }

  function setDifficulty(diff) {
    currentDiff = diff;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.diff-btn[data-diff="${diff}"]`).classList.add('active');
    buildSongList();
  }

  // ===== GAME START =====
  function startGame(song) {
    AudioEngine.init();
    currentSong = song;
    chart = generateChart(song, currentDiff);
    pendingNotes = [...chart];
    activeNotes = [];
    hitNotes = new Set();
    score = 0; combo = 0; maxCombo = 0; health = 100;
    perfect = 0; good = 0; miss = 0;

    // Update UI
    document.getElementById('ui-song-name').textContent = song.name;
    const diffEl = document.getElementById('ui-difficulty');
    diffEl.textContent = currentDiff.toUpperCase();
    diffEl.className = `diff-label ${currentDiff}`;
    document.getElementById('ui-score').textContent = '0';
    document.getElementById('ui-combo').textContent = '0';
    document.getElementById('health-bar').style.width = '100%';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('notes-container').innerHTML = '';
    document.getElementById('hit-effects').innerHTML = '';
    noteElements = {};

    // Speed based on difficulty
    noteSpeed = { easy: 320, normal: 420, hard: 550 }[currentDiff];
    judgeWindow = {
      easy:   { perfect: 0.12, good: 0.20 },
      normal: { perfect: 0.09, good: 0.15 },
      hard:   { perfect: 0.06, good: 0.11 }
    }[currentDiff];

    showScreen('screen-game');

    // Measure playfield
    const pf = document.getElementById('playfield');
    playfieldH = pf.clientHeight;

    gameRunning = true;
    gamePaused = false;

    // Start music after brief delay
    const now = AudioEngine.now();
    gameStartTime = now + 0.5;
    AudioEngine.play(song, gameStartTime, song.duration);

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(gameLoop);
  }

  // ===== GAME LOOP =====
  function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) { animFrame = requestAnimationFrame(gameLoop); return; }

    const now = AudioEngine.now();
    const elapsed = now - gameStartTime;

    // Spawn notes
    while (pendingNotes.length > 0 && pendingNotes[0].time - elapsed < (playfieldH / noteSpeed) + 0.2) {
      const note = pendingNotes.shift();
      spawnNote(note, elapsed);
    }

    // Move notes
    updateNotes(elapsed);

    // Miss detection
    checkMisses(elapsed);

    // Progress bar
    const prog = Math.min(elapsed / currentSong.duration, 1);
    document.getElementById('progress-bar').style.width = (prog * 100) + '%';

    // End game
    if (elapsed >= currentSong.duration + 1 && pendingNotes.length === 0 && activeNotes.length === 0) {
      endGame();
      return;
    }

    animFrame = requestAnimationFrame(gameLoop);
  }

  function spawnNote(note, elapsed) {
    const pf = document.getElementById('notes-container');
    const el = document.createElement('div');
    el.className = 'note';
    el.dataset.lane = note.lane;
    el.dataset.id = note.id;

    const laneW = 20; // 20% each
    el.style.left = (note.lane * laneW) + '%';
    el.style.width = laneW + '%';
    el.style.top = '-30px';

    pf.appendChild(el);
    noteElements[note.id] = el;
    activeNotes.push({ ...note, el });
  }

  function updateNotes(elapsed) {
    activeNotes.forEach(note => {
      const timeDiff = note.time - elapsed;
      // Distance from judge line (bottom of playfield)
      // When timeDiff = 0, note is at judge line (bottom)
      const y = playfieldH - timeDiff * noteSpeed - 28;
      note.el.style.top = y + 'px';
    });
  }

  function checkMisses(elapsed) {
    const toRemove = [];
    activeNotes.forEach(note => {
      if (hitNotes.has(note.id)) { toRemove.push(note.id); return; }
      const timeDiff = note.time - elapsed;
      if (timeDiff < -judgeWindow.good) {
        // Missed
        registerJudge('miss', note.lane, note.id);
        toRemove.push(note.id);
      }
    });
    toRemove.forEach(id => removeNote(id));
  }

  function removeNote(id) {
    activeNotes = activeNotes.filter(n => n.id !== id);
    const el = noteElements[id];
    if (el) { el.remove(); delete noteElements[id]; }
  }

  // ===== INPUT =====
  function onKeyDown(e) {
    if (!gameRunning || gamePaused) return;
    const lane = KEY_MAP[e.key.toLowerCase()];
    if (lane === undefined) return;
    if (keyState[lane]) return;
    keyState[lane] = true;
    pressLane(lane);
    document.getElementById(`btn-${lane}`).classList.add('pressed');
  }

  function onKeyUp(e) {
    const lane = KEY_MAP[e.key.toLowerCase()];
    if (lane === undefined) return;
    keyState[lane] = false;
    document.getElementById(`btn-${lane}`).classList.remove('pressed');
  }

  function onTouch(lane, down) {
    AudioEngine.resume();
    if (down) {
      if (!gameRunning || gamePaused) return;
      pressLane(lane);
      document.getElementById(`btn-${lane}`).classList.add('pressed');
    } else {
      document.getElementById(`btn-${lane}`).classList.remove('pressed');
    }
  }

  function pressLane(lane) {
    const elapsed = AudioEngine.now() - gameStartTime;
    let bestNote = null;
    let bestDiff = Infinity;

    activeNotes.forEach(note => {
      if (note.lane !== lane) return;
      if (hitNotes.has(note.id)) return;
      const diff = Math.abs(note.time - elapsed);
      if (diff < bestDiff) { bestDiff = diff; bestNote = note; }
    });

    if (!bestNote) return;

    if (bestDiff <= judgeWindow.perfect) {
      registerJudge('perfect', lane, bestNote.id);
      hitNotes.add(bestNote.id);
      removeNote(bestNote.id);
    } else if (bestDiff <= judgeWindow.good) {
      registerJudge('good', lane, bestNote.id);
      hitNotes.add(bestNote.id);
      removeNote(bestNote.id);
    }
  }

  function registerJudge(type, lane, noteId) {
    if (type === 'perfect') {
      score += 300 + combo * 3;
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      health = Math.min(100, health + 1);
      perfect++;
      AudioEngine.sfx('perfect');
    } else if (type === 'good') {
      score += 100 + combo;
      combo++;
      if (combo > maxCombo) maxCombo = combo;
      good++;
      AudioEngine.sfx('good');
    } else {
      combo = 0;
      health = Math.max(0, health - 8);
      miss++;
      AudioEngine.sfx('miss');
    }

    // Update UI
    document.getElementById('ui-score').textContent = score.toLocaleString();
    document.getElementById('ui-combo').textContent = combo > 0 ? combo : '';
    document.getElementById('health-bar').style.width = health + '%';
    document.getElementById('health-bar').style.background =
      health > 50 ? 'linear-gradient(90deg, var(--accent4), var(--accent1))' :
      health > 25 ? 'linear-gradient(90deg, var(--accent3), var(--accent5))' :
                    'linear-gradient(90deg, #ff3333, var(--accent2))';

    showJudge(type, combo);
    showHitEffect(type, lane);

    // Game over
    if (health <= 0) {
      endGame();
    }
  }

  function showJudge(type, combo) {
    if (judgeTimer) clearTimeout(judgeTimer);
    const el = document.getElementById('judge-display');
    const text = { perfect: 'PERFECT', good: 'GOOD', miss: 'MISS' }[type];
    el.innerHTML = `<div class="judge-${type}">${text}${combo > 1 ? `<div class="judge-combo">${combo} COMBO</div>` : ''}</div>`;
    judgeTimer = setTimeout(() => { el.innerHTML = ''; }, 400);
  }

  function showHitEffect(type, lane) {
    const container = document.getElementById('hit-effects');
    const el = document.createElement('div');
    el.className = `hit-effect ${type}`;
    el.dataset.lane = lane;
    container.appendChild(el);
    setTimeout(() => el.remove(), 350);
  }

  // ===== PAUSE =====
  function pause() {
    if (!gameRunning) return;
    gamePaused = true;
    document.getElementById('screen-pause').classList.add('active');
  }

  function resume() {
    gamePaused = false;
    document.getElementById('screen-pause').classList.remove('active');
  }

  function quit() {
    endGame(true);
  }

  // ===== END GAME =====
  function endGame(forceQuit = false) {
    gameRunning = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    AudioEngine.stop();

    const totalNotes = chart.length;
    const hit = perfect + good;
    const acc = totalNotes > 0 ? (perfect * 300 + good * 100) / (totalNotes * 300) : 0;

    let rank = 'F';
    if (acc >= 0.95) rank = 'S';
    else if (acc >= 0.85) rank = 'A';
    else if (acc >= 0.70) rank = 'B';
    else if (acc >= 0.55) rank = 'C';

    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-rank').className = `result-rank rank-${rank.toLowerCase()}`;
    document.getElementById('result-song-name').textContent = currentSong.name;
    document.getElementById('res-score').textContent = score.toLocaleString();
    document.getElementById('res-combo').textContent = maxCombo;
    document.getElementById('res-perfect').textContent = perfect;
    document.getElementById('res-good').textContent = good;
    document.getElementById('res-miss').textContent = miss;

    document.getElementById('screen-pause').classList.remove('active');
    showScreen('screen-result');
  }

  function retry() {
    startGame(currentSong);
  }

  // ===== INIT =====
  function init() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('touchstart', () => AudioEngine.init(), { once: true });
    showScreen('screen-title');
  }

  return { showTitle, showSongSelect, setDifficulty, startGame, pause, resume, quit, retry, onTouch, init };
})();

// Boot
window.addEventListener('load', () => Game.init());
