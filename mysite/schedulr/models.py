from django.db import models
from django.utils import timezone
import datetime

# Create your models here.

class Event(models.Model):
    description = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('auth.user', on_delete=models.CASCADE)
    def __unicode__(self):
        return self.description

class Choice(models.Model):
    event = models.ForeignKey(Event)
    start = models.DateTimeField('Choice')
    def __unicode__(self):
    	return str(self.start)

class Response(models.Model):
	user = models.ForeignKey('auth.user',on_delete=models.CASCADE)
	choice = models.ForeignKey(Choice)
	free = models.BooleanField()

