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


cormanControllers.controller('CalendarCtrl', function ($scope, $routeParams, $http, $filter,ngDialog,datasets,$location){

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
  $scope.resources.data[0].open = true;
  $scope.currentResourceName = $scope.resources.data[0].name

  $scope.showResource = function(id,calendar,resource){
    resource['open'] = !resource['open']
    if($scope.currentResource !== id){
      $scope.currentResource = id;
      $scope.currentResourceName = $scope.resources.data[id].name
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
  $scope.booking_response = {}
  $scope.booking_response['success'] = true;


  $scope.bookResource = function(form){
    form['resourceId']=$scope.currentResource
    form['startDate'] = $filter('date')(form['startDate'], 'yyyy-MM-dd')
    form['startTime'] = $filter('date')(form['startTime'], 'HH:mm:ss')
    form['endDate'] = $filter('date')(form['endDate'], 'yyyy-MM-dd')
    form['endTime'] = $filter('date')(form['endTime'], 'HH:mm:ss')
    console.log(JSON.stringify(form))
    $http({
            method: 'POST',
            url: '/bookings/book_resource/',
            data: JSON.stringify(form)
    }).
    success(function(data){
      console.log(data)
      ngDialog.closeAll()  
      $scope.booking_response = data;
      if (!$scope.booking_response.success){
        ngDialog.open({ template: 'partials/booking_failed.html'});
      } else {
        ngDialog.open({ template: 'partials/booking_success.html'}); 
      }
      $location.path('#/calendar')
    }).
    error(function(data){
      console.log(data);
    })
    }
});

cormanControllers.controller('DateCtrl', function ($scope, $http, $filter){

  //Kopierad kod? Skapa en funktion som kan anvandas av bada datepickers?

  $scope.form = {}

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
    $scope.form['startDate'] = new Date($scope.startDate);
  };
  
  $scope.initStart();

  $scope.initEnd = function() {
    $scope.form['endDate'] = new Date($scope.endDate);
  };

  $scope.formValidate = function(form) {

    start_date  =   $filter('date')(form.startDate.$modelValue, 'yyyy-MM-dd')
    start_time  =   $filter('date')(form.startTime.$modelValue, 'HH:mm:ss')
    end_date    =   $filter('date')(form.endDate.$modelValue, 'yyyy-MM-dd')
    end_time    =   $filter('date')(form.endTime.$modelValue, 'HH:mm:ss')
    

    if(start_date < end_date){
      return true
    }

    if(start_date === end_date){
      if(start_time < end_time){
        return true
      }
    }
    return false
  }

//clear() ? Hur funkar den och hur ska det funka pa flera datepickers?
  
  $scope.initEnd();

  $scope.dateOptions = {
    formatYear: 'yy',
    startingDay: 1
  };

  //------------------------------------------------

  $scope.form['startTime'] = new Date($scope.startDate);
  $scope.form['endTime'] = new Date($scope.endDate);

  });

cormanControllers.controller('SchedulrCtrl', function ($scope, $routeParams, $http){
  $http.get('/schedulr/get_all_events').success(function(data){
    $scope.response = data;
  });
});

function ChoiceCtrl($scope) {
  $scope.choices = [{}
  ];

  $scope.choiceNumber = 1;

  $scope.ChoiceTime = new Date('2014-01-01 00:00')

  $scope.addChoice = function() {
    $scope.choices.push({});
    $scope.choiceNumber += 1;
  };

  $scope.closeChoice = function(index) {
    $scope.choices.splice(index, 1);
  };

}

cormanControllers.controller('SchedulrAnswerCtrl', function ($scope, $routeParams, $http){
  
  $scope.eventUrl = $routeParams.eventUrl;

  $http.get('/schedulr/get_event_data?url=' + $scope.eventUrl).success(function(data){
      $scope.eventDetails = data
  });
});
