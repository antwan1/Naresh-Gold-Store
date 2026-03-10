import datetime
from rest_framework import generics, status
from rest_framework.response import Response
from .models import Appointment
from .serializers import AppointmentSerializer


class AppointmentCreateView(generics.CreateAPIView):
    serializer_class = AppointmentSerializer
    authentication_classes = []
    permission_classes = []
