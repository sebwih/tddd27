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
from django.contrib.auth.decorators import login_required

@login_required()
def get_user_events(request):
	user_id = request.user.id
	user = User.objects.get(id=user_id)
	events = Event.objects.filter(Q(user=user))
	return HttpResponse(serializers.serialize("json", events), content_type="application/json")


def get_event_data(request):
	event_url = request.GET['url']
	response = {}
	event = Event.objects.filter(url=event_url)

	if not event:
		response['success'] = False;
		return HttpResponse(json.dumps(response), content_type="application/json")

	choices = Choice.objects.filter(event=event[0].id)

	responses = Response.objects.filter(Q(choice=choices))

	users = Response.objects.filter(Q(choice=choices)).values("user").distinct()

	blubb = []

	for user in users:
		blubb += [{'user' : user['user'], 
				'answers' : json.loads(serializers.serialize("json",Response.objects.filter(Q(choice=choices),
																							Q(user=user['user'])).order_by('choice')))}]

	response['success'] = True
	response['data'] = {"choice" : json.loads(serializers.serialize("json", choices)), 
						"response" : blubb}

	return HttpResponse(json.dumps(response), content_type="application/json")


@login_required()
@csrf_exempt
def get_all_events(request):

	user_id = request.user.id
	user = User.objects.get(id=user_id)
	events = Event.objects.filter(Q(user=user))

	temp_event = []
	
	for event in events:

		choices = Choice.objects.filter(event=event.id)

		responses = Response.objects.filter(Q(choice=choices))

		users = Response.objects.filter(Q(choice=choices)).values("user").distinct()

		event_info = []

		for user in users:

			event_info += [{'user' : user['user'], 
						'answers' : json.loads(serializers.serialize("json",Response.objects.filter(Q(choice=choices),
																							Q(user=user['user'])).order_by('choice')))}]

		all_events += [{'id' 			: event.id, 
						'event_desc' 	: event.description, 
						"url" 			: event.url, 
						'choices' 		: json.loads(serializers.serialize("json", choices)),
						'responses' 	: event_info}]

	response = {}
	response['data'] = {'events' : all_events}

	return HttpResponse(json.dumps(response), content_type="application/json")

@login_required()
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

		print "Start Time: " + start_time
		print "Start Date: " + start_date

		start_date += (' ' + start_time)
		start_date = datetime.datetime.strptime(start_date, '%Y-%m-%d %H:%M')

		Choice.create(event,start_date)

	return HttpResponseRedirect('/static/corman/home.html#/schedulr')

@csrf_exempt
def create_response(request):
	event_url = request.POST['eventUrl']
	event_id = Event.objects.get(url=event_url)
	user = request.POST['user']
	choices = Choice.objects.filter(event=event_id)
	print request.POST

	for choice in choices:
		answ = request.POST.__contains__(str(choice.id))
		Response.create(user,choice,answ)

	return HttpResponseRedirect('/static/corman/home.html#/schedulr')
	