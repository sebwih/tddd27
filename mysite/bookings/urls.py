from django.conf.urls import patterns, include, url

from django.contrib import admin
from django.views.generic import TemplateView
from bookings import views
admin.autodiscover()

urlpatterns = patterns('',

	url(r'^get_bookings/', views.get_bookings, name='get_bookings'),
	url(r'^get_resources/', views.get_resources, name='get_resources'),
	url(r'^book_resource/', views.book_resource, name='create_booking'),
	url(r'^get_booking_details/', views.get_booking_details, name='get_booking_details'),
	url(r'^get_resource_bookings/', views.get_resource_bookings, name='get_resource_bookings'),
	url(r'^remove_booking/', views.remove_booking, name='remove_booking'),
	url(r'^get_week_bookings/', views.get_week_bookings, name='get_week_bookings'),
)