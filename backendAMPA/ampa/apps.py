from django.apps import AppConfig


class AmpaConfig(AppConfig):
    default_auto_field = 'django.db.models.BigAutoField'
    name = 'ampa'

    def ready(self):
        import ampa.signals
