import json

from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.utils import formats
from user.models import User

from chat.models import Message, Room


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.room_name = self.scope["url_route"]["kwargs"]["room_name"]
        self.room_group_name = f"chat_{self.room_name}"

        await self.channel_layer.group_add(self.room_group_name, self.channel_name)
        await self.accept()

    async def disconnect(self, close_code):
        await self.channel_layer.group_discard(self.room_group_name, self.channel_name)

    async def receive(self, text_data: str) -> None:
        user = self.scope["user"]

        try:
            data_json = json.loads(text_data)
        except json.JSONDecodeError:
            await self.send(
                text_data=json.dumps(
                    {"status": "error", "message": "Неверный формат JSON"}
                )
            )
            return

        action = data_json.get("action")
        payload = data_json.get("data", {})

        match action:
            case "create_room":
                await self.create_room(payload)
            case "chat_message":
                await self.send_message(payload, user)
            case _:
                await self.send(
                    text_data=json.dumps(
                        {
                            "status": "error",
                            "message": f"Неизвестное действие: {action}",
                        }
                    )
                )

    async def chat_message(self, event):
        """Получатель события из group_send"""
        await self.send(text_data=json.dumps(event))

    @database_sync_to_async
    def create_message(self, room: Room, user: User, text: str) -> Message:
        return Message.objects.create(room=room, sender=user, text=text)

    @database_sync_to_async
    def get_room(self, hash):
        return Room.objects.get(hash=hash)

    async def send_message(self, data: dict, user: User) -> None:
        try:
            room = await self.get_room(self.room_name)
            message = await self.create_message(room, user, data.get("text"))
        except Room.DoesNotExist:
            await self.channel_layer.group_send(
                json.dumps(
                    {
                        "type": "error",
                        "message": "Комната не существует или была удалена!",
                    }
                )
            )
            return
        except Exception:
            await self.send(
                json.dumps({"status": "error", "message": "Не известная ошибка!"})
            )
            return

        await self.channel_layer.group_send(
            self.room_group_name,
            {
                "type": "chat_message",
                "user": {
                    "id": user.pk,
                    "username": user.username,
                    "avatar": user.avatar.url if user.avatar else None,
                },
                "text": data.get("text"),
                "edited_at": formats.date_format(message.edited_at, "H:i")
                if message.edited_at
                else None,
                "created_at": formats.date_format(message.created_at, "H:i"),
            },
        )

    async def create_room(self, chat_type: str) -> None:
        await self.send(
            text_data=json.dumps(
                {"status": "success", "message": f"Чат создан: {chat_type}"}
            )
        )
