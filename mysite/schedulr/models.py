from django.db import models
from django.utils import timezone
import datetime
import random
import string

class Event(models.Model):
    description = models.CharField(max_length=200)
    created = models.DateTimeField(auto_now_add=True)
    user = models.ForeignKey('auth.user', on_delete=models.CASCADE)
    url = models.CharField(max_length=5)
    
    def __unicode__(self):
        return self.description

    @classmethod
    def create(cls, description,user):

        url = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(5)]).lower()
        
        while Event.objects.filter(url=url).count() == 1:
            url = ''.join([random.choice(string.ascii_letters + string.digits) for n in xrange(5)]).lower()

        e = cls(description=description,user=user,url=url)
        e.save()
        return e.id

class Choice(models.Model):
    event = models.ForeignKey(Event, on_delete=models.CASCADE)
    start = models.DateTimeField('Choice')
    
    def __unicode__(self):
    	return str(self.start)

    @classmethod
    def create(cls, event,start):
        c = cls(event=event,start=start)
        c.save()
    
class Response(models.Model):
    user = models.CharField(max_length=30)
    choice = models.ForeignKey(Choice, on_delete=models.CASCADE)
    free = models.BooleanField()

    @classmethod
    def create(cls, user,choice,free):
        r = cls(user=user,choice=choice,free=free)
        r.save()