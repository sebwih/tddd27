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


cormanControllers.controller('UserBookingsCtrl', function ($scope, $routeParams, $http){
  $scope.resourceName = $routeParams.resourceName;
  $http.get('/bookings/get_user_bookings').success(function(data){
    $scope.user_bookings = data;
  });  
});


cormanControllers.controller('CalendarCtrl', function ($scope, $routeParams, $http, $filter,ngDialog){

    $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
      $scope.alertMessage = (event.title + ' was clicked ' + ' date ' + event.start);
    };

    $scope.alertOnDayClick = function(date,allDay,jsEvent,view){
        console.log(date);
    };

    $scope.alertOnSelect = function(startDate, endDate, allDay,jsEvent,view){
        $scope.startDate = $filter('date')(startDate, 'yyyy-MM-dd HH:mm:ss Z'); 
        $scope.endDate = $filter('date')(endDate, 'yyyy-MM-dd HH:mm:ss Z');
        ngDialog.open({ template: 'partials/booking_dialog.html',
                        scope: $scope});
    }; 

    $scope.alertOnUnselect = function(jsEvent,view){
        console.log('UNSELECT');
    }; 

  /* config object */
    $scope.uiConfig = {
      calendar:{
        height: 450,
        editable: true,
        defaultView: 'agendaWeek',
        selectable: true,
        selectHelper: true,
        unselectAuto: true,
        ignoreTimezone: false,
        header:{
          right: 'prev,next'
        },
        eventClick: $scope.alertOnEventClick,
        eventDrop: $scope.alertOnDrop,
        dayClick: $scope.alertOnDayClick,
        eventResize: $scope.alertOnResize,
        select: $scope.alertOnSelect,
        unselect: $scope.alertOnUnselect
      }
    };

    $scope.eventSource = {
      url: '/bookings/get_week_bookings',
    }; 

    $scope.eventSources = [$scope.eventSource];

    //////////////////////////////////////////////////////////////////////7

    $scope.today = function() {
    $scope.dt = new Date();
  };
  $scope.today();

  $scope.clear = function () {
    $scope.dt = null;
  };

  // Disable weekend selection
  $scope.disabled = function(date, mode) {
    return ( mode === 'day' && ( date.getDay() === 0 || date.getDay() === 6 ) );
  };

  $scope.toggleMin = function() {
    $scope.minDate = $scope.minDate ? null : new Date();
  };
  $scope.toggleMin();

  $scope.open = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.opened = true;
  };

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  $scope.initDate = new Date('2016-15-20');
  $scope.formats = ['dd-MMMM-yyyy', 'yyyy/MM/dd', 'dd.MM.yyyy', 'shortDate'];
  $scope.format = $scope.formats[0];


    //////////////////////////////////////////////////////////////////////


});

