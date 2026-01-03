from django.urls import path
from .views import save_contact,my_api,get_contacts, save_message, get_messages
urlpatterns = [
    path('save/', save_contact),
    path('myapi/', my_api),
    path('contacts/', get_contacts),
    path("messages/", save_message),
    path("messages/<str:conversation_id>/", get_messages),
]
