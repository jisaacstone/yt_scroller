from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('yt_scroller.views',
    url(r'^$', 'index'),
    url(r'^vid/(?P<vid_string>\w+)/?$', 'show'), 
    url(r'^ajax/update_time/(?P<vid_id>\d+)/(?P<timestop_id>\d+)/?', 'update_time'),
)

