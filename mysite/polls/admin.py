from django.contrib import admin
from polls.models import Poll, Choice

class PollAd(admin.ModelAdmin):
	fields = ['pub_date', 'question']
	list_display = ('question', 'pub_date')
	
admin.site.register(Poll,PollAd)
admin.site.register(Choice)

# Register your models here.
