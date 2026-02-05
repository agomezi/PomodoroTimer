from django.db import models
from django.conf import settings
from django.db import models

class UserSettings(models.Model):
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    focus_minutes = models.PositiveSmallIntegerField(default=25)
    short_break_minutes = models.PositiveSmallIntegerField(default=5)
    long_break_minutes = models.PositiveSmallIntegerField(default=15)
    long_break_every = models.PositiveSmallIntegerField(default=4)

    daily_goal_sessions = models.PositiveSmallIntegerField(default=8)

    sound_enabled = models.BooleanField(default=True)
    auto_start_break = models.BooleanField(default=False)
    auto_start_focus = models.BooleanField(default=False)

    updated_at = models.DateTimeField(auto_now=True)

class DailyProgress(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField()

    focus_sessions_completed = models.PositiveSmallIntegerField(default=0)
    focus_minutes_completed = models.PositiveSmallIntegerField(default=0)

class Meta:
    unique_together = ('user', 'date')

# Create your models here.
