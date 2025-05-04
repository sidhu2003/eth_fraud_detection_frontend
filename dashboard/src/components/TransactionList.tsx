import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import TransactionCard from './TransactionCard';

const TransactionList: React.FC = () => {
  const { state } = useTransactions();
  const { transactions } = state;

  if (transactions.length === 0) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md text-center">
        <p className="text-gray-500 dark:text-gray-400">No transactions yet</p>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-white">Transaction History</h2>
      <div className="space-y-4">
        {transactions.map((transaction) => (
          <TransactionCard key={transaction.id} transaction={transaction} />
        ))}
      </div>
    </div>
  );
};

export default TransactionList;