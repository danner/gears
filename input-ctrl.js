angular.module('gears.input', ['ngAnimate', 'ui.bootstrap']);
angular.module('gears.input').controller('InputCtrl', function ($scope) {

  $scope.addItem = function() {
    var newItemNo = $scope.items.length + 1;
    $scope.items.push('Item ' + newItemNo);
  };

  $scope.status = {
    isFirstOpen: true
  };
});