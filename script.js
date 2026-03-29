// ===== BEAT ZONE - script.js (v3) =====
// Lane 0 = DRUM (left/cyan), Lane 1 = BASS (mid/yellow), Lane 2 = MELODY (right/magenta)

// ===== AUDIO ENGINE =====
const AudioEngine = (() => {
  let ctx = null;
  let masterGain = null;
  let bgNodes = [];

  function init() {
    if (ctx) return;
    ctx = new (window.AudioContext || window.webkitAudioContext)();
    masterGain = ctx.createGain();
    masterGain.gain.value = 0.65;
    masterGain.connect(ctx.destination);
  }

  function resume() {
    if (ctx && ctx.state === 'suspended') ctx.resume();
  }

  function now() { return ctx ? ctx.currentTime : 0; }

  function osc(type, freq, t, dur, vol) {
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(masterGain);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.01);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
    bgNodes.push(o, g);
  }

  function noiseNode(t, dur, vol, lpfFreq) {
    const buf = ctx.createBuffer(1, Math.ceil(ctx.sampleRate * dur), ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain();
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = lpfFreq;
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    src.connect(f); f.connect(g); g.connect(masterGain);
    src.start(t); src.stop(t + dur + 0.02);
    bgNodes.push(src, g, f);
  }

  // ── DRUM sounds ──
  function kick(t, vol) {
    vol = vol || 0.8;
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.frequency.setValueAtTime(180, t);
    o.frequency.exponentialRampToValueAtTime(0.001, t + 0.4);
    g.gain.setValueAtTime(vol, t);
    g.gain.exponentialRampToValueAtTime(0.001, t + 0.4);
    o.connect(g); g.connect(masterGain);
    o.start(t); o.stop(t + 0.45);
    bgNodes.push(o, g);
  }

  function snare(t, vol) {
    vol = vol || 0.3;
    noiseNode(t, 0.18, vol, 5000);
    osc('triangle', 200, t, 0.12, vol * 0.5);
  }

  function hat(t, vol) {
    vol = vol || 0.08;
    noiseNode(t, 0.04, vol, 14000);
  }

  // ── HIT sounds (player presses) ──
  function hitDrum(subtype) {
    if (!ctx) return; resume();
    const t = ctx.currentTime;
    if (subtype === 'kick') kick(t, 0.9);
    else snare(t, 0.35);
  }

  function hitBass(freq) {
    if (!ctx) return; resume();
    const t = ctx.currentTime;
    osc('sine', freq, t, 0.35, 0.5);
    osc('sawtooth', freq, t, 0.25, 0.25);
  }

  function hitMelody(freq, instrument) {
    if (!ctx) return; resume();
    instrument = instrument || 'piano';
    const t = ctx.currentTime;
    if (instrument === 'piano') {
      osc('triangle', freq, t, 0.4, 0.3);
      osc('sine', freq * 2, t, 0.2, 0.12);
    } else if (instrument === 'lead') {
      osc('sawtooth', freq, t, 0.35, 0.22);
      osc('sawtooth', freq * 1.006, t, 0.35, 0.18);
    } else {
      osc('sawtooth', freq, t, 0.35, 0.18);
      osc('sine', freq, t, 0.35, 0.12);
    }
  }

  function hitMiss() {
    if (!ctx) return; resume();
    noiseNode(ctx.currentTime, 0.06, 0.05, 2000);
  }

  function playBackground(song, startT, duration) {
    const beat = 60 / song.bpm;
    if (song.musicDef && song.musicDef.background) {
      song.musicDef.background(ctx, masterGain, bgNodes, startT, duration, beat);
    }
    // Add hi-hats background for club songs
    if (song.genre === 'club') {
      const bars = Math.ceil(duration / (beat * 4)) + 1;
      for (let i = 0; i < bars; i++) {
        for (let h = 0; h < 16; h++) {
          hat(startT + i * beat * 4 + h * beat * 0.25, 0.07);
        }
      }
    }
  }

  function stopAll() {
    bgNodes.forEach(n => { try { n.stop ? n.stop() : n.disconnect(); } catch(e){} });
    bgNodes = [];
  }

  return { init, resume, now, hitDrum, hitBass, hitMelody, hitMiss, playBackground, stopAll };
})();

// ===== NOTE FREQUENCIES =====
const N = {
  C2:65.41, Eb2:77.78, F2:87.31, G2:98, Ab2:103.83, A2:110, Bb2:116.54, B2:123.47,
  C3:130.81, D3:146.83, Eb3:155.56, E3:164.81, F3:174.61, Gb3:185, G3:196, Ab3:207.65, A3:220, Bb3:233.08, B3:246.94,
  C4:261.63, D4:293.66, Eb4:311.13, E4:329.63, F4:349.23, Gb4:369.99, G4:392, Ab4:415.30, A4:440, Bb4:466.16, B4:493.88,
  C5:523.25, D5:587.33, Eb5:622.25, E5:659.25, F5:698.46, Gb5:739.99, G5:783.99, Ab5:830.61, A5:880, Bb5:932.33, B5:987.77
};

// ===== SONG DEFINITIONS =====
const SONGS = [

  // 0: FIFTH DRIVE (Beethoven 5th inspired)
  {
    id:0, name:"FIFTH DRIVE", genre:"classic", icon:"🎹",
    bpm:126, duration:30, desc:"クラシック / Beethoven 5th",
    diff:{easy:3,normal:6,hard:9},
    musicDef:{
      buildChart() {
        const b = 60/126;
        const notes = [];
        // da-da-da-DUM motif
        const motifMel  = [N.G4,N.G4,N.G4,N.Eb4, N.F4,N.F4,N.F4,N.D4];
        const motifTime = [0, b*0.5, b, b*1.5,   b*3.5, b*4, b*4.5, b*5];
        const bassNotes = [N.C3,N.G2,N.Eb3,N.Bb2,N.C3,N.G2,N.F3,N.G2];
        const drumPat   = [
          {dt:0,t:'kick'},{dt:b,t:'snare'},{dt:b*2,t:'kick'},{dt:b*2.5,t:'kick'},{dt:b*3,t:'snare'}
        ];
        for (let bar=0; bar<7; bar++) {
          const base = b*2 + bar*b*4;
          drumPat.forEach(n => notes.push({time:base+n.dt, lane:0, drumType:n.t}));
          notes.push({time:base,     lane:1, freq:bassNotes[bar*2%8]});
          notes.push({time:base+b*2, lane:1, freq:bassNotes[(bar*2+1)%8]});
          motifTime.forEach((dt,i) => {
            if (base+dt < b*2 + 7*b*4)
              notes.push({time:base+dt, lane:2, freq:motifMel[i], instrument:'strings'});
          });
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        const chords=[[N.C3,N.Eb3,N.G3],[N.G2,N.B2,N.D3],[N.F3,N.A3,N.C4],[N.G2,N.B2,N.D3]];
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          chords[i%4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            o.type='sine';o.frequency.value=f;o.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.045,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,g);
          });
        }
      }
    }
  },

  // 1: MOONLIGHT ECHO (Beethoven Moonlight Sonata)
  {
    id:1, name:"MOONLIGHT ECHO", genre:"classic", icon:"🌙",
    bpm:108, duration:30, desc:"クラシック / Moonlight Sonata",
    diff:{easy:2,normal:4,hard:7},
    musicDef:{
      buildChart() {
        const b = 60/108; const tri = b/3;
        const mel = [N.E4,N.Gb4,N.A4,N.E4,N.Gb4,N.A4,N.D4,N.Gb4,N.A4,N.D4,N.Gb4,N.A4,
                     N.C4,N.E4,N.A4,N.C4,N.E4,N.A4,N.B3,N.E4,N.Ab4,N.B3,N.Eb4,N.Ab4];
        const bass = [N.A2,N.A2,N.G2,N.G2,N.F3,N.F3,N.E3,N.E3];
        const notes = [];
        const reps = Math.ceil(30*3/(b*mel.length))+1;
        for (let i=0; i<mel.length*reps; i++) {
          const t = b*3 + i*tri;
          if (t > b*3+30) break;
          notes.push({time:t, lane:2, freq:mel[i%mel.length], instrument:'piano'});
          if (i%6===0) notes.push({time:t, lane:0, drumType:'kick'});
          if (i%6===3) notes.push({time:t, lane:0, drumType:'snare'});
          if (i%12===0) notes.push({time:t, lane:1, freq:bass[Math.floor(i/12)%8]});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        const ch=[[N.A3,N.C4,N.E4],[N.G3,N.B3,N.D4],[N.F3,N.A3,N.C4],[N.E3,N.Ab3,N.B3]];
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          ch[i%4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            o.type='sine';o.frequency.value=f;o.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,g);
          });
        }
      }
    }
  },

  // 2: CANON PULSE (Pachelbel Canon)
  {
    id:2, name:"CANON PULSE", genre:"classic", icon:"🎼",
    bpm:120, duration:30, desc:"クラシック / Pachelbel Canon",
    diff:{easy:2,normal:5,hard:8},
    musicDef:{
      buildChart() {
        const b=60/120;
        const bassLine=[N.D3,N.A2,N.B2,N.Gb2,N.G2,N.D3,N.G2,N.A2];
        const mel1=[N.Gb4,N.E4,N.D4,N.Gb4,N.A4,N.Gb4,N.E4,N.D4];
        const mel2=[N.A4,N.B4,N.A4,N.Gb4,N.E4,N.Gb4,N.A4,N.B4];
        const mel3=[N.D5,N.C5,N.B4,N.A4,N.Gb4,N.A4,N.B4,N.C5];
        const mels=[mel1,mel1,mel2,mel2,mel3,mel3,mel3];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b*2+bar*b*4;
          [0,b,b*2,b*3].forEach((dt,i)=>notes.push({time:t+dt,lane:0,drumType:i%2===0?'kick':'snare'}));
          notes.push({time:t,lane:1,freq:bassLine[bar%8]});
          notes.push({time:t+b*2,lane:1,freq:bassLine[(bar+1)%8]});
          const mel=mels[bar];
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:2,freq:mel[i],instrument:'piano'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        const prog=[[N.D3,N.Gb3,N.A3],[N.A2,N.E3,N.A3],[N.B2,N.D3,N.Gb3],[N.Gb2,N.B2,N.D3]];
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          prog[i%4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            o.type='triangle';o.frequency.value=f;o.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,g);
          });
        }
      }
    }
  },

  // 3: AIR FLOW (Bach Air on G String)
  {
    id:3, name:"AIR FLOW", genre:"classic", icon:"🎻",
    bpm:96, duration:30, desc:"クラシック / Bach Air on G String",
    diff:{easy:1,normal:3,hard:6},
    musicDef:{
      buildChart() {
        const b=60/96;
        const mel=[N.B4,N.A4,N.Gb4,N.E4,N.D4,N.E4,N.Gb4,N.A4,N.B4,N.C5,N.B4,N.A4,N.G4,N.Gb4,N.E4,N.D4];
        const bass=[N.D3,N.C3,N.B2,N.A2,N.G2,N.Gb2,N.E3,N.A2];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b*3+bar*b*4;
          notes.push({time:t,lane:0,drumType:'kick'});
          notes.push({time:t+b*2,lane:0,drumType:'kick'});
          notes.push({time:t+b,lane:0,drumType:'snare'});
          notes.push({time:t+b*3,lane:0,drumType:'snare'});
          notes.push({time:t,lane:1,freq:bass[bar*2%8]});
          notes.push({time:t+b*2,lane:1,freq:bass[(bar*2+1)%8]});
          for (let i=0;i<4;i++) notes.push({time:t+i*b,lane:2,freq:mel[(bar*4+i)%mel.length],instrument:'strings'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        const ch=[[N.D3,N.Gb3,N.A3],[N.C3,N.E3,N.G3],[N.B2,N.D3,N.Gb3],[N.A2,N.E3,N.A3]];
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          ch[i%4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            o.type='sine';o.frequency.value=f;o.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,g);
          });
        }
      }
    }
  },

  // 4: TOCCATA RUSH (Bach Toccata & Fugue)
  {
    id:4, name:"TOCCATA RUSH", genre:"classic", icon:"⚡",
    bpm:138, duration:30, desc:"クラシック / Bach Toccata",
    diff:{easy:4,normal:7,hard:10},
    musicDef:{
      buildChart() {
        const b=60/138;
        const mel=[N.D5,N.C5,N.D5,N.Eb5,N.D5,N.C5,N.Bb4,N.A4,N.Bb4,N.C5,N.Bb4,N.A4,N.G4,N.Gb4,N.G4,N.A4];
        const bass=[N.D2,N.A2,N.D3,N.A2,N.G2,N.D3,N.G2,N.D2];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b*1.5+bar*b*4;
          [0,b*0.5,b,b*1.5,b*2,b*2.5,b*3,b*3.5].forEach((dt,i)=>{
            notes.push({time:t+dt,lane:0,drumType:(i%4===0||i%4===2)?'kick':'snare'});
          });
          for (let i=0;i<4;i++) notes.push({time:t+i*b,lane:1,freq:bass[(bar*4+i)%8]});
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:2,freq:mel[(bar*8+i)%mel.length],instrument:'strings'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          [N.D3,N.A3,N.D4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=600;
            o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.03,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
          });
        }
      }
    }
  },

  // 5: ACID DROPS (Acid House / 808 State)
  {
    id:5, name:"ACID DROPS", genre:"club", icon:"🎛",
    bpm:138, duration:30, desc:"クラブ / Acid House",
    diff:{easy:3,normal:5,hard:8},
    musicDef:{
      buildChart() {
        const b=60/138;
        const acidSeq=[N.C3,N.C3,N.C3,N.Eb3,N.C3,N.Bb2,N.C3,N.G2,N.C3,N.Eb3,N.F3,N.Eb3,N.C3,N.Bb2,N.G2,N.C3];
        const melNotes=[N.C5,N.Eb5,N.G5,N.Bb5,N.Ab5,N.G5,N.Eb5,N.C5];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b+bar*b*4;
          [0,b,b*2,b*3].forEach(dt=>notes.push({time:t+dt,lane:0,drumType:'kick'}));
          [b,b*3].forEach(dt=>notes.push({time:t+dt,lane:0,drumType:'snare'}));
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:1,freq:acidSeq[(bar*8+i)%acidSeq.length]});
          const mf=melNotes[(bar*2)%8];
          const mf2=melNotes[(bar*2+1)%8];
          notes.push({time:t,lane:2,freq:mf,instrument:'lead'});
          notes.push({time:t+b*2,lane:2,freq:mf2,instrument:'lead'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          const o=ctx.createOscillator(),g=ctx.createGain();
          const f=ctx.createBiquadFilter();f.type='lowpass';f.frequency.value=600;f.Q.value=8;
          o.type='sawtooth';o.frequency.value=N.C3;
          f.frequency.setValueAtTime(300,t);f.frequency.exponentialRampToValueAtTime(3000,t+beat*2);
          o.connect(f);f.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.12,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,f,g);
        }
      }
    }
  },

  // 6: BLUE MONDAY WAVE (New Order inspired)
  {
    id:6, name:"BLUE MONDAY WAVE", genre:"club", icon:"🌆",
    bpm:130, duration:30, desc:"クラブ / Synth-Pop",
    diff:{easy:2,normal:4,hard:7},
    musicDef:{
      buildChart() {
        const b=60/130;
        const bassRiff=[N.F2,N.F2,N.Ab2,N.F2,N.Eb2,N.F2,N.Ab2,N.Bb2];
        const melRiff=[N.F4,N.Ab4,N.Bb4,N.C5,N.Bb4,N.Ab4,N.F4,N.Eb4];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b*2+bar*b*4;
          notes.push({time:t,lane:0,drumType:'kick'});
          notes.push({time:t+b*0.75,lane:0,drumType:'kick'});
          notes.push({time:t+b*2,lane:0,drumType:'kick'});
          notes.push({time:t+b*2.75,lane:0,drumType:'kick'});
          notes.push({time:t+b,lane:0,drumType:'snare'});
          notes.push({time:t+b*3,lane:0,drumType:'snare'});
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:1,freq:bassRiff[i%8]});
          for (let i=0;i<4;i++) notes.push({time:t+i*b,lane:2,freq:melRiff[(bar*4+i)%8],instrument:'lead'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        const chords=[[N.F3,N.Ab3,N.C4],[N.Eb3,N.G3,N.Bb3],[N.Db3||N.C3,N.F3,N.Ab3],[N.Eb3,N.G3,N.Bb3]];
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          chords[i%4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=800;
            o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.045,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
          });
        }
      }
    }
  },

  // 7: AROUND THE GRID (Daft Punk inspired)
  {
    id:7, name:"AROUND THE GRID", genre:"club", icon:"🤖",
    bpm:121, duration:30, desc:"クラブ / French House",
    diff:{easy:2,normal:4,hard:7},
    musicDef:{
      buildChart() {
        const b=60/121;
        const bassHook=[N.A2,N.A2,N.A2,N.G2,N.A2,N.A2,N.E2||N.G2,N.A2];
        const melHook=[N.A4,N.C5,N.E5,N.A5,N.G4,N.A4,N.E4,N.G4];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b*2+bar*b*4;
          [0,b,b*2,b*3].forEach(dt=>notes.push({time:t+dt,lane:0,drumType:'kick'}));
          notes.push({time:t+b*0.5,lane:0,drumType:'kick'});
          [b,b*3].forEach(dt=>notes.push({time:t+dt,lane:0,drumType:'snare'}));
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:1,freq:bassHook[i%8]});
          if (bar>=1) for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:2,freq:melHook[i%8],instrument:'lead'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          [N.A3,N.E4,N.A4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            o.type='sine';o.frequency.value=f;o.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.04,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,g);
          });
        }
      }
    }
  },

  // 8: ONE MORE DRIVE (Daft Punk One More Time inspired)
  {
    id:8, name:"ONE MORE DRIVE", genre:"club", icon:"✨",
    bpm:123, duration:30, desc:"クラブ / Disco House",
    diff:{easy:2,normal:5,hard:8},
    musicDef:{
      buildChart() {
        const b=60/123;
        const bassLine=[N.D3,N.D3,N.A2,N.D3,N.G2,N.D3,N.A2,N.Bb2];
        const melody=[N.D5,N.E5,N.Gb5||N.G5,N.A5,N.Gb5||N.G5,N.E5,N.D5,N.C5,N.B4,N.A4,N.G4,N.A4,N.B4,N.D5,N.E5,N.Gb5||N.G5];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b*2+bar*b*4;
          [0,b,b*2,b*3].forEach(dt=>notes.push({time:t+dt,lane:0,drumType:'kick'}));
          [b*0.5,b*1.5,b*2.5,b*3.5].forEach(dt=>notes.push({time:t+dt,lane:0,drumType:'snare'}));
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:1,freq:bassLine[i%8]});
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:2,freq:melody[(bar*8+i)%melody.length],instrument:'lead'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        const chs=[[N.D4,N.Gb3||N.G3,N.A3],[N.G3,N.B3,N.D4],[N.A3,N.C4,N.E4],[N.Bb3,N.D4,N.F4]];
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          chs[i%4].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1200;
            o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.05,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
          });
        }
      }
    }
  },

  // 9: JUNGLE MASSIVE (90s Jungle/DnB)
  {
    id:9, name:"JUNGLE MASSIVE", genre:"club", icon:"🔊",
    bpm:160, duration:30, desc:"クラブ / 90s Jungle",
    diff:{easy:4,normal:7,hard:10},
    musicDef:{
      buildChart() {
        const b=60/160;
        const bassSeq=[N.C3,N.C3,N.Eb3,N.C3,N.Bb2,N.C3,N.G2,N.Ab3];
        const melSeq=[N.C5,N.Eb5,N.G5,N.Bb5,N.C5,N.G4,N.Eb4,N.C4];
        const amenPat=[
          {dt:0,t:'kick'},{dt:b*0.375,t:'snare'},{dt:b*0.75,t:'kick'},
          {dt:b,t:'snare'},{dt:b*1.5,t:'kick'},{dt:b*2,t:'kick'},
          {dt:b*2.375,t:'snare'},{dt:b*2.75,t:'kick'},
          {dt:b*3,t:'snare'},{dt:b*3.5,t:'kick'},{dt:b*3.75,t:'snare'}
        ];
        const notes=[];
        for (let bar=0;bar<7;bar++) {
          const t=b+bar*b*4;
          amenPat.forEach(n=>notes.push({time:t+n.dt,lane:0,drumType:n.t}));
          for (let i=0;i<8;i++) notes.push({time:t+i*b*0.5,lane:1,freq:bassSeq[i%8]});
          for (let i=0;i<4;i++) notes.push({time:t+i*b,lane:2,freq:melSeq[(bar*4+i)%8],instrument:'lead'});
        }
        return notes.sort((a,b2)=>a.time-b2.time);
      },
      background(ctx, master, nodes, startT, dur, beat) {
        for (let i=0;i<Math.ceil(dur/(beat*4))+1;i++) {
          const t=startT+i*beat*4;
          [N.C3,N.C3*1.02].forEach(f=>{
            const o=ctx.createOscillator(),g=ctx.createGain();
            const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=300;
            o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
            g.gain.setValueAtTime(0.07,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
            o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
          });
        }
      }
    }
  }
];

// ===== DIFFICULTY FILTER =====
function filterChart(chart, difficulty) {
  if (difficulty === 'hard') return chart;
  return chart.filter((note, i) => {
    if (note.lane === 0) {
      if (difficulty === 'easy') return note.drumType === 'kick';
      return true;
    }
    if (note.lane === 1) {
      if (difficulty === 'easy') return i % 3 === 0;
      return i % 2 === 0;
    }
    // melody
    const rate = difficulty === 'easy' ? 0.5 : 0.75;
    return Math.random() < rate;
  });
}

// ===== GAME ENGINE =====
const Game = (() => {
  let currentSong=null, currentDiff='easy';
  let chart=[], noteElements={};
  let score=0, combo=0, maxCombo=0, health=100;
  let perfect=0, good=0, miss=0;
  let gameRunning=false, gamePaused=false;
  let gameStartTime=0, noteSpeed=400;
  let judgeWindow={perfect:0.09,good:0.16};
  let animFrame=null, judgeTimer=null, playfieldH=0;
  let pendingNotes=[], activeNotes=[], hitNotes=new Set();
  let totalNoteCount=0, gaugeScore=0;

  const GAUGE_PASS = 80;
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
          <div class="song-diff-stars ${currentDiff}">${'★'.repeat(stars)+'☆'.repeat(10-stars).substring(0,7)}</div>
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
    const rawChart=song.musicDef.buildChart();
    chart=filterChart(rawChart,currentDiff);
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

    noteSpeed={easy:280,normal:380,hard:500}[currentDiff];
    judgeWindow={
      easy:{perfect:0.13,good:0.22},
      normal:{perfect:0.09,good:0.16},
      hard:{perfect:0.06,good:0.11}
    }[currentDiff];

    showScreen('screen-game');
    playfieldH=document.getElementById('playfield').clientHeight;
    gameRunning=true; gamePaused=false;

    const startDelay=0.5;
    gameStartTime=AudioEngine.now()+startDelay;
    AudioEngine.playBackground(song,gameStartTime,song.duration);

    if (animFrame) cancelAnimationFrame(animFrame);
    animFrame=requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) { animFrame=requestAnimationFrame(gameLoop); return; }
    const now=AudioEngine.now();
    const elapsed=now-gameStartTime;

    const spawnAhead=playfieldH/noteSpeed+0.15;
    while (pendingNotes.length>0 && pendingNotes[0].time-elapsed<spawnAhead) {
      spawnNote(pendingNotes.shift(),elapsed);
    }
    updateNotes(elapsed);
    checkMisses(elapsed);

    const prog=Math.max(0,Math.min(elapsed/currentSong.duration,1));
    document.getElementById('progress-bar').style.width=(prog*100)+'%';

    if (elapsed>=currentSong.duration+1.5 && pendingNotes.length===0 && activeNotes.length===0) {
      endGame(); return;
    }
    animFrame=requestAnimationFrame(gameLoop);
  }

  function spawnNote(note, elapsed) {
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
    activeNotes.push({...note,elId:id});
  }

  function updateNotes(elapsed) {
    activeNotes.forEach(note=>{
      const el=noteElements[note.elId];
      if (!el) return;
      const y=playfieldH-(note.time-elapsed)*noteSpeed-32;
      el.style.top=y+'px';
    });
  }

  function checkMisses(elapsed) {
    const toRemove=[];
    activeNotes.forEach(note=>{
      if (hitNotes.has(note.elId)) { toRemove.push(note.elId); return; }
      if (note.time-elapsed < -judgeWindow.good) {
        registerJudge('miss',note.lane,note.elId,note);
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
    let bestNote=null,bestDiff=Infinity;
    activeNotes.forEach(note=>{
      if (note.lane!==lane||hitNotes.has(note.elId)) return;
      const diff=Math.abs(note.time-elapsed);
      if (diff<bestDiff) { bestDiff=diff; bestNote=note; }
    });

    if (!bestNote) { playSoundForLane(lane,null); return; }

    if (bestDiff<=judgeWindow.perfect) {
      registerJudge('perfect',lane,bestNote.elId,bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    } else if (bestDiff<=judgeWindow.good) {
      registerJudge('good',lane,bestNote.elId,bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    }
    // Too early = ignored
  }

  function playSoundForLane(lane,note) {
    if (lane===0) AudioEngine.hitDrum(note?.drumType||'kick');
    else if (lane===1) AudioEngine.hitBass(note?.freq||N.C3);
    else AudioEngine.hitMelody(note?.freq||N.A4, note?.instrument||'piano');
  }

  function registerJudge(type,lane,noteId,note) {
    if (type!=='miss') playSoundForLane(lane,note);
    else AudioEngine.hitMiss();

    if (type==='perfect') {
      score+=300+combo*2; combo++; if(combo>maxCombo)maxCombo=combo;
      health=Math.min(100,health+1.5); perfect++;
      gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*1.5);
    } else if (type==='good') {
      score+=100+combo; combo++; if(combo>maxCombo)maxCombo=combo;
      good++;
      gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*0.8);
    } else {
      combo=0; health=Math.max(0,health-7); miss++;
      gaugeScore=Math.max(0,gaugeScore-(100/totalNoteCount)*0.5);
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
    const container=document.getElementById('hit-effects');
    const el=document.createElement('div');
    el.className=`hit-effect ${type}`;
    el.dataset.lane=lane;
    container.appendChild(el);
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
    if(acc>=0.95)rank='S';
    else if(acc>=0.85)rank='A';
    else if(acc>=0.70)rank='B';
    else if(acc>=0.55)rank='C';

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
