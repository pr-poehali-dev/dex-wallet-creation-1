"""
Получение актуальных цен криптовалют через CoinGecko API
Возвращает текущие цены в USD для списка криптовалют
"""

import json
import urllib.request
import urllib.error
from typing import Dict, Any


def handler(event: Dict[str, Any], context: Any) -> Dict[str, Any]:
    """
    Получает актуальные цены криптовалют с CoinGecko API
    Args: event - dict с httpMethod
          context - объект с атрибутами request_id, function_name
    Returns: HTTP response с ценами криптовалют
    """
    method: str = event.get('httpMethod', 'GET')
    
    # CORS preflight
    if method == 'OPTIONS':
        return {
            'statusCode': 200,
            'headers': {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'GET, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Max-Age': '86400'
            },
            'body': '',
            'isBase64Encoded': False
        }
    
    if method == 'GET':
        try:
            # Список криптовалют для получения цен
            coin_ids = 'bitcoin,ethereum,binancecoin,tether,usd-coin,binance-usd,dai,true-usd,paxos-standard,frax,usdd'
            
            url = f'https://api.coingecko.com/api/v3/simple/price?ids={coin_ids}&vs_currencies=usd'
            
            req = urllib.request.Request(url)
            req.add_header('Accept', 'application/json')
            
            with urllib.request.urlopen(req, timeout=10) as response:
                data = json.loads(response.read().decode('utf-8'))
            
            # Маппинг символов на CoinGecko ID
            prices = {
                'BTC': data.get('bitcoin', {}).get('usd', 43250.00),
                'ETH': data.get('ethereum', {}).get('usd', 2280.50),
                'BNB': data.get('binancecoin', {}).get('usd', 312.75),
                'USDT': data.get('tether', {}).get('usd', 1.00),
                'USDC': data.get('usd-coin', {}).get('usd', 1.00),
                'BUSD': data.get('binance-usd', {}).get('usd', 1.00),
                'DAI': data.get('dai', {}).get('usd', 1.00),
                'TUSD': data.get('true-usd', {}).get('usd', 1.00),
                'USDP': data.get('paxos-standard', {}).get('usd', 1.00),
                'FRAX': data.get('frax', {}).get('usd', 1.00),
                'USDD': data.get('usdd', {}).get('usd', 1.00),
            }
            
            return {
                'statusCode': 200,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps(prices),
                'isBase64Encoded': False
            }
            
        except urllib.error.HTTPError as e:
            return {
                'statusCode': e.code,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': f'HTTP Error: {e.code}'}),
                'isBase64Encoded': False
            }
        except Exception as e:
            return {
                'statusCode': 500,
                'headers': {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                'body': json.dumps({'error': str(e)}),
                'isBase64Encoded': False
            }
    
    return {
        'statusCode': 405,
        'headers': {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
        },
        'body': json.dumps({'error': 'Method not allowed'}),
        'isBase64Encoded': False
    }
