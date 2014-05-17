from django.conf.urls import patterns, include, url

from django.contrib import admin
from django.views.generic import TemplateView
from schedulr import views
admin.autodiscover()

urlpatterns = patterns('',
	url(r'^get_user_events/', views.get_user_events, name='get_user_events'),
	url(r'^get_event_data/', views.get_event_data, name='get_event_data'),
	url(r'^create/', views.create, name='create'),
	url(r'^create_response/', views.create_response, name='create_response'),
)