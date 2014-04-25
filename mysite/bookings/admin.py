from django.contrib import admin
from bookings.models import Resource, Booking

class BookingAd(admin.ModelAdmin):
	list_display = ('resource', 'start', 'user')

admin.site.register(Resource)
admin.site.register(Booking,BookingAd)

# Register your models here.
