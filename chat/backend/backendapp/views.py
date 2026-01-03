from django.shortcuts import render
from django.http import JsonResponse

# Create your views here.
from rest_framework.response import Response
from rest_framework.decorators import api_view
from .serializers import YourModelSerializer
from .serializers import MessageSerializer
from rest_framework import status
from .models import Message

from .models import Contact

@api_view(['POST'])
def save_contact(request):
    serializer = YourModelSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({"msg": "Saved successfully"})
    return Response(serializer.errors)



def my_api(request):
    return JsonResponse({"msg": "OK", "status": 200})

@api_view(['GET'])
def get_contacts(request):
    contacts = Contact.objects.all()
    serializer = YourModelSerializer(contacts, many=True)
    return Response(serializer.data)


@api_view(["POST"])
def save_message(request):
    serializer = MessageSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)




@api_view(["GET"])
def get_messages(request, conversation_id):
    messages = Message.objects.filter(
        conversation_id=conversation_id
    ).order_by("timestamp")

    serializer = MessageSerializer(messages, many=True)
    return Response(serializer.data)
