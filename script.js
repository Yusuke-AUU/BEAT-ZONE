// ===== BEAT ZONE v4 =====
// 3 lanes = melody notes (Low / Mid / High)
// Drums + Bass always play as background
// Player presses buttons to "perform" the melody

// ===== NOTE FREQUENCIES =====
const N = {
  C2:65.41, G2:98, A2:110, Bb2:116.54, B2:123.47,
  C3:130.81, D3:146.83, Eb3:155.56, E3:164.81, F3:174.61, Gb3:185, G3:196, Ab3:207.65, A3:220, Bb3:233.08, B3:246.94,
  C4:261.63, D4:293.66, Eb4:311.13, E4:329.63, F4:349.23, Gb4:369.99, G4:392, Ab4:415.30, A4:440, Bb4:466.16, B4:493.88,
  C5:523.25, D5:587.33, Eb5:622.25, E5:659.25, F5:698.46, Gb5:739.99, G5:783.99, Ab5:830.61, A5:880, Bb5:932.33, B5:987.77, C6:1046.5
};

// ===== AUDIO ENGINE =====
const AudioEngine = (() => {
  let ctx = null, master = null;
  let bgNodes = [];

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    master = ctx.createGain(); master.gain.value = 0.7;
    master.connect(ctx.destination);
  }
  function resume() { if (ctx && ctx.state === 'suspended') ctx.resume(); }
  function now() { return ctx ? ctx.currentTime : 0; }

  // ── basic sound builders ──
  function osc(type, freq, t, dur, vol, dest) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(dest || master);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
    bgNodes.push(o, g); return g;
  }

  function noiseNode(t, dur, vol, hpf, lpf) {
    const len = Math.ceil(ctx.sampleRate * Math.max(dur, 0.05));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter(); hp.type = 'highpass'; hp.frequency.value = hpf || 0;
    const lp = ctx.createBiquadFilter(); lp.type = 'lowpass'; lp.frequency.value = lpf || 20000;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master);
    src.start(t); src.stop(t + dur + 0.02);
    bgNodes.push(src, g, hp, lp);
  }

  // ── Background drum kit ──
  function kick(t, vol) {
    vol = vol || 0.75;
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.frequency.setValueAtTime(160, t); o.frequency.exponentialRampToValueAtTime(0.001, t + 0.45);
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t + 0.45);
    o.connect(g); g.connect(master); o.start(t); o.stop(t + 0.5);
    bgNodes.push(o, g);
  }
  function snare(t, vol) {
    vol = vol || 0.22;
    noiseNode(t, 0.15, vol, 1000, 8000);
    osc('triangle', 185, t, 0.1, vol * 0.6);
  }
  function hat(t, vol, open) {
    noiseNode(t, open ? 0.22 : 0.035, vol || 0.08, 8000, 18000);
  }
  function clap(t, vol) {
    for (let i = 0; i < 3; i++) noiseNode(t + i * 0.012, 0.08, vol || 0.18, 2000, 12000);
  }

  // ── Background bass ──
  function bassNote(freq, t, dur, vol) {
    vol = vol || 0.38;
    osc('sine', freq, t, dur, vol * 0.7);
    osc('sawtooth', freq, t, dur * 0.6, vol * 0.2);
  }

  // ── Background pad ──
  function pad(freqs, t, dur, vol, type) {
    type = type || 'sine';
    freqs.forEach(f => osc(type, f, t, dur, vol || 0.05));
  }

  // ── Player melody hit sounds ──
  // instrument: 'piano' | 'keys' | 'synth' | 'strings' | 'lead'
  function hitMelody(freq, instrument) {
    if (!ctx) return; resume();
    const t = ctx.currentTime;
    switch (instrument) {
      case 'piano':
        osc('triangle', freq, t, 0.6, 0.32);
        osc('sine', freq * 2, t, 0.25, 0.14);
        osc('sine', freq * 3, t, 0.12, 0.06);
        break;
      case 'keys':
        osc('triangle', freq, t, 0.5, 0.28);
        osc('sawtooth', freq, t, 0.15, 0.10);
        osc('sine', freq * 2, t, 0.3, 0.10);
        break;
      case 'strings':
        osc('sawtooth', freq, t, 0.7, 0.18);
        osc('sawtooth', freq * 1.007, t, 0.7, 0.14);
        osc('sine', freq * 0.5, t, 0.5, 0.08);
        break;
      case 'lead':
        osc('sawtooth', freq, t, 0.4, 0.22);
        osc('sawtooth', freq * 1.004, t, 0.4, 0.18);
        osc('square', freq * 0.5, t, 0.3, 0.08);
        break;
      case 'synth':
      default:
        osc('sawtooth', freq, t, 0.35, 0.20);
        osc('sine', freq, t, 0.35, 0.12);
        osc('sine', freq * 2, t, 0.2, 0.06);
    }
  }

  function hitMiss() {
    if (!ctx) return; resume();
    noiseNode(ctx.currentTime, 0.07, 0.06, 0, 2000);
  }

  // ── Full background music for a song ──
  function playBackground(song, startT, duration) {
    if (!ctx) return;
    const beat = 60 / song.bpm;
    const bars = Math.ceil(duration / (beat * 4)) + 2;
    song.bgDef(ctx, master, bgNodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc);
  }

  function stopAll() {
    bgNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
    bgNodes = [];
  }

  return { init, resume, now, hitMelody, hitMiss, playBackground, stopAll };
})();

// ===== MELODY → 3 LANES HELPER =====
// Takes a flat melody array and distributes into 3 lanes (Low/Mid/High)
// by splitting the melody into thirds by pitch range
function melodyToLanes(melNotes, startTime, stepTime) {
  // Sort a copy by freq to find pitch ranges
  const freqs = melNotes.map(f => typeof f === 'number' ? f : f.freq).filter(Boolean);
  const sorted = [...freqs].sort((a,b) => a-b);
  const lo = sorted[Math.floor(sorted.length * 0.33)];
  const hi = sorted[Math.floor(sorted.length * 0.67)];

  const notes = [];
  melNotes.forEach((item, i) => {
    const freq = typeof item === 'number' ? item : item.freq;
    const t = startTime + i * stepTime;
    let lane;
    if (freq <= lo) lane = 0;
    else if (freq <= hi) lane = 1;
    else lane = 2;
    notes.push({ time: t, lane, freq });
  });
  return notes;
}

// ===== SONG DEFINITIONS =====
// Each note in chart: { time, lane (0=low,1=mid,2=high), freq, instrument }
// bgDef: function that schedules all background (drums + bass + pads)

const SONGS = [

  // ─── 0: MOONLIGHT SONATA (Beethoven) ───
  {
    id:0, name:'MOONLIGHT SONATA', genre:'classic', icon:'🌙',
    bpm:108, duration:32, desc:'クラシック / Beethoven',
    diff:{easy:2, normal:4, hard:7},
    instrument: 'piano',

    // Full melody chart (Hard = all notes)
    buildMelody() {
      const b = 60/108, tri = b/3;
      // Moonlight triplet melody - full sequence
      const mel = [
        N.A4,N.E4,N.A4, N.A4,N.E4,N.A4, N.A4,N.E4,N.A4, N.A4,N.E4,N.A4,
        N.B4,N.D4,N.G4, N.B4,N.D4,N.G4, N.B4,N.D4,N.G4, N.B4,N.D4,N.G4,
        N.A4,N.C4,N.E4, N.A4,N.C4,N.E4, N.A4,N.C4,N.E4, N.A4,N.C4,N.E4,
        N.Ab4,N.B3,N.E4,N.Ab4,N.B3,N.E4,N.Ab4,N.B3,N.E4,N.Ab4,N.B3,N.E4,
        N.G4,N.B3,N.D4, N.G4,N.B3,N.D4, N.A4,N.C4,N.E4, N.A4,N.C4,N.E4,
        N.Gb4,N.A3,N.D4,N.Gb4,N.A3,N.D4,N.E4,N.A3,N.C4, N.E4,N.A3,N.C4
      ];
      return melodyToLanes(mel, b*2, tri);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const tri = beat / 3;
      const bassLine = [N.A2, N.A2, N.G2, N.G2, N.F3, N.F3, N.E3, N.E3];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        // Soft kick on 1 & 3
        kick(t, 0.3); kick(t + beat*2, 0.22);
        // Soft snare on 2 & 4
        snare(t + beat, 0.12); snare(t + beat*3, 0.12);
        // Bass sustain
        bassNote(bassLine[i % bassLine.length], t, beat * 4 * 0.9, 0.28);
        // Triplet pad arpeggios (gentle)
        const ch = [[N.A3,N.C4,N.E4],[N.G3,N.B3,N.D4],[N.F3,N.A3,N.C4],[N.E3,N.Ab3,N.B3]];
        const thisCh = ch[i % 4];
        for (let rep = 0; rep < 4; rep++) {
          thisCh.forEach((f, fi) => {
            const at = t + rep * beat + fi * tri;
            const o = ctx.createOscillator(), g = ctx.createGain();
            o.type = 'sine'; o.frequency.value = f;
            o.connect(g); g.connect(master);
            g.gain.setValueAtTime(0.04, at); g.gain.exponentialRampToValueAtTime(0.001, at + tri * 2.8);
            o.start(at); o.stop(at + tri * 3); nodes.push(o, g);
          });
        }
      }
    }
  },

  // ─── 1: CANON IN D (Pachelbel) ───
  {
    id:1, name:'CANON IN D', genre:'classic', icon:'🎼',
    bpm:116, duration:32, desc:'クラシック / Pachelbel',
    diff:{easy:2, normal:5, hard:8},
    instrument: 'strings',

    buildMelody() {
      const b = 60/116;
      const mel = [
        N.Gb4,N.E4,N.D4,N.Gb4,N.A4,N.Gb4,N.E4,N.D4,
        N.A4,N.B4,N.A4,N.Gb4,N.E4,N.Gb4,N.A4,N.B4,
        N.D5,N.C5,N.B4,N.A4,N.Gb4,N.A4,N.B4,N.C5,
        N.B4,N.A4,N.Gb4,N.E4,N.D4,N.E4,N.Gb4,N.A4,
        N.D5,N.E5,N.Gb5||N.G5,N.A5,N.Gb5||N.G5,N.E5,N.D5,N.C5,
        N.B4,N.A4,N.G4,N.Gb4,N.E4,N.D4,N.E4,N.Gb4
      ];
      return melodyToLanes(mel, b*2, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.D3,N.A2,N.B2,N.Gb2,N.G2,N.D3,N.G2,N.A2];
      const chords   = [[N.D4,N.Gb4,N.A4],[N.A3,N.C4,N.E4],[N.B3,N.D4,N.Gb4],[N.Gb3,N.A3,N.C4],
                        [N.G3,N.B3,N.D4], [N.D4,N.Gb4,N.A4],[N.G3,N.B3,N.D4],[N.A3,N.C4,N.E4]];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        kick(t, 0.35); kick(t + beat*2, 0.28);
        snare(t + beat, 0.15); snare(t + beat*3, 0.15);
        for (let k = 0; k < 8; k++) hat(t + k * beat * 0.5, 0.07);
        bassNote(bassLine[(i*2)%8], t, beat*2*0.9, 0.32);
        bassNote(bassLine[(i*2+1)%8], t+beat*2, beat*2*0.9, 0.32);
        pad(chords[i%8], t, beat*4, 0.05, 'triangle');
      }
    }
  },

  // ─── 2: AIR ON G STRING (Bach) ───
  {
    id:2, name:'AIR ON G STRING', genre:'classic', icon:'🎻',
    bpm:72, duration:32, desc:'クラシック / Bach',
    diff:{easy:1, normal:3, hard:6},
    instrument: 'strings',

    buildMelody() {
      const b = 60/72;
      const mel = [
        N.B4,N.A4,N.Gb4,N.E4,N.D4,N.E4,N.Gb4,N.A4,
        N.B4,N.C5,N.B4,N.A4,N.G4,N.Gb4,N.E4,N.D4,
        N.C5,N.B4,N.A4,N.G4,N.Gb4,N.G4,N.A4,N.B4,
        N.E5,N.D5,N.C5,N.B4,N.A4,N.B4,N.C5,N.D5,
        N.E5,N.Gb5||N.G5,N.E5,N.D5,N.C5,N.B4,N.A4,N.G4
      ];
      return melodyToLanes(mel, b*3, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.D2||N.D3,N.C3,N.B2,N.A2,N.G2,N.Gb2,N.E2||N.E3,N.A2];
      const chords   = [[N.D3,N.Gb3,N.A3],[N.C3,N.E3,N.G3],[N.B2,N.D3,N.Gb3],[N.A2,N.E3,N.A3],
                        [N.G2,N.B2,N.D3], [N.Gb2,N.A2,N.C3],[N.E2||N.E3,N.A2,N.C3],[N.A2,N.C3,N.E3]];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        kick(t, 0.28); kick(t + beat*2, 0.20);
        snare(t + beat, 0.10); snare(t + beat*3, 0.10);
        bassNote(bassLine[i%8], t, beat*4*0.95, 0.30);
        pad(chords[i%8], t, beat*4, 0.055, 'sine');
        // Gentle counter melody (violas)
        const cm = [N.Gb4, N.E4, N.D4, N.C4][i%4];
        const o = ctx.createOscillator(), g = ctx.createGain();
        o.type = 'sawtooth'; o.frequency.value = cm;
        const lp = ctx.createBiquadFilter(); lp.type='lowpass'; lp.frequency.value=800;
        o.connect(lp); lp.connect(g); g.connect(master);
        g.gain.setValueAtTime(0.0, t); g.gain.linearRampToValueAtTime(0.06, t+beat);
        g.gain.setValueAtTime(0.06, t+beat*3); g.gain.exponentialRampToValueAtTime(0.001, t+beat*4);
        o.start(t); o.stop(t+beat*4+0.1); nodes.push(o,lp,g);
      }
    }
  },

  // ─── 3: TOCCATA & FUGUE (Bach) ───
  {
    id:3, name:'TOCCATA RUSH', genre:'classic', icon:'⚡',
    bpm:132, duration:30, desc:'クラシック / Bach Toccata',
    diff:{easy:4, normal:7, hard:10},
    instrument: 'strings',

    buildMelody() {
      const b = 60/132;
      const mel = [
        N.D5,N.C5,N.D5,N.Eb5,N.D5,N.C5,N.Bb4,N.A4,
        N.Bb4,N.C5,N.Bb4,N.A4,N.G4,N.Gb4,N.G4,N.A4,
        N.D5,N.Eb5,N.D5,N.C5,N.Bb4,N.A4,N.Bb4,N.C5,
        N.D5,N.C5,N.Bb4,N.A4,N.G4,N.A4,N.Bb4,N.C5,
        N.D5,N.F5,N.E5,N.D5,N.C5,N.Bb4,N.A4,N.G4
      ];
      return melodyToLanes(mel, b*1.5, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.D2||N.D3,N.A2,N.D3,N.A2,N.G2,N.D3,N.G2,N.D2||N.D3];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        // Driving 8th kicks
        for (let k = 0; k < 4; k++) kick(t + k*beat, k===0?0.7:0.5);
        snare(t + beat, 0.2); snare(t + beat*3, 0.2);
        for (let k = 0; k < 8; k++) hat(t + k*beat*0.5, 0.09);
        for (let k = 0; k < 4; k++) bassNote(bassLine[(i*4+k)%8], t+k*beat, beat*0.9, 0.35);
        pad([N.D3,N.A3,N.D4], t, beat*4, 0.04, 'sawtooth');
      }
    }
  },

  // ─── 4: FIFTH SYMPHONY (Beethoven) ───
  {
    id:4, name:'FIFTH SYMPHONY', genre:'classic', icon:'🎹',
    bpm:126, duration:30, desc:'クラシック / Beethoven',
    diff:{easy:3, normal:6, hard:9},
    instrument: 'strings',

    buildMelody() {
      const b = 60/126;
      // da-da-da-DUM motif, evenly spaced for lane detection
      const mel = [
        N.G4,N.G4,N.G4,N.Eb4, N.F4,N.F4,N.F4,N.D4,
        N.Eb4,N.Eb4,N.Eb4,N.C4, N.G4,N.G4,N.G4,N.Eb4,
        N.Ab4,N.Ab4,N.Ab4,N.F4, N.G4,N.G4,N.F4,N.Eb4,
        N.G4,N.G4,N.G4,N.Eb4, N.F4,N.F4,N.F4,N.D4,
        N.Eb4,N.Eb4,N.Eb4,N.C4, N.Ab4,N.Ab4,N.G4,N.F4
      ];
      return melodyToLanes(mel, b*2, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.C3,N.G2,N.Eb3,N.Bb2, N.C3,N.G2,N.F3,N.G2];
      const chords   = [[N.C3,N.Eb3,N.G3],[N.G2,N.B2,N.D3],[N.F3,N.A3,N.C4],[N.Eb3,N.G3,N.Bb3]];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        kick(t, 0.6); kick(t+beat*2, 0.5); kick(t+beat*2.5, 0.4);
        snare(t+beat, 0.22); snare(t+beat*3, 0.22);
        for (let k=0;k<8;k++) hat(t+k*beat*0.5, 0.08);
        bassNote(bassLine[(i*2)%8], t, beat*2*0.9, 0.35);
        bassNote(bassLine[(i*2+1)%8], t+beat*2, beat*2*0.9, 0.35);
        pad(chords[i%4], t, beat*4, 0.055, 'sawtooth');
        // Timpani accent
        const oT=ctx.createOscillator(),gT=ctx.createGain();
        oT.frequency.setValueAtTime(70,t);oT.frequency.exponentialRampToValueAtTime(35,t+0.4);
        gT.gain.setValueAtTime(0.2,t);gT.gain.exponentialRampToValueAtTime(0.001,t+0.45);
        oT.connect(gT);gT.connect(master);oT.start(t);oT.stop(t+0.5);nodes.push(oT,gT);
      }
    }
  },

  // ─── 5: BLUE MONDAY (New Order style) ───
  {
    id:5, name:'BLUE MONDAY WAVE', genre:'club', icon:'🌆',
    bpm:130, duration:30, desc:'クラブ / Synth-Pop',
    diff:{easy:2, normal:4, hard:7},
    instrument: 'synth',

    buildMelody() {
      const b = 60/130;
      const mel = [
        N.F4,N.Ab4,N.Bb4,N.C5,N.Bb4,N.Ab4,N.F4,N.Eb4,
        N.F4,N.Ab4,N.Bb4,N.C5,N.Eb5,N.C5,N.Bb4,N.Ab4,
        N.F4,N.Eb4,N.F4,N.Ab4,N.Bb4,N.C5,N.Bb4,N.Ab4,
        N.G4,N.Ab4,N.Bb4,N.C5,N.F5,N.Eb5,N.C5,N.Bb4,
        N.F5,N.Eb5,N.C5,N.Bb4,N.Ab4,N.Bb4,N.C5,N.Eb5
      ];
      return melodyToLanes(mel, b*2, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.F3,N.F3,N.Ab2,N.F3, N.Eb3,N.F3,N.Ab2,N.Bb2];
      const chords   = [[N.F3,N.Ab3,N.C4],[N.Eb3,N.G3,N.Bb3],[N.Db3||N.D3,N.F3,N.Ab3],[N.Eb3,N.G3,N.Bb3]];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        // Electronic drums
        kick(t,0.65); kick(t+beat*0.75,0.45); kick(t+beat*2,0.65); kick(t+beat*2.75,0.45);
        snare(t+beat,0.25); snare(t+beat*3,0.25);
        for (let k=0;k<16;k++) hat(t+k*beat*0.25, k%4===0?0.10:0.06);
        for (let k=0;k<8;k++) bassNote(bassLine[k%8], t+k*beat*0.5, beat*0.45, 0.35);
        // Synth pad with filter sweep
        chords[i%4].forEach(f => {
          const o=ctx.createOscillator(),g=ctx.createGain();
          const lp=ctx.createBiquadFilter();lp.type='lowpass';
          lp.frequency.setValueAtTime(400,t); lp.frequency.linearRampToValueAtTime(1800,t+beat*2);
          lp.frequency.linearRampToValueAtTime(400,t+beat*4);
          o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.06,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
        });
      }
    }
  },

  // ─── 6: AROUND THE GRID (Daft Punk style) ───
  {
    id:6, name:'AROUND THE GRID', genre:'club', icon:'🤖',
    bpm:121, duration:30, desc:'クラブ / French House',
    diff:{easy:2, normal:4, hard:7},
    instrument: 'lead',

    buildMelody() {
      const b = 60/121;
      const mel = [
        N.A4,N.A4,N.A4,N.G4,N.A4,N.A4,N.E4,N.A4,
        N.A4,N.A4,N.A4,N.G4,N.A4,N.C5,N.E5,N.A5,
        N.G4,N.A4,N.G4,N.E4,N.A4,N.G4,N.E4,N.D4,
        N.E4,N.G4,N.A4,N.G4,N.E4,N.D4,N.E4,N.A4,
        N.C5,N.E5,N.A5,N.E5,N.C5,N.A4,N.G4,N.E4
      ];
      return melodyToLanes(mel, b*2, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.A2,N.A2,N.A2,N.G2,N.A2,N.A2,N.E2||N.G2,N.A2];
      const chords   = [[N.A3,N.C4,N.E4],[N.G3,N.B3,N.D4],[N.F3,N.A3,N.C4],[N.E3,N.G3,N.B3]];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        kick(t,0.7); kick(t+beat*0.5,0.5); kick(t+beat,0.55); kick(t+beat*1.5,0.45);
        kick(t+beat*2,0.7); kick(t+beat*2.5,0.5); kick(t+beat*3,0.55); kick(t+beat*3.5,0.45);
        clap(t+beat,0.25); clap(t+beat*3,0.25);
        for (let k=0;k<16;k++) hat(t+k*beat*0.25, k%2===0?0.10:0.06);
        for (let k=0;k<8;k++) bassNote(bassLine[k%8], t+k*beat*0.5, beat*0.45, 0.38);
        // Staccato chord stabs
        chords[i%4].forEach(f => {
          const o=ctx.createOscillator(),g=ctx.createGain();
          const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;
          o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
          [0, beat*2].forEach(dt => {
            g.gain.setValueAtTime(0.07, t+dt); g.gain.exponentialRampToValueAtTime(0.001, t+dt+0.18);
          });
          o.start(t); o.stop(t+beat*4+0.1); nodes.push(o,lp,g);
        });
      }
    }
  },

  // ─── 7: ONE MORE DRIVE (Daft Punk style) ───
  {
    id:7, name:'ONE MORE DRIVE', genre:'club', icon:'✨',
    bpm:123, duration:30, desc:'クラブ / Disco House',
    diff:{easy:2, normal:5, hard:8},
    instrument: 'lead',

    buildMelody() {
      const b = 60/123;
      const mel = [
        N.D5,N.E5,N.G5,N.A5,N.G5,N.E5,N.D5,N.C5,
        N.B4,N.A4,N.G4,N.A4,N.B4,N.D5,N.E5,N.G5,
        N.A5,N.G5,N.E5,N.D5,N.C5,N.B4,N.A4,N.G4,
        N.A4,N.B4,N.D5,N.E5,N.G5,N.A5,N.G5,N.E5,
        N.D5,N.E5,N.G5,N.A5,N.B5||N.B4,N.A5,N.G5,N.E5
      ];
      return melodyToLanes(mel, b*2, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const bassLine = [N.D3,N.D3,N.A2,N.D3,N.G2,N.D3,N.A2,N.Bb2];
      const chords   = [[N.D4,N.Gb3||N.G3,N.A3],[N.G3,N.B3,N.D4],[N.A3,N.C4,N.E4],[N.Bb3,N.D4,N.F4]];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        kick(t,0.7); kick(t+beat,0.6); kick(t+beat*2,0.7); kick(t+beat*3,0.6);
        snare(t+beat*0.5,0.20); snare(t+beat*1.5,0.20); snare(t+beat*2.5,0.20); snare(t+beat*3.5,0.20);
        for (let k=0;k<16;k++) hat(t+k*beat*0.25, k%2===0?0.09:0.05);
        for (let k=0;k<8;k++) bassNote(bassLine[k%8], t+k*beat*0.5, beat*0.48, 0.38);
        chords[i%4].forEach(f => {
          const o=ctx.createOscillator(),g=ctx.createGain();
          const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1600;
          o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
        });
      }
    }
  },

  // ─── 8: ACID DROPS ───
  {
    id:8, name:'ACID DROPS', genre:'club', icon:'🎛',
    bpm:138, duration:30, desc:'クラブ / Acid House',
    diff:{easy:3, normal:5, hard:8},
    instrument: 'synth',

    buildMelody() {
      const b = 60/138;
      const mel = [
        N.C5,N.Eb5,N.G5,N.Bb5,N.C5,N.G4,N.Eb4,N.C4,
        N.C5,N.Eb5,N.G5,N.Bb5,N.Ab5,N.G5,N.Eb5,N.C5,
        N.C5,N.Bb4,N.Ab4,N.G4,N.F4,N.G4,N.Ab4,N.Bb4,
        N.C5,N.Eb5,N.F5,N.Eb5,N.C5,N.Bb4,N.G4,N.C5,
        N.Eb5,N.G5,N.Bb5,N.G5,N.Eb5,N.C5,N.Bb4,N.G4
      ];
      return melodyToLanes(mel, b*1, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      const acidSeq=[N.C3,N.C3,N.Eb3,N.C3,N.Bb2,N.C3,N.G2,N.C3];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        kick(t,0.75); kick(t+beat,0.65); kick(t+beat*2,0.75); kick(t+beat*3,0.65);
        snare(t+beat,0.25); snare(t+beat*3,0.25);
        for (let k=0;k<16;k++) hat(t+k*beat*0.25, k%4===0?0.11:0.07);
        // 303 acid bass sweep
        for (let k=0;k<8;k++) {
          const o=ctx.createOscillator(),g=ctx.createGain();
          const f=ctx.createBiquadFilter();f.type='lowpass';f.Q.value=12;
          o.type='sawtooth';o.frequency.value=acidSeq[k%8];
          const at=t+k*beat*0.5;
          f.frequency.setValueAtTime(200,at);f.frequency.exponentialRampToValueAtTime(3000,at+beat*0.3);
          f.frequency.exponentialRampToValueAtTime(200,at+beat*0.5);
          o.connect(f);f.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.18,at);g.gain.exponentialRampToValueAtTime(0.001,at+beat*0.5);
          o.start(at);o.stop(at+beat*0.55);nodes.push(o,f,g);
        }
      }
    }
  },

  // ─── 9: JUNGLE MASSIVE ───
  {
    id:9, name:'JUNGLE MASSIVE', genre:'club', icon:'🔊',
    bpm:160, duration:30, desc:'クラブ / 90s Jungle',
    diff:{easy:4, normal:7, hard:10},
    instrument: 'synth',

    buildMelody() {
      const b = 60/160;
      const mel = [
        N.C5,N.Eb5,N.G5,N.Bb5,N.C5,N.G4,N.Eb4,N.C4,
        N.G5,N.F5,N.Eb5,N.C5,N.Bb4,N.C5,N.Eb5,N.G5,
        N.C5,N.Eb5,N.G5,N.Bb5,N.C5,N.Bb5,N.G5,N.Eb5,
        N.C5,N.Bb4,N.G4,N.Eb4,N.C4,N.Eb4,N.G4,N.C5,
        N.G5,N.Bb5,N.C5,N.Bb5,N.G5,N.Eb5,N.C5,N.G4
      ];
      return melodyToLanes(mel, b*1, b*0.5);
    },

    bgDef(ctx, master, nodes, startT, bars, beat, noiseNode, kick, snare, hat, clap, bassNote, pad, osc) {
      // Amen break pattern
      const amenPat=[{dt:0,k:true},{dt:.375,k:false},{dt:.75,k:true},{dt:1,k:false},
                     {dt:1.5,k:true},{dt:2,k:true},{dt:2.375,k:false},{dt:2.75,k:true},
                     {dt:3,k:false},{dt:3.5,k:true},{dt:3.75,k:false}];
      const bassSeq=[N.C3,N.C3,N.Eb3,N.C3,N.Bb2,N.C3,N.G2,N.Ab3];
      for (let i = 0; i < bars; i++) {
        const t = startT + i * beat * 4;
        amenPat.forEach(n => { n.k ? kick(t+n.dt*beat,0.65) : snare(t+n.dt*beat,0.22); });
        for (let k=0;k<16;k++) hat(t+k*beat*0.25, k%4===0?0.10:0.05);
        for (let k=0;k<8;k++) bassNote(bassSeq[k%8], t+k*beat*0.5, beat*0.45, 0.38);
        // Reese bass
        [N.C3,N.C3*1.015].forEach(f=>{
          const o=ctx.createOscillator(),g=ctx.createGain();
          const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=350;
          o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
        });
      }
    }
  }
];

// ===== DIFFICULTY FILTER =====
function filterChart(rawChart, difficulty) {
  if (difficulty === 'hard') return rawChart;

  // Sort by time first
  const sorted = [...rawChart].sort((a, b) => a.time - b.time);

  if (difficulty === 'easy') {
    // Keep every 4th note across all lanes - very sparse
    // Ensure no two notes at same time
    const result = [];
    let lastTime = -1;
    sorted.forEach((n, i) => {
      if (i % 4 === 0 && n.time - lastTime > 0.2) {
        result.push(n);
        lastTime = n.time;
      }
    });
    return result;
  } else {
    // Normal: every 2nd note, no simultaneous notes
    const result = [];
    let lastTime = -1;
    sorted.forEach((n, i) => {
      if (i % 2 === 0 && n.time - lastTime > 0.1) {
        result.push(n);
        lastTime = n.time;
      }
    });
    return result;
  }
}

// ===== GAME ENGINE =====
const Game = (() => {
  let currentSong=null, currentDiff='easy';
  let chart=[], noteElements={};
  let score=0, combo=0, maxCombo=0, health=100;
  let perfect=0, good=0, miss=0;
  let gameRunning=false, gamePaused=false;
  let gameStartTime=0, noteSpeed=300;
  let judgeWindow={perfect:0.18,good:0.30};
  let animFrame=null, judgeTimer=null, playfieldH=0;
  let pendingNotes=[], activeNotes=[], hitNotes=new Set();
  let totalNoteCount=0, gaugeScore=0;

  const GAUGE_PASS=80;
  const KEY_MAP={'z':0,'x':1,'c':2};
  const keyState={0:false,1:false,2:false};

  function showScreen(id) {
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  function showTitle() { AudioEngine.stopAll(); showScreen('screen-title'); }
  function showSongSelect() { AudioEngine.stopAll(); buildSongList(); showScreen('screen-select'); }

  function buildSongList() {
    const list=document.getElementById('song-list');
    list.innerHTML='';
    SONGS.forEach(song=>{
      const stars=song.diff[currentDiff];
      const card=document.createElement('div');
      card.className=`song-card genre-${song.genre}`;
      card.innerHTML=`
        <div class="song-icon">${song.icon}</div>
        <div class="song-info">
          <div class="song-name">${song.name}</div>
          <div class="song-meta">${song.desc} · BPM ${song.bpm}</div>
        </div>
        <div>
          <div class="song-bpm">${song.duration}s</div>
          <div class="song-diff-stars ${currentDiff}">${'★'.repeat(stars)+'☆'.repeat(10-stars).substring(0,8)}</div>
        </div>`;
      card.addEventListener('click',()=>startGame(song));
      card.addEventListener('touchend',e=>{e.preventDefault();startGame(song);});
      list.appendChild(card);
    });
  }

  function setDifficulty(diff) {
    currentDiff=diff;
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
    document.querySelector(`.diff-btn[data-diff="${diff}"]`).classList.add('active');
    buildSongList();
  }

  function startGame(song) {
    AudioEngine.init();
    currentSong=song;
    const raw=song.buildMelody();
    chart=filterChart(raw, currentDiff);
    totalNoteCount=chart.length;
    pendingNotes=[...chart].sort((a,b)=>a.time-b.time);
    activeNotes=[]; hitNotes=new Set();
    score=0;combo=0;maxCombo=0;health=100;perfect=0;good=0;miss=0;gaugeScore=0;

    document.getElementById('ui-song-name').textContent=song.name;
    const diffEl=document.getElementById('ui-difficulty');
    diffEl.textContent=currentDiff.toUpperCase();
    diffEl.className=`diff-label ${currentDiff}`;
    document.getElementById('ui-score').textContent='0';
    document.getElementById('ui-combo').textContent='';
    document.getElementById('health-bar').style.width='100%';
    document.getElementById('progress-bar').style.width='0%';
    document.getElementById('notes-container').innerHTML='';
    document.getElementById('hit-effects').innerHTML='';
    noteElements={};
    updateGauge();

    noteSpeed={easy:200, normal:300, hard:420}[currentDiff];
    judgeWindow={
      easy:  {perfect:0.22, good:0.38},
      normal:{perfect:0.12, good:0.22},
      hard:  {perfect:0.07, good:0.13}
    }[currentDiff];

    showScreen('screen-game');
    playfieldH=document.getElementById('playfield').clientHeight;
    gameRunning=true; gamePaused=false;

    gameStartTime=AudioEngine.now()+0.5;
    AudioEngine.playBackground(song, gameStartTime, song.duration);

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame=requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) { animFrame=requestAnimationFrame(gameLoop); return; }
    const elapsed=AudioEngine.now()-gameStartTime;

    const spawnAhead=playfieldH/noteSpeed+0.2;
    while (pendingNotes.length>0 && pendingNotes[0].time-elapsed<spawnAhead) {
      spawnNote(pendingNotes.shift());
    }
    updateNotes(elapsed);
    checkMisses(elapsed);

    document.getElementById('progress-bar').style.width=
      (Math.max(0,Math.min(elapsed/currentSong.duration,1))*100)+'%';

    if (elapsed>=currentSong.duration+2.0 && pendingNotes.length===0) {
      endGame(); return;
    }
    animFrame=requestAnimationFrame(gameLoop);
  }

  function spawnNote(note) {
    const el=document.createElement('div');
    el.className='note';
    el.dataset.lane=note.lane;
    const id=note.time.toFixed(4)+'_'+note.lane+'_'+Math.random().toString(36).slice(2,6);
    el.dataset.id=id;
    const laneLeft=[0,33.33,66.66];
    el.style.left=laneLeft[note.lane]+'%';
    el.style.width=(note.lane===2?33.34:33.33)+'%';
    el.style.top='-34px';
    document.getElementById('notes-container').appendChild(el);
    noteElements[id]=el;
    activeNotes.push({...note, elId:id});
  }

  function updateNotes(elapsed) {
    activeNotes.forEach(note=>{
      const el=noteElements[note.elId];
      if (!el) return;
      el.style.top=(playfieldH-(note.time-elapsed)*noteSpeed-32)+'px';
    });
  }

  function checkMisses(elapsed) {
    const toRemove=[];
    activeNotes.forEach(note=>{
      if (hitNotes.has(note.elId)) { toRemove.push(note.elId); return; }
      if (note.time-elapsed < -judgeWindow.good) {
        registerJudge('miss', note.lane, note.elId, note);
        toRemove.push(note.elId);
      }
    });
    toRemove.forEach(id=>removeNote(id));
  }

  function removeNote(id) {
    activeNotes=activeNotes.filter(n=>n.elId!==id);
    const el=noteElements[id];
    if (el) { el.remove(); delete noteElements[id]; }
  }

  function onKeyDown(e) {
    if (!gameRunning||gamePaused) return;
    if (e.repeat) return;
    const lane=KEY_MAP[e.key.toLowerCase()];
    if (lane===undefined||keyState[lane]) return;
    keyState[lane]=true;
    pressLane(lane);
    document.getElementById(`btn-${lane}`).classList.add('pressed');
  }
  function onKeyUp(e) {
    const lane=KEY_MAP[e.key.toLowerCase()];
    if (lane===undefined) return;
    keyState[lane]=false;
    document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
  }
  function onTouch(lane,down) {
    AudioEngine.resume();
    if (down) {
      if (!gameRunning||gamePaused) return;
      pressLane(lane);
      document.getElementById(`btn-${lane}`).classList.add('pressed');
    } else {
      document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
    }
  }

  function pressLane(lane) {
    const elapsed=AudioEngine.now()-gameStartTime;
    let bestNote=null, bestDiff=Infinity;
    activeNotes.forEach(note=>{
      if (note.lane!==lane||hitNotes.has(note.elId)) return;
      const d=Math.abs(note.time-elapsed);
      if (d<bestDiff) { bestDiff=d; bestNote=note; }
    });

    if (!bestNote) {
      // Play melody sound even on empty press (just for feel)
      const fallbackFreqs=[N.A4, N.C5, N.E5];
      AudioEngine.hitMelody(fallbackFreqs[lane], currentSong?.instrument||'piano');
      return;
    }

    if (bestDiff<=judgeWindow.perfect) {
      registerJudge('perfect',lane,bestNote.elId,bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    } else if (bestDiff<=judgeWindow.good) {
      registerJudge('good',lane,bestNote.elId,bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    }
    // Too early = ignored (no penalty)
  }

  function registerJudge(type,lane,noteId,note) {
    if (type!=='miss') {
      AudioEngine.hitMelody(note.freq, currentSong?.instrument||'piano');
    } else {
      AudioEngine.hitMiss();
    }

    if (type==='perfect') {
      score+=300+combo*2; combo++; if(combo>maxCombo)maxCombo=combo;
      health=Math.min(100,health+1.5); perfect++;
      gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*1.5);
    } else if (type==='good') {
      score+=100+combo; combo++; if(combo>maxCombo)maxCombo=combo;
      good++;
      gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*0.8);
    } else {
      combo=0; health=Math.max(0,health-6); miss++;
      gaugeScore=Math.max(0,gaugeScore-(100/totalNoteCount)*0.4);
    }

    document.getElementById('ui-score').textContent=score.toLocaleString();
    document.getElementById('ui-combo').textContent=combo>1?combo:'';

    const hb=document.getElementById('health-bar');
    hb.style.width=health+'%';
    hb.style.background=health>50
      ?'linear-gradient(90deg,var(--accent4),var(--accent1))'
      :health>25?'linear-gradient(90deg,var(--accent2),var(--accent5))'
      :'linear-gradient(90deg,#ff3333,var(--accent3))';

    updateGauge();
    showJudge(type,combo);
    showHitEffect(type,lane);
    if (health<=0) endGame();
  }

  function updateGauge() {
    const fill=document.getElementById('gauge-fill');
    const label=document.getElementById('gauge-label');
    if (!fill) return;
    const pct=Math.round(gaugeScore);
    fill.style.width=pct+'%';
    const pass=pct>=GAUGE_PASS;
    fill.className='gauge-fill '+(pass?'pass':'warn');
    if (label) label.textContent=pct+'%'+(pass?' ✓':'');
  }

  function showJudge(type,combo) {
    if (judgeTimer) clearTimeout(judgeTimer);
    const el=document.getElementById('judge-display');
    const text={perfect:'PERFECT',good:'GOOD',miss:'MISS'}[type];
    el.innerHTML=`<div class="judge-${type}">${text}${combo>1?`<div class="judge-combo">${combo} COMBO</div>`:''}</div>`;
    judgeTimer=setTimeout(()=>{el.innerHTML='';},420);
  }

  function showHitEffect(type,lane) {
    const c=document.getElementById('hit-effects');
    const el=document.createElement('div');
    el.className=`hit-effect ${type}`;
    el.dataset.lane=lane;
    c.appendChild(el);
    setTimeout(()=>el.remove(),350);
  }

  function pause() {
    if (!gameRunning) return;
    gamePaused=true;
    document.getElementById('screen-pause').classList.add('active');
  }
  function resume() {
    gamePaused=false;
    document.getElementById('screen-pause').classList.remove('active');
  }
  function quit() { endGame(); }

  function endGame() {
    gameRunning=false;
    if (animFrame) cancelAnimationFrame(animFrame);
    AudioEngine.stopAll();

    const acc=totalNoteCount>0?(perfect*300+good*100)/(totalNoteCount*300):0;
    const passed=gaugeScore>=GAUGE_PASS;
    let rank='F';
    if(acc>=0.95)rank='S'; else if(acc>=0.85)rank='A';
    else if(acc>=0.70)rank='B'; else if(acc>=0.55)rank='C';

    document.getElementById('result-rank').textContent=rank;
    document.getElementById('result-rank').className=`result-rank rank-${rank.toLowerCase()}`;
    document.getElementById('result-song-name').textContent=currentSong.name;
    document.getElementById('res-score').textContent=score.toLocaleString();
    document.getElementById('res-combo').textContent=maxCombo;
    document.getElementById('res-perfect').textContent=perfect;
    document.getElementById('res-good').textContent=good;
    document.getElementById('res-miss').textContent=miss;
    const rg=document.getElementById('res-gauge');
    const rc=document.getElementById('res-clear');
    if(rg)rg.textContent=Math.round(gaugeScore)+'%';
    if(rc){rc.textContent=passed?'✓ CLEAR':'✗ FAILED';rc.style.color=passed?'var(--accent4)':'#ff3333';}

    document.getElementById('screen-pause').classList.remove('active');
    showScreen('screen-result');
  }

  function retry() { startGame(currentSong); }

  function init() {
    document.addEventListener('keydown',onKeyDown);
    document.addEventListener('keyup',onKeyUp);
    document.addEventListener('touchstart',()=>AudioEngine.init(),{once:true});
    showScreen('screen-title');
  }

  return {showTitle,showSongSelect,setDifficulty,startGame,pause,resume,quit,retry,onTouch,init};
})();

window.addEventListener('load',()=>Game.init());
