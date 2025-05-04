import React from 'react';
import { useTransactions } from '../context/TransactionContext';
import { ArrowUpCircle, CheckCircle, XCircle, Clock } from 'lucide-react';

const DashboardStats: React.FC = () => {
  const { state } = useTransactions();
  const { stats } = state;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <div className="rounded-full bg-blue-100 dark:bg-blue-900 p-3 mr-4">
          <ArrowUpCircle className="h-6 w-6 text-blue-500 dark:text-blue-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Total Transactions</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <div className="rounded-full bg-green-100 dark:bg-green-900 p-3 mr-4">
          <CheckCircle className="h-6 w-6 text-green-500 dark:text-green-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Successful</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.successful}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <div className="rounded-full bg-red-100 dark:bg-red-900 p-3 mr-4">
          <XCircle className="h-6 w-6 text-red-500 dark:text-red-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Failed</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.failed}</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-md flex items-center">
        <div className="rounded-full bg-yellow-100 dark:bg-yellow-900 p-3 mr-4">
          <Clock className="h-6 w-6 text-yellow-500 dark:text-yellow-400" />
        </div>
        <div>
          <p className="text-sm text-gray-500 dark:text-gray-400">Pending</p>
          <p className="text-xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
        </div>
      </div>
    </div>
  );
};

export default DashboardStats;