'use strict';

angular.module('gameoflifeApp')
    .controller('MainCtrl', function ($scope, $http, $log, $interval) {

        var poller;


        $http.get("/status/name").success(function (data) {
            $scope.title = data.name;
        });

        $scope.startEvolution = function () {
            poller = $interval($scope.getNextStatusOfWorld, 1000);
        };

        $scope.stopEvolution = function () {
            $interval.cancel(poller);
        };

        $scope.getNextStatusOfWorld = function getNextStatusOfWorld() {
            $log.info($scope.world);
            $http
                .post("/gameoflife/world", $scope.world)
                .success(function (data) {
                    $scope.world = data;
                    $log.info(data);
                });
        };

        $scope.toggleCell = function (row, column) {
            $log.info($scope.world);
            $scope.world[column][row] = !$scope.world[column][row];
        };

        function emptyWorld(dimension) {
            var arr = [];
            for (var i = 0; i < dimension; i++) {
                arr[i] = [];
                for (var j = 0; j < dimension; j++) {
                    arr[i][j] = false;
                }
            }
            return arr;
        }

        function blinker() {
            return [
                [false, false, false],
                [true, true, true],
                [false, false, false]
            ];
        }

        $scope.dimensionChanged = function (dimension) {
            initializeWorld(emptyWorld(dimension));
        };

        $scope.initializeWorld = function (arr) {
            $scope.world = arr;
            $scope.worldDimension = arr.length;
        };

        $scope.initializeWorld(blinker());

    });
