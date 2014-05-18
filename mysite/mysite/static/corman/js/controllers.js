var cormanControllers = angular.module('cormanControllers', []);

cormanControllers.controller('BookingListCtrl', function ($scope, $http) {
	$http.get('/bookings/get_bookings').success(function(data) {
      $scope.bookings = data;
    });
});


cormanControllers.controller('BookingDetailCtrl', function ($scope, $routeParams, $http) {
      $http.get('/bookings/get_booking_details/?id='+$scope.bookingId).success(function(data) {
      $scope.booking = data;
      $scope.booked = new Date($scope.booking.data.booked)
      $scope.bookingStart = new Date($scope.booking.data.start)
      $scope.bookingEnd = new Date($scope.booking.data.end)
    });
});

cormanControllers.controller('loginCtrl', function ($scope, $http, $rootScope) {
    $http.get('/user_logged_in').success(function(data) {
      if(data.success){
        $rootScope.logged_in = true;
        $scope.showView = true;
        if (data.user !== 'Administrator'){
          $rootScope.user_pic = data.picture;
        } else {
          $rootScope.user_pic = "";
        }
        $rootScope.logged_in_user= data.user;
      }else{
        $rootScope.logged_in = false;
        $scope.showView = true;
      }
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


cormanControllers.controller('CalendarCtrl', function ($scope, $routeParams, $http, $filter,ngDialog,datasets){

  $scope.alertOnEventClick = function( event, allDay, jsEvent, view ){
    $scope.bookingId = event.id;
    ngDialog.open({ template: 'partials/booking_details.html',
                      scope: $scope,
                      controller: 'BookingDetailCtrl'});
  };

  $scope.alertOnSelect = function(startDate, endDate, allDay,jsEvent,view){
      $scope.startDate = $filter('date')(startDate, 'yyyy-MM-dd HH:mm:ss Z'); 
      $scope.endDate = $filter('date')(endDate, 'yyyy-MM-dd HH:mm:ss Z');
      ngDialog.open({ template: 'partials/booking_dialog.html',
                      scope: $scope,
                      controller: 'DateCtrl'});
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

  $scope.resources = datasets.data;
  $scope.currentResource = $scope.resources.data[0].id

  $scope.showResource = function(id,calendar,resource){
    resource['open'] = !resource['open']
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

    $scope.bookResource = function(form){
    // console.log(form.endDate)
    $http({
            method: 'POST',
            url: '/bookings/book_resource/',
            data: form,
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}}).success(function(data){
        
        $scope.booking_response = data;
      });
    }


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

cormanControllers.controller('SchedulrCtrl', function ($scope, $routeParams, $http){
  $http.get('/schedulr/get_all_events').success(function(data){
    $scope.response = data;
  });
});

function AlertDemoCtrl($scope) {
  $scope.alerts = [
  ];

  $scope.choiceNumber = 1;

  $scope.ChoiceTime = new Date('2014-01-01 00:00')

  $scope.addAlert = function() {
    $scope.alerts.push({id: 1});
    $scope.choiceNumber += 1;
  };

  $scope.closeAlert = function(index) {
    $scope.alerts.splice(index, 1);
  };

}

cormanControllers.controller('SchedulrAnswerCtrl', function ($scope, $routeParams, $http){
  
  $scope.eventUrl = $routeParams.eventUrl;

  $http.get('/schedulr/get_event_data?url=' + $scope.eventUrl).success(function(data){
      $scope.eventDetails = data
  });
});
