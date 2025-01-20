from rest_framework.views import APIView
from rest_framework.response import Response 
from rest_framework import status 
from User.models import CustomUser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegisterSerializer,UserLoginSerializer
from django.contrib.auth import login
from django.conf import settings
from rest_framework.permissions import IsAuthenticated,IsAdminUser
from .serializers import UserUpdateSerializer,UserSerializer
from django.shortcuts import get_object_or_404

class UserRegisterView(APIView):
    def post(self,request):
        serializer=UserRegisterSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.save()
            return Response(
                {'message':"User registered successfully!",
                 'user': {
                        'id': user.id,
                        'username': user.username,
                        'email': user.email
                    }},
                status=status.HTTP_201_CREATED
            )
        return Response(serializer.errors,status.HTTP_400_BAD_REQUEST)

class UserLoginView(APIView):
    def post(self,request):
        serializer=UserLoginSerializer(data=request.data)
        if serializer.is_valid():
            user=serializer.validated_data['user']

            is_admin = user.is_staff or user.is_superuser 

            refresh=RefreshToken.for_user(user)
            access_token = str(refresh.access_token) 
            profile_image = user.profile_image.url if user.profile_image else None

            response=Response(
                {'message':'Login Successful!','access': access_token,'user':{'email':user.email,'username':user.username,'profileImage': profile_image,'isAdmin':is_admin}},
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
    

class TokenRefreshView(APIView):
    def post(self, request):
        refresh_token = request.COOKIES.get('refresh')  # Get refresh token from cookies
        if not refresh_token:
            return Response(
                {'message': 'Refresh token not found!'},
                status=status.HTTP_401_UNAUTHORIZED
            )

        try:
            refresh = RefreshToken(refresh_token)  # Decode and validate refresh token
            access_token = str(refresh.access_token)  # Generate new access token

            return Response(
                {'access': access_token},
                status=status.HTTP_200_OK
            )
        except Exception as e:
            return Response(
                {'message': 'Invalid or expired refresh token!'},
                status=status.HTTP_401_UNAUTHORIZED
            )

########################### Admin side related logics ###################3

class UserListView(APIView):
    permission_classes=[IsAdminUser]

    def get(self,request):
        users=CustomUser.objects.all()
        serializer=UserSerializer(users,many=True)
        return Response(serializer.data)


class UserDeleteView(APIView):
    permission_classes = [IsAdminUser]  # Only admins can delete users

    def delete(self, request, user_id):
        # Get the user object to be deleted
        user = get_object_or_404(CustomUser, id=user_id)

        # Prevent admin users from being deleted
        if user.is_staff or user.is_superuser:
            return Response(
                {'message': 'Cannot delete admin or superuser.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Delete the user
        user.delete()

        return Response(
            {'message': 'User deleted successfully!'},
            status=status.HTTP_204_NO_CONTENT
        )



class AdminUserUpdateView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]  # Ensure only admin users can update other users' profiles

    def put(self, request, id=None):
        try:
            user_to_update = CustomUser.objects.get(id=id)  # Get the user by ID
        except CustomUser.DoesNotExist:
            return Response({'message': 'User not found'}, status=status.HTTP_404_NOT_FOUND)

        # Admins can update any user's profile
        # If you want to restrict the admin to updating only specific fields, add those checks here
        serializer = UserUpdateSerializer(user_to_update, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'User profile updated successfully!', 'data': serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)