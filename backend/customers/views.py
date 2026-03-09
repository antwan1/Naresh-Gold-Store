from django.contrib.auth.models import User
from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers as drf_serializers
from .models import Customer
from .serializers import RegisterSerializer, CustomerProfileSerializer


class EmailTokenObtainPairSerializer(TokenObtainPairSerializer):
    """Accept 'email' + 'password' and map to username internally."""
    email = drf_serializers.EmailField(write_only=True)

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        # Remove the default 'username' field, replace with 'email'
        self.fields.pop('username', None)

    def validate(self, attrs):
        email = attrs.pop('email', '').lower()
        try:
            user = User.objects.get(email=email)
        except User.DoesNotExist:
            from rest_framework_simplejwt.exceptions import AuthenticationFailed
            raise AuthenticationFailed('No active account found with the given credentials')
        attrs['username'] = user.username
        return super().validate(attrs)


class EmailTokenObtainPairView(TokenObtainPairView):
    serializer_class = EmailTokenObtainPairSerializer


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'refresh': str(refresh),
            'user': {
                'email': user.email,
                'first_name': user.first_name,
                'last_name': user.last_name,
            }
        }, status=status.HTTP_201_CREATED)


class ProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = CustomerProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        customer, _ = Customer.objects.get_or_create(user=self.request.user)
        return customer

    def retrieve(self, request, *args, **kwargs):
        customer, _ = Customer.objects.get_or_create(user=request.user)
        serializer = self.get_serializer(customer)
        data = serializer.data
        data['email'] = request.user.email
        return Response(data)
