from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from bookings.models import Resource, Booking
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
from django.shortcuts import render
from django.template import Template, RequestContext, loader

def login(request):
	context = {}
	return render(request, 'home.html', context)

def user_logged_in(request):
	
	if request.user.is_authenticated():
		return HttpResponse(json.dumps({"success" : True, "message" : "user is logged in", "data" : []}), content_type="application/json")
	else:
		return HttpResponse(json.dumps({"success" : False, "message" : "user is not logged in", "data" : []}), content_type="application/json")

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