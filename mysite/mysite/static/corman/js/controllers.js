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
    
    $scope.formValidate = function(form){
      if(form.start_date.$modelValue == form.end_date.$modelValue){
        return form.start_time.$modelValue < form.end_time.$modelValue;
      }
      else{
        return form.start_date.$modelValue < form.end_date.$modelValue;
      }
    };
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

cormanControllers.controller('CalendarCtrl', function ($scope, $routeParams, $http){
  $scope.weekdays = ['Monday','Thuesday','Wendsday', 'Thurday','Friday','Saturday','Sunday'];
  $scope.times = ['00.00', '00.30','01.00','01.30','02.00','02.30','03.00','03.30','04.00',
                  '04.30','05.00','05.30','06.00','06.30','07.00','07.30','08.00','08.30',
                  '09.00','09.30','10.00','10.30','11.00','11.30','12.00','12.30','13.00',
                  '13.30','14.00','14.30','15.00','15.30','16.00','16.30','17.00','17.30',
                  '18.00','18.30','19.00','19.30','20.00','20.30','21.00','21.30','22.00',
                  '22.30','23.00','23.30']
  $scope.week_start_date = function (x){
    var d = new Date();
    var start = d.getDate()-(d.getDay()+6)+x;
    return start;
  };
  $scope.get_week = function (){
    var d = new Date();
    return d.getFullWeek();
  }
});