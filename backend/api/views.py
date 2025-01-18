from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 
from User.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer,UserLoginSerializer
from django.contrib.auth import login
from django.conf import settings
from rest_framework.permissions import IsAuthenticated
from .serializers import UserUpdateSerializer

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
            access_token = str(refresh.access_token) 

            response=Response(
                {'message':'Login Successful!','access': access_token,'user':{'email':user.email,'username':user.username}},
                status=status.HTTP_200_OK
            )
            #Set Cookie with token 
            response.set_cookie(
                key='refresh',
                value=str(refresh),
                httponly=True,
                samesite='Lax',
                max_age=settings.SIMPLE_JWT['REFRESH_TOKEN_LIFETIME'].total_seconds()

            )
        
            return response
        
        return Response(serializer.errors,status=status.HTTP_400_BAD_REQUEST)


class UserLogoutView(APIView):
    def post(self,request):
        response=Response(
            {'message':'Logout Successfull!'},
            status=status.HTTP_200_OK 
        )
        response.delete_cookie(
            key='refresh',
            samesite='Lax'
        )
        return response



class UserProfileUpdateView(APIView):
    permission_classes = [IsAuthenticated]  # Only logged-in users can access this endpoint

    def put(self, request):
        user = request.user  # Get the currently authenticated user
        serializer = UserUpdateSerializer(user, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(
                {'message': 'Profile updated successfully!', 'data': serializer.data},
                status=status.HTTP_200_OK
            )
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)