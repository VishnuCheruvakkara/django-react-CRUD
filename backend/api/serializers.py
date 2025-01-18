from rest_framework import serializers 
from User.models import CustomUser 
from django.contrib.auth.hashers import make_password 
from django.contrib.auth import authenticate
from django.contrib.auth.password_validation import validate_password 

class UserRegisterSerializer(serializers.ModelSerializer):
    password=serializers.CharField(write_only=True,required=True)

    class Meta:
        model=CustomUser 
        fields=['email','username','password','profile_image']

    def validate_password(self,value):
        validate_password(value)
        return value

    def validate_email(self,value):
        if CustomUser.objects.filter(email=value).exists():
            raise serializers.ValidationError("A user with this email already exists.")
        return value
    
    def create(self,validated_data):
        password=validated_data.pop('password')
        user=CustomUser(
            **validated_data
        )
        user.password=make_password(password)
        user.save()
        return user


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, data):
        # Extract email and password from request data
        email = data.get('email')
        password = data.get('password')

        # Authenticate the user with the provided credentials
        user = authenticate(email=email, password=password)

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        
        # Return user if authentication is successful
        data['user'] = user
        return data



class UserUpdateSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=False)  # Password is optional

    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'profile_image']

    def validate_password(self, value):
        if value:  # Only validate if password is provided
            validate_password(value)
        return value

    def update(self, instance, validated_data):
        # Update email, username, and profile image
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)

        # Update password if provided
        password = validated_data.get('password')
        if password:
            instance.password = make_password(password)

        instance.save()
        return instance
