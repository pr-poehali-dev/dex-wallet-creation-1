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
    API для работы с транзакциями пользователей
    Поддерживает создание и получение транзакций
    """
    method: str = event.get('httpMethod', 'GET')
    
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
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
                    "SELECT id, tx_type, asset, amount, tx_date, status, tx_hash FROM transactions WHERE user_id = %s ORDER BY tx_date DESC",
                    (user_id,)
                )
                transactions = cur.fetchall()
                
                transactions_list = []
                for tx in transactions:
                    tx_dict = dict(tx)
                    tx_dict['amount'] = float(tx_dict['amount'])
                    tx_dict['tx_date'] = tx_dict['tx_date'].isoformat()
                    transactions_list.append(tx_dict)
                
                return {
                    'statusCode': 200,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'transactions': transactions_list}),
                    'isBase64Encoded': False
                }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            tx_type = body.get('tx_type')
            asset = body.get('asset')
            amount = body.get('amount')
            tx_hash = body.get('tx_hash')
            status = body.get('status', 'completed')
            
            if not all([user_id, tx_type, asset, amount, tx_hash]):
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id, tx_type, asset, amount, and tx_hash are required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO transactions (user_id, tx_type, asset, amount, status, tx_hash) VALUES (%s, %s, %s, %s, %s, %s)",
                    (user_id, tx_type, asset, Decimal(str(amount)), status, tx_hash)
                )
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'Transaction created successfully'}),
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
