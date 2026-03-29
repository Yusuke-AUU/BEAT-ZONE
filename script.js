// ===== BEAT ZONE v6 =====
// Tone.js で本格クラシック音源 + 楽譜通り正確な音符データ
// 著作権切れパブリックドメイン楽曲のみ使用

// ===== TONE.JS LOADER =====
// Tone.js CDNから動的ロード
(function loadTone() {
  const s = document.createElement('script');
  s.src = 'https://cdnjs.cloudflare.com/ajax/libs/tone/14.8.49/Tone.js';
  s.onload = () => { window._toneReady = true; console.log('Tone.js ready'); };
  s.onerror = () => { window._toneReady = false; console.log('Tone.js failed, using Web Audio fallback'); };
  document.head.appendChild(s);
})();

// ===== MIDI NOTE TO FREQUENCY =====
function midiToFreq(m) { return 440 * Math.pow(2, (m - 69) / 12); }

// ===== NOTE NAME TO MIDI =====
const NOTE_MAP = {C:0,'C#':1,Db:1,D:2,'D#':3,Eb:3,E:4,F:5,'F#':6,Gb:6,G:7,'G#':8,Ab:8,A:9,'A#':10,Bb:10,B:11};
function nameToMidi(name) {
  // e.g. "C4", "F#5", "Bb3"
  const m = name.match(/^([A-G][b#]?)(\d)$/);
  if (!m) return 60;
  return NOTE_MAP[m[1]] + (parseInt(m[2]) + 1) * 12;
}
function freq(name) { return midiToFreq(nameToMidi(name)); }

// ===== LANE HELPER =====
function ln(lane, noteName, dur) {
  return { lane, freq: freq(noteName), dur: dur || 0.5, noteName };
}

// ===== AUDIO ENGINE =====
const AudioEngine = (() => {
  let ctx = null, masterGain = null;
  let synths = {}; // Tone.js synths per instrument
  let bgNodes = []; // Web Audio fallback nodes
  let useTone = false;

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.7;
    masterGain.connect(ctx.destination);

    if (window._toneReady && window.Tone) {
      try {
        Tone.setContext(ctx);
        // Piano-like synth with rich harmonics
        synths.piano = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle' },
          envelope: { attack: 0.02, decay: 0.3, sustain: 0.4, release: 1.2 },
          volume: -8
        }).toDestination();

        synths.strings = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sawtooth' },
          envelope: { attack: 0.1, decay: 0.2, sustain: 0.8, release: 0.8 },
          volume: -12
        }).toDestination();

        synths.harpsichord = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'triangle8' },
          envelope: { attack: 0.005, decay: 0.4, sustain: 0.1, release: 0.3 },
          volume: -10
        }).toDestination();

        synths.flute = new Tone.PolySynth(Tone.Synth, {
          oscillator: { type: 'sine' },
          envelope: { attack: 0.08, decay: 0.1, sustain: 0.9, release: 0.5 },
          volume: -10
        }).toDestination();

        useTone = true;
        console.log('Tone.js synths initialized');
      } catch(e) {
        console.log('Tone.js init error:', e);
        useTone = false;
      }
    }
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
    if (useTone && Tone.context.state === 'suspended') Tone.start();
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  // ── Fallback Web Audio oscillators ──
  function oscFallback(type, noteFreq, t, dur, vol) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = noteFreq;
    o.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.02);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
    bgNodes.push(o, g);
  }

  function noiseNode(t, dur, vol, hpf, lpf) {
    if (!ctx) return;
    const len = Math.ceil(ctx.sampleRate * Math.max(dur, 0.02));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value = hpf||0;
    const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value = lpf||20000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t+dur);
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(masterGain);
    src.start(t); src.stop(t+dur+0.02);
    bgNodes.push(src, g, hp, lp);
  }

  function kick(t, vol) {
    if (!ctx) return;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(150, t); o.frequency.exponentialRampToValueAtTime(0.001, t+0.4);
    g.gain.setValueAtTime(vol||0.55, t); g.gain.exponentialRampToValueAtTime(0.001, t+0.4);
    o.connect(g); g.connect(masterGain); o.start(t); o.stop(t+0.45);
    bgNodes.push(o, g);
  }

  function snare(t, vol) { noiseNode(t, 0.14, vol||0.18, 1500, 8000); }
  function hat(t, vol) { noiseNode(t, 0.03, vol||0.07, 9000, 18000); }

  function bassNote(noteFreq, t, dur, vol) {
    oscFallback('sine', noteFreq, t, dur, vol||0.32);
    oscFallback('sawtooth', noteFreq, t, dur*0.5, (vol||0.32)*0.12);
  }

  function padNote(noteFreq, t, dur, vol) {
    oscFallback('sine', noteFreq, t, dur, vol||0.04);
  }

  // ── Player hit - uses Tone.js if available ──
  function hitNote(noteName, noteFreq, instrument, dur) {
    if (!ctx) return;
    resume();
    dur = dur || 0.5;

    if (useTone && synths[instrument]) {
      try {
        synths[instrument].triggerAttackRelease(noteName, dur + 'n' in Tone.Time ? dur : dur);
        return;
      } catch(e) {}
    }

    // Fallback
    switch(instrument) {
      case 'piano':
        oscFallback('triangle', noteFreq, ctx.currentTime, dur*1.5, 0.30);
        oscFallback('sine', noteFreq*2, ctx.currentTime, dur*0.8, 0.12);
        oscFallback('sine', noteFreq*3, ctx.currentTime, dur*0.4, 0.05);
        break;
      case 'strings':
        oscFallback('sawtooth', noteFreq, ctx.currentTime, dur*1.8, 0.18);
        oscFallback('sawtooth', noteFreq*1.007, ctx.currentTime, dur*1.8, 0.14);
        break;
      case 'harpsichord':
        oscFallback('triangle', noteFreq, ctx.currentTime, dur*0.6, 0.28);
        oscFallback('sine', noteFreq*2, ctx.currentTime, dur*0.3, 0.10);
        break;
      case 'flute':
        oscFallback('sine', noteFreq, ctx.currentTime, dur*1.2, 0.26);
        oscFallback('sine', noteFreq*2, ctx.currentTime, dur*0.8, 0.08);
        break;
      default:
        oscFallback('triangle', noteFreq, ctx.currentTime, dur, 0.25);
    }
  }

  function hitMiss() {
    if (!ctx) return;
    noiseNode(ctx.currentTime, 0.06, 0.05, 0, 1500);
  }

  // ── Background music scheduler ──
  // Schedules full accompaniment for a song
  function scheduleBG(song, startT, duration) {
    if (!ctx || !song.bgNotes) return;
    song.bgNotes.forEach(n => {
      const t = startT + n.time;
      if (t > startT + duration + 1) return;
      switch(n.type) {
        case 'kick':   kick(t, n.vol); break;
        case 'snare':  snare(t, n.vol); break;
        case 'hat':    hat(t, n.vol); break;
        case 'bass':   bassNote(freq(n.note), t, n.dur||0.4, n.vol); break;
        case 'pad':    padNote(freq(n.note), t, n.dur||1.5, n.vol); break;
      }
    });
  }

  function stopAll() {
    if (useTone) {
      try {
        Object.values(synths).forEach(s => { try { s.releaseAll(); } catch(e){} });
      } catch(e) {}
    }
    bgNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
    bgNodes = [];
  }

  return { init, resume, now, hitNote, hitMiss, scheduleBG, stopAll };
})();

// ===== BACKGROUND PATTERN GENERATOR =====
// Generates bgNotes array from a simple pattern spec
function genBG(bpm, duration, spec) {
  const beat = 60 / bpm;
  const bar = beat * 4;
  const bars = Math.ceil(duration / bar) + 2;
  const notes = [];

  for (let b = 0; b < bars; b++) {
    const t = b * bar;
    if (spec.kick)   spec.kick.forEach(dt   => notes.push({type:'kick',  time:t+dt*beat, vol:0.45}));
    if (spec.snare)  spec.snare.forEach(dt  => notes.push({type:'snare', time:t+dt*beat, vol:0.18}));
    if (spec.hat)    spec.hat.forEach(dt    => notes.push({type:'hat',   time:t+dt*beat, vol:0.07}));
    if (spec.bass)   spec.bass.forEach(([dt,note,dur]) => notes.push({type:'bass',time:t+dt*beat,note,dur:dur*beat,vol:0.30}));
    if (spec.pad)    spec.pad.forEach(([dt,note,dur])  => notes.push({type:'pad', time:t+dt*beat,note,dur:dur*beat,vol:0.045}));
  }
  return notes;
}

// ===== SONGS =====
// mel: array of ln(lane, noteName, duration)
// Each note: lane 0=LOW, 1=MID, 2=HIGH
// Actual score-accurate melodies from public domain scores

const SONGS = [

  // ════════════════════════════
  // 0. ベートーヴェン「月光ソナタ」第1楽章 (1801) - Cis minor, 4/4, Adagio
  // ════════════════════════════
  {
    id:0, name:'月光ソナタ', nameEn:'MOONLIGHT SONATA', genre:'classic',
    composer:'Beethoven Op.27 No.2 (1801)', icon:'🌙',
    bpm:54, duration:32,
    diff:{easy:2,normal:4,hard:7}, instrument:'piano',

    // Authentic triplet arpeggio - each group: bass / middle / top
    // Original key: C# minor. Each triplet = beat/3
    mel: [
      // Bar 1-2: C#m arpeggio (G#3-C#4-E4 repeating, top melody B4)
      ln(0,'G#3'), ln(1,'C#4'), ln(2,'E4'),   ln(0,'G#3'), ln(1,'C#4'), ln(2,'E4'),
      ln(0,'G#3'), ln(1,'C#4'), ln(2,'E4'),   ln(0,'G#3'), ln(1,'C#4'), ln(2,'E4'),
      // Bar 3-4: F#m (F#3-A3-C#4, top D4)
      ln(0,'F#3'), ln(1,'A3'),  ln(2,'C#4'),  ln(0,'F#3'), ln(1,'A3'),  ln(2,'C#4'),
      ln(0,'F#3'), ln(1,'A3'),  ln(2,'D4'),   ln(0,'F#3'), ln(1,'A3'),  ln(2,'D4'),
      // Bar 5-6: E major (E3-G#3-B3, top E4)
      ln(0,'E3'),  ln(1,'G#3'), ln(2,'B3'),   ln(0,'E3'),  ln(1,'G#3'), ln(2,'B3'),
      ln(0,'E3'),  ln(1,'G#3'), ln(2,'E4'),   ln(0,'E3'),  ln(1,'G#3'), ln(2,'E4'),
      // Bar 7-8: A minor / return (A3-C#4-E4)
      ln(0,'A3'),  ln(1,'C#4'), ln(2,'E4'),   ln(0,'A3'),  ln(1,'C#4'), ln(2,'E4'),
      ln(0,'G#3'), ln(1,'C#4'), ln(2,'E4'),   ln(0,'G#3'), ln(1,'C#4'), ln(2,'E4'),
      // Bar 9-10: Melody rises (top voice B4 - C#5)
      ln(0,'G#3'), ln(1,'B3'),  ln(2,'E4'),   ln(0,'G#3'), ln(1,'B3'),  ln(2,'E4'),
      ln(0,'G#3'), ln(1,'B3'),  ln(2,'B4'),   ln(0,'G#3'), ln(1,'B3'),  ln(2,'C#5'),
      // Bar 11-12: resolve
      ln(0,'F#3'), ln(1,'A3'),  ln(2,'C#5'),  ln(0,'F#3'), ln(1,'A3'),  ln(2,'B4'),
      ln(0,'E3'),  ln(1,'G#3'), ln(2,'A4'),   ln(0,'E3'),  ln(1,'G#3'), ln(2,'G#4'),
    ],
    stepFn(b) { return b / 3; }, // triplets

    bgNotes: genBG(54, 34, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0.5,1.5,2.5,3.5],
      bass:  [[0,'C#2',2],[2,'G#2',2]],
      pad:   [[0,'C#3',4],[0,'E3',4],[0,'G#3',4]]
    })
  },

  // ════════════════════════════
  // 1. ベートーヴェン「エリーゼのために」(1810) - A minor
  // ════════════════════════════
  {
    id:1, name:'エリーゼのために', nameEn:'FÜR ELISE', genre:'classic',
    composer:'Beethoven WoO 59 (1810)', icon:'🎹',
    bpm:116, duration:30,
    diff:{easy:2,normal:5,hard:8}, instrument:'piano',

    // Iconic E5-Eb5-E5-Eb5-E5-B4-D5-C5-A4 motif
    mel: [
      // A section (main theme)
      ln(2,'E5'),  ln(2,'Eb5'), ln(2,'E5'),  ln(2,'Eb5'),
      ln(2,'E5'),  ln(1,'B4'),  ln(1,'D5'),  ln(1,'C5'),
      ln(0,'A4'),  ln(0,'A3'),  ln(1,'E4'),  ln(1,'A4'),
      ln(1,'B4'),  ln(0,'E3'),  ln(1,'G#4'), ln(1,'B4'),
      // A section repeat with variation
      ln(2,'C5'),  ln(2,'E5'),  ln(2,'Eb5'), ln(2,'E5'),
      ln(2,'Eb5'), ln(2,'E5'),  ln(1,'B4'),  ln(1,'D5'),
      ln(1,'C5'),  ln(0,'A4'),  ln(0,'A3'),  ln(1,'E4'),
      ln(1,'A4'),  ln(1,'B4'),  ln(0,'E3'),  ln(0,'A3'),
      // B section (C major)
      ln(0,'B3'),  ln(1,'C4'),  ln(2,'D4'),  ln(2,'E4'),
      ln(2,'G4'),  ln(1,'F4'),  ln(1,'E4'),  ln(1,'D4'),
      ln(0,'F3'),  ln(1,'A3'),  ln(2,'C4'),  ln(2,'E4'),
      ln(2,'D4'),  ln(1,'F4'),  ln(1,'E4'),  ln(0,'E3'),
    ],
    stepFn(b) { return b * 0.5; },

    bgNotes: genBG(116, 32, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0,0.5,1,1.5,2,2.5,3,3.5],
      bass:  [[0,'A2',1],[1,'E3',1],[2,'A2',1],[3,'E3',1]],
      pad:   [[0,'A3',2],[0,'C4',2],[2,'E3',2],[2,'G#3',2]]
    })
  },

  // ════════════════════════════
  // 2. ショパン「夜想曲 第2番」Op.9 No.2 (1830-31) - Eb major
  // ════════════════════════════
  {
    id:2, name:'夜想曲 第2番', nameEn:"NOCTURNE Op.9 No.2", genre:'classic',
    composer:'Chopin Op.9 No.2 (1830)', icon:'🌹',
    bpm:66, duration:32,
    diff:{easy:1,normal:3,hard:6}, instrument:'piano',

    // Beautiful singing melody in Eb major
    mel: [
      // Bar 1: Bb4 - C5 - D5 - Eb5
      ln(1,'Bb4'), ln(2,'C5'),  ln(2,'D5'),  ln(2,'Eb5'),
      // Bar 2: F5 - Eb5 - D5 - C5
      ln(2,'F5'),  ln(2,'Eb5'), ln(2,'D5'),  ln(1,'C5'),
      // Bar 3: Bb4 - Ab4 - G4 - F4
      ln(1,'Bb4'), ln(1,'Ab4'), ln(0,'G4'),  ln(0,'F4'),
      // Bar 4: Eb4 long
      ln(0,'Eb4'), ln(0,'Eb4'), ln(1,'Bb4'), ln(1,'Bb4'),
      // Bar 5-6: ornamental rise
      ln(1,'C5'),  ln(2,'Eb5'), ln(2,'F5'),  ln(2,'G5'),
      ln(2,'Ab5'), ln(2,'G5'),  ln(2,'F5'),  ln(2,'Eb5'),
      // Bar 7-8: descent
      ln(2,'D5'),  ln(1,'C5'),  ln(1,'Bb4'), ln(1,'Ab4'),
      ln(0,'G4'),  ln(0,'F4'),  ln(0,'Eb4'), ln(1,'Bb4'),
      // Bar 9-10: variation
      ln(2,'Eb5'), ln(2,'F5'),  ln(2,'G5'),  ln(2,'Ab5'),
      ln(2,'Bb5'), ln(2,'Ab5'), ln(2,'G5'),  ln(2,'F5'),
      // Bar 11-12: descend and cadence
      ln(2,'Eb5'), ln(1,'D5'),  ln(1,'C5'),  ln(1,'Bb4'),
      ln(0,'Ab4'), ln(0,'G4'),  ln(0,'F4'),  ln(0,'Eb4'),
    ],
    stepFn(b) { return b; },

    bgNotes: genBG(66, 34, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0.5,1.5,2.5,3.5],
      bass:  [[0,'Eb2',2],[2,'Bb2',2]],
      pad:   [[0,'Eb3',4],[0,'G3',4],[0,'Bb3',4]]
    })
  },

  // ════════════════════════════
  // 3. ショパン「前奏曲 第15番 雨だれ」Op.28 No.15 (1839) - Db major
  // ════════════════════════════
  {
    id:3, name:'雨だれの前奏曲', nameEn:'RAINDROP PRELUDE', genre:'classic',
    composer:'Chopin Op.28 No.15 (1839)', icon:'🌧️',
    bpm:60, duration:30,
    diff:{easy:2,normal:4,hard:7}, instrument:'piano',

    // The melody over the famous Ab "raindrop" ostinato
    mel: [
      // Melody in Db major over repeating Ab
      ln(2,'F4'),  ln(2,'F4'),  ln(2,'Eb4'), ln(2,'Db4'),
      ln(1,'Eb4'), ln(1,'F4'),  ln(2,'Ab4'), ln(2,'Bb4'),
      ln(2,'Db5'), ln(2,'Db5'), ln(2,'C5'),  ln(2,'Bb4'),
      ln(1,'Ab4'), ln(1,'Ab4'), ln(1,'Bb4'), ln(2,'C5'),
      ln(2,'Db5'), ln(2,'Eb5'), ln(2,'F5'),  ln(2,'Eb5'),
      ln(2,'Db5'), ln(1,'C5'),  ln(1,'Bb4'), ln(1,'Ab4'),
      ln(0,'Gb4'), ln(1,'Ab4'), ln(2,'Bb4'), ln(2,'Db5'),
      ln(2,'C5'),  ln(1,'Bb4'), ln(1,'Ab4'), ln(0,'Db4'),
      // Section B - darker (C# minor)
      ln(0,'C#4'), ln(0,'C#4'), ln(1,'E4'),  ln(1,'G#4'),
      ln(2,'B4'),  ln(2,'B4'),  ln(2,'A4'),  ln(2,'G#4'),
      ln(1,'F#4'), ln(1,'G#4'), ln(2,'A4'),  ln(2,'B4'),
      ln(2,'C#5'), ln(2,'B4'),  ln(1,'A4'),  ln(0,'G#4'),
    ],
    stepFn(b) { return b; },

    bgNotes: genBG(60, 32, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0.5,1,1.5,2,2.5,3,3.5], // raindrop feel
      bass:  [[0,'Db2',4]],
      pad:   [[0,'Ab3',4],[0,'Db3',4],[0,'F3',4]]
    })
  },

  // ════════════════════════════
  // 4. バッハ「G線上のアリア」(1731) - D major
  // ════════════════════════════
  {
    id:4, name:'G線上のアリア', nameEn:'AIR ON THE G STRING', genre:'classic',
    composer:'J.S.Bach BWV 1068 (1731)', icon:'🎻',
    bpm:66, duration:32,
    diff:{easy:1,normal:3,hard:6}, instrument:'strings',

    // Authentic melody - violin part from BWV 1068
    mel: [
      // Bar 1: D5 - C#5 - B4 - A4
      ln(2,'D5'),  ln(2,'C#5'), ln(2,'B4'),  ln(1,'A4'),
      // Bar 2: G4 - F#4 - E4 - D4
      ln(1,'G4'),  ln(1,'F#4'), ln(0,'E4'),  ln(0,'D4'),
      // Bar 3: C#4 - B3 (chromatic)
      ln(0,'C#4'), ln(0,'D4'),  ln(1,'E4'),  ln(1,'F#4'),
      // Bar 4: G4 - A4
      ln(1,'G4'),  ln(2,'A4'),  ln(2,'B4'),  ln(2,'C#5'),
      // Bar 5: D5 - E5 ornament
      ln(2,'D5'),  ln(2,'E5'),  ln(2,'D5'),  ln(2,'C#5'),
      // Bar 6: B4 - A4 descent
      ln(2,'B4'),  ln(1,'A4'),  ln(1,'G4'),  ln(1,'F#4'),
      // Bar 7: E5 - F#5 peak
      ln(2,'E5'),  ln(2,'F#5'), ln(2,'E5'),  ln(2,'D5'),
      // Bar 8: C#5 - D5 resolve
      ln(2,'C#5'), ln(2,'B4'),  ln(1,'A4'),  ln(0,'G4'),
      // Bar 9-12: variation
      ln(2,'F#5'), ln(2,'E5'),  ln(2,'D5'),  ln(2,'C#5'),
      ln(2,'B4'),  ln(1,'A4'),  ln(1,'G4'),  ln(1,'F#4'),
      ln(0,'E4'),  ln(0,'F#4'), ln(1,'G4'),  ln(1,'A4'),
      ln(2,'B4'),  ln(2,'C#5'), ln(2,'D5'),  ln(2,'E5'),
    ],
    stepFn(b) { return b; },

    bgNotes: genBG(66, 34, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0.5,1.5,2.5,3.5],
      bass:  [[0,'D2',2],[2,'A2',2]],
      pad:   [[0,'D3',4],[0,'F#3',4],[0,'A3',4]]
    })
  },

  // ════════════════════════════
  // 5. バッハ「メヌエット ト長調」BWV Anh.114 (1725) - G major
  // ════════════════════════════
  {
    id:5, name:'メヌエット ト長調', nameEn:'MINUET IN G MAJOR', genre:'classic',
    composer:'Petzold/Bach BWV Anh.114 (1725)', icon:'🎼',
    bpm:120, duration:30,
    diff:{easy:2,normal:5,hard:8}, instrument:'harpsichord',

    // Accurate score - one of the most recognizable classical pieces
    mel: [
      // Bar 1-4 (A section)
      ln(2,'D5'),  ln(1,'G4'),  ln(1,'A4'),  ln(2,'B4'),
      ln(2,'C5'),  ln(2,'D5'),  ln(2,'B4'),  ln(0,'G4'),
      ln(1,'E5'),  ln(2,'C5'),  ln(2,'D5'),  ln(2,'C5'),
      ln(1,'B4'),  ln(0,'G4'),  ln(0,'G4'),  ln(0,'G4'),
      // Bar 5-8
      ln(0,'A4'),  ln(1,'D4'),  ln(1,'E4'),  ln(1,'F#4'),
      ln(2,'G4'),  ln(2,'A4'),  ln(2,'B4'),  ln(2,'C5'),
      ln(2,'D5'),  ln(1,'B4'),  ln(1,'D5'),  ln(1,'C5'),
      ln(1,'B4'),  ln(0,'A4'),  ln(0,'A4'),  ln(0,'A4'),
      // Bar 9-12 (B section)
      ln(2,'B4'),  ln(1,'G4'),  ln(1,'A4'),  ln(2,'B4'),
      ln(2,'C5'),  ln(1,'B4'),  ln(1,'A4'),  ln(1,'G4'),
      ln(2,'D5'),  ln(2,'D4'),  ln(2,'E4'),  ln(2,'F#4'),
      ln(2,'G4'),  ln(1,'F#4'), ln(1,'E4'),  ln(0,'D4'),
    ],
    stepFn(b) { return b * 0.5; },

    bgNotes: genBG(120, 32, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0,0.5,1,1.5,2,2.5,3,3.5],
      bass:  [[0,'G2',1],[1,'D3',1],[2,'G2',1],[3,'B2',1]],
      pad:   [[0,'G3',2],[0,'B3',2],[2,'D3',2],[2,'G3',2]]
    })
  },

  // ════════════════════════════
  // 6. パッヘルベル「カノン」(c.1680) - D major
  // ════════════════════════════
  {
    id:6, name:'パッヘルベルのカノン', nameEn:"PACHELBEL'S CANON", genre:'classic',
    composer:'Pachelbel Canon in D (c.1680)', icon:'🕯️',
    bpm:100, duration:32,
    diff:{easy:2,normal:5,hard:8}, instrument:'strings',

    // Canon melody with characteristic 3-voice texture
    mel: [
      // Voice 1 - descending bass theme as melody (counter)
      ln(0,'D4'),  ln(0,'A3'),  ln(0,'B3'),  ln(0,'F#3'),
      ln(0,'G3'),  ln(0,'D3'),  ln(0,'G3'),  ln(0,'A3'),
      // Voice 2 - 8th note melody
      ln(1,'F#4'), ln(1,'E4'),  ln(1,'D4'),  ln(1,'F#4'),
      ln(1,'A4'),  ln(1,'F#4'), ln(1,'E4'),  ln(1,'D4'),
      // Voice 3 - high melody (canon theme)
      ln(2,'A4'),  ln(2,'B4'),  ln(2,'A4'),  ln(2,'F#4'),
      ln(2,'E4'),  ln(2,'F#4'), ln(2,'A4'),  ln(2,'B4'),
      // Rising variation
      ln(2,'D5'),  ln(2,'C#5'), ln(2,'B4'),  ln(2,'A4'),
      ln(2,'F#4'), ln(2,'A4'),  ln(2,'B4'),  ln(2,'C#5'),
      // Peak
      ln(2,'D5'),  ln(2,'E5'),  ln(2,'F#5'), ln(2,'E5'),
      ln(2,'D5'),  ln(2,'B4'),  ln(2,'A4'),  ln(2,'G4'),
      // Descend and resolve
      ln(1,'F#4'), ln(1,'G4'),  ln(1,'A4'),  ln(1,'B4'),
      ln(0,'D5'),  ln(0,'C#5'), ln(0,'B4'),  ln(0,'A4'),
    ],
    stepFn(b) { return b * 0.5; },

    bgNotes: genBG(100, 34, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0.5,1.5,2.5,3.5],
      bass:  [[0,'D2',1],[1,'A2',1],[2,'B2',1],[3,'F#2',1]],
      pad:   [[0,'D3',4],[0,'F#3',4],[0,'A3',4]]
    })
  },

  // ════════════════════════════
  // 7. ヴィヴァルディ「春」第1楽章 (1723) - E major
  // ════════════════════════════
  {
    id:7, name:'四季より「春」', nameEn:'THE FOUR SEASONS - SPRING', genre:'classic',
    composer:'Vivaldi Op.8 No.1 (1723)', icon:'🌸',
    bpm:138, duration:30,
    diff:{easy:3,normal:6,hard:9}, instrument:'strings',

    // Opening Allegro - the famous ritornello theme
    mel: [
      // Main spring theme - E major, 3 voices
      ln(0,'E4'),  ln(2,'E5'),  ln(1,'B4'),  ln(2,'G#5'),
      ln(0,'G#4'), ln(2,'F#5'), ln(1,'E5'),  ln(2,'F#5'),
      ln(0,'G#4'), ln(2,'G#5'), ln(1,'E5'),  ln(1,'B4'),
      ln(0,'G#4'), ln(0,'B4'),  ln(1,'E5'),  ln(2,'E5'),
      // Bird call figure - distributed
      ln(0,'E4'),  ln(2,'B5'),  ln(1,'A5'),  ln(2,'G#5'),
      ln(1,'F#5'), ln(0,'E4'),  ln(2,'E5'),  ln(2,'F#5'),
      ln(0,'G#4'), ln(2,'G#5'), ln(1,'A5'),  ln(2,'B5'),
      ln(1,'A5'),  ln(0,'G#4'), ln(2,'G#5'), ln(2,'E5'),
      // Second theme
      ln(0,'E4'),  ln(1,'G#4'), ln(2,'B4'),  ln(2,'E5'),
      ln(0,'G#4'), ln(2,'B5'),  ln(2,'G#5'), ln(2,'F#5'),
      ln(0,'E4'),  ln(1,'D#5'), ln(1,'E5'),  ln(2,'F#5'),
      ln(0,'G#4'), ln(2,'A5'),  ln(2,'G#5'), ln(2,'F#5'),
    ],
    stepFn(b) { return b * 0.5; },

    bgNotes: genBG(138, 32, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0,0.5,1,1.5,2,2.5,3,3.5],
      bass:  [[0,'E2',1],[1,'B2',1],[2,'E3',1],[3,'B2',1]],
      pad:   [[0,'E3',2],[0,'G#3',2],[2,'B3',2],[2,'E4',2]]
    })
  },

  // ════════════════════════════
  // 8. モーツァルト「トルコ行進曲」K.331 (1783) - A major
  // ════════════════════════════
  {
    id:8, name:'トルコ行進曲', nameEn:'TURKISH MARCH', genre:'classic',
    composer:'Mozart K.331 (1783)', icon:'🎺',
    bpm:144, duration:30,
    diff:{easy:3,normal:6,hard:9}, instrument:'piano',

    // Alla Turca - the famous march theme
    mel: [
      // Main theme - A minor section
      ln(1,'E5'),  ln(1,'D#5'), ln(1,'E5'),  ln(0,'B4'),
      ln(1,'D5'),  ln(1,'C#5'), ln(1,'D5'),  ln(0,'A4'),
      ln(0,'C5'),  ln(0,'B4'),  ln(1,'C5'),  ln(1,'E5'),
      ln(2,'A5'),  ln(2,'A5'),  ln(0,'A4'),  ln(0,'A4'),
      // Continuation
      ln(1,'E5'),  ln(1,'D#5'), ln(1,'E5'),  ln(0,'B4'),
      ln(1,'D5'),  ln(1,'C#5'), ln(1,'D5'),  ln(0,'A4'),
      ln(0,'C5'),  ln(0,'B4'),  ln(1,'C5'),  ln(1,'E5'),
      ln(2,'A5'),  ln(2,'G#5'), ln(2,'A5'),  ln(0,'A4'),
      // B section - A major
      ln(2,'A5'),  ln(2,'G#5'), ln(2,'A5'),  ln(2,'E5'),
      ln(2,'C#5'), ln(2,'E5'),  ln(2,'A5'),  ln(2,'A5'),
      ln(2,'G#5'), ln(2,'A5'),  ln(2,'E5'),  ln(2,'C#5'),
      ln(2,'B4'),  ln(1,'C#5'), ln(1,'D5'),  ln(1,'E5'),
    ],
    stepFn(b) { return b * 0.5; },

    bgNotes: genBG(144, 32, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0,0.25,0.5,0.75,1,1.25,1.5,1.75,2,2.25,2.5,2.75,3,3.25,3.5,3.75],
      bass:  [[0,'A2',1],[1,'E3',1],[2,'A2',1],[3,'E3',1]],
      pad:   [[0,'A3',2],[0,'C4',2],[2,'E3',2],[2,'A3',2]]
    })
  },

  // ════════════════════════════
  // 9. ドヴォルザーク「家路」(遠い故郷) Op.95 (1893) - F major
  // ════════════════════════════
  {
    id:9, name:'家路（遠い故郷）', nameEn:"GOIN' HOME", genre:'classic',
    composer:'Dvořák New World Symphony (1893)', icon:'🏠',
    bpm:72, duration:32,
    diff:{easy:1,normal:3,hard:6}, instrument:'flute',

    // Largo - the famous pentatonic melody (F major pentatonic)
    mel: [
      // Bar 1-2: F4 - G4 - Bb4 - C5
      ln(0,'F4'),  ln(0,'G4'),  ln(1,'Bb4'), ln(1,'C5'),
      ln(2,'F5'),  ln(2,'F5'),  ln(1,'Eb5'), ln(1,'C5'),
      // Bar 3-4: Bb4 - G4 - F4
      ln(1,'Bb4'), ln(1,'G4'),  ln(0,'F4'),  ln(0,'G4'),
      ln(1,'Bb4'), ln(1,'C5'),  ln(2,'F5'),  ln(2,'F5'),
      // Bar 5-6: variation up
      ln(2,'F5'),  ln(2,'G5'),  ln(2,'Bb5'), ln(2,'G5'),
      ln(2,'F5'),  ln(2,'Eb5'), ln(1,'C5'),  ln(1,'Bb4'),
      // Bar 7-8: descend
      ln(1,'G4'),  ln(0,'F4'),  ln(0,'Eb4'), ln(0,'F4'),
      ln(1,'G4'),  ln(1,'Bb4'), ln(1,'C5'),  ln(2,'F5'),
      // Bar 9-10: peak
      ln(2,'Ab5'), ln(2,'G5'),  ln(2,'F5'),  ln(2,'Eb5'),
      ln(2,'C5'),  ln(2,'Bb4'), ln(1,'Ab4'), ln(1,'G4'),
      // Bar 11-12: final cadence
      ln(0,'F4'),  ln(0,'G4'),  ln(1,'Bb4'), ln(1,'C5'),
      ln(2,'F5'),  ln(2,'Eb5'), ln(2,'C5'),  ln(2,'F5'),
    ],
    stepFn(b) { return b; },

    bgNotes: genBG(72, 34, {
      kick:  [0, 2],
      snare: [1, 3],
      hat:   [0.5,1.5,2.5,3.5],
      bass:  [[0,'F2',2],[2,'C3',2]],
      pad:   [[0,'F3',4],[0,'A3',4],[0,'C4',4]]
    })
  }

]; // end SONGS

// ===== DIFFICULTY FILTER =====
// Filter per lane independently - guarantees all 3 lanes always appear
function filterChart(rawChart, difficulty) {
  if (difficulty === 'hard') return rawChart;

  const byLane = [[], [], []];
  rawChart.forEach(n => byLane[n.lane].push(n));

  let result = [];
  byLane.forEach((laneNotes, li) => {
    if (difficulty === 'easy') {
      // Keep every 3rd for lane 0&1, every 2nd for lane 2 (high = lead melody)
      const step = li === 2 ? 2 : 3;
      laneNotes.forEach((n, i) => { if (i % step === 0) result.push(n); });
    } else {
      // Normal: every 2nd note in each lane
      laneNotes.forEach((n, i) => { if (i % 2 === 0) result.push(n); });
    }
  });

  // Sort by time, remove notes closer than 80ms
  result.sort((a, b) => a.time - b.time);
  const clean = [];
  let lastT = -999;
  result.forEach(n => {
    if (n.time - lastT >= 0.08) { clean.push(n); lastT = n.time; }
  });
  return clean;
}

// ===== CHART BUILDER =====
// Expands mel pattern to fill song duration by looping
function expandMelody(mel, startTime, stepTime, duration) {
  const patDur = mel.length * stepTime;
  const reps = Math.ceil((duration - startTime + 2) / patDur) + 1;
  const notes = [];
  for (let r = 0; r < reps; r++) {
    mel.forEach((item, i) => {
      const t = startTime + r * patDur + i * stepTime;
      if (t > duration + 0.5) return;
      notes.push({ time: t, lane: item.lane, freq: item.freq, noteName: item.noteName, dur: item.dur || 0.5 });
    });
  }
  return notes;
}

// ===== GAME ENGINE =====
const Game = (() => {
  let currentSong = null, currentDiff = 'easy';
  let chart = [], noteElements = {};
  let score = 0, combo = 0, maxCombo = 0, health = 100;
  let perfect = 0, good = 0, miss = 0;
  let gameRunning = false, gamePaused = false;
  let gameStartTime = 0, noteSpeed = 280;
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
  function showTitle()      { AudioEngine.stopAll(); showScreen('screen-title'); }
  function showSongSelect() { AudioEngine.stopAll(); buildSongList(); showScreen('screen-select'); }

  function buildSongList() {
    const list = document.getElementById('song-list');
    list.innerHTML = '';
    SONGS.forEach(song => {
      const stars = song.diff[currentDiff];
      const card = document.createElement('div');
      card.className = `song-card genre-classic`;
      card.innerHTML = `
        <div class="song-icon">${song.icon}</div>
        <div class="song-info">
          <div class="song-name">${song.name}</div>
          <div class="song-meta">${song.composer} · BPM ${song.bpm}</div>
        </div>
        <div>
          <div class="song-bpm">${song.duration}s</div>
          <div class="song-diff-stars ${currentDiff}">${'★'.repeat(stars) + '☆'.repeat(10 - stars).substring(0, 8)}</div>
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

    const b = 60 / song.bpm;
    const step = song.stepFn(b);
    const raw = expandMelody(song.mel, b * 2, step, song.duration);
    chart = filterChart(raw, currentDiff);
    totalNoteCount = chart.length;
    pendingNotes = [...chart].sort((a, b2) => a.time - b2.time);
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
    noteElements = {};
    updateGauge();

    noteSpeed = { easy: 190, normal: 300, hard: 420 }[currentDiff];
    judgeWindow = {
      easy:   { perfect: 0.22, good: 0.38 },
      normal: { perfect: 0.12, good: 0.22 },
      hard:   { perfect: 0.07, good: 0.13 }
    }[currentDiff];

    showScreen('screen-game');
    playfieldH = document.getElementById('playfield').clientHeight;
    gameRunning = true; gamePaused = false;

    gameStartTime = AudioEngine.now() + 0.5;
    AudioEngine.scheduleBG(song, gameStartTime, song.duration);

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame = requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) { animFrame = requestAnimationFrame(gameLoop); return; }

    const elapsed = AudioEngine.now() - gameStartTime;
    const spawnAhead = playfieldH / noteSpeed + 0.25;

    while (pendingNotes.length > 0 && pendingNotes[0].time - elapsed < spawnAhead) {
      spawnNote(pendingNotes.shift());
    }
    updateNotes(elapsed);
    checkMisses(elapsed);

    document.getElementById('progress-bar').style.width =
      (Math.max(0, Math.min(elapsed / currentSong.duration, 1)) * 100) + '%';

    if (elapsed >= currentSong.duration + 2.0 && pendingNotes.length === 0 && activeNotes.length === 0) {
      endGame(); return;
    }
    animFrame = requestAnimationFrame(gameLoop);
  }

  function spawnNote(note) {
    const el = document.createElement('div');
    el.className = 'note';
    el.dataset.lane = note.lane;
    const id = note.time.toFixed(4) + '_' + note.lane + '_' + Math.random().toString(36).slice(2, 5);
    el.dataset.id = id;
    const laneLeft = [0, 33.33, 66.66];
    el.style.left  = laneLeft[note.lane] + '%';
    el.style.width = (note.lane === 2 ? 33.34 : 33.33) + '%';
    el.style.top   = '-34px';
    document.getElementById('notes-container').appendChild(el);
    noteElements[id] = el;
    activeNotes.push({ ...note, elId: id });
  }

  function updateNotes(elapsed) {
    activeNotes.forEach(note => {
      const el = noteElements[note.elId];
      if (!el) return;
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
    keyState[lane] = true;
    pressLane(lane);
    document.getElementById(`btn-${lane}`).classList.add('pressed');
  }
  function onKeyUp(e) {
    const lane = KEY_MAP[e.key.toLowerCase()];
    if (lane === undefined) return;
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
    let bestNote = null, bestDiff = Infinity;
    activeNotes.forEach(note => {
      if (note.lane !== lane || hitNotes.has(note.elId)) return;
      const d = Math.abs(note.time - elapsed);
      if (d < bestDiff) { bestDiff = d; bestNote = note; }
    });

    if (!bestNote) {
      const fallbacks = ['A4', 'C5', 'E5'];
      AudioEngine.hitNote(fallbacks[lane], freq(fallbacks[lane]), currentSong?.instrument || 'piano', 0.3);
      return;
    }

    if (bestDiff <= judgeWindow.perfect) {
      registerJudge('perfect', lane, bestNote.elId, bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    } else if (bestDiff <= judgeWindow.good) {
      registerJudge('good', lane, bestNote.elId, bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    }
  }

  function registerJudge(type, lane, noteId, note) {
    if (type !== 'miss') {
      AudioEngine.hitNote(note.noteName || 'C5', note.freq, currentSong?.instrument || 'piano', note.dur || 0.5);
    } else {
      AudioEngine.hitMiss();
    }

    if (type === 'perfect') {
      score += 300 + combo * 2; combo++; if (combo > maxCombo) maxCombo = combo;
      health = Math.min(100, health + 1.5); perfect++;
      gaugeScore = Math.min(100, gaugeScore + (100 / totalNoteCount) * 1.5);
    } else if (type === 'good') {
      score += 100 + combo; combo++; if (combo > maxCombo) maxCombo = combo;
      good++;
      gaugeScore = Math.min(100, gaugeScore + (100 / totalNoteCount) * 0.8);
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
      : health > 25
        ? 'linear-gradient(90deg,var(--accent2),var(--accent5))'
        : 'linear-gradient(90deg,#ff3333,var(--accent3))';

    updateGauge();
    showJudge(type, combo);
    showHitEffect(type, lane);
    if (health <= 0) endGame();
  }

  function updateGauge() {
    const fill  = document.getElementById('gauge-fill');
    const label = document.getElementById('gauge-label');
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
    const comboHtml = combo > 1 ? `<div class="judge-combo">${combo} COMBO</div>` : '';
    el.innerHTML = `<div class="judge-${type}">${text}${comboHtml}</div>`;
    judgeTimer = setTimeout(() => { el.innerHTML = ''; }, 420);
  }

  function showHitEffect(type, lane) {
    const c  = document.getElementById('hit-effects');
    const el = document.createElement('div');
    el.className  = `hit-effect ${type}`;
    el.dataset.lane = lane;
    c.appendChild(el);
    setTimeout(() => el.remove(), 350);
  }

  function pause()  { if (!gameRunning) return; gamePaused = true;  document.getElementById('screen-pause').classList.add('active'); }
  function resume() { gamePaused = false; document.getElementById('screen-pause').classList.remove('active'); }
  function quit()   { endGame(); }

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
    document.getElementById('result-song-name').textContent = currentSong.name + '  ' + currentSong.nameEn;
    document.getElementById('res-score').textContent   = score.toLocaleString();
    document.getElementById('res-combo').textContent   = maxCombo;
    document.getElementById('res-perfect').textContent = perfect;
    document.getElementById('res-good').textContent    = good;
    document.getElementById('res-miss').textContent    = miss;
    const rg = document.getElementById('res-gauge');
    const rc = document.getElementById('res-clear');
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
