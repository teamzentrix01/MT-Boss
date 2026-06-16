'use client';

import { useState } from 'react';

export default function EnquiriesPage() {
  const [enquiries] = useState([
    { id: 1, name: 'John Doe', email: 'john@example.com', phone: '+91 9876543210', property: 'Residential', budget: '₹50-75L', date: '2024-05-10', status: 'Pending', message: 'Looking for 2BHK in Mumbai' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', phone: '+91 9876543211', property: 'Commercial', budget: '₹1-2Cr', date: '2024-05-09', status: 'Contacted', message: 'Need office space in central Delhi' },
    { id: 3, name: 'Mike Johnson', email: 'mike@example.com', phone: '+91 9876543212', property: 'Industrial', budget: '₹50Cr+', date: '2024-05-08', status: 'Pending', message: 'Industrial plot required' },
    { id: 4, name: 'Sarah Wilson', email: 'sarah@example.com', phone: '+91 9876543213', property: 'Plot', budget: '₹20-30L', date: '2024-05-07', status: 'Closed', message: 'Plot in suburbs preferred' },
    { id: 5, name: 'Alex Brown', email: 'alex@example.com', phone: '+91 9876543214', property: 'Apartment', budget: '₹75L-1Cr', date: '2024-05-06', status: 'Contacted', message: 'Premium apartment required' },
  ]);

  const [filterStatus, setFilterStatus] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const filteredEnquiries = enquiries.filter((item) => {
    const matchStatus = filterStatus === 'All' || item.status === filterStatus;
    const matchSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       item.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchStatus && matchSearch;
  });

  const getStatusColor = (status) => {
    const colors = {
      'Pending': 'bg-sky-100 text-[var(--brand-blue-deepest)]',
      'Contacted': 'bg-blue-100 text-blue-800',
      'Closed': 'bg-red-100 text-red-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Enquiries Management</h1>
          <p className="text-gray-600 mt-2">Total: {enquiries.length} | Pending: {enquiries.filter(e => e.status === 'Pending').length}</p>
        </div>

        {/* Controls */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Search</label>
              <input
                type="text"
                placeholder="Search by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Status</label>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]"
              >
                <option>All</option>
                <option>Pending</option>
                <option>Contacted</option>
                <option>Closed</option>
              </select>
            </div>
            <div className="flex items-end">
              <button className="w-full px-4 py-2 bg-[var(--brand-blue)] text-black rounded-lg font-semibold hover:bg-sky-500 transition-colors">
                Export CSV
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Contact</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Property Type</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Budget</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-700 uppercase">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredEnquiries.map((item) => (
                  <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{item.name}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.email}</td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.property}</td>
                    <td className="px-6 py-4 text-sm text-gray-900 font-semibold">{item.budget}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600">{item.date}</td>
                    <td className="px-6 py-4 text-sm">
                      <button
                        onClick={() => setSelectedEnquiry(item)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal */}
      {selectedEnquiry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-2xl w-full p-4 sm:p-8 shadow-xl max-h-[90dvh] overflow-y-auto">
            <div className="flex justify-between items-start mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Enquiry Details</h2>
              <button
                onClick={() => setSelectedEnquiry(null)}
                className="text-gray-400 hover:text-gray-600 text-2xl"
              >
                ✕
              </button>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Date</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.date}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Property Type</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.property}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-lg font-semibold text-gray-900">{selectedEnquiry.budget}</p>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600">Message</p>
                <p className="text-gray-900 bg-gray-50 p-4 rounded-lg mt-2">{selectedEnquiry.message}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <select defaultValue={selectedEnquiry.status} className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--brand-blue)]">
                  <option>Pending</option>
                  <option>Contacted</option>
                  <option>Closed</option>
                </select>
                <button className="px-6 py-2 bg-[var(--brand-blue)] text-black rounded-lg font-semibold hover:bg-sky-500 transition-colors">
                  Update Status
                </button>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors">
                  Send Email
                </button>
                <button className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                  Assign Agent
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
