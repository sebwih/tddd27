from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate
from bookings.models import Resource, Booking
from allauth.socialaccount.models import SocialAccount  
from django.core import serializers
from django.views.decorators.csrf import csrf_exempt
import json
import datetime
from django.shortcuts import render
from django.template import Template, RequestContext, loader

def user_logged_in(request):
	
	if request.user.is_authenticated():
		response = {}
		response['success'] = True
		response['message'] = "user is logged in"
		response['picture'] = SocialAccount.objects.get(id=request.user.id).extra_data['picture']
		if request.user.is_superuser:
			response['user'] = "Administrator"
		else:
			response['user'] = request.user.first_name +" "+ request.user.last_name
		return HttpResponse(json.dumps(response), content_type="application/json")
	else:
		return HttpResponse(json.dumps({"success" : False, "message" : "user is not logged in", "data" : []}), content_type="application/json")