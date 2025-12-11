import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any
from decimal import Decimal

def get_db_connection():
    """Создает подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с балансами пользователей
    Поддерживает получение и обновление балансов
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, PUT, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    conn = get_db_connection()
    
    try:
        if method == 'GET':
            params = event.get('queryStringParameters') or {}
            user_id = params.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                cur.execute(
                    "SELECT crypto_symbol, crypto_network, balance FROM balances WHERE user_id = %s",
                    (user_id,)
                )
                balances = cur.fetchall()
                
                balances_dict = {}
                for b in balances:
                    key = f"{b['crypto_symbol']}-{b['crypto_network'] or 'native'}"
                    balances_dict[key] = float(b['balance'])
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'balances': balances_dict}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST' or method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            crypto_symbol = body.get('crypto_symbol')
            crypto_network = body.get('crypto_network')
            balance = body.get('balance')
            
            if not user_id or not crypto_symbol or balance is None:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id, crypto_symbol, and balance are required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    """
                    INSERT INTO balances (user_id, crypto_symbol, crypto_network, balance, updated_at) 
                    VALUES (%s, %s, %s, %s, NOW())
                    ON CONFLICT (user_id, crypto_symbol, crypto_network) 
                    DO UPDATE SET balance = EXCLUDED.balance, updated_at = NOW()
                    """,
                    (user_id, crypto_symbol, crypto_network, Decimal(str(balance)))
                )
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Balance updated successfully'}),
                'isBase64Encoded': False
            }
        
        return {
            'statusCode': 405,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': 'Method not allowed'}),
            'isBase64Encoded': False
        }
    
    finally:
        conn.close()
