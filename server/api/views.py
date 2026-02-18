from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from django.utils import timezone
from datetime import date


from .serializers import (
    RegisterSerializer,
    UserSettingsSerializer,
    UserSerializer,
    DailyProgresSerializer,
)

from .models import UserSettings, DailyProgress


