"""
# user/serializers.py
"""

from rest_framework import serializers

from .models import Room, RoomMember


class AddRoomSerializer(serializers.Serializer):
    name = serializers.CharField(max_length=255, required=True)
    type = serializers.ChoiceField(choices=Room.Types.choices, default=Room.Types.ROOM)
    parent = serializers.CharField(max_length=64, required=False)

    def validate(self, data: dict) -> dict:
        RoomTypes = Room.Types

        user = self.context.get("user")

        if not user:
            raise serializers.ValidationError("Пользователь не найден")

        name = data.get("name")
        type = data.get("type")
        parent = data.get("parent")

        if not name or not type:
            raise serializers.ValidationError("Требуется название и тип")

        if parent:
            parent_obj = Room.objects.filter(hash=parent).first()
            if not parent_obj:
                raise serializers.ValidationError(
                    f"Room с значением {parent} не существует!"
                )

            if parent_obj.type == RoomTypes.SUPPER_GROUP:
                raise serializers.ValidationError(
                    "Группа должна быть супер группой чтоб добавить тему!"
                )

            data["parent"] = parent_obj
        else:
            data["parent"] = None

        return data

    def create(self, validated_data: dict) -> dict:
        user = self.context.get("user")

        room = Room.objects.create(
            name=validated_data["name"],
            type=validated_data["type"],
            parent=validated_data.get("parent"),
        )

        if user:
            RoomMember.objects.create(user=user, room=room, role="owner")

        return room
