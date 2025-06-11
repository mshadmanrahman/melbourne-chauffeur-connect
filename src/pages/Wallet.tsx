
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';

const Wallet = () => {
  // Mock data
  const balance = 247.50;
  const transactions = [
    {
      id: '1',
      type: 'earned',
      amount: 85.00,
      description: 'Airport run - Crown Casino',
      date: '2024-06-11',
      status: 'completed'
    },
    {
      id: '2',
      type: 'earned',
      amount: 45.00,
      description: 'Collins St to Brighton',
      date: '2024-06-10',
      status: 'completed'
    },
    {
      id: '3',
      type: 'commission',
      amount: -8.50,
      description: 'Platform commission',
      date: '2024-06-10',
      status: 'completed'
    },
    {
      id: '4',
      type: 'payout',
      amount: -150.00,
      description: 'Bank transfer to ANZ ****1234',
      date: '2024-06-09',
      status: 'completed'
    }
  ];

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'earned':
        return <ArrowDown className="text-chauffer-mint" size={16} />;
      case 'payout':
        return <ArrowUp className="text-chauffer-gray-500" size={16} />;
      default:
        return <ArrowUp className="text-red-500" size={16} />;
    }
  };

  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Wallet" />
      
      <div className="px-4 py-6 pb-20">
        {/* Balance Card */}
        <Card className="p-6 mb-6 bg-gradient-to-r from-chauffer-black to-chauffer-gray-700 text-white">
          <div className="text-center">
            <p className="text-white/80 text-sm mb-2">Available Balance</p>
            <p className="text-3xl font-bold mb-4">${balance.toFixed(2)}</p>
            
            <div className="flex space-x-3">
              <Button variant="secondary" className="flex-1">
                <Plus size={16} className="mr-2" />
                Top Up
              </Button>
              <Button variant="outline" className="flex-1 border-white/20 text-white hover:bg-white/10">
                <ArrowUp size={16} className="mr-2" />
                Withdraw
              </Button>
            </div>
          </div>
        </Card>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <Card className="p-4 text-center">
            <p className="text-2xl font-semibold text-chauffer-black">12</p>
            <p className="text-sm text-chauffer-gray-500">Jobs This Month</p>
          </Card>
          <Card className="p-4 text-center">
            <p className="text-2xl font-semibold text-chauffer-mint">$892</p>
            <p className="text-sm text-chauffer-gray-500">Monthly Earnings</p>
          </Card>
        </div>

        {/* Transactions */}
        <div className="space-y-4">
          <h3 className="font-semibold text-chauffer-black">Recent Transactions</h3>
          
          {transactions.map(transaction => (
            <Card key={transaction.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-chauffer-gray-100 rounded-full flex items-center justify-center">
                    {getTransactionIcon(transaction.type)}
                  </div>
                  <div>
                    <p className="font-medium text-sm text-chauffer-black">
                      {transaction.description}
                    </p>
                    <p className="text-xs text-chauffer-gray-500">
                      {new Date(transaction.date).toLocaleDateString('en-AU')}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className={`font-semibold ${
                    transaction.amount > 0 
                      ? 'text-chauffer-mint' 
                      : 'text-chauffer-gray-500'
                  }`}>
                    {transaction.amount > 0 ? '+' : ''}${Math.abs(transaction.amount).toFixed(2)}
                  </p>
                  <p className="text-xs text-chauffer-gray-500 capitalize">
                    {transaction.status}
                  </p>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <Button variant="outline" className="w-full mt-4">
          View All Transactions
        </Button>
      </div>
    </div>
  );
};

export default Wallet;
