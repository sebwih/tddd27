from django.db import models

class Resource(models.Model):
	def __unicode__(self):
		return self.name

	def create_booking(self, user, start_date, start_time, end_date, end_time, message):
		b = Booking(resource=self,user=user,start_date=start_date,start_time=start_time,
					end_date=end_date,end_time=end_time,message=message)
		b.save()

	def remove_booking(self):
		pass

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

