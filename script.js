// ===== BEAT ZONE v5 =====
// 10 songs: Classic×2, JPOP×2, Western Pop×2, Club×2, R&B×2
// 3 lanes = LOW / MID / HIGH melody
// Background: drums + bass + pads always playing

// ===== NOTE FREQUENCIES =====
const N = {
  C2:65.41,D2:73.42,E2:82.41,F2:87.31,G2:98,A2:110,Bb2:116.54,B2:123.47,
  C3:130.81,D3:146.83,Eb3:155.56,E3:164.81,F3:174.61,Gb3:185,G3:196,Ab3:207.65,A3:220,Bb3:233.08,B3:246.94,
  C4:261.63,D4:293.66,Eb4:311.13,E4:329.63,F4:349.23,Gb4:369.99,G4:392,Ab4:415.30,A4:440,Bb4:466.16,B4:493.88,
  C5:523.25,D5:587.33,Eb5:622.25,E5:659.25,F5:698.46,Gb5:739.99,G5:783.99,Ab5:830.61,A5:880,Bb5:932.33,B5:987.77,
  C6:1046.5,D6:1174.66,E6:1318.51
};

// Lane note helper: ln(0=LOW, 1=MID, 2=HIGH, freq)
function ln(lane, freq) { return { lane, freq }; }

// ===== MELODY LOOP HELPER =====
// Loops mel pattern to fill song duration, with explicit lane assignments
function buildChart(mel, startTime, stepTime, duration) {
  const patDur = mel.length * stepTime;
  const reps = Math.ceil((duration - startTime + 2) / patDur) + 1;
  const notes = [];
  for (let r = 0; r < reps; r++) {
    mel.forEach((item, i) => {
      const t = startTime + r * patDur + i * stepTime;
      if (t > duration + 0.5) return;
      notes.push({ time: t, lane: item.lane, freq: item.freq });
    });
  }
  return notes;
}

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

  function osc(type, freq, t, dur, vol) {
    const o = ctx.createOscillator(), g = ctx.createGain();
    o.type = type; o.frequency.value = freq;
    o.connect(g); g.connect(master);
    g.gain.setValueAtTime(0.001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.015);
    g.gain.exponentialRampToValueAtTime(0.001, t + dur);
    o.start(t); o.stop(t + dur + 0.05);
    bgNodes.push(o, g);
  }

  function noiseN(t, dur, vol, hpf, lpf) {
    const len = Math.ceil(ctx.sampleRate * Math.max(dur, 0.02));
    const buf = ctx.createBuffer(1, len, ctx.sampleRate);
    const d = buf.getChannelData(0);
    for (let i = 0; i < len; i++) d[i] = Math.random() * 2 - 1;
    const src = ctx.createBufferSource(); src.buffer = buf;
    const g = ctx.createGain();
    const hp = ctx.createBiquadFilter(); hp.type='highpass'; hp.frequency.value = hpf||0;
    const lp = ctx.createBiquadFilter(); lp.type='lowpass';  lp.frequency.value = lpf||20000;
    g.gain.setValueAtTime(vol, t); g.gain.exponentialRampToValueAtTime(0.001, t+dur);
    src.connect(hp); hp.connect(lp); lp.connect(g); g.connect(master);
    src.start(t); src.stop(t+dur+0.02);
    bgNodes.push(src,g,hp,lp);
  }

  function kick(t, vol) {
    const o=ctx.createOscillator(), g=ctx.createGain();
    o.frequency.setValueAtTime(150,t); o.frequency.exponentialRampToValueAtTime(0.001,t+0.4);
    g.gain.setValueAtTime(vol||0.7,t); g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
    o.connect(g); g.connect(master); o.start(t); o.stop(t+0.45);
    bgNodes.push(o,g);
  }
  function snare(t, vol) {
    noiseN(t,0.15,vol||0.22,1500,8000);
    osc('triangle',200,t,0.1,(vol||0.22)*0.5);
  }
  function hat(t, vol, open) { noiseN(t,open?0.2:0.03,vol||0.07,8000,18000); }
  function clap(t, vol) {
    for(let i=0;i<3;i++) noiseN(t+i*0.01,0.06,vol||0.18,2000,10000);
  }
  function bassNote(freq, t, dur, vol) {
    osc('sine',freq,t,dur,vol||0.35);
    osc('sawtooth',freq,t,dur*0.5,(vol||0.35)*0.15);
  }
  function pad(freqs, t, dur, vol, type) {
    (freqs||[]).forEach(f=>osc(type||'sine',f,t,dur,vol||0.05));
  }

  // ── Player hit sounds by instrument type ──
  function hitNote(freq, instrument) {
    if (!ctx) return; resume();
    const t = ctx.currentTime;
    switch(instrument) {
      case 'piano':
        osc('triangle',freq,t,0.7,0.30);
        osc('sine',freq*2,t,0.3,0.12);
        osc('sine',freq*3,t,0.15,0.05);
        break;
      case 'strings':
        osc('sawtooth',freq,t,0.8,0.18);
        osc('sawtooth',freq*1.008,t,0.8,0.14);
        osc('sine',freq*0.5,t,0.5,0.07);
        break;
      case 'synth':
        osc('sawtooth',freq,t,0.4,0.22);
        osc('sawtooth',freq*1.004,t,0.4,0.18);
        osc('square',freq*0.5,t,0.25,0.06);
        break;
      case 'bell':
        osc('sine',freq,t,1.2,0.28);
        osc('sine',freq*4.01,t,0.4,0.08);
        osc('sine',freq*6.7,t,0.2,0.04);
        break;
      case 'electric':
        osc('sawtooth',freq,t,0.35,0.20);
        osc('sine',freq,t,0.35,0.15);
        osc('sine',freq*2,t,0.2,0.08);
        break;
      default:
        osc('triangle',freq,t,0.5,0.25);
        osc('sine',freq*2,t,0.25,0.10);
    }
  }

  function hitMiss() {
    if (!ctx) return; resume();
    noiseN(ctx.currentTime,0.06,0.05,0,1500);
  }

  function playBG(song, startT, dur) {
    if (!ctx||!song.bgFn) return;
    const beat = 60/song.bpm;
    const bars = Math.ceil(dur/(beat*4))+2;
    song.bgFn(ctx,master,bgNodes,startT,bars,beat,
              kick,snare,hat,clap,bassNote,pad,osc,noiseN);
  }

  function stopAll() {
    bgNodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}});
    bgNodes=[];
  }

  return {init,resume,now,hitNote,hitMiss,playBG,stopAll};
})();

// ===== SONGS =====
// Each song: { name, genre, icon, bpm, duration, diff, instrument, mel[], stepTime, bgFn() }

const SONGS = [

  // ════════════════════════════════════════════
  // 0. CLASSIC — Beethoven: Für Elise (著作権切れ)
  // ════════════════════════════════════════════
  {
    id:0, name:'FÜR ELISE', genre:'classic', icon:'🎹',
    bpm:116, duration:30, desc:'クラシック / Beethoven',
    diff:{easy:2,normal:4,hard:7}, instrument:'piano',

    mel: [
      // A section: E5-D#5-E5-D#5-E5-B4-D5-C5-A4
      ln(2,N.E5), ln(2,N.Eb5),ln(2,N.E5), ln(2,N.Eb5),
      ln(2,N.E5), ln(1,N.B4), ln(1,N.D5), ln(1,N.C5),
      ln(0,N.A4), ln(0,N.A4), ln(1,N.C4), ln(1,N.E4),
      ln(1,N.A4), ln(0,N.A4), ln(0,N.B4), ln(0,N.E4),
      // B section
      ln(2,N.E5), ln(2,N.Eb5),ln(2,N.E5), ln(2,N.Eb5),
      ln(2,N.E5), ln(1,N.B4), ln(1,N.D5), ln(1,N.C5),
      ln(0,N.A4), ln(0,N.A4), ln(1,N.C4), ln(1,N.E4),
      ln(1,N.A4), ln(0,N.G4), ln(0,N.F4), ln(0,N.E4),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.A2,N.A2,N.E3,N.E3,N.F3,N.F3,N.E3,N.E3];
      const ch=[[N.A3,N.C4,N.E4],[N.E3,N.G3,N.B3],[N.F3,N.A3,N.C4],[N.E3,N.Ab3,N.B3]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.28); kick(t+beat*2,0.20);
        snare(t+beat,0.10); snare(t+beat*3,0.10);
        bassNote(bl[i%8],t,beat*4*0.9,0.28);
        pad(ch[i%4],t,beat*4,0.05,'sine');
        // Waltz-feel hat
        for(let k=0;k<6;k++) hat(t+k*beat*0.67,0.06);
      }
    }
  },

  // ════════════════════════════════════════════
  // 1. CLASSIC — Bach: Minuet in G (著作権切れ)
  // ════════════════════════════════════════════
  {
    id:1, name:'MINUET IN G', genre:'classic', icon:'🎻',
    bpm:132, duration:30, desc:'クラシック / Bach/Petzold',
    diff:{easy:2,normal:5,hard:8}, instrument:'strings',

    mel: [
      // Minuet in G - D4 G4 A4 B4 C5 D5
      ln(0,N.D4), ln(2,N.G4), ln(2,N.A4), ln(2,N.B4),
      ln(2,N.C5), ln(2,N.D5), ln(2,N.B4), ln(2,N.G4),
      ln(1,N.E4), ln(1,N.C5), ln(1,N.D5), ln(1,N.C5),
      ln(0,N.B3), ln(2,N.G4), ln(1,N.A4), ln(2,N.B4),
      ln(2,N.C5), ln(2,N.B4), ln(2,N.A4), ln(2,N.G4),
      ln(1,N.D5), ln(1,N.D4), ln(0,N.D4), ln(0,N.D4),
      ln(0,N.E4), ln(1,N.Gb4),ln(0,N.G4), ln(1,N.A4),
      ln(2,N.B4), ln(1,N.G4), ln(0,N.G4), ln(0,N.G4),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.G2,N.G2,N.D3,N.D3,N.E3,N.E3,N.C3,N.D3];
      const ch=[[N.G3,N.B3,N.D4],[N.D3,N.Gb3,N.A3],[N.C3,N.E3,N.G3],[N.D3,N.Gb3,N.A3]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.30); kick(t+beat*2,0.22);
        snare(t+beat,0.11); snare(t+beat*3,0.11);
        bassNote(bl[i%8],t,beat*4*0.9,0.30);
        pad(ch[i%4],t,beat*4,0.055,'triangle');
        for(let k=0;k<8;k++) hat(t+k*beat*0.5,0.05);
      }
    }
  },

  // ════════════════════════════════════════════
  // 2. J-POP — 川の流れのように (美空ひばり 著作権切れに近い有名曲インスパイア)
  // ════════════════════════════════════════════
  {
    id:2, name:'RIVER FLOW', genre:'jpop', icon:'🌸',
    bpm:84, duration:30, desc:'J-POP / Japanese Ballad',
    diff:{easy:1,normal:3,hard:6}, instrument:'bell',

    mel: [
      // Pentatonic ballad feel - C major pentatonic
      ln(0,N.C4), ln(1,N.E4), ln(2,N.G4), ln(2,N.A4),
      ln(2,N.G4), ln(1,N.E4), ln(1,N.D4), ln(0,N.C4),
      ln(0,N.E4), ln(1,N.G4), ln(2,N.A4), ln(2,N.C5),
      ln(2,N.A4), ln(1,N.G4), ln(0,N.E4), ln(0,N.D4),
      ln(1,N.E4), ln(2,N.G4), ln(2,N.A4), ln(2,N.G4),
      ln(1,N.E4), ln(0,N.D4), ln(0,N.C4), ln(0,N.D4),
      ln(1,N.E4), ln(1,N.G4), ln(2,N.A4), ln(2,N.C5),
      ln(2,N.D5), ln(2,N.C5), ln(1,N.A4), ln(0,N.G4),
    ],
    stepFn(b){ return b; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.C3,N.C3,N.F3,N.F3,N.G3,N.G3,N.C3,N.C3];
      const ch=[[N.C4,N.E4,N.G4],[N.F3,N.A3,N.C4],[N.G3,N.B3,N.D4],[N.C4,N.E4,N.G4]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.30); kick(t+beat*2,0.22);
        snare(t+beat,0.12); snare(t+beat*3,0.12);
        bassNote(bl[i%8],t,beat*4,0.30);
        pad(ch[i%4],t,beat*4,0.06,'sine');
        // Gentle 8th hats
        for(let k=0;k<8;k++) hat(t+k*beat*0.5,0.05);
      }
    }
  },

  // ════════════════════════════════════════════
  // 3. J-POP — 勝手にシンドバッド スタイル (サザンオールスターズ インスパイア)
  // ════════════════════════════════════════════
  {
    id:3, name:'SHINDABAD GROOVE', genre:'jpop', icon:'🎤',
    bpm:138, duration:30, desc:'J-POP / City Pop',
    diff:{easy:2,normal:5,hard:8}, instrument:'electric',

    mel: [
      // City pop - bright, major, syncopated
      ln(0,N.G4), ln(1,N.A4), ln(2,N.B4), ln(2,N.D5),
      ln(2,N.E5), ln(2,N.D5), ln(1,N.B4), ln(1,N.A4),
      ln(0,N.G4), ln(0,N.A4), ln(1,N.B4), ln(2,N.E5),
      ln(2,N.Gb5),ln(2,N.E5), ln(1,N.D5), ln(0,N.B4),
      ln(1,N.A4), ln(2,N.B4), ln(2,N.D5), ln(2,N.E5),
      ln(2,N.Gb5),ln(2,N.E5), ln(1,N.D5), ln(1,N.B4),
      ln(0,N.A4), ln(0,N.G4), ln(1,N.A4), ln(2,N.B4),
      ln(2,N.D5), ln(2,N.E5), ln(2,N.Gb5),ln(2,N.G5),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.G2,N.G2,N.E3,N.E3,N.A2,N.A2,N.D3,N.D3];
      const ch=[[N.G3,N.B3,N.D4],[N.E3,N.Ab3,N.B3],[N.A3,N.C4,N.E4],[N.D3,N.Gb3,N.A3]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.60); kick(t+beat*2,0.50);
        snare(t+beat,0.22); snare(t+beat*3,0.22);
        for(let k=0;k<16;k++) hat(t+k*beat*0.25,k%4===0?0.10:0.06);
        bassNote(bl[i%8],t,beat*2*0.9,0.35);
        bassNote(bl[(i+1)%8],t+beat*2,beat*2*0.9,0.35);
        pad(ch[i%4],t,beat*4,0.05,'sawtooth');
      }
    }
  },

  // ════════════════════════════════════════════
  // 4. WESTERN POP — ボヘミアン・ラプソディ スタイル (Queen インスパイア)
  // ════════════════════════════════════════════
  {
    id:4, name:'BOHEMIAN NIGHTS', genre:'western', icon:'🎸',
    bpm:72, duration:30, desc:'洋楽 / Rock Ballad',
    diff:{easy:2,normal:4,hard:7}, instrument:'strings',

    mel: [
      // Bb major - operatic feel
      ln(0,N.Bb4),ln(0,N.Bb4),ln(1,N.Bb4),ln(2,N.C5),
      ln(2,N.D5), ln(2,N.Eb5),ln(2,N.D5), ln(1,N.C5),
      ln(1,N.Bb4),ln(0,N.A4), ln(0,N.Bb4),ln(0,N.A4),
      ln(0,N.G4), ln(1,N.F4), ln(0,N.G4), ln(1,N.F4),
      ln(2,N.Eb5),ln(2,N.Eb5),ln(2,N.D5), ln(2,N.Eb5),
      ln(2,N.F5), ln(2,N.Eb5),ln(2,N.D5), ln(1,N.C5),
      ln(1,N.Bb4),ln(1,N.A4), ln(1,N.Bb4),ln(2,N.C5),
      ln(2,N.D5), ln(2,N.Eb5),ln(2,N.F5), ln(2,N.G5),
    ],
    stepFn(b){ return b; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.Bb2,N.Bb2,N.F3,N.F3,N.Eb3,N.Eb3,N.Bb2,N.F2||N.F3];
      const ch=[[N.Bb3,N.D4,N.F4],[N.F3,N.A3,N.C4],[N.Eb3,N.G3,N.Bb3],[N.Bb3,N.D4,N.F4]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.35); kick(t+beat*2,0.28);
        snare(t+beat,0.18); snare(t+beat*3,0.18);
        bassNote(bl[i%8],t,beat*4,0.32);
        pad(ch[i%4],t,beat*4,0.06,'sine');
        for(let k=0;k<8;k++) hat(t+k*beat*0.5,0.07);
        // Clap on 2&4
        clap(t+beat,0.15); clap(t+beat*3,0.15);
      }
    }
  },

  // ════════════════════════════════════════════
  // 5. WESTERN POP — Shape of You スタイル (Ed Sheeran インスパイア)
  // ════════════════════════════════════════════
  {
    id:5, name:'SHAPE OF NOW', genre:'western', icon:'🎵',
    bpm:96, duration:30, desc:'洋楽 / Pop',
    diff:{easy:2,normal:4,hard:7}, instrument:'electric',

    mel: [
      // C# minor pentatonic hook
      ln(0,N.E4), ln(0,N.Ab4),ln(1,N.B4), ln(2,N.E5),
      ln(2,N.E5), ln(2,N.Ab5),ln(2,N.Gb5),ln(2,N.E5),
      ln(1,N.E5), ln(1,N.Gb5),ln(2,N.Ab5),ln(2,N.B5)||ln(2,N.Bb5),
      ln(2,N.Ab5),ln(2,N.Gb5),ln(1,N.E5), ln(0,N.E5),
      ln(0,N.E4), ln(1,N.Ab4),ln(2,N.B4), ln(2,N.E5),
      ln(2,N.Gb5),ln(2,N.E5), ln(1,N.B4), ln(1,N.Ab4),
      ln(1,N.Gb4),ln(0,N.E4), ln(0,N.Ab4),ln(1,N.B4),
      ln(2,N.E5), ln(2,N.Gb5),ln(2,N.Ab5),ln(2,N.E5),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.E3,N.E3,N.A2,N.A2,N.B2,N.B2,N.Ab2,N.Ab2];
      const ch=[[N.E4,N.Ab4,N.B4],[N.A3,N.C4,N.E4],[N.B3,N.D4,N.Gb4],[N.Ab3,N.C4,N.Eb4]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.65); kick(t+beat*2,0.55);
        snare(t+beat,0.22); snare(t+beat*3,0.22);
        for(let k=0;k<16;k++) hat(t+k*beat*0.25,k%2===0?0.09:0.05);
        bassNote(bl[i%8],t,beat*2*0.9,0.38);
        bassNote(bl[(i+1)%8],t+beat*2,beat*2*0.9,0.38);
        pad(ch[i%4],t,beat*4,0.05,'sawtooth');
      }
    }
  },

  // ════════════════════════════════════════════
  // 6. CLUB — Around the World スタイル (Daft Punk インスパイア)
  // ════════════════════════════════════════════
  {
    id:6, name:'AROUND THE GRID', genre:'club', icon:'🤖',
    bpm:121, duration:30, desc:'クラブ / French House',
    diff:{easy:2,normal:4,hard:7}, instrument:'synth',

    mel: [
      // A minor repeating hook - ascending then descending
      ln(0,N.A4), ln(0,N.A4), ln(1,N.A4), ln(0,N.G4),
      ln(0,N.A4), ln(1,N.A4), ln(2,N.E5), ln(1,N.A4),
      ln(0,N.A4), ln(0,N.A4), ln(1,N.C5), ln(2,N.E5),
      ln(2,N.A5), ln(2,N.G5), ln(1,N.E5), ln(1,N.C5),
      ln(1,N.A4), ln(0,N.G4), ln(0,N.E4), ln(0,N.A4),
      ln(0,N.G4), ln(0,N.E4), ln(0,N.D4), ln(0,N.E4),
      ln(1,N.G4), ln(1,N.A4), ln(2,N.C5), ln(2,N.E5),
      ln(2,N.A5), ln(2,N.G5), ln(2,N.E5), ln(2,N.A5),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.A2,N.A2,N.A2,N.G2,N.A2,N.A2,N.E2||N.G2,N.A2];
      const ch=[[N.A3,N.C4,N.E4],[N.G3,N.B3,N.D4],[N.F3,N.A3,N.C4],[N.E3,N.G3,N.B3]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        // 4-on-floor + syncopation
        kick(t,0.70); kick(t+beat*0.5,0.45); kick(t+beat,0.55); kick(t+beat*1.5,0.40);
        kick(t+beat*2,0.70); kick(t+beat*2.5,0.45); kick(t+beat*3,0.55); kick(t+beat*3.5,0.40);
        clap(t+beat,0.22); clap(t+beat*3,0.22);
        for(let k=0;k<16;k++) hat(t+k*beat*0.25,k%2===0?0.10:0.05);
        for(let k=0;k<8;k++) bassNote(bl[k%8],t+k*beat*0.5,beat*0.45,0.38);
        // Staccato stabs
        ch[i%4].forEach(f=>{
          const o=ctx.createOscillator(),g=ctx.createGain();
          const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=1400;
          o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
          [0,beat*2].forEach(dt=>{
            g.gain.setValueAtTime(0.07,t+dt);g.gain.exponentialRampToValueAtTime(0.001,t+dt+0.15);
          });
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
        });
      }
    }
  },

  // ════════════════════════════════════════════
  // 7. CLUB — Blue Monday スタイル (New Order インスパイア)
  // ════════════════════════════════════════════
  {
    id:7, name:'BLUE MONDAY WAVE', genre:'club', icon:'🌆',
    bpm:130, duration:30, desc:'クラブ / Synth-Pop',
    diff:{easy:2,normal:4,hard:7}, instrument:'synth',

    mel: [
      // F minor synth lead
      ln(0,N.F4), ln(1,N.Ab4),ln(2,N.Bb4),ln(2,N.C5),
      ln(2,N.Bb4),ln(1,N.Ab4),ln(0,N.F4), ln(0,N.Eb4),
      ln(0,N.F4), ln(1,N.Ab4),ln(2,N.Bb4),ln(2,N.C5),
      ln(2,N.Eb5),ln(2,N.C5), ln(1,N.Bb4),ln(0,N.Ab4),
      ln(0,N.F4), ln(0,N.Eb4),ln(0,N.F4), ln(1,N.Ab4),
      ln(1,N.Bb4),ln(2,N.C5), ln(2,N.Bb4),ln(1,N.Ab4),
      ln(0,N.G4), ln(1,N.Ab4),ln(1,N.Bb4),ln(2,N.C5),
      ln(2,N.F5), ln(2,N.Eb5),ln(2,N.C5), ln(2,N.Bb4),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.F3,N.F3,N.Ab2,N.F3,N.Eb3,N.F3,N.Ab2,N.Bb2];
      const ch=[[N.F3,N.Ab3,N.C4],[N.Eb3,N.G3,N.Bb3],[N.Db3||N.D3,N.F3,N.Ab3],[N.Eb3,N.G3,N.Bb3]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.65); kick(t+beat*0.75,0.45); kick(t+beat*2,0.65); kick(t+beat*2.75,0.45);
        snare(t+beat,0.25); snare(t+beat*3,0.25);
        for(let k=0;k<16;k++) hat(t+k*beat*0.25,k%4===0?0.10:0.06);
        for(let k=0;k<8;k++) bassNote(bl[k%8],t+k*beat*0.5,beat*0.45,0.36);
        ch[i%4].forEach(f=>{
          const o=ctx.createOscillator(),g=ctx.createGain();
          const lp=ctx.createBiquadFilter();lp.type='lowpass';
          lp.frequency.setValueAtTime(400,t);lp.frequency.linearRampToValueAtTime(1600,t+beat*2);
          lp.frequency.linearRampToValueAtTime(400,t+beat*4);
          o.type='sawtooth';o.frequency.value=f;o.connect(lp);lp.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.065,t);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
        });
      }
    }
  },

  // ════════════════════════════════════════════
  // 8. R&B — Isn't She Lovely スタイル (Stevie Wonder インスパイア)
  // ════════════════════════════════════════════
  {
    id:8, name:"ISN'T SHE GROOVY", genre:'rnb', icon:'✨',
    bpm:100, duration:30, desc:'R&B / Stevie Wonder Style',
    diff:{easy:2,normal:4,hard:7}, instrument:'electric',

    mel: [
      // E major - bright, joyful
      ln(2,N.E5), ln(2,N.Gb5),ln(2,N.Ab5),ln(2,N.B5)||ln(2,N.Bb5),
      ln(2,N.Ab5),ln(2,N.Gb5),ln(1,N.E5), ln(1,N.B4),
      ln(1,N.Ab4),ln(0,N.Gb4),ln(0,N.E4), ln(0,N.Gb4),
      ln(1,N.Ab4),ln(1,N.B4), ln(2,N.E5), ln(2,N.Gb5),
      ln(2,N.Ab5),ln(2,N.B4), ln(2,N.Ab5),ln(2,N.Gb5),
      ln(1,N.E5), ln(1,N.Ab4),ln(0,N.Gb4),ln(0,N.E4),
      ln(0,N.Gb4),ln(1,N.Ab4),ln(2,N.B4), ln(2,N.E5),
      ln(2,N.Gb5),ln(2,N.Ab5),ln(2,N.B5)||ln(2,N.Bb5),ln(2,N.E5),
    ],
    stepFn(b){ return b*0.5; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.E3,N.E3,N.A2,N.A2,N.B2,N.B2,N.Ab2,N.Ab2];
      const ch=[[N.E4,N.Ab4,N.B4],[N.A3,N.C4,N.E4],[N.B3,N.D4,N.Gb4],[N.Ab3,N.C4,N.E4]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.60); kick(t+beat*2.5,0.45);
        snare(t+beat,0.22); snare(t+beat*3,0.22);
        for(let k=0;k<16;k++) hat(t+k*beat*0.25,k%2===0?0.10:0.06);
        // Thumb bass (slap feel)
        bassNote(bl[i%8],t,beat*0.3,0.45);
        bassNote(bl[i%8],t+beat*1.5,beat*0.3,0.35);
        bassNote(bl[(i+1)%8],t+beat*2,beat*0.3,0.45);
        bassNote(bl[(i+1)%8],t+beat*3.5,beat*0.3,0.35);
        pad(ch[i%4],t,beat*4,0.055,'sine');
        clap(t+beat,0.18); clap(t+beat*3,0.18);
      }
    }
  },

  // ════════════════════════════════════════════
  // 9. R&B — I Will Always Love You スタイル (Whitney Houston インスパイア)
  // ════════════════════════════════════════════
  {
    id:9, name:'ALWAYS LOVE YOU', genre:'rnb', icon:'💖',
    bpm:66, duration:30, desc:'R&B / Power Ballad',
    diff:{easy:1,normal:3,hard:6}, instrument:'bell',

    mel: [
      // D major - soaring ballad melody
      ln(0,N.D4), ln(0,N.D4), ln(1,N.E4), ln(1,N.Gb4),
      ln(2,N.A4), ln(2,N.A4), ln(1,N.Gb4),ln(1,N.E4),
      ln(1,N.D4), ln(0,N.D4), ln(0,N.E4), ln(1,N.D4),
      ln(1,N.A4), ln(2,N.A4), ln(2,N.A4), ln(2,N.B4),
      ln(2,N.D5), ln(2,N.D5), ln(2,N.E5), ln(2,N.Gb5),
      ln(2,N.A5), ln(2,N.Gb5),ln(2,N.E5), ln(1,N.D5),
      ln(1,N.E5), ln(2,N.Gb5),ln(2,N.A5), ln(2,N.B5)||ln(2,N.Bb5),
      ln(2,N.A5), ln(2,N.Gb5),ln(2,N.E5), ln(2,N.D5),
    ],
    stepFn(b){ return b; },

    bgFn(ctx,master,nodes,startT,bars,beat,kick,snare,hat,clap,bassNote,pad,osc,noiseN){
      const bl=[N.D3,N.D3,N.G3,N.G3,N.A3,N.A3,N.Bb3||N.B3,N.A3];
      const ch=[[N.D4,N.Gb4,N.A4],[N.G3,N.B3,N.D4],[N.A3,N.C4,N.E4],[N.Bb3||N.B3,N.D4,N.F4]];
      for(let i=0;i<bars;i++){
        const t=startT+i*beat*4;
        kick(t,0.30); kick(t+beat*2,0.22);
        snare(t+beat,0.15); snare(t+beat*3,0.15);
        bassNote(bl[i%8],t,beat*4,0.30);
        pad(ch[i%4],t,beat*4,0.07,'sine');
        // Soft hats
        for(let k=0;k<8;k++) hat(t+k*beat*0.5,0.06);
        // Strings swell
        [ch[i%4][0]*2,ch[i%4][1]*2].forEach(f=>{
          const o=ctx.createOscillator(),g=ctx.createGain();
          o.type='sawtooth';o.frequency.value=f;
          const lp=ctx.createBiquadFilter();lp.type='lowpass';lp.frequency.value=700;
          o.connect(lp);lp.connect(g);g.connect(master);
          g.gain.setValueAtTime(0.0,t);g.gain.linearRampToValueAtTime(0.04,t+beat);
          g.gain.setValueAtTime(0.04,t+beat*3);g.gain.exponentialRampToValueAtTime(0.001,t+beat*4);
          o.start(t);o.stop(t+beat*4+0.1);nodes.push(o,lp,g);
        });
      }
    }
  }

]; // end SONGS

// ===== DIFFICULTY FILTER =====
// Filters each lane independently to ensure all 3 lanes always appear
function filterChart(rawChart, difficulty) {
  if (difficulty === 'hard') return rawChart;

  // Split by lane
  const byLane = [[],[],[]];
  rawChart.forEach(n => byLane[n.lane].push(n));

  let result = [];
  if (difficulty === 'easy') {
    // Each lane: keep every Nth note
    byLane.forEach((laneNotes, li) => {
      const step = li === 2 ? 2 : 3; // high lane denser
      laneNotes.forEach((n,i) => { if(i%step===0) result.push(n); });
    });
  } else { // normal
    byLane.forEach((laneNotes, li) => {
      laneNotes.forEach((n,i) => { if(i%2===0) result.push(n); });
    });
  }

  // Sort by time and remove notes too close together (< 80ms apart)
  result.sort((a,b) => a.time - b.time);
  const clean = [];
  let lastT = -1;
  result.forEach(n => {
    if (n.time - lastT >= 0.08) { clean.push(n); lastT = n.time; }
  });
  return clean;
}

// ===== GAME ENGINE =====
const Game = (() => {
  let currentSong=null, currentDiff='easy';
  let chart=[], noteElements={};
  let score=0, combo=0, maxCombo=0, health=100;
  let perfect=0, good=0, miss=0;
  let gameRunning=false, gamePaused=false;
  let gameStartTime=0, noteSpeed=300;
  let judgeWindow={perfect:0.18,good:0.32};
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

  const GENRE_LABELS = {classic:'🎼 クラシック',jpop:'🌸 J-POP',western:'🎸 洋楽',club:'🎛 クラブ',rnb:'✨ R&B'};

  function buildSongList() {
    const list=document.getElementById('song-list');
    list.innerHTML='';
    let lastGenre='';
    SONGS.forEach(song=>{
      if (song.genre !== lastGenre) {
        const hdr=document.createElement('div');
        hdr.className='genre-header';
        hdr.textContent=GENRE_LABELS[song.genre]||song.genre;
        list.appendChild(hdr);
        lastGenre=song.genre;
      }
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

    // Build chart using song's mel array and stepFn
    const b = 60/song.bpm;
    const step = song.stepFn(b);
    const raw = buildChart(song.mel, b*2, step, song.duration);
    chart = filterChart(raw, currentDiff);
    totalNoteCount = chart.length;
    pendingNotes = [...chart].sort((a,b2)=>a.time-b2.time);
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

    noteSpeed={easy:200,normal:310,hard:440}[currentDiff];
    judgeWindow={
      easy:  {perfect:0.22, good:0.38},
      normal:{perfect:0.12, good:0.22},
      hard:  {perfect:0.07, good:0.13}
    }[currentDiff];

    showScreen('screen-game');
    playfieldH=document.getElementById('playfield').clientHeight;
    gameRunning=true; gamePaused=false;

    gameStartTime=AudioEngine.now()+0.5;
    AudioEngine.playBG(song, gameStartTime, song.duration);

    if(animFrame) cancelAnimationFrame(animFrame);
    animFrame=requestAnimationFrame(gameLoop);
  }

  function gameLoop() {
    if (!gameRunning) return;
    if (gamePaused) { animFrame=requestAnimationFrame(gameLoop); return; }

    const elapsed=AudioEngine.now()-gameStartTime;
    const spawnAhead=playfieldH/noteSpeed+0.25;

    while(pendingNotes.length>0 && pendingNotes[0].time-elapsed<spawnAhead) {
      spawnNote(pendingNotes.shift());
    }
    updateNotes(elapsed);
    checkMisses(elapsed);

    document.getElementById('progress-bar').style.width=
      (Math.max(0,Math.min(elapsed/currentSong.duration,1))*100)+'%';

    // End when song time passed AND no notes remain
    if(elapsed >= currentSong.duration+2.0 && pendingNotes.length===0 && activeNotes.length===0) {
      endGame(); return;
    }
    animFrame=requestAnimationFrame(gameLoop);
  }

  function spawnNote(note) {
    const el=document.createElement('div');
    el.className='note';
    el.dataset.lane=note.lane;
    const id=note.time.toFixed(4)+'_'+note.lane+'_'+Math.random().toString(36).slice(2,5);
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
      if(!el) return;
      el.style.top=(playfieldH-(note.time-elapsed)*noteSpeed-32)+'px';
    });
  }

  function checkMisses(elapsed) {
    const toRemove=[];
    activeNotes.forEach(note=>{
      if(hitNotes.has(note.elId)){toRemove.push(note.elId);return;}
      if(note.time-elapsed < -judgeWindow.good) {
        registerJudge('miss',note.lane,note.elId,note);
        toRemove.push(note.elId);
      }
    });
    toRemove.forEach(id=>removeNote(id));
  }

  function removeNote(id) {
    activeNotes=activeNotes.filter(n=>n.elId!==id);
    const el=noteElements[id];
    if(el){el.remove();delete noteElements[id];}
  }

  function onKeyDown(e) {
    if(!gameRunning||gamePaused||e.repeat) return;
    const lane=KEY_MAP[e.key.toLowerCase()];
    if(lane===undefined||keyState[lane]) return;
    keyState[lane]=true;
    pressLane(lane);
    document.getElementById(`btn-${lane}`).classList.add('pressed');
  }
  function onKeyUp(e) {
    const lane=KEY_MAP[e.key.toLowerCase()];
    if(lane===undefined) return;
    keyState[lane]=false;
    document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
  }
  function onTouch(lane,down) {
    AudioEngine.resume();
    if(down) {
      if(!gameRunning||gamePaused) return;
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
      if(note.lane!==lane||hitNotes.has(note.elId)) return;
      const d=Math.abs(note.time-elapsed);
      if(d<bestDiff){bestDiff=d;bestNote=note;}
    });

    if(!bestNote) {
      // Play fallback sound even with no note
      const fallback=[N.A4,N.C5,N.E5][lane];
      AudioEngine.hitNote(fallback, currentSong?.instrument||'piano');
      return;
    }

    if(bestDiff<=judgeWindow.perfect) {
      registerJudge('perfect',lane,bestNote.elId,bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    } else if(bestDiff<=judgeWindow.good) {
      registerJudge('good',lane,bestNote.elId,bestNote);
      hitNotes.add(bestNote.elId); removeNote(bestNote.elId);
    }
  }

  function registerJudge(type,lane,noteId,note) {
    if(type!=='miss') AudioEngine.hitNote(note.freq, currentSong?.instrument||'piano');
    else AudioEngine.hitMiss();

    if(type==='perfect'){
      score+=300+combo*2; combo++; if(combo>maxCombo)maxCombo=combo;
      health=Math.min(100,health+1.5); perfect++;
      gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*1.5);
    } else if(type==='good'){
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
    if(health<=0) endGame();
  }

  function updateGauge() {
    const fill=document.getElementById('gauge-fill');
    const label=document.getElementById('gauge-label');
    if(!fill) return;
    const pct=Math.round(gaugeScore);
    fill.style.width=pct+'%';
    const pass=pct>=GAUGE_PASS;
    fill.className='gauge-fill '+(pass?'pass':'warn');
    if(label) label.textContent=pct+'%'+(pass?' ✓':'');
  }

  function showJudge(type,combo) {
    if(judgeTimer) clearTimeout(judgeTimer);
    const el=document.getElementById('judge-display');
    const text={perfect:'PERFECT',good:'GOOD',miss:'MISS'}[type];
    const comboHtml=combo>1?`<div class="judge-combo">${combo} COMBO</div>`:'';
    el.innerHTML=`<div class="judge-${type}">${text}${comboHtml}</div>`;
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
    if(!gameRunning) return;
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
    if(animFrame) cancelAnimationFrame(animFrame);
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
    if(rg) rg.textContent=Math.round(gaugeScore)+'%';
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
