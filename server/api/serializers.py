from django.contrib.auth.models import User
from rest_framework import serializers

from .models import UserSettings, DailyProgress

class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'password']

        extra_kwargs = {
            'id': {'read_only': True},
            'email': {'required' : True},
        }

    def create(self, validated_data):
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        UserSettings.objects.create(user=user)
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User

        fields = ['id', 'username', 'email']

        extra_kwargs = {
            'id': {'read_only': True}
        }

class UserSettingsSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserSettings
        fields = [
            'id',
            'focus_minutes',
            'short_break_minutes',
            'long_break_minutes',
            'daily_goal_sessions',
            'sound_enabled',
            'auto_start_break',
            'auto_start_focus',
            'updated_at',
        ]

        extra_kwargs = {
            'id': {'read_only': True },
            'updated_at': {'read_only': True},
        }

class DailyProgressSerializer(serializers.ModelSerializer):
    class Meta:
        model = DailyProgress

        fields = [
            'id',
            'date',
            'focus_sessions_completed',
            'focus_minutes_completed',
        ]

        extra_kwargs = {
            'id': {'read_only': True},
            'date': {'read_only': True},
        }