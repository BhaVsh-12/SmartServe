import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Filter, Search, Clock, CheckCircle, XCircle, CheckSquare } from 'lucide-react';
import axios from 'axios';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  accepted: 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
  completed: 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  declined: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  rejected: 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200',
  pursuing: 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
};

const cardVariants = {
  initial: { opacity: 0, y: 20, scale: 0.95 },
  animate: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.3, ease: 'easeInOut' } },
  exit: { opacity: 0, y: -20, scale: 0.95, transition: { duration: 0.2, ease: 'easeInOut' } },
};

const buttonVariants = {
  hover: { scale: 1.05, boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.2)" },
  tap: { scale: 0.95 },
};

export default function Requests() {
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        const token = localStorage.getItem('token');
        const response = await axios.get('http://localhost:5000/request/api/auth/getrequest', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRequests(response.data);
      } catch (err) {
        console.error('Error fetching requests:', err);
        setError('Failed to fetch requests.');
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, []);

  const handleAccept = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/request/api/auth/accept',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, userstatus: 'pursuing', servicestatus: 'accepted' }
            : request
        )
      );
    } catch (err) {
      console.error('Error accepting request:', err);
      setError('Failed to accept request.');
    }
  };

  const handleComplete = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/request/api/auth/complete',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, userstatus: 'completed', servicestatus: 'completed' }
            : request
        )
      );
    } catch (err) {
      console.error('Error completing request:', err);
      setError('Failed to complete request.');
    }
  };

  const handleDecline = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(
        'http://localhost:5000/request/api/auth/decline',
        { requestId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setRequests((prevRequests) =>
        prevRequests.map((request) =>
          request._id === requestId
            ? { ...request, userstatus: 'declined', servicestatus: 'rejected' }
            : request
        )
      );
    } catch (err) {
      console.error('Error declining request:', err);
      setError('Failed to decline request.');
    }
  };

  const filteredRequests = requests.filter((request) => {
    const matchesFilter =
      filter === 'all' || request.userstatus === filter || request.servicestatus === filter;
    const matchesSearch =
      request.clientname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.service?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center">Loading requests...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-red-500">{error}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold">Service Requests</h1>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative flex-1 sm:flex-none">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search requests..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <div className="relative flex-1 sm:flex-none">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border dark:border-gray-600 dark:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Requests</option>
              <option value="pending">Pending</option>
              <option value="accepted">Accepted</option>
              <option value="completed">Completed</option>
              <option value="declined">Declined</option>
              <option value="rejected">Rejected</option>
              <option value="pursuing">Pursuing</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        <AnimatePresence>
          {filteredRequests.map((request) => (
            <motion.div
              key={request._id}
              variants={cardVariants}
              initial="initial"
              animate="animate"
              exit="exit"className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-4 sm:p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <img
                      src={request.clientPhoto}
                      alt={request.clientname}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                      <h3 className="font-semibold text-lg">{request.clientname}</h3>
                      <p className="text-gray-600 dark:text-gray-400">{request.service}</p>
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[request.userstatus] || statusColors[request.servicestatus]}`}>
                      {request.userstatus ? request.userstatus.charAt(0).toUpperCase() + request.userstatus.slice(1) : request.servicestatus.charAt(0).toUpperCase() + request.servicestatus.slice(1)}
                    </span>
                    <div className="text-left sm:text-right">
                      <p className="font-semibold">${request.price}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Clock size={16} />
                        {new Date(request.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
                {request.userstatus === 'pending' && (
                  <div className="mt-4 flex gap-2 justify-end">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-primary-500 text-white hover:bg-primary-600 transition-colors"
                      onClick={() => handleAccept(request._id)}
                    >
                      <CheckCircle size={20} />
                      Accept
                    </motion.button>
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      onClick={() => handleDecline(request._id)}
                    >
                      <XCircle size={20} />
                      Decline
                    </motion.button>
                  </div>
                )}
                {request.userstatus === 'pursuing' && (
                  <div className="mt-4 flex gap-2 justify-end">
                    <motion.button
                      variants={buttonVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 transition-colors"
                      onClick={() => handleComplete(request._id)}
                    >
                      <CheckSquare size={20} />
                      Complete
                    </motion.button>
                  </div>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  }