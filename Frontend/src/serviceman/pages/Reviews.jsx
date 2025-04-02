import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Star, Search, Filter } from 'lucide-react';
import api from "../../Api/capi";
import { useAppContext } from '../../context/AppContext';
import { useTheme } from '../hooks/useTheme';

const StarRating = ({ rating }) => {
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          size={20}
          className={star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}
        />
      ))}
    </div>
  );
};

export default function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const { user } = useAppContext();
  const { theme } = useTheme();
  const [themeClass, setThemeClass] = useState(theme);

  useEffect(() => {
    setThemeClass(theme);
  }, [theme]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await api.get(
          '/review/api/auth/getreview',
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('token')}`,
            },
          }
        );
        setReviews(response.data);
      } catch (error) {
        console.error('Error fetching reviews:', error);
        // Handle error (e.g., show a message to the user)
      }
    };

    if (user) {
      fetchReviews();
    }
  }, [user]);

  // Handle cases where reviews are empty to prevent NaN errors.
  const averageRating = reviews.length > 0
    ? reviews.reduce((acc, review) => acc + review.rating, 0) / reviews.length
    : 0; // or any default value you prefer

  const filteredReviews = reviews.filter((review) => {
    const matchesFilter = filter === 'all' || review.rating === parseInt(filter);
    const matchesSearch =
      review.clientname?.toLowerCase().includes(searchTerm.toLowerCase()) || // Added optional chaining
      review.review?.toLowerCase().includes(searchTerm.toLowerCase()); // Added optional chaining
    return matchesFilter && matchesSearch;
  });

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={`max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 ${themeClass === 'dark' ? 'text-white' : 'text-gray-800'}`}
    >
      <div className="flex flex-col gap-4 mb-8">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Reviews & Ratings</h1>
          <div className="mt-2 flex items-center gap-2">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-lg font-semibold">{averageRating.toFixed(1)}</span>
            <span className={`text-gray-600 ${themeClass === 'dark' ? 'dark:text-gray-400' : ''}`}>({reviews.length} reviews)</span>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClass === 'dark' ? 'dark:border-gray-600 dark:bg-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            />
          </div>
          <div className="relative flex-1">
            <Filter className={`absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400`} size={20} />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className={`w-full pl-10 pr-4 py-2 rounded-lg border ${themeClass === 'dark' ? 'dark:border-gray-600 dark:bg-gray-700' : 'border-gray-300'} focus:outline-none focus:ring-2 focus:ring-primary-500`}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid gap-4">
        {filteredReviews.map((review) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`rounded-2xl shadow-lg p-4 sm:p-6 ${themeClass === 'dark' ? 'bg-gray-800' : 'bg-white'}`}
          >
            <div className="flex flex-col sm:flex-row items-start gap-4">
              <img
                src={review.clientPhoto}
                alt={review.clientname}
                className="w-12 h-12 rounded-full object-cover"
              />
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2">
                  <div>
                    <h3 className="font-semibold text-lg">{review.clientname}</h3>
                    <StarRating rating={review.rating} />
                  </div>
                  <span className={`text-sm text-gray-600 ${themeClass === 'dark' ? 'dark:text-gray-400' : ''}`}>
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className={`mt-2 ${themeClass === 'dark' ? 'text-gray-300' : 'text-gray-700'}`}>{review.review}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}