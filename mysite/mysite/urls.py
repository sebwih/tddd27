from django.conf.urls import patterns, include, url

from django.contrib import admin
from django.views.generic import TemplateView
import settings
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    #url(r'^$', 'mysite.views.index', name='home'),
    url(r'^usrname/', 'mysite.views.post_usrname', name='usr'),
    url(r'^login_local/', 'mysite.views.login_local', name='login_local'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^logout/', 'django.contrib.auth.views.logout', {'next_page' : '/'}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', 'mysite.views.login', name='login'),
    (r'^accounts/', include('allauth.urls')),
    url(r'^user_logged_in/', 'mysite.views.user_logged_in', name='user_logged_in'),
    url(r'^get_bookings/', 'mysite.views.get_bookings', name='get_bookings'),
    url(r'^get_resources/', 'mysite.views.get_resources', name='get_resources'),
    url(r'^create_booking/', 'mysite.views.create_booking', name='create_booking'),
    url(r'^get_booking_details/', 'mysite.views.get_booking_details', name='get_booking_details'),
    url(r'^get_resource_bookings/', 'mysite.views.get_resource_bookings', name='get_resource_bookings'),
    url(r'^remove_booking/', 'mysite.views.remove_booking', name='remove_booking'),
    url(r'^/static/corman/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_DOC_ROOT}),
)
