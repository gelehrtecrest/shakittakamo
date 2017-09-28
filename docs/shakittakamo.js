'use strict';

var ctx, analyser, frequencies, getByteFrequencyDataAverage, elVolume, draw, bufferLength;

window.AudioContext = window.AudioContext || window.webkitAudioContext;
ctx = new AudioContext();

analyser = ctx.createAnalyser();
frequencies = new Uint8Array(analyser.frequencyBinCount);
bufferLength = analyser.frequencyBinCount;

getByteFrequencyDataAverage = function() {
	analyser.getByteFrequencyData(frequencies);
	var max_hz = 0;
	var max_hz_value = 0.0;
	for(var i = 0; i < bufferLength; i++) {
		if(max_hz_value < frequencies[i]) {
			max_hz_value = frequencies[i];
			max_hz = i;
		}
	}
	return max_hz;
};

navigator.mediaDevices.getUserMedia({audio: true})
    .then(function(stream) {
            window.hackForMozzila = stream;
            ctx.createMediaStreamSource(stream)
              // AnalyserNodeに接続
              .connect(analyser);
        })
    .catch(function(err) {
            console.log(err.message);
        });

var shakitta_hz_array = [
	250,
	250,
	250,
	250,
	250,
	250,
	250,
	250,
	250,
	250,
/*
164,
150,
326,
327,
326,
313,
169,
169,
224,
224,
*/
/*
	154,
	153,
	319, 
	319,
	257,
	258,
	258,
	150,
	150,
	150,
	151,
	150,
	326,
	327,
	326,
	326,
	326,
	224,
	224,
	224
*/
];
//誤差は 5hz
var t_hz = 50
//合格率は 8割
var t_match = shakitta_hz_array.length * 0.8;

// シャキったかどうかの判別
function is_shakitta(f_array){
	var match_count = 0;
	for (var i = 0; i < shakitta_hz_array.length; i++) {
		if(f_array[i] <= shakitta_hz_array[i] + t_hz && 
			f_array[i] >= shakitta_hz_array[i] - t_hz
			){
			match_count++;
		}
	}
	if(f_array[0] > 50) {
		console.log(f_array[0]);
	}
	if(match_count >= t_match){
		return true;
	} else {
		return false;
	}
}

elVolume = document.getElementById('volume');
var buffer_hz =[
/*
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
*/
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0,
	0
];
var count = 0;
var flag = true;
(draw = function() {
	var hz = Math.floor(getByteFrequencyDataAverage());
	for (var i=1; i<buffer_hz.length; i++) {
		buffer_hz[i-1] = buffer_hz[i];
	}
	buffer_hz[buffer_hz.length-1] = hz;
	if (is_shakitta(buffer_hz)) {
		elVolume.innerHTML = "シャキった";
		flag = false;
	} else {
		if(flag) {
			elVolume.innerHTML = "シャキってない";
		} else {
			elVolume.innerHTML = "シャキった後";
		}
	}
	requestAnimationFrame(draw);
})();
