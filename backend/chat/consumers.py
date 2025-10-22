import json
from channels.generic.websocket import AsyncWebsocketConsumer

class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        await self.channel_layer.group_add("chat", self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard("chat", self.channel_name)

    async def receive(self, text_data):
        data = text_data
        user = self.scope["user"]

        await self.channel_layer.group_send(
            "chat",
            {
                "type": "chat.message",
                'user': {
                    'username': user.username,
                    'avatar': user.avatar if user.avatar else None,
                    'is_current': False
                },
                'text': data.get("text", ""),
            }
        )

    async def chat_message(self, event):
        await self.send(text_data=json.dumps({
            "message": event["message"]
        }))
