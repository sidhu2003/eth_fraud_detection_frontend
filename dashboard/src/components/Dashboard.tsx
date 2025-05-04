import React from 'react';
import DashboardHeader from './DashboardHeader';
import DashboardStats from './DashboardStats';
import TransactionForm from './TransactionForm';
import TransactionList from './TransactionList';

const Dashboard: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4 md:p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        <DashboardHeader />
        
        <div className="mb-6">
          <DashboardStats />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1">
            <TransactionForm />
          </div>
          
          <div className="lg:col-span-2">
            <TransactionList />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;