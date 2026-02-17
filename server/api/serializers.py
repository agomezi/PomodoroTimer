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

class DailyProgresSerializer(serializers.ModelSerializer):
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