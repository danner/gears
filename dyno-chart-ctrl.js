angular.module('gears.chart', ['ngAnimate', 'ui.bootstrap']);
angular.module('gears.chart').controller('ChartCtrl', function ($scope) {

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true
  };
});