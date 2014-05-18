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
      when('/resources', {
        templateUrl: 'partials/resource_list.html',
        controller: 'ResourceListCtrl'
      }).
      when('/resources/:resourceName', {
        templateUrl: 'partials/resource_details.html',
        controller: 'ResourceDetailCtrl'        
      }).
      when('/schedulr/answer/:eventUrl', {
        templateUrl: 'partials/schedulr_answer.html',
        controller: 'SchedulrAnswerCtrl'      
      }).
      when('/calendar', {
        templateUrl: 'partials/calendar.html',
        controller: 'CalendarCtrl'
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