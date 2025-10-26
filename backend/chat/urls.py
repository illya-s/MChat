# urls.py

from django.urls import path
from . import views


urlpatterns = [
	path('add', views.ChatAdd.as_view()),
	path('list', views.ChatList.as_view()),
	path('<str:hash>/message/list/', views.ChatMessageList.as_view())
]