from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('yt_scroller.views',
    url(r'^$', 'index'),
    url(r'^vid/(?P<vid_string>\w+)/?$', 'show'), 
)

