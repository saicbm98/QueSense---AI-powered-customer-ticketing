import React, { useState } from 'react';
import { Search, Filter, MoreHorizontal, Star, Mail } from 'lucide-react';
import { MOCK_CUSTOMERS_LIST } from '../constants';

interface CustomersViewProps {
  notify: (message: string, type?: 'success' | 'error' | 'info') => void;
}

const CustomersView: React.FC<CustomersViewProps> = ({ notify }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredCustomers = MOCK_CUSTOMERS_LIST.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.company.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-8 animate-fade-in">
      <div className="flex items-center justify-between mb-8">
        <div>
           <h1 className="text-2xl font-bold text-gray-900 mb-1">Customers</h1>
           <p className="text-sm text-gray-500">View and manage customer profiles.</p>
        </div>
        <div className="relative w-64">
           <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
           <input 
             type="text"
             placeholder="Search customers..."
             className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:border-primary outline-none shadow-sm"
             value={searchTerm}
             onChange={(e) => setSearchTerm(e.target.value)}
           />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200 text-xs text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Customer</th>
              <th className="px-6 py-4 font-semibold">Plan</th>
              <th className="px-6 py-4 font-semibold">MRR</th>
              <th className="px-6 py-4 font-semibold">Joined</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredCustomers.map(customer => (
              <tr key={customer.id} className="hover:bg-gray-50 transition-colors group">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-blue-100 to-indigo-100 flex items-center justify-center text-primary font-bold text-sm">
                      {customer.name.charAt(0)}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-900">{customer.name}</div>
                      <div className="text-xs text-gray-500">{customer.company}</div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded-md text-xs font-medium border ${
                    customer.plan === 'Enterprise' 
                    ? 'bg-purple-50 text-purple-700 border-purple-100' 
                    : customer.plan === 'Pro' 
                    ? 'bg-blue-50 text-blue-700 border-blue-100'
                    : 'bg-gray-100 text-gray-600 border-gray-200'
                  }`}>
                    {customer.plan}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-600 font-mono">
                  ${customer.mrr.toLocaleString()}
                </td>
                <td className="px-6 py-4 text-sm text-gray-500">
                  {new Date(customer.joinedAt).toLocaleDateString()}
                </td>
                <td className="px-6 py-4">
                  {customer.isHighValue && (
                    <span className="flex items-center gap-1 text-xs font-semibold text-amber-600 bg-amber-50 px-2 py-1 rounded-full w-fit">
                      <Star size={10} fill="currentColor" /> High Value
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => notify(`Emailing ${customer.name}...`, 'info')} className="p-1.5 text-gray-400 hover:text-primary hover:bg-blue-50 rounded">
                      <Mail size={16} />
                    </button>
                    <button className="p-1.5 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded">
                      <MoreHorizontal size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCustomers.length === 0 && (
           <div className="p-8 text-center text-gray-500">No customers found.</div>
        )}
      </div>
      <div className="mt-4 flex justify-between items-center text-xs text-gray-500">
        <span>Showing {filteredCustomers.length} results</span>
        <div className="flex gap-2">
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Previous</button>
          <button className="px-3 py-1 border border-gray-200 rounded hover:bg-gray-50 disabled:opacity-50" disabled>Next</button>
        </div>
      </div>
    </div>
  );
};

export default CustomersView;
