from django.urls import path 
from .views import UserRegisterView,UserLoginView,UserLogoutView,UserProfileUpdateView

urlpatterns=[
    path('register/',UserRegisterView.as_view(),name='register'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('logout/',UserLogoutView.as_view(),name='logout'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
]