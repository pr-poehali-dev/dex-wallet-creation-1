import json
import os
import psycopg2
from psycopg2.extras import RealDictCursor
from typing import Dict, Any

def get_db_connection():
    """Создает подключение к базе данных"""
    return psycopg2.connect(os.environ['DATABASE_URL'])

def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    API для работы с пользователями кошелька
    Поддерживает создание, получение и обновление пользователей
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
            
            with conn.cursor(cursor_factory=RealDictCursor) as cur:
                if user_id:
                    cur.execute(
                        "SELECT user_id, seed_phrase, created_at, last_login FROM users WHERE user_id = %s",
                        (user_id,)
                    )
                    user = cur.fetchone()
                    if not user:
                        return {
                            'statusCode': 404,
                            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                            'body': json.dumps({'error': 'User not found'}),
                            'isBase64Encoded': False
                        }
                    
                    cur.execute(
                        "SELECT crypto_symbol, crypto_network, balance FROM balances WHERE user_id = %s",
                        (user_id,)
                    )
                    balances = cur.fetchall()
                    
                    user_data = dict(user)
                    user_data['created_at'] = user_data['created_at'].isoformat()
                    user_data['last_login'] = user_data['last_login'].isoformat()
                    user_data['balances'] = [dict(b) for b in balances]
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps(user_data),
                        'isBase64Encoded': False
                    }
                else:
                    cur.execute("SELECT user_id, seed_phrase, created_at, last_login FROM users ORDER BY created_at DESC")
                    users = cur.fetchall()
                    
                    users_list = []
                    for user in users:
                        user_dict = dict(user)
                        user_dict['created_at'] = user_dict['created_at'].isoformat()
                        user_dict['last_login'] = user_dict['last_login'].isoformat()
                        users_list.append(user_dict)
                    
                    return {
                        'statusCode': 200,
                        'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                        'body': json.dumps({'users': users_list}),
                        'isBase64Encoded': False
                    }
        
        elif method == 'POST':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            seed_phrase = body.get('seed_phrase')
            
            if not user_id or not seed_phrase:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id and seed_phrase are required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    "INSERT INTO users (user_id, seed_phrase) VALUES (%s, %s) ON CONFLICT (user_id) DO UPDATE SET last_login = NOW()",
                    (user_id, seed_phrase)
                )
                conn.commit()
            
            return {
                'statusCode': 201,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'User created successfully', 'user_id': user_id}),
                'isBase64Encoded': False
            }
        
        elif method == 'PUT':
            body = json.loads(event.get('body', '{}'))
            user_id = body.get('user_id')
            
            if not user_id:
                return {
                    'statusCode': 400,
                    'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                    'body': json.dumps({'error': 'user_id is required'}),
                    'isBase64Encoded': False
                }
            
            with conn.cursor() as cur:
                cur.execute(
                    "UPDATE users SET last_login = NOW() WHERE user_id = %s",
                    (user_id,)
                )
                conn.commit()
            
            return {
                'statusCode': 200,
                'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
                'body': json.dumps({'message': 'User updated successfully'}),
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
