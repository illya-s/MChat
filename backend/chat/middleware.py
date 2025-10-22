from jwt import decode, ExpiredSignatureError, InvalidTokenError
from channels.middleware import BaseMiddleware

from django.conf import settings
from django.contrib.auth.models import AnonymousUser
from rest_framework.exceptions import AuthenticationFailed

from user.auth import JWTAuthentication


class JWTAuthMiddleware(BaseMiddleware):
    async def __call__(self, scope, receive, send):
        request = self.get_request(scope)
        authenticator = JWTAuthentication()

        try:
            # пробуем достать токен из cookies
            token = None
            cookies = dict(scope.get("headers", []))
            if b"cookie" in cookies:
                cookie_str = cookies[b"cookie"].decode()
                for part in cookie_str.split(";"):
                    if "refresh=" in part:
                        token = part.split("=", 1)[1].strip()
                        break

            if not token:
                scope["user"] = AnonymousUser()
            else:
                user_token = authenticator._decode_token(token)
                user = authenticator._get_refresh_token(user_token).user
                scope["user"] = user
        except Exception:
            scope["user"] = AnonymousUser()

        return await super().__call__(scope, receive, send)

    def get_request(self, scope):
        """Создаёт псевдо-request для DRF совместимости"""
        class DummyRequest:
            COOKIES = {}
        return DummyRequest()
