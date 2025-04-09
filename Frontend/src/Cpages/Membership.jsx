import React, { useState, useEffect } from 'react';
import {
    Settings2, Award, Crown, Star, Clock, Gift, DollarSign,
    CheckCircle2, Timer, Bell, Sparkles, ArrowRight, Shield,
    Users, Zap, Loader2, AlertCircle
} from 'lucide-react';
import Api from '../Api/capi';
import { useAppContext } from "../context/AppContext";

function Membership({ servicemanId, handleChat }) {
    const { darkMode } = useAppContext();
    const [billingCycle, setBillingCycle] = useState('monthly');
    const [selectedTier, setSelectedTier] = useState(null);
    const [tiersData, setTiersData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Theme configuration
    const themeConfig = {
        dark: {
            bg: 'bg-gray-900',
            card: 'bg-gray-800',
            text: 'text-gray-100',
            mutedText: 'text-gray-400',
            button: 'bg-gray-700 hover:bg-gray-600',
            serviceCard: 'bg-gray-700',
            hero: 'bg-gradient-to-r from-blue-600 to-purple-600',
            toggleBg: 'bg-white/10',
            toggleActive: 'bg-white text-blue-600',
            toggleInactive: 'text-white hover:bg-white/10'
        },
        light: {
            bg: 'bg-gradient-to-br from-gray-50 to-gray-100',
            card: 'bg-white',
            text: 'text-gray-800',
            mutedText: 'text-gray-600',
            button: 'bg-gray-100 hover:bg-gray-200',
            serviceCard: 'bg-gray-50',
            hero: 'bg-gradient-to-r from-blue-600 to-purple-600',
            toggleBg: 'bg-white/20',
            toggleActive: 'bg-white text-blue-600',
            toggleInactive: 'text-white hover:bg-white/10'
        }
    };

    const theme = themeConfig[darkMode ? 'dark' : 'light'];

    const calculateSavings = (monthly, yearly) => {
        if (!monthly || !yearly || monthly === 0) return 0;
        const yearlyFromMonthly = monthly * 12;
        return Math.round(((yearlyFromMonthly - yearly) / yearlyFromMonthly) * 100);
    };

    useEffect(() => {
        const fetchMembershipData = async () => {
            setLoading(true);
            setError(null);
            try {
                const token = localStorage.getItem("token");
                const response = await Api.get(`/user/api/auth/getMembership/${servicemanId}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (response.status === 200) {
                    const transformTierData = (tierData, tierName) => {
                        if (!tierData) return null;

                        const config = {
                            basic: {
                                name: 'Basic Care',
                                icon: <Star className="w-6 h-6" />,
                                color: 'from-blue-500 to-blue-600',
                                description: 'Perfect for basic maintenance needs'
                            },
                            professional: {
                                name: 'Professional Plus',
                                icon: <Award className="w-6 h-6" />,
                                color: 'from-purple-500 to-purple-600',
                                description: 'Enhanced service package for regular maintenance',
                                isPopular: true
                            },
                            elite: {
                                name: 'Elite Service',
                                icon: <Crown className="w-6 h-6" />,
                                color: 'from-amber-500 to-amber-600',
                                description: 'Premium service with priority support'
                            }
                        };

                        return {
                            id: tierName,
                            ...config[tierName],
                            services: tierData.includeService?.map(s => ({
                                id: s._id || `${tierName}-${Math.random().toString(36).substr(2, 9)}`,
                                name: s.service || 'Unnamed Service',
                                duration: s.time || 'Not specified',
                                description: s.description || 'No description available'
                            })) || [],
                            frequency: tierData.frquency || 'Not specified',
                            responseTime: tierData.Response || 'Not specified',
                            benefits: tierData.benefits?.filter(b => b) || ['No benefits listed'],
                            price: {
                                monthly: tierData.mprice || 0,
                                yearly: tierData.yprice || 0
                            },
                            savepercentage: calculateSavings(tierData.mprice, tierData.yprice)
                        };
                    };

                    const tiers = [
                        transformTierData(response.data.basic, 'basic'),
                        transformTierData(response.data.professional, 'professional'),
                        transformTierData(response.data.elite, 'elite')
                    ].filter(Boolean);

                    setTiersData(tiers);
                } else {
                    throw new Error('Failed to fetch membership data');
                }
            } catch (err) {
                console.error("Fetch error:", err);
                setError(err.message || 'An error occurred while fetching data');
            } finally {
                setLoading(false);
            }
        };

        if (servicemanId) fetchMembershipData();
    }, [servicemanId]);

    const handlePurchase = (tierId) => {
        handleChat();
    };

    const TierCard = ({ tier }) => {
        const isSelected = selectedTier === tier.id;
        const monthlyPrice = parseFloat(tier.price.monthly);
        const yearlyPrice = parseFloat(tier.price.yearly);
        const displayPrice = billingCycle === 'monthly'
            ? monthlyPrice.toFixed(2)
            : (yearlyPrice / 12).toFixed(2);
        const hasSavings = tier.savepercentage > 0;

        return (
            <div
                className={`relative rounded-xl shadow-lg overflow-hidden transition-all duration-300
                    transform hover:scale-[1.02] ${theme.card} ${theme.text}
                    ${isSelected ? 'ring-2 ring-blue-500' : ''}
                    ${tier.isPopular ? 'ring-2 ring-purple-500' : ''}`}
                aria-labelledby={`tier-${tier.id}-title`}
            >
                {tier.isPopular && (
                    <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg z-10 flex items-center">
                        <Sparkles className="w-4 h-4 mr-1" />
                        <span className="text-sm font-medium">Most Popular</span>
                    </div>
                )}

                <div className={`absolute inset-x-0 h-2 bg-gradient-to-r ${tier.color}`} />

                <div className="p-6 pt-8">
                    <div className="flex items-center space-x-3 mb-4">
                        {React.cloneElement(tier.icon, {
                            className: `w-6 h-6 ${theme.text}`
                        })}
                        <h3 id={`tier-${tier.id}-title`} className="text-2xl font-bold">
                            {tier.name}
                        </h3>
                    </div>

                    <p className={`${theme.mutedText} mb-6`}>{tier.description}</p>

                    <div className="mb-6">
                        <div className="flex items-baseline mb-1">
                            <span className="text-4xl font-bold">${displayPrice}</span>
                            <span className={`${theme.mutedText} ml-2`}>/month</span>
                            {billingCycle === 'yearly' && hasSavings && (
                                <span className="text-green-500 ml-2 text-sm">
                                    Save {tier.savepercentage}%
                                </span>
                            )}
                        </div>
                        {billingCycle === 'yearly' && (
                            <p className={`text-sm ${theme.mutedText}`}>
                                Billed annually at ${yearlyPrice.toFixed(2)}
                            </p>
                        )}
                    </div>

                    <button
                        onClick={() => handlePurchase(tier.id)}
                        className={`w-full py-3 rounded-lg font-medium transition-all duration-200
                            transform hover:scale-[1.02] mb-6 flex items-center justify-center
                            ${tier.isPopular
                                ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white'
                                : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
                            }`}
                        aria-label={`Select ${tier.name} plan`}
                    >
                        Buy
                        <ArrowRight className="w-4 h-4 ml-2" />
                    </button>

                    <div className="space-y-6">
                        <div>
                            <div className={`flex items-center space-x-2 ${theme.mutedText} mb-2`}>
                                <Settings2 className="w-4 h-4" />
                                <span className="font-medium">Included Services</span>
                            </div>
                            <ul className="space-y-3">
                                {tier.services.map(service => (
                                    <li key={service.id} className={`rounded-lg p-3 ${theme.serviceCard}`}>
                                        <div className="flex items-center space-x-2 mb-1">
                                            <CheckCircle2 className="w-4 h-4 text-green-500" />
                                            <span className="font-medium">{service.name}</span>
                                        </div>
                                        <div className="space-y-1 ml-6">
                                            <div className="flex items-center space-x-2 text-sm">
                                                <Timer className="w-3 h-3" />
                                                <span className={theme.mutedText}>{service.duration}</span>
                                            </div>
                                            <p className={`text-sm ${theme.mutedText}`}>
                                                {service.description}
                                            </p>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div>
                            <div className={`flex items-center space-x-2 ${theme.mutedText} mb-2`}>
                                <Clock className="w-4 h-4" />
                                <span className="font-medium">Service Frequency</span>
                            </div>
                            <p className={`text-sm ml-6 ${theme.mutedText}`}>
                                {tier.frequency}
                            </p>
                        </div>

                        <div>
                            <div className={`flex items-center space-x-2 ${theme.mutedText} mb-2`}>
                                <Bell className="w-4 h-4" />
                                <span className="font-medium">Response Time</span>
                            </div>
                            <p className={`text-sm ml-6 ${theme.mutedText}`}>
                                {tier.responseTime}
                            </p>
                        </div>

                        <div>
                            <div className={`flex items-center space-x-2 ${theme.mutedText} mb-2`}>
                                <Gift className="w-4 h-4" />
                                <span className="font-medium">Exclusive Benefits</span>
                            </div>
                            <ul className="space-y-2 ml-6">
                                {tier.benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-start space-x-2 text-sm">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500 flex-shrink-0 mt-0.5" />
                                        <span className={theme.mutedText}>{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
                <div className="text-center">
                    <Loader2 className="w-8 h-8 animate-spin mx-auto text-blue-500" />
                    <p className={`mt-4 ${theme.text}`}>
                        Loading membership plans...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme.bg}`}>
                <div className={`max-w-md p-6 rounded-lg shadow-md ${theme.card} ${theme.text}`}>
                    <AlertCircle className="w-10 h-10 mx-auto text-red-500 mb-4" />
                    <h2 className="text-xl font-bold mb-2">
                        Error Loading Plans
                    </h2>
                    <p className={`mb-4 ${theme.mutedText}`}>
                        {error}
                    </p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className={`min-h-screen ${theme.bg}`}>
            {/* Hero Section */}
            <div className={`${theme.hero} text-white py-20 px-4 shadow-lg`}>
                <div className="max-w-7xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">
                        Choose Your Perfect Service Plan
                    </h1>

                    <div className="flex flex-wrap items-center justify-center gap-6 mb-8">
                        <div className="flex items-center space-x-3">
                            <Shield className="w-6 h-6" />
                            <span>100% Satisfaction Guarantee</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Zap className="w-6 h-6" />
                            <span>Quick Response Time</span>
                        </div>
                        <div className="flex items-center space-x-3">
                            <Users className="w-6 h-6" />
                            <span>To Buy Communicate With Serviceman</span>
                        </div>
                    </div>

                    <div className={`inline-flex items-center justify-center rounded-lg p-1 ${theme.toggleBg}`}>
                        <button
                            onClick={() => setBillingCycle('monthly')}
                            className={`px-4 py-2 rounded-md transition-all duration-200 ${
                                billingCycle === 'monthly'
                                    ? theme.toggleActive
                                    : theme.toggleInactive
                            }`}
                            aria-label="Show monthly pricing"
                        >
                            Monthly
                        </button>
                        <button
                            onClick={() => setBillingCycle('yearly')}
                            className={`px-4 py-2 rounded-md transition-all duration-200 ${
                                billingCycle === 'yearly'
                                    ? theme.toggleActive
                                    : theme.toggleInactive
                            }`}
                            aria-label="Show yearly pricing"
                        >
                            Yearly
                            {tiersData[0]?.savepercentage > 0 && (
                                <span className="ml-2 text-sm bg-green-500 text-white px-2 py-0.5 rounded-full">
                                    Save {tiersData[0].savepercentage}%
                                </span>
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Pricing Cards */}
            <div className="max-w-7xl mx-auto px-4 py-16">
                {tiersData.length > 0 ? (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {tiersData.map(tier => (
                            <TierCard key={tier.id} tier={tier} />
                        ))}
                    </div>
                ) : (
                    <div className={`text-center py-12 ${theme.text}`}>
                        <p className="text-lg">No membership plans available</p>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Membership;