from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from schedulr.models import Event, Choice, Response
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
from django.db.models import Q

def get_user_events(request):
	user_id = request.user.id
	user = User.objects.get(id=user_id)
	events = Event.objects.filter(Q(user=user))
	print events
	return HttpResponse(serializers.serialize("json", events), content_type="application/json")

def get_event_data(request):

	event_id = request.GET['eventId']

	response = {}

	choices = Choice.objects.filter(event=event_id)

	responses = Response.objects.filter(Q(choice=choices))

	users = Response.objects.filter(Q(choice=choices)).values("user").distinct()

	print users

	blubb = []

	for user in users:
		print user
		blubb += [{'user' : user['user'], 
				'answers' : json.loads(serializers.serialize("json",Response.objects.filter(Q(choice=choices),
																							Q(user=user['user'])).order_by('choice')))}]


	response['data'] = {"choice" : json.loads(serializers.serialize("json", choices)), 
						"response" : blubb}

	return HttpResponse(json.dumps(response), content_type="application/json")

@csrf_exempt
def create(request):
	number_choices = (len(request.POST)-1)/2
	event_desc = request.POST['eventDesc']
	user = User.objects.get(id=request.user.id)
	event_id = Event.create(event_desc,user)

	event = Event.objects.get(id=event_id)
	
	for index in range(number_choices):
		start_time = request.POST['choiceTime_' + str(index)]
		start_date = request.POST['choiceDate_' + str(index)]

		start_date += (' ' + start_time)
		start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d %H:%M')

		Choice.create(event,start_date)

	return HttpResponse("")

@csrf_exempt
def create_response(request):
	event_id = request.POST['eventId']
	user = request.POST['user']
	choices = Choice.objects.filter(event=event_id)
	print request.POST

	for choice in choices:
		answ = request.POST.__contains__(str(choice.id))
		Response.create(user,choice,answ)

	return HttpResponse("")

























