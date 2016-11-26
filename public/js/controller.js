var app = angular.module('terrible', [
	'btford.socket-io',
	]);

app.factory('mySocket', function (socketFactory) {
  return socketFactory();
});

app.controller("LeaderboardCtrl", function($scope, mySocket) {
	mySocket.on("hello", function(data) {
		console.log("AAAA");
		console.log (data);
		$scope.test = data;
	});
});