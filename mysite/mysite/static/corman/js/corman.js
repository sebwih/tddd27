var cormanApp = angular.module('cormanApp', [
  'ngRoute',
  'cormanControllers',
  'ui.calendar',
  'ui.bootstrap',
  'ngDialog',
]);

cormanApp.run(function ($rootScope,$location) {
    $rootScope.isActive = function (viewLocation) { 
        return (viewLocation === $location.path()) && $rootScope.logged_in;
    };
  });

cormanApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/schedulr/answer/:eventUrl', {
        templateUrl: 'partials/schedulr_answer.html',
        controller: 'SchedulrAnswerCtrl'      
      }).
      when('/calendar', {
      templateUrl: 'partials/calendar.html',
      controller: 'CalendarCtrl',
      resolve : {
        datasets: function($q,$http){
          return $http.get('/bookings/get_resources')
        }
      }
      }).
      when('/my_bookings', {
      templateUrl: 'partials/user_bookings.html',
      controller: 'UserBookingsCtrl'
      }).
      when('/schedulr', {
        templateUrl: 'partials/schedulr.html',
        controller: 'SchedulrCtrl'
      }).
      when('/new_schedulr', {
        templateUrl: 'partials/new_schedulr.html',
        controller: 'SchedulrCtrl'
      }).
        when('/login', {
        templateUrl: '/sign_in.html',
      }).
      otherwise({
        redirectTo: '/calendar'
      });
  }]);
