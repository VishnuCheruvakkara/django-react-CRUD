from django.shortcuts import HttpResponse
# Create your views here.
def core(request):
    return HttpResponse("Welcome to the Django Backend!")