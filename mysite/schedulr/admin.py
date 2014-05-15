from django.contrib import admin
from schedulr.models import Event, Choice, Response

# Register your models here.
class SchedulrAd(admin.ModelAdmin):
	list_display = ('Event', 'start_date', 'user')

admin.site.register(Event)
admin.site.register(Choice)
admin.site.register(Response)