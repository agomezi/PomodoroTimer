from django.urls import path
from . import views

from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)

urlpatterns = [
    path("token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("register/", views.RegisterView.as_view(), name="register"),
    path("profile/", views.ProfileView.as_view(), name="profile"),
    path("settings/", views.UserSettingsView.as_view(), name="settings"),
    path("progress/", views.DailyProgressListView.as_view(), name="progress_list"),
    path("progress/log-session/", views.log_session, name="log_session"),
    path("stats/", views.user_stats, name="user_stats"),
]
