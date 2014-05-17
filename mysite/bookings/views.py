from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from bookings.models import Resource, Booking
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
from django.db.models import Q

def get_bookings(request):
	response = {}
	response['success'] = True
	
	bookings = Booking.objects.all()

	booking_list = []
	for booking in bookings:
		booking_list.append({'id' : booking.id, 'start' : str(booking.start_time), 'end' : str(booking.end_date)})

	response['data'] = booking_list

	return HttpResponse(json.dumps(response), content_type="application/json")

def get_user_bookings(request):
	
	response = {}
	response['success'] = True

	bookings = Booking.objects.filter(user=request.user.id)
	response['data'] = json.loads(serializers.serialize("json", bookings))

	return HttpResponse(json.dumps(response), content_type="application/json")

#Anvands denna?
def get_resources(request):
	response = {}
	response['success'] = True
	response['data'] = list(Resource.objects.filter(available=True).values('id','name','description'))
	return HttpResponse(json.dumps(response), content_type="application/json")

@csrf_exempt
def get_resource_bookings(request):
	obj = json.loads(request.body)
	resource = Resource.objects.get(name=obj["name"])
	bookings = Booking.objects.filter(resource=resource)
	from django.core import serializers
	response = {}
	response['success'] = True	
	response['data'] = json.loads(serializers.serialize("json", bookings))
	return HttpResponse(json.dumps(response), content_type="application/json")

@csrf_exempt
def book_resource(request):

	start_date = request.POST['startDate']
	start_time = request.POST['startTime']

	end_date = request.POST['endDate']
	end_time = request.POST['endTime']
	msg = request.POST['msg']
	resource_id = request.POST['resourceId']

	resource = Resource.objects.get(id=resource_id)

	start_date += (' ' + start_time)

	start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d %H:%M:%S')

	end_date += (' ' + end_time)

	end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d %H:%M:%S')
	
	user = User.objects.get(id=request.user.id)
	Resource.create_booking(resource,user,start_date,end_date,msg)

	return HttpResponseRedirect("/static/corman/home.html#/calendar")

@csrf_exempt
def get_booking_details(request):
	booking_id = request.GET['id']


	booking = Booking.objects.get(id=booking_id)

	response = {}
	response['success'] = True
	response['data'] = {'resource' : booking.resource.name, 'user' : booking.user.first_name, 'booked' : str(booking.booked), 
						'start' : str(booking.start_date), 'end' : str(booking.end_date), 'message' : booking.message}

	return HttpResponse(json.dumps(response), content_type="application/json")

@csrf_exempt
def remove_booking(request):
	booking_id = request.POST['booking_id']
	booking = Booking.objects.get(id=booking_id)
	booking.delete()
	return HttpResponseRedirect("/static/corman/home.html#/my_bookings")

@csrf_exempt
def get_week_bookings(request):
	start = request.GET['start']
	start = (datetime.datetime.fromtimestamp(int(start)))
	end = request.GET['end']
	end = (datetime.datetime.fromtimestamp(int(end)))
	resource_id = request.GET['id']
	
	b = Booking.objects.filter(Q(resource=resource_id),Q(start_date__gt=start),Q(end_date__lt=end)).order_by('start_date')

	event_feed = []

	for event in b:
		event_feed += [{'id' : event.id, 'title' : event.message, 'start' : str(event.start_date), 'end' : str(event.end_date), 'allDay' : False}]

	return HttpResponse(json.dumps(event_feed), content_type="application/json")