from rest_framework import serializers
from .models import Contact
from .models import Message

class YourModelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Contact
        fields = [ 'name', 'number', ]

#for Message model

class MessageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Message
        fields = [
            "id",
            "conversation_id",
            "sender_id",
            "text",
            "timestamp",
        ]
