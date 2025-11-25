from dotenv import load_dotenv
import os
import psycopg2

load_dotenv()

database_url = os.getenv('DATABASE_URL')

if database_url:
    print(f"✅ DATABASE_URL encontrada!")
    print(f"🔗 Host: {database_url.split('@')[1].split('/')[0] if '@' in database_url else 'desconhecido'}")
    
    try:
        conn = psycopg2.connect(database_url)
        cursor = conn.cursor()
        cursor.execute("SELECT current_database(), current_user, inet_server_addr();")
        result = cursor.fetchone()
        print(f"✅ Conectado com sucesso!")
        print(f"📊 Banco: {result[0]}")
        print(f"👤 Usuário: {result[1]}")
        print(f"🌐 Servidor: {result[2]}")
        cursor.close()
        conn.close()
    except Exception as e:
        print(f"❌ Erro: {e}")
else:
    print("❌ DATABASE_URL não encontrada")
    print("🔧 Usando configuração local (127.0.0.1)")