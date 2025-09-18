from app.config.database import get_cursor
from datetime import datetime, timedelta


def get_user_by_email(email: str):
    mydb, cursor = get_cursor()
    cursor.execute("SELECT * FROM usuarios WHERE correo = %s", (email,))
    user = cursor.fetchone()
    cursor.close()
    mydb.close()
    return user

def email_exists(email: str) -> bool:
    mydb, cursor = get_cursor()
    cursor.execute("SELECT id FROM usuarios WHERE correo = %s", (email,))
    exists = cursor.fetchone() is not None
    cursor.close()
    mydb.close()
    return exists

def id_exists(numeroId: str) -> bool:
    mydb, cursor = get_cursor()
    cursor.execute("SELECT id FROM usuarios WHERE num_identificacion = %s", (numeroId,))
    exists = cursor.fetchone() is not None
    cursor.close()
    mydb.close()
    return exists

def create_user(data: dict) -> int:
    mydb, cursor = get_cursor()
    sql = """
        INSERT INTO usuarios (nombre, apellido, tipo_identificacion, num_identificacion, correo, clave, rol)
        VALUES (%s, %s, %s, %s, %s, %s, %s)
    """
    cursor.execute(sql, (
        data["nombre"],
        data["apellido"],
        data["tipo_identificacion"],
        data["num_identificacion"],
        data["correo"],
        data["clave"],
        data["rol"]
    ))
    mydb.commit()
    user_id = cursor.lastrowid
    cursor.close()
    mydb.close()
    return user_id


def save_consent(user_id: int, consent_text: str, ip: str, user_agent: str):
    mydb, cursor = get_cursor()
    sql = """
        INSERT INTO consents (user_id, consent_key, consent_text, granted, ip_address, user_agent)
        VALUES (%s, %s, %s, 1, %s, %s)
    """
    cursor.execute(sql, (user_id, "privacy_policy_v1", consent_text, ip, user_agent))
    mydb.commit()
    cursor.close()
    mydb.close()

def increment_login_attempts(user_id: int, max_attempts: int, lock_minutes: int):
    mydb, cursor = get_cursor()
    cursor.execute("SELECT intentos_fallidos FROM usuarios WHERE id = %s", (user_id,))
    row = cursor.fetchone()

    # Si no hay fila, salir (protección)
    if row is None:
        cursor.close()
        mydb.close()
        return

    # row puede ser dict (cursor con dict=True) o tuple
    if isinstance(row, dict):
        attempts = row.get("intentos_fallidos") or 0
    else:
        # tuple-like
        attempts = row[0] if len(row) > 0 and row[0] is not None else 0

    attempts = int(attempts)

    if attempts + 1 >= max_attempts:
        bloqueado_hasta = datetime.now() + timedelta(minutes=lock_minutes)
        # Guardamos fecha en formato compatible con MySQL
        cursor.execute(
            "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = %s WHERE id = %s",
            (bloqueado_hasta.strftime("%Y-%m-%d %H:%M:%S"), user_id)
        )
    else:
        cursor.execute(
            "UPDATE usuarios SET intentos_fallidos = intentos_fallidos + 1 WHERE id = %s",
            (user_id,)
        )

    mydb.commit()
    cursor.close()
    mydb.close()


def reset_login_attempts(user_id: int):
    mydb, cursor = get_cursor()
    cursor.execute(
        "UPDATE usuarios SET intentos_fallidos = 0, bloqueado_hasta = NULL WHERE id = %s",
        (user_id,)
    )
    mydb.commit()
    cursor.close()
    mydb.close()