from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from channels.middleware import BaseMiddleware
from django.contrib.auth.models import AnonymousUser
from rest_framework import exceptions
from user.models import AccessToken, RefreshToken


class JWTAuthMiddleware(BaseMiddleware):
    """
    JWT Middleware for Django Channels
    Async-safe: uses database_sync_to_async for ORM calls
    """

    async def __call__(self, scope, receive, send):
        request = self.get_request(scope)

        user, token_obj = await self.authenticate(request)

        scope["user"] = user
        scope["token_obj"] = token_obj

        return await super().__call__(scope, receive, send)

    def get_request(self, scope):
        """
        Creates a pseudo-request object compatible with DRF authentication
        """

        class DummyRequest:
            def __init__(self, scope):
                self.scope = scope
                self.COOKIES = {}
                self.META = {}

                query_string = parse_qs(scope.get("query_string", b"").decode())
                self.query_params = {k: v[0] for k, v in query_string.items()}

                headers = dict(scope.get("headers", []))
                if b"authorization" in headers:
                    self.META["HTTP_AUTHORIZATION"] = headers[b"authorization"].decode()

                # parse cookies
                cookie_header = headers.get(b"cookie")
                if cookie_header:
                    cookies = {}
                    for cookie in cookie_header.decode().split(";"):
                        key, val = cookie.strip().split("=", 1)
                        cookies[key] = val
                    self.COOKIES = cookies

            @property
            def data(self):
                return self.query_params

        return DummyRequest(scope)

    async def authenticate(self, request):
        from user.auth import JWTAuthentication

        authenticator = JWTAuthentication()
        token = None
        token_type = "access"

        token = authenticator._get_access_token_from_request(request)
        if not token:
            token = request.COOKIES.get("refresh")
            token_type = "refresh" if token else "access"

        if not token:
            return AnonymousUser(), None

        payload = authenticator._decode_token(token)
        token_type = payload.get("type", token_type)

        # Асинхронные ORM вызовы
        if token_type == "access":
            token_obj = await self.get_access_token(payload)
        else:
            token_obj = await self.get_refresh_token(payload)

        if not token_obj.is_valid():
            return AnonymousUser(), None

        return token_obj.user, token_obj

    @database_sync_to_async
    def get_access_token(self, payload):
        try:
            return AccessToken.objects.select_related("user").get(
                id=payload.get("id"), user_id=payload.get("user_id")
            )
        except AccessToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("Access token not found")

    @database_sync_to_async
    def get_refresh_token(self, payload):
        try:
            return RefreshToken.objects.select_related("user").get(
                id=payload.get("id"), user_id=payload.get("user_id")
            )
        except RefreshToken.DoesNotExist:
            raise exceptions.AuthenticationFailed("Refresh token not found")