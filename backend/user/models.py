import jwt
import datetime
import hashlib, secrets

from django.conf import settings
from django.db import models
from django.contrib.auth.models import (
    AbstractBaseUser,
    BaseUserManager,
    PermissionsMixin,
)
from django.utils import timezone


class UserManager(BaseUserManager):
    """Main User Manager"""

    def create_user(self, email, username=None, avatar=None, **extra_fields):
        if not email:
            raise ValueError("Email must be set")
        user = self.model(
            username=username,
            email=self.normalize_email(email),
            avatar=avatar,
            **extra_fields,
        )
        user.save(using=self._db)
        return user

    def create_superuser(self, email, username=None, avatar=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, username=username, avatar=avatar, **extra_fields)


class User(AbstractBaseUser, PermissionsMixin):
    """Main User model"""

    username = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(unique=True)
    avatar = models.ImageField(upload_to="avatars/", null=True, blank=True)

    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(default=timezone.now)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = []

    def __str__(self):
        return str(self.email)


class AccessToken(models.Model):
    """Access Token"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="access_tokens"
    )
    expires_at = models.DateTimeField()

    device_id = models.CharField(max_length=255, blank=True, null=True)
    user_agent = models.CharField(max_length=512, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        token = jwt.encode(
            {
                "id": self.pk,
                "user_id": self.user.pk,
                "device_id": self.device_id,
                "exp": int(self.expires_at.timestamp()),
                "type": "access",
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        return token

    def is_valid(self):
        """Determines whether the token has expired"""
        return self.expires_at > timezone.now()


class RefreshToken(models.Model):
    """Refresh Token"""

    user = models.ForeignKey(
        User, on_delete=models.CASCADE, related_name="refresh_tokens"
    )
    expires_at = models.DateTimeField()

    device_id = models.CharField(max_length=255, blank=True, null=True)
    user_agent = models.CharField(max_length=512, blank=True, null=True)
    ip_address = models.GenericIPAddressField(blank=True, null=True)

    created_at = models.DateTimeField(auto_now_add=True)

    @property
    def token(self):
        return self._generate_jwt_token()

    def _generate_jwt_token(self):
        token = jwt.encode(
            {
                "id": self.pk,
                "user_id": self.user.pk,
                "device_id": self.device_id,
                "exp": int(self.expires_at.timestamp()),
                "type": "refresh",
            },
            settings.SECRET_KEY,
            algorithm="HS256",
        )

        return token

    def is_valid(self):
        """Determines whether the token has expired"""
        return self.expires_at > timezone.now()


class LoginCode(models.Model):
    """Model for temp login codes"""

    email = models.EmailField(null=True, blank=False)
    _code_hash = models.CharField(max_length=128, db_column="code")
    is_used = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)

    __plain_code = None

    @classmethod
    def generate_code(cls):
        """Генерирует 6-значный код."""
        return "".join(secrets.choice("0123456789") for _ in range(6))

    @staticmethod
    def hash_code(code: str) -> str:
        """Возвращает SHA256-хэш кода."""
        return hashlib.sha256(code.encode()).hexdigest()

    @classmethod
    def create_with_code(cls, email: str):
        """Создает новый LoginCode и возвращает экземпляр с доступом к plain_code."""
        code = cls.generate_code()
        hashed = cls.hash_code(code)
        obj = cls.objects.create(email=email, _code_hash=hashed)
        obj.__plain_code = code
        return obj

    @property
    def code(self):
        """Возвращает исходный код только если он был сгенерирован при создании."""
        if self.__plain_code is None:
            raise AttributeError(
                "Код недоступен. Он не хранится в базе по соображениям безопасности."
            )
        return self.__plain_code

    @code.setter
    def code(self, value):
        """Запрещаем изменение кода напрямую."""
        raise AttributeError("Нельзя изменять код вручную.")

    def check_code(self, code: str) -> bool:
        """Проверяет введённый код."""
        return self._code_hash == self.hash_code(code)

    def is_expired(self):
        """Determines whether the code has expired"""
        return timezone.now() > self.created_at + timezone.timedelta(minutes=5)

    def __str__(self):
        return f"{self.email} - {'*' * 6}"
