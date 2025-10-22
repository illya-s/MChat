import jwt

from django.conf import settings
from django.contrib.auth import get_user_model

from rest_framework import authentication
from rest_framework import exceptions

from .models import AccessToken, RefreshToken


User = get_user_model()

class JWTAuthentication(authentication.BaseAuthentication):
    """
    Custom JWT authentication for both Access and Refresh tokens
    """

    keyword = "Bearer"

    def authenticate(self, request):
        auth_header = authentication.get_authorization_header(request).decode("utf-8")
        token = None
        token_type = "access"

        if auth_header and auth_header.startswith(self.keyword):
            token = auth_header[len(self.keyword):].strip()
        else:
            cookie_token = request.COOKIES.get("refresh")
            if cookie_token:
                token = cookie_token
                token_type = "refresh"

        if not token:
            return None

        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")

        payload = self._decode_token(token)
        token_type = payload.get("type", token_type)

        if token_type == "access":
            token_obj = self._get_access_token(payload)
        else:
            token_obj = self._get_refresh_token(payload)

        if not token_obj.is_valid():
            raise exceptions.AuthenticationFailed("Token expired or invalid")

        return (token_obj.user, token_obj)

    def _decode_token(self, token):
        try:
            payload = jwt.decode(token, settings.SECRET_KEY, algorithms=["HS256"])
        except jwt.ExpiredSignatureError:
            raise exceptions.AuthenticationFailed("Token has expired")
        except jwt.InvalidTokenError:
            raise exceptions.AuthenticationFailed("Invalid token")
        return payload

    def _get_access_token(self, payload):
        try:
            return AccessToken.objects.select_related("user").get(
                id=payload.get("id"), user_id=payload.get("user_id")
            )
        except AccessToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("Access token not found")

    def _get_refresh_token(self, payload):
        try:
            return RefreshToken.objects.select_related("user").get(
                id=payload.get("id"), user_id=payload.get("user_id")
            )
        except RefreshToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("Refresh token not found")

    def authenticate_header(self, request):
        return self.keyword
