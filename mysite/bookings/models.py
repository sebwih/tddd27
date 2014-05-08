from django.db import models

class Resource(models.Model):
	def __unicode__(self):
		return self.name
	name = models.CharField(max_length=200)
	description = models.CharField(max_length=200, null=True, blank=True)
	available = models.BooleanField()
	priviledge = models.ForeignKey('auth.group', on_delete=models.CASCADE)
	

class Booking(models.Model):
	def __unicode__(self):
		return self.message
	resource = models.ForeignKey(Resource, on_delete=models.CASCADE)
	user = models.ForeignKey('auth.user', on_delete=models.CASCADE)
	# ANDRA TILL DATEFIELD OCH TIME FIELD ISTALLET FOR DATETIMEFIELD?
	booked = models.DateTimeField(auto_now_add=True)
	start_date = models.DateField('start date')
	start_time = models.TimeField('start time')
	end_date = models.DateField('end date')
	end_time = models.TimeField('end time')
	message = models.CharField(max_length=200, null=True, blank=True)

