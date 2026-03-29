const SONGS = [
  {
    id:0,name:'月光花',genre:'jpop',icon:'🌸',
    bpm:120,duration:35,diff:{easy:3,normal:6,hard:9},instrument:'synth',
    rawNotes:[{t:4.935,l:2,f:622.25},{t:5.338,l:2,f:554.37},{t:5.694,l:2,f:466.16},{t:6.076,l:2,f:415.3},{t:6.467,l:1,f:246.94},{t:6.811,l:1,f:311.13},{t:7.191,l:2,f:622.25},{t:7.553,l:2,f:554.37},{t:7.903,l:1,f:233.08},{t:8.261,l:2,f:622.25},{t:8.64,l:2,f:659.26},{t:9.012,l:2,f:622.25},{t:9.397,l:1,f:246.94},{t:9.751,l:2,f:659.26},{t:10.126,l:1,f:246.94},{t:10.492,l:0,f:155.56},{t:10.889,l:1,f:185.0},{t:11.26,l:1,f:246.94},{t:11.648,l:1,f:185.0},{t:12.002,l:2,f:554.37},{t:12.399,l:1,f:207.65},{t:12.753,l:2,f:659.26},{t:13.118,l:2,f:622.25},{t:13.458,l:1,f:369.99},{t:13.86,l:1,f:185.0},{t:14.202,l:2,f:622.25},{t:14.562,l:1,f:185.0},{t:14.946,l:0,f:116.54},{t:15.349,l:1,f:174.61},{t:15.702,l:1,f:233.08},{t:16.072,l:1,f:174.61},{t:16.442,l:2,f:466.16},{t:16.832,l:1,f:233.08},{t:17.214,l:1,f:311.13},{t:17.582,l:1,f:233.08},{t:17.964,l:0,f:103.83},{t:18.357,l:1,f:246.94},{t:18.721,l:2,f:415.3},{t:19.093,l:1,f:246.94},{t:19.452,l:2,f:415.3},{t:19.841,l:1,f:246.94},{t:20.164,l:1,f:185.0},{t:20.417,l:1,f:174.61},{t:20.535,l:1,f:246.94},{t:20.667,l:0,f:82.41},{t:20.908,l:0,f:103.83},{t:21.32,l:1,f:246.94},{t:21.683,l:1,f:311.13},{t:22.095,l:1,f:246.94},{t:22.572,l:2,f:415.3},{t:24.409,l:2,f:587.33},{t:24.569,l:2,f:659.26},{t:24.754,l:0,f:123.47},{t:25.067,l:1,f:185.0},{t:25.229,l:2,f:783.99},{t:25.4,l:1,f:246.94},{t:25.663,l:1,f:185.0},{t:26.003,l:2,f:554.37},{t:26.322,l:0,f:164.81},{t:26.472,l:2,f:783.99},{t:26.619,l:1,f:220.0},{t:26.906,l:0,f:164.81},{t:27.251,l:2,f:587.33},{t:27.584,l:0,f:146.83},{t:27.897,l:1,f:196.0},{t:28.208,l:0,f:146.83},{t:28.525,l:0,f:98.0},{t:28.843,l:0,f:146.83},{t:29.164,l:1,f:196.0},{t:29.465,l:0,f:146.83},{t:29.621,l:2,f:659.26},{t:29.789,l:2,f:739.99},{t:30.092,l:1,f:185.0},{t:30.221,l:2,f:783.99},{t:30.404,l:1,f:246.94},{t:30.686,l:1,f:185.0},{t:31.025,l:0,f:110.0},{t:31.344,l:0,f:164.81},{t:31.446,l:2,f:440.0},{t:31.647,l:1,f:220.0},{t:31.834,l:2,f:783.99},{t:31.965,l:1,f:277.18},{t:32.266,l:2,f:739.99},{t:32.624,l:0,f:146.83},{t:32.953,l:1,f:196.0},{t:33.268,l:1,f:246.94},{t:33.587,l:1,f:196.0},{t:33.914,l:0,f:146.83},{t:34.217,l:0,f:110.0},{t:34.526,l:2,f:783.99},{t:34.84,l:2,f:739.99}]
  },
  {
    id:1,name:'GET WILD',genre:'jpop',icon:'🎸',
    bpm:128,duration:35,diff:{easy:2,normal:5,hard:8},instrument:'synth',
    rawNotes:[{t:2.0,l:1,f:207.65},{t:2.5,l:2,f:554.37},{t:3.0,l:0,f:164.81},{t:3.75,l:2,f:622.25},{t:4.0,l:0,f:185.0},{t:4.375,l:2,f:493.88},{t:4.75,l:2,f:493.88},{t:5.0,l:1,f:246.94},{t:5.5,l:1,f:233.08},{t:5.75,l:2,f:493.88},{t:5.875,l:2,f:554.37},{t:6.0,l:1,f:207.65},{t:6.375,l:2,f:622.25},{t:6.75,l:2,f:659.26},{t:7.0,l:0,f:164.81},{t:7.375,l:2,f:493.88},{t:7.75,l:2,f:622.25},{t:8.0,l:0,f:185.0},{t:8.375,l:2,f:554.37},{t:8.75,l:2,f:493.88},{t:9.0,l:1,f:246.94},{t:9.5,l:1,f:233.08},{t:10.0,l:1,f:207.65},{t:10.5,l:2,f:554.37},{t:11.0,l:0,f:164.81},{t:11.75,l:2,f:622.25},{t:12.0,l:0,f:185.0},{t:12.375,l:2,f:493.88},{t:12.75,l:2,f:493.88},{t:13.0,l:1,f:246.94},{t:13.5,l:1,f:233.08},{t:13.75,l:2,f:493.88},{t:13.875,l:2,f:554.37},{t:14.0,l:1,f:207.65},{t:14.375,l:2,f:622.25},{t:14.75,l:2,f:659.26},{t:15.0,l:0,f:164.81},{t:15.375,l:2,f:493.88},{t:15.75,l:2,f:622.25},{t:16.0,l:0,f:185.0},{t:16.375,l:2,f:554.37},{t:16.75,l:2,f:493.88},{t:17.0,l:1,f:246.94},{t:18.0,l:0,f:123.47},{t:24.0,l:1,f:220.0},{t:24.125,l:0,f:196.0},{t:24.25,l:0,f:185.0},{t:24.375,l:0,f:164.81},{t:24.5,l:0,f:196.0},{t:24.625,l:0,f:185.0},{t:24.75,l:0,f:164.81},{t:24.875,l:0,f:146.83},{t:25.0,l:1,f:293.66},{t:25.167,l:2,f:440.0},{t:25.333,l:2,f:440.0},{t:25.5,l:1,f:329.63},{t:25.667,l:2,f:493.88},{t:25.833,l:2,f:493.88},{t:26.0,l:0,f:123.47},{t:33.0,l:1,f:293.66},{t:33.167,l:2,f:440.0},{t:33.333,l:2,f:440.0},{t:33.5,l:1,f:329.63},{t:33.667,l:2,f:493.88},{t:33.833,l:2,f:493.88}]
  },
  {
    id:2,name:'Believe / Tomorrow',genre:'jpop',icon:'🌟',
    bpm:120,duration:35,diff:{easy:3,normal:6,hard:9},instrument:'synth',
    rawNotes:[{t:2.0,l:1,f:587.33},{t:2.25,l:2,f:1567.98},{t:2.5,l:2,f:1479.98},{t:2.75,l:1,f:659.26},{t:3.5,l:1,f:739.99},{t:3.746,l:1,f:659.26},{t:3.85,l:0,f:392.0},{t:3.95,l:0,f:246.94},{t:5.967,l:0,f:293.66},{t:6.092,l:0,f:440.0},{t:6.25,l:1,f:880.0},{t:6.5,l:2,f:1174.66},{t:6.75,l:0,f:293.66},{t:7.0,l:2,f:1174.66},{t:7.25,l:0,f:293.66},{t:7.5,l:2,f:1174.66},{t:7.75,l:2,f:1760.0},{t:8.0,l:0,f:277.18},{t:8.25,l:1,f:880.0},{t:8.5,l:2,f:1174.66},{t:8.75,l:0,f:277.18},{t:9.0,l:2,f:1318.51},{t:9.25,l:0,f:277.18},{t:9.5,l:0,f:277.18},{t:9.75,l:2,f:1760.0},{t:10.0,l:0,f:293.66},{t:10.25,l:1,f:880.0},{t:10.5,l:2,f:1174.66},{t:10.75,l:0,f:293.66},{t:11.0,l:2,f:1174.66},{t:11.25,l:0,f:293.66},{t:11.5,l:2,f:1174.66},{t:11.75,l:2,f:1760.0},{t:12.0,l:0,f:293.66},{t:12.25,l:1,f:880.0},{t:12.5,l:2,f:1174.66},{t:12.75,l:0,f:293.66},{t:13.0,l:2,f:1567.98},{t:13.25,l:0,f:293.66},{t:13.5,l:0,f:293.66},{t:13.75,l:2,f:1174.66},{t:14.0,l:0,f:293.66},{t:14.25,l:1,f:783.99},{t:14.5,l:2,f:1174.66},{t:14.75,l:0,f:293.66},{t:15.0,l:2,f:1174.66},{t:15.25,l:0,f:293.66},{t:15.5,l:2,f:1174.66},{t:15.75,l:2,f:1760.0},{t:16.0,l:0,f:293.66},{t:16.25,l:1,f:880.0},{t:16.5,l:2,f:1174.66},{t:16.75,l:0,f:293.66},{t:17.0,l:2,f:1174.66},{t:17.25,l:0,f:293.66},{t:17.5,l:0,f:293.66},{t:17.75,l:2,f:1760.0},{t:18.0,l:0,f:293.66},{t:18.25,l:1,f:987.77},{t:18.5,l:2,f:1174.66},{t:18.75,l:0,f:293.66},{t:19.0,l:2,f:1174.66},{t:19.25,l:0,f:293.66},{t:19.5,l:2,f:1174.66},{t:19.75,l:2,f:1760.0},{t:20.0,l:0,f:277.18},{t:20.25,l:1,f:880.0},{t:20.5,l:0,f:277.18},{t:20.75,l:2,f:1760.0},{t:21.0,l:2,f:1567.98},{t:21.25,l:0,f:277.18},{t:21.5,l:2,f:1318.51},{t:21.75,l:2,f:1567.98},{t:22.0,l:0,f:293.66},{t:22.25,l:1,f:880.0},{t:22.5,l:2,f:1174.66},{t:22.75,l:0,f:293.66},{t:23.0,l:2,f:1174.66},{t:23.25,l:0,f:293.66},{t:23.5,l:2,f:1174.66},{t:23.75,l:2,f:1760.0},{t:24.0,l:0,f:277.18},{t:24.25,l:1,f:880.0},{t:24.5,l:2,f:1174.66},{t:24.75,l:0,f:277.18},{t:25.0,l:2,f:1174.66},{t:25.25,l:0,f:277.18},{t:25.5,l:2,f:1174.66},{t:25.75,l:2,f:1760.0},{t:26.0,l:0,f:293.66},{t:26.25,l:1,f:880.0},{t:26.5,l:2,f:1174.66},{t:26.75,l:0,f:293.66},{t:27.0,l:2,f:1174.66},{t:27.25,l:0,f:293.66},{t:27.5,l:2,f:1174.66},{t:27.75,l:2,f:1760.0},{t:28.0,l:0,f:293.66},{t:28.25,l:1,f:880.0},{t:28.5,l:2,f:1174.66},{t:28.75,l:0,f:293.66},{t:29.0,l:2,f:1174.66},{t:29.25,l:0,f:293.66},{t:29.5,l:2,f:1174.66},{t:29.75,l:2,f:1760.0},{t:30.0,l:0,f:293.66},{t:30.25,l:1,f:783.99},{t:30.5,l:2,f:1174.66},{t:30.75,l:0,f:293.66},{t:31.0,l:2,f:1174.66},{t:31.25,l:0,f:293.66},{t:31.5,l:2,f:1174.66},{t:31.75,l:2,f:1567.98},{t:32.0,l:0,f:277.18},{t:32.25,l:1,f:880.0},{t:32.5,l:2,f:1318.51},{t:32.75,l:0,f:277.18},{t:33.0,l:2,f:1318.51},{t:33.25,l:0,f:277.18},{t:33.5,l:0,f:277.18},{t:33.75,l:2,f:1760.0},{t:34.0,l:0,f:293.66},{t:34.25,l:2,f:1318.51},{t:34.5,l:2,f:1174.66},{t:34.75,l:0,f:293.66},{t:35.0,l:2,f:1567.98}]
  },
  {
    id:3,name:'笑顔で答えて',genre:'jpop',icon:'😊',
    bpm:120,duration:35,diff:{easy:2,normal:4,hard:7},instrument:'synth',
    rawNotes:[{t:2.0,l:0,f:73.42},{t:2.5,l:1,f:369.99},{t:3.0,l:1,f:329.63},{t:3.25,l:1,f:369.99},{t:3.75,l:1,f:392.0},{t:4.25,l:1,f:392.0},{t:4.5,l:1,f:369.99},{t:5.0,l:1,f:329.63},{t:5.25,l:1,f:369.99},{t:6.0,l:0,f:61.74},{t:6.5,l:1,f:369.99},{t:7.0,l:1,f:329.63},{t:7.25,l:1,f:369.99},{t:7.75,l:1,f:392.0},{t:8.25,l:1,f:392.0},{t:8.5,l:1,f:369.99},{t:9.0,l:1,f:329.63},{t:9.25,l:0,f:293.66},{t:10.0,l:1,f:440.0},{t:10.75,l:1,f:493.88},{t:11.5,l:2,f:554.37},{t:12.0,l:2,f:587.33},{t:12.5,l:2,f:554.37},{t:12.75,l:1,f:493.88},{t:13.25,l:1,f:440.0},{t:28.0,l:2,f:587.33},{t:28.5,l:2,f:554.37},{t:28.75,l:1,f:493.88},{t:29.25,l:1,f:440.0},{t:33.25,l:0,f:220.0},{t:33.5,l:0,f:293.66},{t:33.75,l:1,f:440.0},{t:34.0,l:2,f:880.0},{t:34.5,l:2,f:1760.0}]
  },
  {
    id:4,name:'哀しみよこんにちは',genre:'jpop',icon:'💙',
    bpm:120,duration:35,diff:{easy:3,normal:6,hard:9},instrument:'synth',
    rawNotes:[{t:2.25,l:0,f:466.16},{t:2.75,l:0,f:466.16},{t:3.25,l:0,f:466.16},{t:3.75,l:0,f:466.16},{t:4.25,l:0,f:466.16},{t:4.75,l:0,f:466.16},{t:5.25,l:0,f:466.16},{t:5.75,l:0,f:466.16},{t:6.25,l:0,f:466.16},{t:6.75,l:0,f:466.16},{t:7.25,l:0,f:466.16},{t:7.75,l:0,f:466.16},{t:8.25,l:0,f:466.16},{t:8.75,l:0,f:466.16},{t:9.25,l:0,f:466.16},{t:9.75,l:0,f:466.16},{t:10.25,l:1,f:698.46},{t:10.5,l:1,f:1046.5},{t:10.75,l:1,f:698.46},{t:11.0,l:2,f:1174.66},{t:11.25,l:1,f:698.46},{t:11.5,l:1,f:1046.5},{t:11.75,l:1,f:698.46},{t:12.25,l:1,f:698.46},{t:12.5,l:1,f:1046.5},{t:12.75,l:1,f:698.46},{t:13.0,l:2,f:1174.66},{t:13.25,l:1,f:698.46},{t:13.5,l:1,f:1046.5},{t:13.75,l:2,f:1174.66},{t:14.25,l:1,f:783.99},{t:14.5,l:1,f:932.33},{t:14.75,l:1,f:783.99},{t:15.0,l:1,f:1046.5},{t:15.25,l:1,f:783.99},{t:15.5,l:2,f:1174.66},{t:15.75,l:1,f:783.99},{t:16.25,l:1,f:783.99},{t:16.5,l:1,f:932.33},{t:16.75,l:1,f:783.99},{t:17.0,l:1,f:1046.5},{t:17.25,l:1,f:783.99},{t:17.5,l:2,f:1174.66},{t:17.75,l:1,f:783.99},{t:18.25,l:1,f:783.99},{t:18.5,l:1,f:932.33},{t:18.75,l:1,f:783.99},{t:19.0,l:1,f:1046.5},{t:19.25,l:1,f:783.99},{t:19.5,l:2,f:1174.66},{t:19.75,l:1,f:783.99},{t:20.25,l:1,f:698.46},{t:20.5,l:1,f:1046.5},{t:20.75,l:1,f:698.46},{t:21.0,l:2,f:1174.66},{t:21.25,l:1,f:698.46},{t:21.5,l:1,f:1046.5},{t:21.75,l:1,f:698.46},{t:22.25,l:0,f:622.25},{t:22.5,l:1,f:783.99},{t:22.75,l:0,f:622.25},{t:23.0,l:1,f:1046.5},{t:23.25,l:0,f:622.25},{t:23.5,l:1,f:783.99},{t:23.75,l:0,f:622.25},{t:24.25,l:2,f:1244.51},{t:24.5,l:2,f:1174.66},{t:24.75,l:1,f:932.33},{t:25.25,l:1,f:698.46},{t:25.5,l:1,f:783.99},{t:25.75,l:1,f:698.46},{t:26.25,l:1,f:698.46},{t:26.5,l:1,f:1046.5},{t:26.75,l:1,f:698.46},{t:27.0,l:2,f:1174.66},{t:27.25,l:1,f:698.46},{t:27.5,l:1,f:1046.5},{t:27.75,l:1,f:698.46},{t:28.25,l:1,f:698.46},{t:28.5,l:1,f:1046.5},{t:28.75,l:1,f:698.46},{t:29.0,l:2,f:1174.66},{t:29.25,l:1,f:698.46},{t:29.5,l:1,f:1046.5},{t:29.75,l:2,f:1174.66},{t:30.25,l:1,f:783.99},{t:30.5,l:1,f:932.33},{t:30.75,l:1,f:783.99},{t:31.0,l:1,f:1046.5},{t:31.25,l:1,f:783.99},{t:31.5,l:2,f:1174.66},{t:31.75,l:1,f:783.99},{t:32.25,l:1,f:783.99},{t:32.5,l:1,f:932.33},{t:32.75,l:1,f:783.99},{t:33.0,l:1,f:1046.5},{t:33.25,l:1,f:783.99},{t:33.5,l:2,f:1174.66},{t:33.75,l:1,f:783.99},{t:34.25,l:1,f:783.99},{t:34.5,l:1,f:932.33},{t:34.75,l:1,f:783.99},{t:35.0,l:1,f:1046.5}]
  },
  {
    id:5,name:'Kiminism',genre:'jpop',icon:'💜',
    bpm:118,duration:35,diff:{easy:2,normal:4,hard:7},instrument:'synth',
    rawNotes:[{t:1.525,l:1,f:587.33},{t:2.034,l:1,f:587.33},{t:2.542,l:2,f:987.77},{t:3.051,l:1,f:880.0},{t:5.085,l:0,f:185.0},{t:6.356,l:1,f:783.99},{t:6.61,l:1,f:739.99},{t:6.864,l:1,f:783.99},{t:7.119,l:1,f:739.99},{t:7.373,l:1,f:587.33},{t:9.153,l:0,f:185.0},{t:9.661,l:0,f:440.0},{t:10.169,l:1,f:587.33},{t:10.678,l:2,f:987.77},{t:11.186,l:1,f:880.0},{t:13.22,l:0,f:185.0},{t:14.492,l:1,f:783.99},{t:14.746,l:1,f:739.99},{t:15.0,l:1,f:783.99},{t:15.254,l:1,f:880.0},{t:15.508,l:2,f:1174.66},{t:17.288,l:0,f:146.83}]
  },
  {
    id:6,name:'愛を覚えていますか',genre:'jpop',icon:'❤️',
    bpm:108,duration:35,diff:{easy:3,normal:6,hard:9},instrument:'synth',
    rawNotes:[{t:2.091,l:0,f:329.63},{t:2.207,l:0,f:220.0},{t:2.493,l:2,f:880.0},{t:2.77,l:2,f:880.0},{t:3.047,l:2,f:880.0},{t:3.324,l:2,f:880.0},{t:3.601,l:2,f:880.0},{t:3.878,l:2,f:880.0},{t:4.155,l:2,f:880.0},{t:4.432,l:2,f:880.0},{t:4.709,l:2,f:880.0},{t:4.986,l:2,f:880.0},{t:5.263,l:2,f:880.0},{t:5.54,l:2,f:880.0},{t:5.817,l:2,f:880.0},{t:6.094,l:2,f:880.0},{t:6.371,l:2,f:880.0},{t:6.495,l:1,f:369.99},{t:6.611,l:0,f:293.66},{t:6.925,l:2,f:880.0},{t:7.202,l:2,f:880.0},{t:7.479,l:2,f:880.0},{t:7.755,l:2,f:880.0},{t:8.032,l:2,f:880.0},{t:8.309,l:2,f:880.0},{t:8.586,l:2,f:880.0},{t:8.863,l:2,f:880.0},{t:9.14,l:2,f:880.0},{t:9.417,l:2,f:880.0},{t:9.694,l:2,f:880.0},{t:9.971,l:2,f:880.0},{t:10.248,l:2,f:880.0},{t:10.525,l:2,f:880.0},{t:10.802,l:2,f:880.0},{t:10.955,l:0,f:329.63},{t:11.075,l:0,f:220.0},{t:11.356,l:2,f:880.0},{t:11.633,l:2,f:880.0},{t:11.91,l:2,f:880.0},{t:12.187,l:2,f:880.0},{t:12.464,l:2,f:880.0},{t:12.741,l:2,f:880.0},{t:13.018,l:2,f:880.0},{t:13.295,l:2,f:880.0},{t:13.572,l:2,f:880.0},{t:13.849,l:2,f:880.0},{t:14.126,l:2,f:880.0},{t:14.403,l:2,f:880.0},{t:14.68,l:2,f:880.0},{t:14.957,l:2,f:880.0},{t:15.234,l:2,f:880.0},{t:15.396,l:0,f:329.63},{t:15.511,l:2,f:880.0},{t:15.788,l:2,f:880.0},{t:16.065,l:2,f:880.0},{t:16.342,l:2,f:880.0},{t:16.619,l:2,f:880.0},{t:16.896,l:2,f:880.0},{t:17.173,l:2,f:880.0},{t:17.45,l:2,f:880.0},{t:17.695,l:0,f:220.0},{t:18.004,l:2,f:880.0},{t:18.281,l:2,f:880.0},{t:18.558,l:2,f:880.0},{t:18.793,l:0,f:246.94},{t:19.112,l:2,f:880.0},{t:19.389,l:2,f:880.0},{t:19.666,l:2,f:880.0},{t:19.832,l:0,f:220.0},{t:19.975,l:1,f:440.0},{t:22.075,l:0,f:246.94},{t:22.214,l:1,f:493.88},{t:23.174,l:0,f:293.66},{t:23.303,l:1,f:440.0},{t:24.324,l:0,f:185.0},{t:24.448,l:1,f:440.0},{t:24.651,l:1,f:587.33},{t:24.947,l:2,f:880.0},{t:25.205,l:1,f:440.0},{t:25.482,l:1,f:587.33},{t:25.759,l:1,f:659.26},{t:26.036,l:2,f:739.99},{t:26.313,l:1,f:587.33},{t:26.867,l:1,f:659.26},{t:27.163,l:2,f:987.77},{t:27.421,l:1,f:493.88},{t:27.698,l:1,f:659.26},{t:27.975,l:2,f:739.99},{t:28.252,l:2,f:830.61},{t:28.529,l:2,f:1174.66},{t:29.083,l:1,f:554.37},{t:29.36,l:2,f:830.61},{t:29.637,l:1,f:415.3},{t:29.914,l:1,f:554.37},{t:30.191,l:1,f:554.37},{t:30.468,l:2,f:830.61},{t:30.745,l:1,f:554.37},{t:31.022,l:2,f:739.99},{t:31.299,l:2,f:830.61},{t:31.576,l:2,f:880.0},{t:31.853,l:2,f:739.99},{t:32.13,l:2,f:987.77},{t:32.407,l:2,f:880.0},{t:32.684,l:2,f:830.61},{t:32.961,l:2,f:880.0},{t:33.515,l:1,f:587.33},{t:33.792,l:2,f:880.0},{t:34.069,l:1,f:440.0},{t:34.346,l:1,f:587.33},{t:34.623,l:1,f:587.33},{t:34.9,l:2,f:880.0}]
  }
];
// ===== AUDIO ENGINE =====
const AudioEngine = (() => {
  let ctx=null, master=null, bgNodes=[];
  function init() {
    if(ctx) return;
    ctx=new(window.AudioContext||window.webkitAudioContext)();
    master=ctx.createGain(); master.gain.value=0.7;
    master.connect(ctx.destination);
  }
  function resume(){if(ctx&&ctx.state==='suspended')ctx.resume();}
  function now(){return ctx?ctx.currentTime:0;}

  function osc(type,f,t,dur,vol){
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.type=type;o.frequency.value=f;o.connect(g);g.connect(master);
    g.gain.setValueAtTime(0.001,t);g.gain.linearRampToValueAtTime(vol,t+0.015);
    g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    o.start(t);o.stop(t+dur+0.05);bgNodes.push(o,g);
  }
  function noiseN(t,dur,vol,hpf,lpf){
    const len=Math.ceil(ctx.sampleRate*Math.max(dur,0.02));
    const buf=ctx.createBuffer(1,len,ctx.sampleRate);
    const d=buf.getChannelData(0);
    for(let i=0;i<len;i++)d[i]=Math.random()*2-1;
    const src=ctx.createBufferSource();src.buffer=buf;
    const g=ctx.createGain(),hp=ctx.createBiquadFilter(),lp=ctx.createBiquadFilter();
    hp.type='highpass';hp.frequency.value=hpf||0;
    lp.type='lowpass';lp.frequency.value=lpf||20000;
    g.gain.setValueAtTime(vol,t);g.gain.exponentialRampToValueAtTime(0.001,t+dur);
    src.connect(hp);hp.connect(lp);lp.connect(g);g.connect(master);
    src.start(t);src.stop(t+dur+0.02);bgNodes.push(src,g,hp,lp);
  }
  function kick(t,v){
    const o=ctx.createOscillator(),g=ctx.createGain();
    o.frequency.setValueAtTime(150,t);o.frequency.exponentialRampToValueAtTime(0.001,t+0.4);
    g.gain.setValueAtTime(v||0.65,t);g.gain.exponentialRampToValueAtTime(0.001,t+0.4);
    o.connect(g);g.connect(master);o.start(t);o.stop(t+0.45);bgNodes.push(o,g);
  }
  function snare(t,v){noiseN(t,0.14,v||0.22,1500,8000);osc('triangle',200,t,0.1,(v||0.22)*0.5);}
  function hat(t,v){noiseN(t,0.03,v||0.07,9000,18000);}
  function clap(t,v){for(let i=0;i<3;i++)noiseN(t+i*0.01,0.06,v||0.18,2000,10000);}

  function hitNote(f,inst){
    if(!ctx)return;resume();const t=ctx.currentTime;
    switch(inst){
      case'piano':osc('triangle',f,t,0.7,0.30);osc('sine',f*2,t,0.35,0.12);osc('sine',f*3,t,0.18,0.05);break;
      case'synth':osc('sawtooth',f,t,0.4,0.22);osc('sawtooth',f*1.004,t,0.4,0.18);break;
      default:osc('triangle',f,t,0.5,0.25);osc('sine',f*2,t,0.25,0.10);
    }
  }
  function hitMiss(){if(!ctx)return;noiseN(ctx.currentTime,0.06,0.05,0,1500);}

  function playBG(song,startT,dur){
    if(!ctx)return;
    const beat=60/song.bpm,bar=beat*4,bars=Math.ceil(dur/bar)+2;
    for(let b=0;b<bars;b++){
      const t=startT+b*bar;
      kick(t,0.65);kick(t+beat*2,0.55);
      snare(t+beat,0.22);snare(t+beat*3,0.22);
      clap(t+beat,0.15);clap(t+beat*3,0.15);
      for(let k=0;k<16;k++)hat(t+k*beat*0.25,k%4===0?0.09:0.05);
      // Bass
      osc('sine',song.bpm>125?87.31:73.42,t,beat*1.8,0.28);
      osc('sine',song.bpm>125?87.31:73.42,t+beat*2,beat*1.8,0.22);
      // Pad
      [261.63,329.63,392].forEach(f=>osc('sine',f,t,bar*0.9,0.035));
    }
  }

  function stopAll(){
    bgNodes.forEach(n=>{try{n.stop?n.stop():n.disconnect();}catch(e){}});
    bgNodes=[];
  }
  return{init,resume,now,hitNote,hitMiss,playBG,stopAll};
})();

// ===== DIFFICULTY FILTER =====
function filterChart(rawNotes,difficulty){
  if(difficulty==='hard')return rawNotes;
  const byLane=[[],[],[]];
  rawNotes.forEach(n=>byLane[n.l].push(n));
  const result=[];
  byLane.forEach((ln,li)=>{
    const step=difficulty==='easy'?(li===2?2:3):2;
    ln.forEach((n,i)=>{if(i%step===0)result.push(n);});
  });
  result.sort((a,b)=>a.t-b.t);
  const clean=[];let lastT=-999;
  result.forEach(n=>{if(n.t-lastT>=0.10){clean.push(n);lastT=n.t;}});
  return clean;
}

// ===== GAME ENGINE =====
const Game=(()=>{
  let currentSong=null,currentDiff='easy';
  let chart=[],noteElements={};
  let score=0,combo=0,maxCombo=0,health=100;
  let perfect=0,good=0,miss=0;
  let gameRunning=false,gamePaused=false;
  let gameStartTime=0,noteSpeed=300;
  let judgeWindow={perfect:0.20,good:0.35};
  let animFrame=null,judgeTimer=null,playfieldH=0;
  let pendingNotes=[],activeNotes=[],hitNotes=new Set();
  let totalNoteCount=0,gaugeScore=0;
  const GAUGE_PASS=80;
  const KEY_MAP={'z':0,'x':1,'c':2};
  const keyState={0:false,1:false,2:false};

  function showScreen(id){
    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    document.getElementById(id).classList.add('active');
  }
  function showTitle(){AudioEngine.stopAll();showScreen('screen-title');}
  function showSongSelect(){AudioEngine.stopAll();buildSongList();showScreen('screen-select');}

  function buildSongList(){
    const list=document.getElementById('song-list');
    list.innerHTML='';
    SONGS.forEach(song=>{
      const stars=song.diff[currentDiff];
      const card=document.createElement('div');
      card.className='song-card genre-jpop';
      card.innerHTML=`
        <div class="song-icon">${song.icon}</div>
        <div class="song-info">
          <div class="song-name">${song.name}</div>
          <div class="song-meta">J-POP · BPM ${song.bpm}</div>
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

  function setDifficulty(diff){
    currentDiff=diff;
    document.querySelectorAll('.diff-btn').forEach(b=>b.classList.remove('active'));
    document.querySelector(`.diff-btn[data-diff="${diff}"]`).classList.add('active');
    buildSongList();
  }

  function startGame(song){
    AudioEngine.init();currentSong=song;
    const filtered=filterChart(song.rawNotes,currentDiff);
    chart=filtered.map(n=>({time:n.t,lane:n.l,freq:n.f}));
    totalNoteCount=chart.length;
    pendingNotes=[...chart].sort((a,b)=>a.time-b.time);
    activeNotes=[];hitNotes=new Set();
    score=0;combo=0;maxCombo=0;health=100;perfect=0;good=0;miss=0;gaugeScore=0;

    document.getElementById('ui-song-name').textContent=song.name;
    const diffEl=document.getElementById('ui-difficulty');
    diffEl.textContent=currentDiff.toUpperCase();
    diffEl.className=`diff-label ${currentDiff}`;
    ['ui-score','ui-combo'].forEach(id=>document.getElementById(id).textContent='');
    document.getElementById('ui-score').textContent='0';
    document.getElementById('health-bar').style.width='100%';
    document.getElementById('progress-bar').style.width='0%';
    document.getElementById('notes-container').innerHTML='';
    document.getElementById('hit-effects').innerHTML='';
    noteElements={};updateGauge();

    noteSpeed={easy:200,normal:310,hard:440}[currentDiff];
    judgeWindow={
      easy:{perfect:0.22,good:0.38},
      normal:{perfect:0.12,good:0.22},
      hard:{perfect:0.07,good:0.13}
    }[currentDiff];

    showScreen('screen-game');
    playfieldH=document.getElementById('playfield').clientHeight;
    gameRunning=true;gamePaused=false;
    gameStartTime=AudioEngine.now()+0.5;
    AudioEngine.playBG(song,gameStartTime,song.duration);
    if(animFrame)cancelAnimationFrame(animFrame);
    animFrame=requestAnimationFrame(gameLoop);
  }

  function gameLoop(){
    if(!gameRunning)return;
    if(gamePaused){animFrame=requestAnimationFrame(gameLoop);return;}
    const elapsed=AudioEngine.now()-gameStartTime;
    const spawnAhead=playfieldH/noteSpeed+0.3;
    while(pendingNotes.length>0&&pendingNotes[0].time-elapsed<spawnAhead)
      spawnNote(pendingNotes.shift());
    updateNotes(elapsed);checkMisses(elapsed);
    document.getElementById('progress-bar').style.width=
      (Math.max(0,Math.min(elapsed/currentSong.duration,1))*100)+'%';
    if(elapsed>=currentSong.duration+2&&pendingNotes.length===0&&activeNotes.length===0){
      endGame();return;
    }
    animFrame=requestAnimationFrame(gameLoop);
  }

  function spawnNote(note){
    const el=document.createElement('div');
    el.className='note';el.dataset.lane=note.lane;
    const id=note.time.toFixed(4)+'_'+note.lane+'_'+Math.random().toString(36).slice(2,5);
    el.dataset.id=id;
    const ll=[0,33.33,66.66];
    el.style.left=ll[note.lane]+'%';
    el.style.width=(note.lane===2?33.34:33.33)+'%';
    el.style.top='-34px';
    document.getElementById('notes-container').appendChild(el);
    noteElements[id]=el;activeNotes.push({...note,elId:id});
  }
  function updateNotes(elapsed){
    activeNotes.forEach(note=>{
      const el=noteElements[note.elId];if(!el)return;
      el.style.top=(playfieldH-(note.time-elapsed)*noteSpeed-32)+'px';
    });
  }
  function checkMisses(elapsed){
    const toRemove=[];
    activeNotes.forEach(note=>{
      if(hitNotes.has(note.elId)){toRemove.push(note.elId);return;}
      if(note.time-elapsed<-judgeWindow.good){
        registerJudge('miss',note.lane,note.elId,note);toRemove.push(note.elId);
      }
    });
    toRemove.forEach(id=>removeNote(id));
  }
  function removeNote(id){
    activeNotes=activeNotes.filter(n=>n.elId!==id);
    const el=noteElements[id];if(el){el.remove();delete noteElements[id];}
  }

  function onKeyDown(e){
    if(!gameRunning||gamePaused||e.repeat)return;
    const lane=KEY_MAP[e.key.toLowerCase()];
    if(lane===undefined||keyState[lane])return;
    keyState[lane]=true;pressLane(lane);
    document.getElementById(`btn-${lane}`).classList.add('pressed');
  }
  function onKeyUp(e){
    const lane=KEY_MAP[e.key.toLowerCase()];if(lane===undefined)return;
    keyState[lane]=false;
    document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
  }
  function onTouch(lane,down){
    AudioEngine.resume();
    if(down){if(!gameRunning||gamePaused)return;pressLane(lane);document.getElementById(`btn-${lane}`).classList.add('pressed');}
    else document.getElementById(`btn-${lane}`)?.classList.remove('pressed');
  }

  function pressLane(lane){
    const elapsed=AudioEngine.now()-gameStartTime;
    let best=null,bd=Infinity;
    activeNotes.forEach(note=>{
      if(note.lane!==lane||hitNotes.has(note.elId))return;
      const d=Math.abs(note.time-elapsed);if(d<bd){bd=d;best=note;}
    });
    if(!best){AudioEngine.hitNote([196,392,784][lane],currentSong?.instrument||'synth');return;}
    if(bd<=judgeWindow.perfect){
      registerJudge('perfect',lane,best.elId,best);hitNotes.add(best.elId);removeNote(best.elId);
    }else if(bd<=judgeWindow.good){
      registerJudge('good',lane,best.elId,best);hitNotes.add(best.elId);removeNote(best.elId);
    }
  }

  function registerJudge(type,lane,noteId,note){
    if(type!=='miss')AudioEngine.hitNote(note.freq,currentSong?.instrument||'synth');
    else AudioEngine.hitMiss();
    if(type==='perfect'){
      score+=300+combo*2;combo++;if(combo>maxCombo)maxCombo=combo;
      health=Math.min(100,health+1.5);perfect++;
      gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*1.5);
    }else if(type==='good'){
      score+=100+combo;combo++;if(combo>maxCombo)maxCombo=combo;
      good++;gaugeScore=Math.min(100,gaugeScore+(100/totalNoteCount)*0.8);
    }else{
      combo=0;health=Math.max(0,health-6);miss++;
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
    updateGauge();showJudge(type,combo);showHitEffect(type,lane);
    if(health<=0)endGame();
  }

  function updateGauge(){
    const fill=document.getElementById('gauge-fill'),label=document.getElementById('gauge-label');
    if(!fill)return;const pct=Math.round(gaugeScore);
    fill.style.width=pct+'%';const pass=pct>=GAUGE_PASS;
    fill.className='gauge-fill '+(pass?'pass':'warn');
    if(label)label.textContent=pct+'%'+(pass?' ✓':'');
  }
  function showJudge(type,combo){
    if(judgeTimer)clearTimeout(judgeTimer);
    const el=document.getElementById('judge-display');
    const text={perfect:'PERFECT',good:'GOOD',miss:'MISS'}[type];
    el.innerHTML=`<div class="judge-${type}">${text}${combo>1?`<div class="judge-combo">${combo} COMBO</div>`:''}</div>`;
    judgeTimer=setTimeout(()=>{el.innerHTML='';},420);
  }
  function showHitEffect(type,lane){
    const c=document.getElementById('hit-effects'),el=document.createElement('div');
    el.className=`hit-effect ${type}`;el.dataset.lane=lane;c.appendChild(el);
    setTimeout(()=>el.remove(),350);
  }
  function pause(){if(!gameRunning)return;gamePaused=true;document.getElementById('screen-pause').classList.add('active');}
  function resume(){gamePaused=false;document.getElementById('screen-pause').classList.remove('active');}
  function quit(){endGame();}

  function endGame(){
    gameRunning=false;if(animFrame)cancelAnimationFrame(animFrame);AudioEngine.stopAll();
    const acc=totalNoteCount>0?(perfect*300+good*100)/(totalNoteCount*300):0;
    const passed=gaugeScore>=GAUGE_PASS;
    let rank='F';
    if(acc>=0.95)rank='S';else if(acc>=0.85)rank='A';
    else if(acc>=0.70)rank='B';else if(acc>=0.55)rank='C';
    document.getElementById('result-rank').textContent=rank;
    document.getElementById('result-rank').className=`result-rank rank-${rank.toLowerCase()}`;
    document.getElementById('result-song-name').textContent=currentSong.name;
    document.getElementById('res-score').textContent=score.toLocaleString();
    document.getElementById('res-combo').textContent=maxCombo;
    document.getElementById('res-perfect').textContent=perfect;
    document.getElementById('res-good').textContent=good;
    document.getElementById('res-miss').textContent=miss;
    const rg=document.getElementById('res-gauge'),rc=document.getElementById('res-clear');
    if(rg)rg.textContent=Math.round(gaugeScore)+'%';
    if(rc){rc.textContent=passed?'✓ CLEAR':'✗ FAILED';rc.style.color=passed?'var(--accent4)':'#ff3333';}
    document.getElementById('screen-pause').classList.remove('active');
    showScreen('screen-result');
  }

  function retry(){startGame(currentSong);}
  function init(){
    document.addEventListener('keydown',onKeyDown);
    document.addEventListener('keyup',onKeyUp);
    document.addEventListener('touchstart',()=>AudioEngine.init(),{once:true});
    showScreen('screen-title');
  }
  return{showTitle,showSongSelect,setDifficulty,startGame,pause,resume,quit,retry,onTouch,init};
})();

window.addEventListener('load',()=>Game.init());
