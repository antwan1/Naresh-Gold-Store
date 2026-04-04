import logging
from django.contrib.auth.models import User
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import send_mail
from django.conf import settings as django_settings
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import serializers as drf_serializers
from .models import Customer
from .serializers import RegisterSerializer, CustomerProfileSerializer

logger = logging.getLogger(__name__)


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


class PasswordResetRequestView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        email = request.data.get('email', '').strip().lower()
        # Always return 200 so we don't leak whether an email is registered
        try:
            user = User.objects.get(email=email)
            uid = urlsafe_base64_encode(force_bytes(user.pk))
            token = default_token_generator.make_token(user)
            frontend_url = django_settings.FRONTEND_URL
            reset_url = f"{frontend_url}/reset-password/{uid}/{token}/"
            send_mail(
                subject='Reset your Naresh Jewellers password',
                message=(
                    f'Hi {user.first_name or user.email},\n\n'
                    f'We received a request to reset your password.\n\n'
                    f'Click the link below to set a new password:\n{reset_url}\n\n'
                    f'This link expires in 24 hours. If you did not request this, '
                    f'you can safely ignore this email.\n\n'
                    f'Warm regards,\nNaresh Jewellers\n4 High St, Smethwick B66 1DX'
                ),
                from_email=django_settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
            )
        except User.DoesNotExist:
            pass
        except Exception as e:
            logger.error('Password reset email failed for %s: %s', email, e)
        return Response({'detail': 'If that email is registered you will receive a reset link shortly.'})


class PasswordResetConfirmView(APIView):
    permission_classes = [AllowAny]

    def post(self, request):
        uid = request.data.get('uid', '')
        token = request.data.get('token', '')
        new_password = request.data.get('new_password', '')

        if not new_password or len(new_password) < 8:
            return Response({'error': 'Password must be at least 8 characters.'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            user_id = force_str(urlsafe_base64_decode(uid))
            user = User.objects.get(pk=user_id)
        except (User.DoesNotExist, ValueError, TypeError):
            return Response({'error': 'Invalid reset link.'}, status=status.HTTP_400_BAD_REQUEST)

        if not default_token_generator.check_token(user, token):
            return Response({'error': 'This reset link has expired or already been used.'}, status=status.HTTP_400_BAD_REQUEST)

        user.set_password(new_password)
        user.save()
        return Response({'detail': 'Password updated successfully. You can now sign in.'})


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
