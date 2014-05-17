from django.contrib import admin
from schedulr.models import Event, Choice, Response

# Register your models here.
class SchedulrAd(admin.ModelAdmin):
	list_display = ('Event', 'start_date', 'user')

class ChoiceAd(admin.ModelAdmin):
	list_display = ('start', 'event')

class ResponseAd(admin.ModelAdmin):
	list_display = ('user', 'choice', 'free')

admin.site.register(Event)
admin.site.register(Choice, ChoiceAd)
admin.site.register(Response, ResponseAd)