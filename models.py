from django.db import models

class VidInfo(models.Model):
    name = models.CharField(max_length=200)
    vid_id = models.CharField(max_length=200)

    def __uicode__(self):
        return self.name if self.name else self.vid_id

class Timestop(models.Model):
    vid = models.ForeignKey(VidInfo)

    time = models.IntegerField()
    html = models.TextField()

    def __unicode__(self):
        return self.html[:100]

    class Meta:
        ordering = 'time',
