from typing import Any
import psycopg2
from psycopg2.extras import DictCursor
import os


class DatabaseManager:
    """Classe de Gerenciamento do database"""

    def __init__(self) -> None:
        # Usar variável de ambiente ou conexão local como fallback
        database_url = os.getenv('DATABASE_URL')
        
        if database_url:
            # Conectar usando URL do Render
            self.conn = psycopg2.connect(database_url)
        else:
            # Fallback para banco local
            self.conn = psycopg2.connect(
                dbname="restaurante",
                user="postgres",
                password="nicolas",
                host="127.0.0.1",
                port=5432,
            )
        
        self.cursor = self.conn.cursor(cursor_factory=DictCursor)

    def execute_statement(self, statement: str) -> bool:
        """Usado para Inserções, Deleções, Alter Tables"""
        try:
            self.cursor.execute(statement)
            self.conn.commit()
        except Exception as e:
            print(f"Erro no execute_statement: {e}")
            self.conn.rollback()
            return False
        return True

    def execute_select_all(self, query: str) -> list[dict[str, Any]]:
        """Usado para SELECTS no geral"""
        try:
            self.cursor.execute(query)
            result = self.cursor.fetchall()
            return [dict(item) for item in result] if result else []
        except Exception as e:
            print(f"Erro no execute_select_all: {e}")
            self.conn.rollback()
            return []

    def execute_select_one(self, query: str) -> dict | None:
        """Usado para SELECT com apenas uma linha de resposta"""
        try:
            self.cursor.execute(query)
            query_result = self.cursor.fetchone()

            if not query_result:
                return None

            return dict(query_result)
        except Exception as e:
            print(f"Erro no execute_select_one: {e}")
            self.conn.rollback()
            return None
    
    def execute_query(self, query):
        """Executa queries gerais com commit"""
        try:
            self.cursor.execute(query)
            self.conn.commit()
        except Exception as e:
            self.conn.rollback()
            print(f"Erro ao executar query: {e}")
            raise
    
    def close(self):
        """Fecha a conexão com o banco"""
        if self.cursor:
            self.cursor.close()
        if self.conn:
            self.conn.close()