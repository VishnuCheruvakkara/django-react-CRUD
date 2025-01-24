from rest_framework import serializers 
from User.models import CustomUser 
from django.contrib.auth.hashers import make_password 
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from django.contrib.auth.password_validation import validate_password
from PIL import Image
from rest_framework.exceptions import ValidationError as DRFValidationError


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
    password = serializers.CharField(write_only=True, required=False, allow_blank=True)  # Password is optional
    profile_image = serializers.ImageField(required=False, allow_null=True)  # Optional image field
    class Meta:
        model = CustomUser
        fields = ['email', 'username', 'password', 'profile_image']

    def validate_password(self, value):
        print(value)
        if value:  # Only validate if password is provided
            validate_password(value)
        return value
    
    def validate_email(self, value):
        # Check if the email is unique
        if CustomUser.objects.filter(email=value).exclude(id=self.instance.id).exists():
            raise ValidationError("This email is already taken.")
        
        return value
    
    def validate_username(self, value):
        # Ensure the username is unique
        if CustomUser.objects.filter(username=value).exclude(id=self.instance.id).exists():
            raise ValidationError("This username is already taken.")
        
        return value
    
    
    def validate_profile_image(self, value):
        """ Validate that the uploaded file is an image and check its size """
        if value:
            # Validate the image format (e.g., PNG, JPG)
            try:
                image = Image.open(value)
                image.verify()  # This will raise an exception if it's not a valid image
            except (IOError, SyntaxError) as e:
                raise DRFValidationError("Uploaded file is not a valid image.")

            # Validate file size (e.g., limit to 5MB)
            max_size = 5 * 1024 * 1024  # 5 MB
            if value.size > max_size:
                raise DRFValidationError("The image file is too large. Maximum size is 5MB.")
        
        return value

    def update(self, instance, validated_data):
        # Update email and username
        instance.email = validated_data.get('email', instance.email)
        instance.username = validated_data.get('username', instance.username)

        # Update profile image if provided
        instance.profile_image = validated_data.get('profile_image', instance.profile_image)

        # Update password only if it's provided (not empty)
        password = validated_data.get('password')
        if password:
            instance.password = make_password(password)

        instance.save()
        return instance
    

################# Admin Side serializers ################### 

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = ['id', 'username', 'email', 'is_staff', 'profile_image']