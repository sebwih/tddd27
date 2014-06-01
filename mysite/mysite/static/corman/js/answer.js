var schedulrApp = angular.module('schedulrApp', [
  'ngRoute',
  'cormanControllers',
  'ui.calendar',
  'ui.bootstrap',
  'ngDialog',
]);

schedulrApp.config(['$routeProvider',
  function($routeProvider) {
    $routeProvider.
      when('/answer/:eventUrl', {
        templateUrl: 'partials/schedulr_answer.html',
        controller: 'SchedulrAnswerCtrl'      
      }).
      otherwise({
        redirectTo: '/answer/notfound'
      });
  }]);
