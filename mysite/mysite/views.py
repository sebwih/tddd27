from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import Template, RequestContext, loader
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from bookings.models import Resource, Booking
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
import datetime

def dict_builder(not_seri_dict):
 	seri_dict = {}
	for list_elem in not_seri_dict:
		for elem in list_elem:
			seri_dict[elem] = list_elem[elem]
	return [seri_dict]


def login(request):
	context = {}
	return render(request, 'home.html', context)

def user_logged_in(request):
	
	if request.user.is_authenticated():
		return HttpResponse(json.dumps({"success" : True, "message" : "user is logged in", "data" : []}), content_type="application/json")
	else:
		return HttpResponse(json.dumps({"success" : False, "message" : "user is not logged in", "data" : []}), content_type="application/json")

def get_bookings(request):
	response = {}
	response['success'] = True
	
	bookings = Booking.objects.all()

	booking_list = []
	for booking in bookings:
		booking_list.append({'id' : booking.id, 'start' : str(booking.start_time), 'end' : str(booking.end_date)})

	response['data'] = booking_list

	return HttpResponse(json.dumps(response), content_type="application/json")

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
def create_booking(request):
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
	user = 2
	b = Booking(resource=resource,user=User.objects.get(id=2),start_date=start_date,start_time=start_time,end_date=end_date,end_time=end_time,message=msg)
	b.save()
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
	return HttpResponseRedirect("/static/corman/home.html#/resources/"+request.POST['resource_name'])



def home(request):
	user_lvl = request.user.groups.filter(name='1')

	if user_lvl:
		context = {"user_lvl" : user_lvl[0].name,
					"bookings" : Booking.objects.all()}
	else:
		context = {"user_lvl" : '2',
					"bookings" : Booking.objects.all()}

	return render(request, 'home.html', context)

def post_usrname(request):
	username = request.POST['username']
	email = request.POST['email']
	first_name = request.POST['first_name']
	last_name = request.POST['last_name']
	password = request.POST['password1']

	user = User.objects.create_user(username, email, password)
	
	user.first_name = first_name
	user.last_name = last_name
	user.save()

	return HttpResponseRedirect('/')

def login_local(request):
	username = request.POST['username']
	password =  request.POST['password']

	user = authenticate(username=username,password=password)
	if user is not None:
		if user.is_active:
			auth_login(request, user)
			return HttpResponseRedirect('/')

	return HttpResponse("error")