from channels.auth import AuthMiddlewareStack
from channels.routing import ProtocolTypeRouter, URLRouter
import chat.routing
import notifications.routing

application = ProtocolTypeRouter({
    'websocket': AuthMiddlewareStack(
        URLRouter(
            chat.routing.websocket_urlpatterns,
        ),
    ),
    'notifications': AuthMiddlewareStack(
        URLRouter(
            notifications.routing.websocket_urlpatterns,
        ),
    )
})