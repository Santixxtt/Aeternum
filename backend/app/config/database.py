from contextlib import asynccontextmanager
import aiomysql

pool = None

async def init_db(app):
    global pool
    pool = await aiomysql.create_pool(
        host="yamanote.proxy.rlwy.net",
        port=28425,
        user="root",
        password="yUHXDnqrMmGvNygnFHjRHiKnWhiJrXZF",
        db="railway",
        minsize=1,
        maxsize=10,
    )
    print("✅ Pool de conexiones MySQL inicializado.")

@asynccontextmanager
async def get_cursor():
    async with pool.acquire() as conn:
        async with conn.cursor(aiomysql.DictCursor) as cursor:
            yield conn, cursor

async def close_db():
    global pool
    if pool is not None:
        pool.close()
        await pool.wait_closed()
        pool = None
        print("Pool de conexiones cerrado.")
