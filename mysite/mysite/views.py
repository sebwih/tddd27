from django.shortcuts import render
from django.http import HttpResponse
from django.template import Template, RequestContext

def login(request):
	context = {}
	return render(request, 'login.html', context)

def home(request):
	user_lvl = request.user.groups.filter(name='1')
	if user_lvl:
		context = {"user_lvl" : user_lvl[0].name}
	else:
		context = {"user_lvl" : '2'}

	return render(request, 'home.html', context)