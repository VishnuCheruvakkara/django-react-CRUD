from django.urls import path 
from .views import UserRegisterView,UserLoginView,UserLogoutView,UserProfileUpdateView,TokenRefreshView
from .views import UserListView,UserDeleteView,AdminUserUpdateView


urlpatterns=[
    path('register/',UserRegisterView.as_view(),name='register'),
    path('login/',UserLoginView.as_view(),name='login'),
    path('logout/',UserLogoutView.as_view(),name='logout'),
    path('profile/update/', UserProfileUpdateView.as_view(), name='user-profile-update'),
    path('token/refresh/',TokenRefreshView.as_view(),name='token_refresh'),
    path('users/',UserListView.as_view(),name='user-list'),
    path('user/delete/<int:user_id>/',UserDeleteView.as_view(),name='delete_user'),
    path('admin/user/edit/<int:id>/',AdminUserUpdateView.as_view(),name='admin-user-update')
]

