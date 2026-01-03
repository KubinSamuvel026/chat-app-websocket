from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class Contact(models.Model):
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=20)

    def __str__(self):
        return self.name


class Chat(models.Model):
    name = models.CharField(max_length=100)
    number = models.CharField(max_length=20)
    created_by = models.ForeignKey(User, on_delete=models.CASCADE, related_name='chats', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Chats"


class Group(models.Model):
    name = models.CharField(max_length=255)
    created_by = models.ForeignKey(
    User,
    on_delete=models.CASCADE,
    related_name='created_groups',
    null=True,
    blank=True
)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Groups"


class GroupMember(models.Model):
    group = models.ForeignKey(Group, on_delete=models.CASCADE, related_name='members')
    name = models.CharField(max_length=255)
    number = models.CharField(max_length=20)
    added_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.group.name}"

    class Meta:
        verbose_name_plural = "Group Members"
        unique_together = ('group', 'number')

    

class Message(models.Model):
    conversation_id = models.CharField(max_length=100)
    sender_id = models.CharField(max_length=100)
    text = models.TextField(blank=True, null=True)
    timestamp = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.conversation_id} - {self.sender_id}"
