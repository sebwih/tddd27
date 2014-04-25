from django.db import models

class Resource(models.Model):
	def __unicode__(self):
		return self.name
	name = models.CharField(max_length=200)
	description = models.CharField(max_length=200, null=True, blank=True)
	available = models.BooleanField()
	priviledge = models.ForeignKey('auth.group')
	

class Booking(models.Model):
	def __unicode__(self):
		return self.message
	resource = models.ForeignKey(Resource)
	user = models.ForeignKey('auth.user')
	booked = models.DateTimeField(auto_now_add=True)
	start = models.DateTimeField('start time')
	end = models.DateTimeField('end time')
	message = models.CharField(max_length=200, null=True, blank=True)

