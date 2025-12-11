-- Таблица пользователей
CREATE TABLE IF NOT EXISTS users (
    user_id VARCHAR(16) PRIMARY KEY,
    seed_phrase TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    last_login TIMESTAMP NOT NULL DEFAULT NOW()
);

-- Таблица балансов
CREATE TABLE IF NOT EXISTS balances (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(16) NOT NULL REFERENCES users(user_id),
    crypto_symbol VARCHAR(10) NOT NULL,
    crypto_network VARCHAR(10),
    balance DECIMAL(20, 8) NOT NULL DEFAULT 0,
    updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, crypto_symbol, crypto_network)
);

-- Таблица транзакций
CREATE TABLE IF NOT EXISTS transactions (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(16) NOT NULL REFERENCES users(user_id),
    tx_type VARCHAR(10) NOT NULL,
    asset VARCHAR(50) NOT NULL,
    amount DECIMAL(20, 8) NOT NULL,
    tx_date TIMESTAMP NOT NULL DEFAULT NOW(),
    status VARCHAR(20) NOT NULL DEFAULT 'completed',
    tx_hash VARCHAR(100) NOT NULL
);

-- Индексы для ускорения запросов
CREATE INDEX IF NOT EXISTS idx_balances_user_id ON balances(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions(tx_date DESC);
