from django.conf.urls.defaults import patterns, include, url

urlpatterns = patterns('yt_scroller.views',
    url(r'^$', 'index'),
    url(r'^vid/(?P<vid_string>\w*)/?$', 'show'), 
    url(r'^vids/index/?$', 'show', {'vid_string': None}),
    url(r'^ajax/update_time/(?P<vid_id>\d+)/(?P<timestop_id>\d+)/?', 'update'),
    url(r'^ajax/new_video/?$','update_vid', {'vid_id': None}),
    url(r'^ajax/update/(?P<vid_id>\w+)/?$', 'update_vid'),
)

