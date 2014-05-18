var cormanApp = angular.module('cormanApp', [
  'ngRoute',
  'cormanControllers',
  'ui.calendar',
  'ui.bootstrap',
  'ngDialog',
  'ngCookies',
]);


cormanApp.run(function ($rootScope,$location,$http,$cookies) {
    $rootScope.isActive = function (viewLocation) { 
        return (viewLocation === $location.path()) && $rootScope.logged_in;
    };
    //$http.defaults.headers.post['X-CSRFToken'] = $cookies.csrftoken;
  });

cormanApp.config(['$routeProvider','$httpProvider',
  function($routeProvider,$httpProvider) {
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

      //$httpProvider.defaults.xsrfHeaderName = 'X-CSRFToken';
  }]);
