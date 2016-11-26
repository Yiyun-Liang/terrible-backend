var app = angular.module('terrible', [
	'btford.socket-io',
]);

app.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

app.controller("LeaderboardCtrl", function($scope, mySocket) {
	mySocket.on("leaderboard", function(data) {
		$scope.leaders = data;

	});
});


app.controller("CamCtrl", function($scope, mySocket) {
	mySocket.on("hello", function(data) {
		console.log("AAAA");
		console.log (data);
		$scope.test = data;
	});
});

	$scope.snapshot = function() {
		canvas.width = video.videoWidth;
		  canvas.height = video.videoHeight;
		  canvas.getContext('2d').
		    drawImage(video, 0, 0, canvas.width, canvas.height);

		  var canvasData = canvas.toDataURL("image/png");
		   mySocket.emit("image", {image: canvasData});
		  var base64ImageContent = canvasData.replace(/^data:image\/(png|jpg);base64,/, "");
		  var blob = base64ToBlob(base64ImageContent, 'image/png');
		    var ajax = new XMLHttpRequest();
		    ajax.open("POST",'https://api.projectoxford.ai/emotion/v1.0/recognize',false);
		    ajax.onreadystatechange = function() {
		        console.log(ajax.responseText);

		        document.getElementById("result").innerHTML = ajax.responseText;

		    }
		    ajax.setRequestHeader('Content-Type', 'application/octet-stream');
		    ajax.setRequestHeader('Ocp-Apim-Subscription-Key', 'ccba260c28864adcb6624df03085ab49');
		    ajax.send(blob);

	}
});

// Put variables in global scope to make them available to the browser console.
var video = document.querySelector('video');
var canvas = window.canvas = document.querySelector('canvas');
canvas.width = 480;
canvas.height = 360;

function base64ToBlob(base64, mime)
{
    mime = mime || '';
    var sliceSize = 1024;
    var byteChars = window.atob(base64);
    var byteArrays = [];

    for (var offset = 0, len = byteChars.length; offset < len; offset += sliceSize) {
        var slice = byteChars.slice(offset, offset + sliceSize);

        var byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }

        var byteArray = new Uint8Array(byteNumbers);

        byteArrays.push(byteArray);
    }

    return new Blob(byteArrays, {type: mime});
}



var constraints = {
  audio: false,
  video: true
};

function handleSuccess(stream) {
  window.stream = stream; // make stream available to browser console
  video.srcObject = stream;
}

function handleError(error) {
  console.log('navigator.getUserMedia error: ', error);
}

navigator.mediaDevices.getUserMedia(constraints).
    then(handleSuccess).catch(handleError);
