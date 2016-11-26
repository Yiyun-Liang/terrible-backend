var app = angular.module('terrible', [
	'btford.socket-io',
]);

app.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

app.controller("LeaderboardCtrl", function($scope, mySocket) {
	$scope.limit = 9;
	$scope.data;
	mySocket.on("leaderboard", function(data) {
		console.log(data);
		data.sort((a,b) => b.value - a.value);
		$scope.data = data;
		$scope.leaders = $scope.data.slice(0,3);
		$scope.losers = $scope.data.slice(3,$scope.limit);
	});

	$scope.user = {name:"Anonymous"};

	mySocket.on("hello", function(data) {
		console.log (data);
		$scope.test = data;
	});

	$scope.showMore = function() {
		$scope.losers = $scope.data.slice(3,$scope.limit+6);
		$scope.limit += 6;
	}


	$scope.snapshot = function() {
	  canvas.width = video.videoWidth;
	  canvas.height = video.videoHeight;
	  canvas.getContext('2d').
	    drawImage(video, 0, 0, canvas.width, canvas.height);

	  var canvasData = canvas.toDataURL("image/png");
	   
	  var base64ImageContent = canvasData.replace(/^data:image\/(png|jpg);base64,/, "");
	  var blob = base64ToBlob(base64ImageContent, 'image/png');
	    var ajax = new XMLHttpRequest();
	    ajax.open("POST",'https://api.projectoxford.ai/emotion/v1.0/recognize',false);
	    ajax.onreadystatechange = function() {
	    	var resObj = JSON.parse(ajax.responseText);
	        console.log(resObj);
	        var boredScore = parseInt(resObj[0].scores.neutral*10000);
	        $scope.boredScore = boredScore;

	        mySocket.emit("image", 
	        	{ name:$scope.user.name,
	        	image: canvasData,
	            result: boredScore});
	    }
	    ajax.setRequestHeader('Content-Type', 'application/octet-stream');
	    ajax.setRequestHeader('Ocp-Apim-Subscription-Key', '5b3b98d70fa8466ca0e28426c8552ce7');
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
