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
	response['data'] = list(Resource.objects.values('name','id','description'))
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
	resource = request.POST['resource']
	resource = Resource.objects.get(name=resource)
	msg = request.POST['msg']
	start_date = request.POST['start_date']
	start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d').date()
	end_date = request.POST['end_date']
	end_date = datetime.datetime.strptime(end_date, '%Y-%m-%d').date()
	start_time = request.POST['start_time']
	start_time = datetime.datetime.strptime(start_time,'%H:%M').time()
	end_time = request.POST['end_time']
	end_time = datetime.datetime.strptime(end_time,'%H:%M').time()
	# ANDRAS TILL ATT VARA ANVANDAREN SOM AR INLOGGAD.
	user = User.objects.get(id=request.user.id)
	print user
	Resource.create_booking(resource,user,start_date,start_time,end_date,end_time,msg)
	return HttpResponseRedirect("/static/corman/home.html#/resources/"+resource.name)


@csrf_exempt
def get_booking_details(request):
	obj = json.loads(request.body)
	response = {}
	response['success'] = True
	booking = Booking.objects.get(id=obj['id'])
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
	obj = json.loads(request.body)
	print obj
	resource = obj['resource']
	s_date = datetime.datetime.strptime(obj['dates']['start'], '%Y-%m-%d').date()
	e_date = datetime.datetime.strptime(obj['dates']['end'], '%Y-%m-%d').date()
	week = s_date.isocalendar()[1]
	b = Booking.objects.filter(Q(resource=resource),Q(start_date__gt=s_date),Q(end_date__lt=e_date)).order_by('start_date','start_time')

	response = {}
	response['success'] = True
	response['data'] = json.loads(serializers.serialize('json', b))
	response['week'] = week

	return HttpResponse(json.dumps(response), content_type="application/json")


