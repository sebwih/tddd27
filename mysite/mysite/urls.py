from django.conf.urls import patterns, include, url

from django.contrib import admin
admin.autodiscover()

urlpatterns = patterns('',
    # Examples:
    url(r'^$', 'mysite.views.home', name='home'),
    url(r'^angu/', 'mysite.views.angu', name='angu'),
    url(r'^sign_up/', 'mysite.views.sign_up', name='sign_up'),
    url(r'^usrname/', 'mysite.views.post_usrname', name='usr'),
    url(r'^login_local/', 'mysite.views.login_local', name='login_local'),
    # url(r'^blog/', include('blog.urls')),
    url(r'^logout/', 'django.contrib.auth.views.logout', {'next_page' : '/'}),
    url(r'^admin/', include(admin.site.urls)),
    url(r'^login/', 'mysite.views.login', name='login'),
    (r'^accounts/', include('allauth.urls')),
)
