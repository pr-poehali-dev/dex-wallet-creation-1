const API_URLS = {
  users: 'https://functions.poehali.dev/5b53d08f-8282-4753-a886-e57f87da0c4c',
  balances: 'https://functions.poehali.dev/a7bcef98-4e37-4a26-84bf-f09f3174f551',
  transactions: 'https://functions.poehali.dev/43928769-a226-4ab3-a0da-56f76ce50b68',
};

export interface User {
  user_id: string;
  seed_phrase: string;
  created_at: string;
  last_login: string;
  balances?: Array<{
    crypto_symbol: string;
    crypto_network: string | null;
    balance: number;
  }>;
}

export interface Balance {
  [key: string]: number;
}

export interface Transaction {
  id: number;
  tx_type: string;
  asset: string;
  amount: number;
  tx_date: string;
  status: string;
  tx_hash: string;
}

export const api = {
  users: {
    async create(userId: string, seedPhrase: string): Promise<void> {
      const response = await fetch(API_URLS.users, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, seed_phrase: seedPhrase }),
      });
      if (!response.ok) throw new Error('Failed to create user');
    },

    async get(userId: string): Promise<User> {
      const response = await fetch(`${API_URLS.users}?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch user');
      return response.json();
    },

    async getAll(): Promise<User[]> {
      const response = await fetch(API_URLS.users);
      if (!response.ok) throw new Error('Failed to fetch users');
      const data = await response.json();
      return data.users;
    },

    async updateLogin(userId: string): Promise<void> {
      const response = await fetch(API_URLS.users, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId }),
      });
      if (!response.ok) throw new Error('Failed to update login');
    },
  },

  balances: {
    async get(userId: string): Promise<Balance> {
      const response = await fetch(`${API_URLS.balances}?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch balances');
      const data = await response.json();
      return data.balances;
    },

    async update(userId: string, cryptoSymbol: string, cryptoNetwork: string | null, balance: number): Promise<void> {
      const response = await fetch(API_URLS.balances, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          crypto_symbol: cryptoSymbol,
          crypto_network: cryptoNetwork,
          balance,
        }),
      });
      if (!response.ok) throw new Error('Failed to update balance');
    },
  },

  transactions: {
    async get(userId: string): Promise<Transaction[]> {
      const response = await fetch(`${API_URLS.transactions}?user_id=${userId}`);
      if (!response.ok) throw new Error('Failed to fetch transactions');
      const data = await response.json();
      return data.transactions;
    },

    async create(
      userId: string,
      txType: string,
      asset: string,
      amount: number,
      txHash: string,
      status: string = 'completed'
    ): Promise<void> {
      const response = await fetch(API_URLS.transactions, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          user_id: userId,
          tx_type: txType,
          asset,
          amount,
          tx_hash: txHash,
          status,
        }),
      });
      if (!response.ok) throw new Error('Failed to create transaction');
    },
  },
};
