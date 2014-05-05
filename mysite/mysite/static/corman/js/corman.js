var cormanApp = angular.module('cormanApp', [
  'ngRoute',
  'cormanControllers'
]);

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
      when('/new_reservation', {
      	templateUrl: 'partials/reservation.html',
        controller: 'ReservationCtrl'
      }).
      otherwise({
        redirectTo: '/bookings'
      });
  }]);