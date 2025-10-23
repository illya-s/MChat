from django.utils import formats
from rest_framework.views import APIView
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated, IsAdminUser

from .models import Room
from .serializers import AddRoomSerializer


class ChatAdd(APIView):
    serializer_class = AddRoomSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request: Request) -> Response:
        serializer = AddRoomSerializer(
            data=request.data, context={"user": request.user}
        )
        serializer.is_valid(raise_exception=True)
        room = serializer.save()

        return Response(
            {"message": f"Чат создан: {room.type}"}, status=status.HTTP_201_CREATED
        )


class ChatList(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request: Request) -> Response:
        user = request.user

        return Response(
            {
                "list": [
                    {
                        "hash": chat.hash,
                        "name": chat.name,
                        "created_at": chat.created_at,
                        "members": [
                            {
                                "username": member.user.username,
                                "role": member.role,
                                "joined_at": formats.date_format(
                                    member.joined_at, "j F Y"
                                ),
                            }
                            for member in chat.roommember_set.all()
                        ],
                    }
                    for chat in Room.objects.filter(
                        members=user, parent=None
                    ).prefetch_related("members")
                ]
            },
            status=status.HTTP_200_OK,
        )
