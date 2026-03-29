const SONGS = [
  {
    id:0,name:'Y1',icon:'⚡',bpm:140,duration:35,
    diff:{easy:2,normal:5,hard:8},
    mp3:'music/Y1.mp3',
    rawNotes:[{t:1.714,l:1,f:523.25},{t:2.143,l:2,f:523.25},{t:2.571,l:2,f:783.99},{t:3.0,l:1,f:587.33},{t:3.429,l:0,f:329.63},{t:3.999,l:1,f:523.25},{t:4.5,l:0,f:329.63},{t:4.929,l:2,f:659.25},{t:5.357,l:0,f:329.63},{t:5.786,l:2,f:659.25},{t:6.214,l:2,f:783.99},{t:6.643,l:0,f:349.23},{t:6.857,l:2,f:523.25},{t:7.071,l:2,f:698.46},{t:7.5,l:0,f:329.63},{t:7.714,l:0,f:329.63},{t:8.036,l:2,f:523.25},{t:8.571,l:1,f:493.88},{t:9.141,l:0,f:293.66},{t:9.429,l:0,f:261.63},{t:9.711,l:1,f:440.0},{t:9.999,l:1,f:392.0},{t:10.569,l:0,f:293.66},{t:12.857,l:2,f:659.25},{t:13.071,l:1,f:392.0},{t:13.286,l:0,f:349.23},{t:13.5,l:1,f:392.0},{t:13.714,l:2,f:587.33},{t:13.929,l:2,f:783.99},{t:14.143,l:1,f:587.33},{t:14.357,l:0,f:261.63},{t:14.571,l:2,f:587.33},{t:14.893,l:0,f:293.66},{t:15.429,l:2,f:659.25},{t:15.75,l:0,f:261.63},{t:16.286,l:2,f:523.25},{t:16.856,l:1,f:440.0},{t:17.426,l:2,f:523.25},{t:18.0,l:1,f:493.88},{t:18.214,l:0,f:392.0},{t:18.429,l:0,f:349.23},{t:18.643,l:1,f:523.25},{t:18.857,l:1,f:523.25},{t:19.071,l:2,f:587.33},{t:19.286,l:0,f:293.66},{t:19.5,l:0,f:261.63},{t:19.714,l:1,f:440.0},{t:20.036,l:2,f:698.46},{t:20.571,l:0,f:293.66},{t:20.893,l:1,f:523.25},{t:21.429,l:2,f:698.46},{t:21.857,l:0,f:392.0},{t:22.286,l:1,f:587.33},{t:22.714,l:2,f:698.46},{t:23.143,l:0,f:392.0},{t:23.713,l:1,f:523.25},{t:24.283,l:0,f:392.0},{t:24.857,l:2,f:783.99},{t:25.179,l:1,f:587.33},{t:25.714,l:2,f:659.25},{t:26.036,l:1,f:587.33},{t:28.286,l:0,f:392.0},{t:28.714,l:0,f:261.63},{t:29.143,l:1,f:493.88},{t:29.571,l:0,f:293.66},{t:31.714,l:1,f:440.0},{t:31.929,l:0,f:293.66},{t:32.143,l:1,f:392.0},{t:32.357,l:0,f:261.63},{t:32.571,l:2,f:523.25},{t:32.786,l:1,f:523.25},{t:33.0,l:0,f:392.0},{t:33.214,l:2,f:659.25},{t:33.429,l:0,f:293.66},{t:33.999,l:2,f:587.33},{t:34.569,l:1,f:392.0}]
  },
  {
    id:1,name:'Burn Together',icon:'🔥',bpm:138,duration:35,
    diff:{easy:3,normal:6,hard:9},
    mp3:'music/Pokki_DJ_-_Burn_Together.mp3',
    rawNotes:[{t:1.739,l:0,f:349.23},{t:1.957,l:2,f:523.25},{t:2.174,l:0,f:392.0},{t:2.391,l:0,f:349.23},{t:2.609,l:1,f:392.0},{t:2.826,l:0,f:261.63},{t:3.043,l:2,f:698.46},{t:3.261,l:0,f:392.0},{t:3.478,l:0,f:293.66},{t:3.696,l:2,f:698.46},{t:4.057,l:2,f:523.25},{t:4.635,l:2,f:783.99},{t:7.174,l:1,f:392.0},{t:7.609,l:2,f:523.25},{t:8.043,l:2,f:587.33},{t:8.478,l:1,f:587.33},{t:8.696,l:0,f:293.66},{t:8.913,l:2,f:587.33},{t:9.13,l:0,f:392.0},{t:9.348,l:1,f:587.33},{t:9.565,l:2,f:698.46},{t:9.783,l:1,f:587.33},{t:10.0,l:0,f:261.63},{t:10.217,l:2,f:698.46},{t:10.435,l:0,f:349.23},{t:10.652,l:1,f:392.0},{t:10.87,l:2,f:523.25},{t:11.087,l:1,f:493.88},{t:11.304,l:2,f:659.25},{t:11.522,l:1,f:392.0},{t:11.739,l:0,f:329.63},{t:11.957,l:1,f:392.0},{t:12.174,l:1,f:440.0},{t:12.391,l:2,f:523.25},{t:12.609,l:1,f:392.0},{t:12.826,l:0,f:329.63},{t:13.261,l:1,f:523.25},{t:13.696,l:1,f:523.25},{t:14.13,l:0,f:349.23},{t:14.565,l:2,f:659.25},{t:14.783,l:0,f:293.66},{t:15.0,l:0,f:293.66},{t:15.217,l:2,f:587.33},{t:15.435,l:0,f:349.23},{t:15.652,l:2,f:587.33},{t:15.87,l:1,f:493.88},{t:16.087,l:0,f:293.66},{t:16.304,l:1,f:587.33},{t:16.522,l:2,f:659.25},{t:17.1,l:0,f:392.0},{t:17.678,l:2,f:523.25},{t:18.261,l:1,f:523.25},{t:18.839,l:0,f:293.66},{t:19.13,l:2,f:523.25},{t:19.348,l:0,f:261.63},{t:19.565,l:2,f:587.33},{t:19.783,l:2,f:659.25},{t:20.0,l:2,f:587.33},{t:20.217,l:2,f:659.25},{t:20.435,l:0,f:261.63},{t:20.652,l:1,f:523.25},{t:20.87,l:1,f:392.0},{t:21.196,l:2,f:659.25},{t:21.739,l:2,f:587.33},{t:22.065,l:2,f:783.99},{t:22.826,l:0,f:392.0},{t:23.261,l:1,f:392.0},{t:23.696,l:2,f:659.25},{t:24.13,l:0,f:329.63},{t:24.348,l:2,f:783.99},{t:24.926,l:1,f:440.0},{t:25.504,l:2,f:587.33},{t:26.087,l:0,f:392.0},{t:26.413,l:1,f:493.88},{t:26.957,l:2,f:523.25},{t:27.283,l:0,f:329.63},{t:27.826,l:1,f:523.25},{t:28.043,l:2,f:659.25},{t:28.261,l:1,f:392.0},{t:28.478,l:0,f:261.63},{t:28.696,l:1,f:440.0},{t:28.913,l:2,f:523.25},{t:29.13,l:1,f:493.88},{t:29.348,l:2,f:523.25},{t:29.565,l:0,f:293.66},{t:29.891,l:0,f:349.23},{t:30.435,l:2,f:698.46},{t:31.013,l:0,f:392.0},{t:31.304,l:0,f:349.23},{t:31.591,l:2,f:587.33},{t:31.739,l:0,f:293.66},{t:32.174,l:1,f:587.33},{t:32.609,l:0,f:392.0},{t:33.043,l:2,f:698.46},{t:33.261,l:0,f:261.63},{t:33.478,l:2,f:659.25},{t:33.696,l:1,f:587.33},{t:33.913,l:2,f:698.46},{t:34.13,l:2,f:587.33},{t:34.348,l:1,f:440.0}]
  },
  {
    id:2,name:'Red Light',icon:'🔴',bpm:126,duration:35,
    diff:{easy:2,normal:5,hard:8},
    mp3:'music/RED_LIGHT_-_EGOR_BUDENNYY.mp3',
    rawNotes:[{t:1.905,l:0,f:293.66},{t:2.381,l:1,f:493.88},{t:2.857,l:2,f:783.99},{t:3.333,l:1,f:392.0},{t:3.81,l:1,f:392.0},{t:4.286,l:0,f:349.23},{t:4.762,l:1,f:523.25},{t:5.119,l:1,f:523.25},{t:5.714,l:1,f:523.25},{t:5.952,l:2,f:659.25},{t:6.429,l:1,f:587.33},{t:6.905,l:0,f:392.0},{t:7.381,l:1,f:392.0},{t:7.857,l:1,f:493.88},{t:8.333,l:1,f:523.25},{t:8.81,l:1,f:587.33},{t:9.286,l:1,f:523.25},{t:9.762,l:0,f:329.63},{t:10.238,l:0,f:293.66},{t:10.714,l:1,f:523.25},{t:11.19,l:0,f:261.63},{t:13.333,l:2,f:698.46},{t:13.571,l:0,f:329.63},{t:13.81,l:0,f:329.63},{t:14.048,l:2,f:783.99},{t:14.286,l:0,f:293.66},{t:14.524,l:2,f:698.46},{t:14.762,l:1,f:392.0},{t:15.0,l:0,f:349.23},{t:15.238,l:2,f:523.25},{t:15.871,l:1,f:493.88},{t:16.505,l:0,f:329.63},{t:17.381,l:1,f:587.33},{t:17.857,l:2,f:523.25},{t:18.333,l:0,f:349.23},{t:18.81,l:1,f:523.25},{t:19.286,l:0,f:329.63},{t:19.762,l:0,f:329.63},{t:20.238,l:1,f:587.33},{t:20.714,l:0,f:261.63},{t:20.952,l:2,f:783.99},{t:21.31,l:0,f:293.66},{t:21.905,l:2,f:783.99},{t:22.262,l:2,f:587.33},{t:22.857,l:2,f:523.25},{t:23.333,l:1,f:440.0},{t:24.048,l:2,f:523.25},{t:24.524,l:0,f:293.66},{t:24.762,l:2,f:698.46},{t:25.0,l:0,f:392.0},{t:25.238,l:1,f:392.0},{t:25.476,l:1,f:587.33},{t:25.714,l:1,f:587.33},{t:26.19,l:2,f:587.33},{t:28.571,l:1,f:493.88},{t:29.048,l:0,f:392.0},{t:29.524,l:1,f:587.33},{t:30.0,l:2,f:783.99},{t:30.476,l:0,f:349.23},{t:30.952,l:1,f:493.88},{t:31.429,l:2,f:523.25},{t:31.905,l:0,f:293.66},{t:32.381,l:1,f:493.88},{t:33.014,l:2,f:783.99},{t:33.648,l:0,f:392.0}]
  },
  {
    id:3,name:'Dance Tonight',icon:'💃',bpm:130,duration:35,
    diff:{easy:2,normal:5,hard:8},
    mp3:'music/Dance_tonight_-_Lollita__2_.mp3',
    rawNotes:[{t:2.077,l:2,f:783.99},{t:2.538,l:0,f:261.63},{t:2.769,l:1,f:587.33},{t:3.0,l:0,f:329.63},{t:3.231,l:0,f:349.23},{t:3.462,l:0,f:293.66},{t:3.692,l:0,f:392.0},{t:3.923,l:1,f:392.0},{t:4.154,l:0,f:392.0},{t:4.385,l:1,f:493.88},{t:6.462,l:0,f:329.63},{t:6.808,l:1,f:392.0},{t:7.385,l:2,f:698.46},{t:7.731,l:0,f:349.23},{t:8.308,l:1,f:392.0},{t:8.538,l:0,f:261.63},{t:8.769,l:1,f:587.33},{t:9.0,l:2,f:587.33},{t:9.231,l:0,f:261.63},{t:9.462,l:2,f:587.33},{t:9.692,l:0,f:293.66},{t:9.845,l:1,f:392.0},{t:10.458,l:2,f:659.25},{t:12.923,l:2,f:587.33},{t:13.154,l:0,f:293.66},{t:13.385,l:1,f:440.0},{t:13.615,l:2,f:698.46},{t:13.846,l:1,f:493.88},{t:14.077,l:2,f:587.33},{t:14.308,l:0,f:329.63},{t:14.538,l:0,f:329.63},{t:15.0,l:1,f:392.0},{t:15.462,l:2,f:587.33},{t:15.923,l:0,f:349.23},{t:16.385,l:0,f:261.63},{t:16.615,l:2,f:659.25},{t:16.962,l:0,f:349.23},{t:17.538,l:1,f:493.88},{t:17.885,l:0,f:329.63},{t:20.308,l:1,f:523.25},{t:20.769,l:1,f:587.33},{t:21.231,l:2,f:659.25},{t:21.692,l:1,f:523.25},{t:22.154,l:2,f:587.33},{t:22.768,l:1,f:523.25},{t:23.308,l:0,f:261.63},{t:23.769,l:1,f:587.33},{t:24.231,l:0,f:293.66},{t:24.692,l:1,f:493.88},{t:26.769,l:2,f:698.46},{t:27.231,l:2,f:783.99},{t:27.692,l:1,f:587.33},{t:28.154,l:1,f:493.88},{t:28.615,l:0,f:261.63},{t:29.077,l:2,f:587.33},{t:29.538,l:1,f:587.33},{t:30.0,l:2,f:587.33},{t:30.692,l:0,f:349.23},{t:31.154,l:1,f:523.25},{t:31.615,l:0,f:392.0},{t:32.077,l:2,f:698.46}]
  },
  {
    id:4,name:'What Do You Know',icon:'🎵',bpm:120,duration:35,
    diff:{easy:2,normal:5,hard:8},
    mp3:'music/What_Do_You_Know_-_Explosive_Ear_Candy.mp3',
    rawNotes:[{t:2.0,l:0,f:392.0},{t:2.25,l:1,f:392.0},{t:2.5,l:0,f:349.23},{t:2.75,l:2,f:698.46},{t:3.0,l:1,f:440.0},{t:3.25,l:0,f:329.63},{t:3.5,l:0,f:293.66},{t:3.665,l:1,f:392.0},{t:4.33,l:0,f:349.23},{t:5.25,l:2,f:523.25},{t:5.75,l:1,f:523.25},{t:6.25,l:2,f:659.25},{t:6.75,l:1,f:440.0},{t:7.0,l:2,f:523.25},{t:7.375,l:1,f:392.0},{t:8.0,l:0,f:392.0},{t:8.375,l:2,f:783.99},{t:9.0,l:1,f:440.0},{t:9.375,l:2,f:698.46},{t:10.0,l:2,f:698.46},{t:10.375,l:0,f:349.23},{t:13.0,l:2,f:523.25},{t:13.375,l:2,f:698.46},{t:14.0,l:0,f:293.66},{t:14.25,l:0,f:392.0},{t:14.375,l:2,f:587.33},{t:14.75,l:0,f:261.63},{t:15.25,l:1,f:392.0},{t:15.75,l:0,f:349.23},{t:16.0,l:2,f:783.99},{t:16.665,l:0,f:293.66},{t:17.0,l:0,f:329.63},{t:17.33,l:2,f:783.99},{t:17.5,l:2,f:659.25},{t:18.0,l:1,f:392.0},{t:18.5,l:0,f:293.66},{t:19.0,l:2,f:587.33},{t:19.5,l:1,f:440.0},{t:20.0,l:2,f:659.25},{t:20.5,l:0,f:293.66},{t:23.0,l:0,f:293.66},{t:23.5,l:2,f:659.25},{t:24.0,l:0,f:329.63},{t:24.5,l:2,f:783.99},{t:25.0,l:0,f:349.23},{t:25.665,l:2,f:587.33},{t:26.33,l:0,f:293.66},{t:27.0,l:1,f:523.25},{t:27.665,l:2,f:659.25},{t:28.33,l:0,f:329.63},{t:29.25,l:2,f:523.25},{t:29.75,l:1,f:392.0},{t:30.0,l:0,f:349.23},{t:30.25,l:0,f:392.0},{t:30.375,l:1,f:440.0},{t:30.75,l:2,f:659.25},{t:31.0,l:0,f:392.0},{t:31.375,l:2,f:659.25},{t:32.25,l:0,f:329.63},{t:32.75,l:1,f:523.25},{t:33.25,l:0,f:349.23},{t:33.75,l:1,f:587.33}]
  },
  {
    id:5,name:'My Fav Escape',icon:'🎶',bpm:124,duration:35,
    diff:{easy:2,normal:4,hard:7},
    mp3:'music/My_Favorite_Escape_-_Explosive_Ear_Candy.mp3',
    rawNotes:[{t:1.935,l:0,f:293.66},{t:2.298,l:1,f:493.88},{t:2.903,l:2,f:523.25},{t:3.266,l:0,f:392.0},{t:5.806,l:0,f:349.23},{t:6.169,l:1,f:523.25},{t:6.774,l:2,f:783.99},{t:7.137,l:0,f:293.66},{t:7.418,l:1,f:493.88},{t:8.061,l:2,f:587.33},{t:8.71,l:2,f:523.25},{t:9.073,l:1,f:440.0},{t:9.677,l:2,f:659.25},{t:10.04,l:2,f:587.33},{t:10.645,l:2,f:659.25},{t:10.887,l:1,f:587.33},{t:11.129,l:2,f:698.46},{t:11.371,l:1,f:392.0},{t:11.613,l:2,f:659.25},{t:11.855,l:1,f:493.88},{t:12.097,l:0,f:329.63},{t:12.339,l:2,f:698.46},{t:14.758,l:1,f:493.88},{t:15.242,l:2,f:783.99},{t:15.726,l:1,f:440.0},{t:16.21,l:2,f:587.33},{t:16.452,l:0,f:392.0},{t:17.095,l:0,f:392.0},{t:17.739,l:1,f:523.25},{t:20.323,l:1,f:440.0},{t:20.565,l:0,f:329.63},{t:20.806,l:2,f:587.33},{t:21.048,l:0,f:349.23},{t:21.29,l:1,f:493.88},{t:21.532,l:2,f:783.99},{t:21.774,l:2,f:523.25},{t:22.016,l:0,f:392.0},{t:22.5,l:2,f:783.99},{t:22.984,l:1,f:493.88},{t:23.468,l:1,f:493.88},{t:23.952,l:2,f:587.33},{t:24.194,l:0,f:392.0},{t:24.556,l:0,f:293.66},{t:25.161,l:2,f:523.25},{t:25.524,l:1,f:523.25},{t:26.129,l:2,f:659.25},{t:26.613,l:2,f:523.25},{t:27.097,l:1,f:523.25},{t:27.581,l:2,f:698.46},{t:30.242,l:1,f:392.0},{t:30.726,l:0,f:261.63},{t:31.21,l:0,f:261.63},{t:31.694,l:2,f:587.33},{t:31.935,l:2,f:783.99},{t:32.579,l:0,f:392.0},{t:33.223,l:2,f:659.25},{t:33.871,l:1,f:587.33},{t:34.113,l:1,f:493.88},{t:34.355,l:2,f:587.33}]
  }
];
// ===== AUDIO ENGINE =====
const AudioEngine = (() => {
  let ctx = null, master = null, bgNodes = [];
  let musicAudio = null;  // <audio> element for MP3

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.75;
    master.connect(ctx.destination);
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function now() { return ctx ? ctx.currentTime : 0; }

  // ── MP3 playback ──
  function loadAndPlayMP3(mp3path, startDelay) {
    stopMP3();
    const audio = new Audio(mp3path);
    audio.volume = 0.85;
    audio.preload = 'auto';
    musicAudio = audio;

    // Play after startDelay
    setTimeout(() => {
      audio.play().catch(e => console.log('Audio play failed:', e));
    }, startDelay * 1000);

    return audio;
  }

  function stopMP3() {
    if (musicAudio) {
      musicAudio.pause();
      musicAudio.currentTime = 0;
      musicAudio = null;
    }
  }

  function pauseMP3() { if (musicAudio) musicAudio.pause(); }
  function resumeMP3() { if (musicAudio) musicAudio.play().catch(()=>{}); }

  // ── Sound effects (Web Audio) ──
  function osc(type, f, t, dur, vol) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = f;
    o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
    bgNodes.push(o, g);
  }

  function noiseN(t, dur, vol, hpf, lpf) {
    if (!ctx) return;
    const len = Math.ceil(ctx.sampleRate * Math.max(dur, 0.02));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = hpf || 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = lpf || 20000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.02);
    bgNodes.push(src, g, hp, lp);
  }

  // Hit sound - bright synth blip matching the lane color
  function hitNote(f, lane) {
    if (!ctx) return; resume();
    const t = ctx.currentTime;
    const colors = [
      { type: 'sine',     vol: 0.35 },  // lane 0 - cyan - clean sine
      { type: 'triangle', vol: 0.32 },  // lane 1 - yellow - warm triangle
      { type: 'sine',     vol: 0.35 },  // lane 2 - magenta - sine
    ];
    const c = colors[lane] || colors[0];
    osc(c.type, f, t, 0.25, c.vol);
    osc('sine', f * 2, t, 0.12, c.vol * 0.3);
    // Tiny attack click
    noiseN(t, 0.02, 0.08, 2000, 8000);
  }

  function hitMiss() {
    if (!ctx) return; resume();
    noiseN(ctx.currentTime, 0.08, 0.06, 0, 800);
  }

  function stopAll() {
    stopMP3();
    bgNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e) {} });
    bgNodes = [];
  }

  return { init, resume, now, loadAndPlayMP3, stopMP3, pauseMP3, resumeMP3, hitNote, hitMiss, stopAll };
})();

// ===== DIFFICULTY FILTER =====
function filterChart(rawNotes, difficulty) {
  if (difficulty === 'hard') return rawNotes;
  const byLane = [[], [], []];
  rawNotes.forEach(n => byLane[n.l].push(n));
  const result = [];
  byLane.forEach((ln, li) => {
    const step = difficulty === 'easy' ? (li === 2 ? 2 : 3) : 2;
    ln.forEach((n, i) => { if (i % step === 0) result.push(n); });
  });
  result.sort((a, b) => a.t - b.t);
  const clean = []; let lastT = -999;
  result.forEach(n => { if (n.t - lastT >= 0.10) { clean.push(n); lastT = n.t; } });
  return clean;
}

// ===== GAME ENGINE =====
const Game = (() => {
  let currentSong = null, currentDiff = 'easy';
  let chart = [], noteElements = {};
  let score = 0, combo = 0, maxCombo = 0, health = 100;
  let perfect = 0, good = 0, miss = 0;
  let gameRunning = false, gamePaused = false;
  let gameStartTime = 0, noteSpeed = 300;
  let judgeWindow = { perfect: 0.20, good: 0.35 };
  let animFrame = null, judgeTimer = null, playfieldH = 0;
  let pendingNotes = [], activeNotes = [], hitNotes = new Set();
  let totalNoteCount = 0, gaugeScore = 0;

  const GAUGE_PASS = 80;
  const KEY_MAP = { 'z': 0, 'x': 1, 'c': 2 };
  const keyState = { 0: false, 1: false, 2: false };

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  function showTitle() { AudioEngine.stopAll(); showScreen('screen-title'); }
  function showSongSelect() { AudioEngine.stopAll(); buildSongList(); showScreen('screen-select'); }

  function buildSongList() {
    const list = document.getElementById('song-list');
    list.innerHTML = '';
    SONGS.forEach(song => {
      const stars = song.diff[currentDiff];
      const card = document.createElement('div');
      card.className = 'song-card genre-club';
      card.innerHTML = `
        <div class="song-icon">${song.icon}</div>
        <div class="song-info">
          <div class="song-name">${song.name}</div>
          <div class="song-meta">BPM ${song.bpm}</div>
        </div>
        <div>
          <div class="song-bpm">${song.duration}s</div>
          <div class="song-diff-stars ${currentDiff}">${'★'.repeat(stars)+'☆'.repeat(10-stars).substring(0,8)}</div>
        </div>`;
      card.addEventListener('click', () => startGame(song));
      card.addEventListener('touchend', e => { e.preventDefault(); startGame(song); });
      list.appendChild(card);
    });
  }

  function setDifficulty(diff) {
    currentDiff = diff;
    document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
    document.querySelector(`.diff-btn[data-diff="${diff}"]`).classList.add('active');
    buildSongList();
  }

  function startGame(song) {
    AudioEngine.init();
    currentSong = song;

    const filtered = filterChart(song.rawNotes, currentDiff);
    chart = filtered.map(n => ({ time: n.t, lane: n.l, freq: n.f }));
    totalNoteCount = chart.length;
    pendingNotes = [...chart].sort((a, b) => a.time - b.time);
    activeNotes = []; hitNotes = new Set();
    score = 0; combo = 0; maxCombo = 0; health = 100;
    perfect = 0; good = 0; miss = 0; gaugeScore = 0;

    document.getElementById('ui-song-name').textContent = song.name;
    const diffEl = document.getElementById('ui-difficulty');
    diffEl.textContent = currentDiff.toUpperCase();
    diffEl.className = `diff-label ${currentDiff}`;
    document.getElementById('ui-score').textContent = '0';
    document.getElementById('ui-combo').textContent = '';
    document.getElementById('health-bar').style.width = '100%';
    document.getElementById('progress-bar').style.width = '0%';
    document.getElementById('notes-container').innerHTML = '';
    document.getElementById('hit-effects').innerHTML = '';
    noteElements = {}; updateGauge();

    noteSpeed = { easy: 200, normal: 310, hard: 440 }[currentDiff];
    judgeWindow = {
      easy:   { perfect: 0.22, good: 0.38 },
      normal: { perfect: 0.12, good: 0.22 },
      hard:   { perfect: 0.07, good: 0.13 }
    }[currentDiff];

    showScreen('screen-game');
    playfieldH = document.getElementById('playfield').clientHeight;
    gameRunning = true; gamePaused = false;

    const startDelay = 0.5;
    gameStartTime = AudioEngine.now() + startDelay;

    // 🎵 MP3再生！
    AudioEngine.loadAndPlayMP3(song.mp3, startDelay);

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) { animFrame = requestAnimationFrame(gameLoop); return; }

    const elapsed = AudioEngine.now() - gameStartTime;
    const spawnAhead = playfieldH / noteSpeed + 0.3;

    while (pendingNotes.length > 0 && pendingNotes[0].time - elapsed < spawnAhead)
      spawnNote(pendingNotes.shift());

    updateNotes(elapsed);
    checkMisses(elapsed);

    document.getElementById('progress-bar').style.width =
      (Math.max(0, Math.min(elapsed / currentSong.duration, 1)) * 100) + '%';

    if (elapsed >= currentSong.duration + 2 && pendingNotes.length === 0 && activeNotes.length === 0) {
      endGame(); return;
    }
    animFrame = requestAnimationFrame(gameLoop);
  }

  function spawnNote(note) {
    const el = document.createElement('div');
    el.className = 'note'; el.dataset.lane = note.lane;
    const id = note.time.toFixed(4) + '_' + note.lane + '_' + Math.random().toString(36).slice(2, 5);
    el.dataset.id = id;
    const ll = [0, 33.33, 66.66];
    el.style.left = ll[note.lane] + '%';
    el.style.width = (note.lane === 2 ? 33.34 : 33.33) + '%';
    el.style.top = '-34px';
    document.getElementById('notes-container').appendChild(el);
    noteElements[id] = el;
    activeNotes.push({ ...note, elId: id });
  }

  function updateNotes(elapsed) {
    activeNotes.forEach(note => {
      const el = noteElements[note.elId]; if (!el) return;
      el.style.top = (playfieldH - (note.time - elapsed) * noteSpeed - 32) + 'px';
    });
  }

  function checkMisses(elapsed) {
    const toRemove = [];
    activeNotes.forEach(note => {
      if (hitNotes.has(note.elId)) { toRemove.push(note.elId); return; }
      if (note.time - elapsed < -judgeWindow.good) {
        registerJudge('miss', note.lane, note.elId, note);
        toRemove.push(note.elId);
      }
    });
    toRemove.forEach(id => removeNote(id));
  }

  function removeNote(id) {
    activeNotes = activeNotes.filter(n => n.elId !== id);
    const el = noteElements[id];
    if (el) { el.remove(); delete noteElements[id]; }
  }

  function onKeyDown(e) {
    if (!gameRunning || gamePaused || e.repeat) return;
    const lane = KEY_MAP[e.key.toLowerCase()];
    if (lane === undefined || keyState[lane]) return;
    keyState[lane] = true; pressLane(lane);
    document.getElementById(`btn-${lane}`).classList.add('pressed');
  }
  function onKeyUp(e) {
    const lane = KEY_MAP[e.key.toLowerCase()]; if (lane === undefined) return;
    keyState[lane] = false;
    document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
  }
  function onTouch(lane, down) {
    AudioEngine.resume();
    if (down) {
      if (!gameRunning || gamePaused) return;
      pressLane(lane);
      document.getElementById(`btn-${lane}`).classList.add('pressed');
    } else {
      document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
    }
  }

  function pressLane(lane) {
    const elapsed = AudioEngine.now() - gameStartTime;
    let best = null, bd = Infinity;
    activeNotes.forEach(note => {
      if (note.lane !== lane || hitNotes.has(note.elId)) return;
      const d = Math.abs(note.time - elapsed);
      if (d < bd) { bd = d; best = note; }
    });
    if (!best) {
      AudioEngine.hitNote([261.63, 392, 523.25][lane], lane);
      return;
    }
    if (bd <= judgeWindow.perfect) {
      registerJudge('perfect', lane, best.elId, best);
      hitNotes.add(best.elId); removeNote(best.elId);
    } else if (bd <= judgeWindow.good) {
      registerJudge('good', lane, best.elId, best);
      hitNotes.add(best.elId); removeNote(best.elId);
    }
  }

  function registerJudge(type, lane, noteId, note) {
    if (type !== 'miss') AudioEngine.hitNote(note.freq, lane);
    else AudioEngine.hitMiss();

    if (type === 'perfect') {
      score += 300 + combo * 2; combo++; if (combo > maxCombo) maxCombo = combo;
      health = Math.min(100, health + 1.5); perfect++;
      gaugeScore = Math.min(100, gaugeScore + (100 / totalNoteCount) * 1.5);
    } else if (type === 'good') {
      score += 100 + combo; combo++; if (combo > maxCombo) maxCombo = combo;
      good++; gaugeScore = Math.min(100, gaugeScore + (100 / totalNoteCount) * 0.8);
    } else {
      combo = 0; health = Math.max(0, health - 6); miss++;
      gaugeScore = Math.max(0, gaugeScore - (100 / totalNoteCount) * 0.4);
    }

    document.getElementById('ui-score').textContent = score.toLocaleString();
    document.getElementById('ui-combo').textContent = combo > 1 ? combo : '';

    const hb = document.getElementById('health-bar');
    hb.style.width = health + '%';
    hb.style.background = health > 50
      ? 'linear-gradient(90deg,var(--accent4),var(--accent1))'
      : health > 25 ? 'linear-gradient(90deg,var(--accent2),var(--accent5))'
      : 'linear-gradient(90deg,#ff3333,var(--accent3))';

    updateGauge(); showJudge(type, combo); showHitEffect(type, lane);
    if (health <= 0) endGame();
  }

  function updateGauge() {
    const fill = document.getElementById('gauge-fill'), label = document.getElementById('gauge-label');
    if (!fill) return;
    const pct = Math.round(gaugeScore);
    fill.style.width = pct + '%';
    const pass = pct >= GAUGE_PASS;
    fill.className = 'gauge-fill ' + (pass ? 'pass' : 'warn');
    if (label) label.textContent = pct + '%' + (pass ? ' ✓' : '');
  }

  function showJudge(type, combo) {
    if (judgeTimer) clearTimeout(judgeTimer);
    const el = document.getElementById('judge-display');
    const text = { perfect: 'PERFECT', good: 'GOOD', miss: 'MISS' }[type];
    el.innerHTML = `<div class="judge-${type}">${text}${combo > 1 ? `<div class="judge-combo">${combo} COMBO</div>` : ''}</div>`;
    judgeTimer = setTimeout(() => { el.innerHTML = ''; }, 420);
  }

  function showHitEffect(type, lane) {
    const c = document.getElementById('hit-effects'), el = document.createElement('div');
    el.className = `hit-effect ${type}`; el.dataset.lane = lane;
    c.appendChild(el); setTimeout(() => el.remove(), 350);
  }

  function pause() {
    if (!gameRunning) return;
    gamePaused = true;
    AudioEngine.pauseMP3();
    document.getElementById('screen-pause').classList.add('active');
  }
  function resume() {
    gamePaused = false;
    AudioEngine.resumeMP3();
    document.getElementById('screen-pause').classList.remove('active');
  }
  function quit() { endGame(); }

  function endGame() {
    gameRunning = false;
    if (animFrame) cancelAnimationFrame(animFrame);
    AudioEngine.stopAll();

    const acc = totalNoteCount > 0 ? (perfect * 300 + good * 100) / (totalNoteCount * 300) : 0;
    const passed = gaugeScore >= GAUGE_PASS;
    let rank = 'F';
    if (acc >= 0.95) rank = 'S'; else if (acc >= 0.85) rank = 'A';
    else if (acc >= 0.70) rank = 'B'; else if (acc >= 0.55) rank = 'C';

    document.getElementById('result-rank').textContent = rank;
    document.getElementById('result-rank').className = `result-rank rank-${rank.toLowerCase()}`;
    document.getElementById('result-song-name').textContent = currentSong.name;
    document.getElementById('res-score').textContent = score.toLocaleString();
    document.getElementById('res-combo').textContent = maxCombo;
    document.getElementById('res-perfect').textContent = perfect;
    document.getElementById('res-good').textContent = good;
    document.getElementById('res-miss').textContent = miss;
    const rg = document.getElementById('res-gauge'), rc = document.getElementById('res-clear');
    if (rg) rg.textContent = Math.round(gaugeScore) + '%';
    if (rc) { rc.textContent = passed ? '✓ CLEAR' : '✗ FAILED'; rc.style.color = passed ? 'var(--accent4)' : '#ff3333'; }

    document.getElementById('screen-pause').classList.remove('active');
    showScreen('screen-result');
  }

  function retry() { startGame(currentSong); }

  function init() {
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('keyup', onKeyUp);
    document.addEventListener('touchstart', () => AudioEngine.init(), { once: true });
    showScreen('screen-title');
  }

  return { showTitle, showSongSelect, setDifficulty, startGame, pause, resume, quit, retry, onTouch, init };
})();

window.addEventListener('load', () => Game.init());
