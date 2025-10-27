from redis import Redis, ConnectionError
from typing import Optional

# --- Configuración de Redis ---
REDIS_HOST = "localhost"
REDIS_PORT = 6379

def get_redis_client() -> Optional[Redis]:
    """
    Función para obtener una instancia de cliente Redis.
    Se utiliza como dependencia en las rutas de FastAPI.
    Retorna None si la conexión falla, permitiendo a la aplicación continuar.
    """
    try:
        # decode_responses=True asegura que los datos se lean como strings
        r = Redis(host=REDIS_HOST, port=REDIS_PORT, decode_responses=True)
        r.ping() # Prueba la conexión
        return r
    except ConnectionError as e:
        # Si Redis no está disponible, registramos el error y continuamos sin caché.
        print(f"Error de conexión a Redis: {e}. La aplicación continuará sin caché.")
        return None 
