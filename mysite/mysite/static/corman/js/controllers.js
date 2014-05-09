var cormanControllers = angular.module('cormanControllers', []);

cormanControllers.controller('BookingListCtrl', function ($scope, $http) {
	$http.get('/bookings/get_bookings').success(function(data) {
      $scope.bookings = data;
    });
});

cormanControllers.controller('BookingDetailCtrl', function ($scope, $routeParams, $http) {
    $scope.bookingId = $routeParams.bookingId;
    $scope.resourceName = $routeParams.resourceName;
    $http.post('/bookings/get_booking_details/', {"id" : $routeParams.bookingId}).success(function(data) {
      $scope.booking = data;
    });

 });


cormanControllers.controller('ReservationCtrl', function ($scope, $routeParams, $http) {
    $scope.resourceName = $routeParams.resourceName;
 });

cormanControllers.controller('loginCtrl', function ($scope, $http) {
    $http.get('/user_logged_in').success(function(data) {
      if(data.success){
        $scope.logged_in = true;
      } else{
        $scope.logged_in = false;
      }
    });
 });

cormanControllers.controller('ResourceListCtrl', function ($scope, $http){
    $http.get('/bookings/get_resources').success(function(data){
      $scope.resources = data;
    });
});

cormanControllers.controller('ResourceDetailCtrl', function ($scope, $routeParams, $http){
    $scope.resourceName = $routeParams.resourceName;
  $http.post('/bookings/get_resource_bookings/',{"name":$routeParams.resourceName}).success(function(data){
    $scope.resource_bookings = data;
  });  
});