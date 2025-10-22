from django.db import models
from django.conf import settings
from cryptography.fernet import Fernet


class Room(models.Model):
    """Комната / группа / чат / супер-группа"""
    TYPE_CHOICES = [
        ('room', 'Room'),
        ('supergroup', 'SuperGroup'),
        ('group', 'Group'),
        ('chat', 'Chat'),
    ]

    name = models.CharField(max_length=255)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES, default='room')
    parent = models.ForeignKey(
        'self',
        on_delete=models.CASCADE,
        null=True,
        blank=True,
        related_name='children'
    )
    members = models.ManyToManyField(
        settings.AUTH_USER_MODEL,
        through='RoomMember',
        related_name='rooms'
    )
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.get_type_display()}: {self.name}"


class RoomMember(models.Model):
    """Участник комнаты"""
    ROLE_CHOICES = [
        ('owner', 'Owner'),
        ('admin', 'Admin'),
        ('member', 'Member'),
    ]

    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'room')

    def __str__(self):
        return f"{self.user} in {self.room} as {self.role}"


class Message(models.Model):
    """Сообщения (шифрованный текст, медиа, реакции)"""
    room = models.ForeignKey(Room, on_delete=models.CASCADE, related_name='messages')
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    _text = models.BinaryField(db_column='text', editable=False, null=True, blank=True)
    reply_to = models.ForeignKey('self', null=True, blank=True, on_delete=models.SET_NULL)
    created_at = models.DateTimeField(auto_now_add=True)
    edited_at = models.DateTimeField(null=True, blank=True)

    @property
    def text(self):
        if not self._text:
            return ''
        try:
            fernet = Fernet(settings.FERNET_KEY)
            return fernet.decrypt(self._text).decode()
        except Exception:
            return '[DECRYPTION_ERROR]'

    @text.setter
    def text(self, value: str):
        if not value:
            self._text = None
            return
        fernet = Fernet(settings.FERNET_KEYS[0])
        self._text = fernet.encrypt(value.encode())

    def __str__(self):
        preview = self.text[:50] + ("…" if len(self.text) > 50 else "")
        return f"{self.sender} → {self.room}: {preview}"


class MediaMessage(models.Model):
    """Медиа-файлы, прикреплённые к сообщениям"""
    MESSAGE_TYPES = [
        ('image', 'Image'),
        ('video', 'Video'),
        ('audio', 'Audio'),
        ('file', 'File'),
    ]
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='media')
    type = models.CharField(max_length=20, choices=MESSAGE_TYPES)
    file = models.FileField(upload_to='messages/media/')
    thumbnail = models.ImageField(upload_to='messages/thumbnails/', null=True, blank=True)
    duration = models.FloatField(null=True, blank=True)  # для аудио/видео
    size = models.PositiveIntegerField(null=True, blank=True)  # байты

    def __str__(self):
        return f"{self.type} for {self.message.pk}"


class Reaction(models.Model):
    """Реакции (эмодзи, лайки и т.п.)"""
    message = models.ForeignKey(Message, on_delete=models.CASCADE, related_name='reactions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    emoji = models.CharField(max_length=20)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('message', 'user', 'emoji')

    def __str__(self):
        return f"{self.user} reacted {self.emoji} to {self.message.pk}"
