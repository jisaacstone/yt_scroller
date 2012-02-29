from django.http import HttpRequest, HttpResponse
from django.shortcuts import render_to_response, get_object_or_404
from yt_scroller.models import VidInfo, Timestop

def index(HttpRequest):
    return render_to_response('yt_scroller.html', {})

def show(HttpRequest, vid_string):
    vid = VidInfo.objects.filter(name=vid_string)
    if not vid:
        vid = VidInfo.objects.filter(vid_id=vid_string)
    if not vid:
        return render_to_response('yt_index.html', {'vids': VidInfo.objects.all(), 'edit': True})
    vid = vid[0]    
    timestops = vid.timestop_set.all()
    edit = True
    return render_to_response('yt_vid.html', locals())

def update(HttpRequest, vid_id, timestop_id):
    if timestop_id != '0':
        ts = get_object_or_404(Timestop, pk=timestop_id, vid=vid_id)
    else:
        ts = get_object_or_404(VidInfo, pk=vid_id).timestop_set.create(time=0, html="")
    method = HttpRequest.META['REQUEST_METHOD']
    if method == 'POST':
        html = HttpRequest.POST.get('html', None)
        time = HttpRequest.POST.get('time', None)
        if time is None and html is None:
            return HttpResponse(status="400") 
        if time:
            ts.time = time
        if html:    
            ts.html = html
        ts.save()
        return HttpResponse(status='201')
    elif method == 'DELETE':
        ts.delete()
        return HttpResponse(status='204')

def update_vid(HttpRequest, vid_id):
    method = HttpRequest.META['REQUEST_METHOD']
    if method == 'POST':
        title = HttpRequest.POST.get('name', None)
        vid_id = HttpRequest.POST.get('vid_id', None);
        if not title or not vid_id:
            return HttpResponse(status="400")
        v = VidInfo(name=title, vid_id=vid_id)
        v.save()
        return HttpResponse(status="201")
    elif method == 'DELETE':
        vid = get_object_or_404(VidInfo, vid_id=vid_id)
        vid.delete()
        return HttpResponse(status='204')

    
