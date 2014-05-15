var cormanControllers = angular.module('cormanControllers', []);

cormanControllers.controller('BookingListCtrl', function ($scope, $http) {
	$http.get('/bookings/get_bookings').success(function(data) {
      $scope.bookings = data;
    });
});


cormanControllers.controller('BookingDetailCtrl', function ($scope, $routeParams, $http) {
    /*$scope.resourceName = $routeParams.resourceName;
    $http.post('/bookings/get_booking_details/', {"id" : $routeParams.bookingId}).success(function(data) {
      $scope.booking = data;*/
      $http.get('/bookings/get_booking_details/?id='+$scope.bookingId).success(function(data) {
      $scope.booking = data;
      $scope.booked = new Date($scope.booking.data.booked)
      $scope.bookingStart = new Date($scope.booking.data.start)
      $scope.bookingEnd = new Date($scope.booking.data.end)
    });

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
    $scope.bookingId = event.id;
    ngDialog.open({ template: 'partials/booking_details.html',
                      scope: $scope,
                      controller: 'BookingDetailCtrl'});
  };

  $scope.alertOnDayClick = function(date,allDay,jsEvent,view){
      
  };


  $scope.alertOnSelect = function(startDate, endDate, allDay,jsEvent,view){
      $scope.startDate = $filter('date')(startDate, 'yyyy-MM-dd HH:mm:ss Z'); 
      $scope.endDate = $filter('date')(endDate, 'yyyy-MM-dd HH:mm:ss Z');
      ngDialog.open({ template: 'partials/booking_dialog.html',
                      scope: $scope,
                      controller: 'DateCtrl'});
  }; 

  $scope.alertOnUnselect = function(jsEvent,view){
      console.log('UNSELECT');
  }; 

/* config object */
  $scope.uiConfig = {
    calendar:{
      aspectRatio: 2,
      axisFormat: 'HH:mm',
      timeFormat: {
        agenda: 'HH:mm{ - HH:mm}'
      },
      columnFormat: {
        week: 'ddd dd/M'
      },
      firstHour: new Date().getHours()-1,
      defaultView: 'agendaWeek',
      selectable: true,
      selectHelper: true,
      unselectAuto: true,
      ignoreTimezone: false,
      firstDay: 1,
      header:{
        left: '',
        center: 'title',
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

  //INIT ORDENTLIGT!
  $scope.currentResource = 1

  $http.get('/bookings/get_resources').success(function(data){
      $scope.resources = data;
  });

  $scope.showResource = function(id,calendar){
    if($scope.currentResource !== id){
      $scope.currentResource = id;
      calendar.fullCalendar('refetchEvents')
    }
  }

  $scope.eventSource = {
    url: '/bookings/get_week_bookings',
    data: function() {
      return {
        id: $scope.currentResource
      }
    },
  }; 

  $scope.eventSources = [$scope.eventSource];

  ///////////////////////////////////////////////////////////////////////

  //////////////////////////////////////////////////////////////////////
});

cormanControllers.controller('DateCtrl', function ($scope, $http){

  //Kopierad kod? Skapa en funktion som kan anvandas av bada datepickers?

  $scope.openStart = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedStart = true;
  };

    $scope.openEnd = function($event) {
    $event.preventDefault();
    $event.stopPropagation();

    $scope.openedEnd = true;
  };

  $scope.initStart = function() {
    $scope.BookingStartDate = new Date($scope.startDate);
  };
  
  $scope.initStart();

  $scope.initEnd = function() {
    $scope.BookingEndDate = new Date($scope.endDate);
  };


//clear() ? Hur funkar den och hur ska det funka pa flera datepickers?
  
  $scope.initEnd();

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  //------------------------------------------------

  $scope.BookingStartTime = new Date($scope.startDate);
  $scope.BookingEndTime = new Date($scope.endDate);

  });