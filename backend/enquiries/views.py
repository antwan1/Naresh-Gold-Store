from rest_framework import generics
from .models import Enquiry
from .serializers import EnquirySerializer


class EnquiryCreateView(generics.CreateAPIView):
    serializer_class = EnquirySerializer
    authentication_classes = []
    permission_classes = []
