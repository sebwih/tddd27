var cormanApp = angular.module('cormanApp', [
  'ngRoute',
  'cormanControllers',
  'ui.calendar',
  'ui.bootstrap',
  'ngDialog',
]);

cormanApp.run(function($rootScope,$location) {
    $rootScope.isActive = function (viewLocation) { 
        return (viewLocation === $location.path()) && $rootScope.logged_in;
    };
})

cormanApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/bookings', {
        templateUrl: 'partials/booking_list.html',
        controller: 'BookingListCtrl'
      }).
      when('/bookings/:bookingId', {
        templateUrl: 'partials/booking_details.html',
        controller: 'BookingDetailCtrl'
      }).
      when('/resources', {
        templateUrl: 'partials/resource_list.html',
        controller: 'ResourceListCtrl'
      }).
      when('/resources/:resourceName', {
        templateUrl: 'partials/resource_details.html',
        controller: 'ResourceDetailCtrl'        
      }).
      when('/resources/:resourceName/reservation', {
        templateUrl: 'partials/reservation.html',
        controller: 'ReservationCtrl'
      }).
      when('/resources/:resourceName/:bookingId', {
        templateUrl: 'partials/booking_details.html',
        controller: 'BookingDetailCtrl'        
      }).
        when('/calendar', {
        templateUrl: 'partials/calendar.html',
        controller: 'CalendarCtrl'        
      }).
        when('/my_bookings', {
        templateUrl: 'partials/user_bookings.html',
        controller: 'UserBookingsCtrl'
      }).
        when('/login', {
        templateUrl: '/sign_in.html',
      }).
      otherwise({
        redirectTo: '/calendar'
      });
  }]);