from django.urls import path
from . import views

urlpatterns = [
    path('', views.chat_page, name='chat_page'),        # /chat/
    path('api/chat/', views.chat_api, name='chat_api'), # /chat/api/chat/
]
