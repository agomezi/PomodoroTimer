from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from datetime import date, timedelta

from .serializers import (
    RegisterSerializer,
    UserSettingsSerializer,
    UserSerializer,
    DailyProgressSerializer,
)

from .models import UserSettings, DailyProgress


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = [AllowAny]
    serializer_class = RegisterSerializer


class ProfileView(generics.RetrieveAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSerializer

    def get_object(self):
        return self.request.user


class UserSettingsView(generics.RetrieveUpdateAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = UserSettingsSerializer

    def get_object(self):
        settings, created = UserSettings.objects.get_or_create(user=self.request.user)
        return settings


class DailyProgressListView(generics.ListAPIView):
    permission_classes = [IsAuthenticated]
    serializer_class = DailyProgressSerializer

    def get_queryset(self):
        user = self.request.user
        queryset = DailyProgress.objects.filter(user=user).order_by('-date')

        days_param = self.request.query_params.get('days', None)

        if days_param:
            try:
                days = int(days_param)
                cutoff_date = date.today() - timedelta(days=days)
                queryset = queryset.filter(date__gte=cutoff_date)
            except ValueError:
                pass
        return queryset


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def log_session(request):
    duration_minutes = request.data.get('duration_minutes', 25)

    try:
        duration_minutes = int(duration_minutes)
        if duration_minutes <= 0:
            return Response(
                {'error': 'Duration must be positive'},
                status=status.HTTP_400_BAD_REQUEST
            )
    except (ValueError, TypeError):
        return Response(
            {'error': 'Invalid duration value'},
            status=status.HTTP_400_BAD_REQUEST
        )

    today = date.today()

    progress, created = DailyProgress.objects.get_or_create(
        user=request.user,
        date=today,
        defaults={
            'focus_sessions_completed': 0,
            'focus_minutes_completed': 0,
        }
    )

    progress.focus_sessions_completed += 1
    progress.focus_minutes_completed += duration_minutes
    progress.save()

    serializer = DailyProgressSerializer(progress)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_stats(request):

    user = request.user

    all_progress = DailyProgress.objects.filter(user=user).order_by('date')
    total_sessions = sum(p.focus_sessions_completed for p in all_progress)
    total_minutes = sum(p.focus_minutes_completed for p in all_progress)

    current_streak = 0
    longest_streak = 0
    temp_streak = 0

    if all_progress.exists():
        progress_list = list(all_progress)
        today = date.today()
        current_date = today

        latest_record = progress_list[-1]
        if latest_record.date == today or latest_record.date == today - timedelta(days=1):
            for i in range(len(progress_list) - 1, -1, -1):
                record = progress_list[i]

                if record.date == current_date and record.focus_sessions_completed > 0:
                    current_streak += 1
                    current_date -= timedelta(days=1)
                elif record.date < current_date:
                    break

        previous_date = None
        for record in progress_list:
            if record.focus_sessions_completed > 0:
                if previous_date is None:
                    temp_streak = 1
                elif record.date == previous_date + timedelta(days=1):
                    temp_streak += 1
                else:
                    temp_streak = 1
                longest_streak = max(longest_streak, temp_streak)
                previous_date = record.date
            else:
                previous_date = None
                temp_streak = 0

    return Response({
        'total_sessions': total_sessions,
        'total_minutes': total_minutes,
        'current_streak': current_streak,
        'longest_streak': longest_streak,
    })