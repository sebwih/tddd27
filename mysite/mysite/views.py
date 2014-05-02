from django.shortcuts import render
from django.http import HttpResponse, HttpResponseRedirect
from django.template import Template, RequestContext
from django.contrib.auth.models import User
from django.contrib.auth import login as auth_login
from django.contrib.auth import authenticate


def login(request):
	context = {}
	return render(request, 'home.html', context)

def home(request):
	user_lvl = request.user.groups.filter(name='1')
	if user_lvl:
		context = {"user_lvl" : user_lvl[0].name}
	else:
		context = {"user_lvl" : '2'}

	return render(request, 'home.html', context)

def angu(request):
	return render(request, 'ang.html', {})

def sign_up(request):
	return render(request, 'sign_up.html', {})

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