from django.contrib import admin
from .models import Contact, Chat, Group, GroupMember, Message  # Import YourModel if needed

admin.site.register(Contact)
admin.site.register(Chat)
admin.site.register(Group)
admin.site.register(GroupMember)
admin.site.register(Message)  # Register GroupMember model
# from .models import YourModel --- IGNORE ---
# --- IGNORE ---
# admin.site.register(YourModel) --- IGNORE ---
# from .models import YourModel --- IGNORE ---
# --- IGNORE ---