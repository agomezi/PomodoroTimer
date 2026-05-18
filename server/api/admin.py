from django.contrib import admin
from .models import UserSettings, DailyProgress

admin.site.register(UserSettings)
admin.site.register(DailyProgress)
