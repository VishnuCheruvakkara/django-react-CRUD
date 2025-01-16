from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 
from User.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer,UserLoginSerializer
from django.contrib.auth import login

class UserRegisterView(APIView):
    def post(self,request):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message':"User registered successfully!"},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self,request):
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.validated_data['user']
            refresh=RefreshToken.for_user(user)

            login(request,user)
            return Response(
                {
                    'message':'Login successful!',
                    'access':str(refresh.access_token),#accessToken
                    'refresh':str(refresh),#refresh token
                },
                status=status.HTTP_200_OK)
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)