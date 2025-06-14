
import React from 'react';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { ArrowUp, ArrowDown, Plus } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

const Wallet = () => {
  const { user } = useAuth();

  // Mock data (only used when authenticated)
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

  // If not logged in, show friendly notice with login/sign up
  if (!user) {
    return (
      <div className="min-h-screen bg-chauffer-gray-50 flex flex-col items-center justify-center px-4">
        <Header title="Wallet" />
        <div className="w-full max-w-md mt-12 flex flex-col items-center">
          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-2 text-chauffer-black">Sign in to view your wallet</h2>
            <p className="text-chauffer-gray-600 mb-6">
              Your wallet, balance, and transaction history are only visible to registered users.
            </p>
            <div className="flex flex-col gap-3 w-full">
              <Button
                className="w-full bg-chauffer-mint hover:bg-chauffer-mint/90 text-white"
                onClick={() => {
                  // Find the global authMode setter and trigger login modal
                  if (window && typeof window !== 'undefined') {
                    // Use a custom event to tell AuthWrapper to open login
                    window.dispatchEvent(new CustomEvent('lovable-set-auth-mode', { detail: 'login' }))
                  }
                }}
              >
                Log In
              </Button>
              <Button
                className="w-full"
                variant="outline"
                onClick={() => {
                  if (window && typeof window !== 'undefined') {
                    window.dispatchEvent(new CustomEvent('lovable-set-auth-mode', { detail: 'signup' }))
                  }
                }}
              >
                Sign Up
              </Button>
            </div>
          </Card>
        </div>
      </div>
    );
  }

  // Authenticated state: show full wallet
  return (
    <div className="min-h-screen bg-chauffer-gray-50">
      <Header title="Wallet" />
      
      <div className="px-4 md:px-8 py-6 pb-20 md:pb-8 max-w-4xl md:mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Balance Card */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-6 bg-gradient-to-r from-chauffer-black to-chauffer-gray-700 text-white">
              <div className="text-center">
                <p className="text-white/80 text-sm mb-2">Available Balance</p>
                <p className="text-3xl md:text-4xl font-bold mb-4">${balance.toFixed(2)}</p>
                
                <div className="flex flex-col md:flex-row space-y-3 md:space-y-0 md:space-x-3">
                  <Button variant="secondary" className="flex-1 min-w-0">
                    <Plus size={16} className="mr-2" />
                    <span className="whitespace-nowrap">Top Up</span>
                  </Button>
                  <Button variant="outline" className="flex-1 min-w-0 border-white/20 text-white hover:bg-white/10">
                    <ArrowUp size={16} className="mr-2" />
                    <span className="whitespace-nowrap">Withdraw</span>
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
          </div>

          {/* Transactions */}
          <div className="lg:col-span-3">
            <div className="space-y-4">
              <h3 className="font-semibold text-chauffer-black">Recent Transactions</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
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

              <Button variant="outline" className="w-full md:max-w-xs md:mx-auto md:block mt-4">
                View All Transactions
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Wallet;
