from django.conf.urls import patterns, include, url

from django.contrib import admin
from django.views.generic import TemplateView
import settings
admin.autodiscover()

urlpatterns = patterns('',

    url(r'^logout/', 'django.contrib.auth.views.logout', {'next_page' : '/static/corman/home.html'}),
    url(r'^admin/', include(admin.site.urls)),
    (r'^accounts/', include('allauth.urls')),
    url(r'^bookings/', include('bookings.urls')),
    url(r'^schedulr/', include('schedulr.urls')),
    url(r'^user_logged_in/', 'mysite.views.user_logged_in', name='user_logged_in'),
    
    url(r'^/static/corman/(?P<path>.*)$', 'django.views.static.serve', {'document_root': settings.STATIC_DOC_ROOT}),
)
