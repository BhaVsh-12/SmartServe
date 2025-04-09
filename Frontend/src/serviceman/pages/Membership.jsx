import React, { useState, useEffect } from 'react';
import { Settings2, Award, Crown, Star, Clock, Gift, DollarSign, Edit3, Save, X, Plus, Trash2, Timer, Bell, CheckCircle2, AlertCircle, Info, Sparkles, Sun, Moon } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';
import api from "../../Api/capi";

const TierCard = ({ tier, editingTier, handleEdit, handleSave, updateTier, togglePopular, addService, removeService, updateService, addBenefit, removeBenefit, billingCycle, setBillingCycle }) => {
    const { theme } = useTheme();
    const isEditing = editingTier === tier.id;
    console.log(`Rendering TierCard for: ${tier.name}, ID: ${tier.id}`);
    
    return (
        <div className={`relative ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-xl shadow-xl overflow-hidden transition-all duration-300 transform hover:scale-[1.02] ${isEditing ? 'ring-2 ring-blue-500' : ''} ${tier.isPopular ? 'ring-2 ring-purple-500' : ''}`}>
            {tier.isPopular && (
                <div className="absolute top-0 right-0 bg-purple-500 text-white px-4 py-1 rounded-bl-lg z-10 flex items-center space-x-1">
                    <Sparkles className="w-4 h-4" />
                    <span className="text-sm font-medium">Most Popular</span>
                </div>
            )}
            <div className={`absolute inset-x-0 h-2 bg-gradient-to-r ${tier.color}`} />
            <div className="p-6 pt-8">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center space-x-3">
                        {tier.icon}
                        {isEditing ? (
                            <input
                                type="text"
                                className={`text-md font-bold ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded  py-1 w-full sm:w-auto`}
                                value={tier.name}
                                onChange={(e) => updateTier(tier.id, { name: e.target.value })}
                            />
                        ) : (
                            <h3 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>{tier.name}</h3>
                        )}
                    </div>
                    <div className="flex items-center space-x-2">
                        {isEditing && (
                            <button
                                onClick={() => togglePopular(tier.id)}
                                className={`p-2 ml-1 rounded-full transition-colors ${tier.isPopular ? 'bg-purple-100 text-purple-600' : `${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'}`}`}
                                title="Mark as popular"
                            >
                                <Sparkles className="w-5 h-5" />
                            </button>
                        )}
                        <button
                            onClick={() => isEditing ? handleSave(tier.id) : handleEdit(tier.id)}
                            className={`p-2 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                        >
                            {isEditing ? <Save className="w-5 h-5 text-green-600" /> : <Edit3 className={`w-5 h-5 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />}
                        </button>
                    </div>
                </div>
                <div className="space-y-4">
                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <Settings2 className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Included Services</span>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => addService(tier.id)}
                                    className={`p-1 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                                >
                                    <Plus className="w-4 h-4 text-green-600" />
                                </button>
                            )}
                        </div>
                        <ul className="space-y-3">
                            {tier.services.map(service => (
                                <li key={service.id} className={`${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50'} rounded-lg p-3 transition-all duration-200 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-100'}`}>
                                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2">
                                        <div className="flex items-center space-x-2 mb-1 sm:mb-0">
                                            <span className="w-1.5 h-1.5 bg-green-500 rounded-full" />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} border rounded px-2 py-1 text-sm font-medium w-full sm:w-auto`}
                                                    value={service.name}
                                                    onChange={(e) => updateService(tier.id, service.id, { name: e.target.value })}
                                                />
                                            ) : (
                                                <span className={`font-medium ${theme === 'dark' ? 'text-white' : ''}`}>{service.name}</span>
                                            )}
                                        </div>
                                        {isEditing && (
                                            <button
                                                onClick={() => removeService(tier.id, service.id)}
                                                className={`p-1 ${theme === 'dark' ? 'hover:bg-gray-600' : 'hover:bg-gray-200'} rounded-full transition-colors`}
                                            >
                                                <Trash2 className="w-4 h-4 text-red-500" />
                                            </button>
                                        )}
                                    </div>
                                    <div className="space-y-2 ml-3">
                                        <div className="flex items-center space-x-2 text-sm">
                                            <Timer className={`w-3 h-3 ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`} />
                                            {isEditing ? (
                                                <input
                                                    type="text"
                                                    className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} border rounded px-2 py-1 text-sm w-full sm:w-24`}
                                                    value={service.duration}
                                                    onChange={(e) => updateService(tier.id, service.id, { duration: e.target.value })}
                                                />
                                            ) : (
                                                <span className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>{service.duration}</span>
                                            )}
                                        </div>
                                        {isEditing ? (
                                            <textarea
                                                className={`${theme === 'dark' ? 'bg-gray-800 text-white' : 'bg-white'} border rounded px-2 py-1 text-sm w-full`}
                                                value={service.description}
                                                onChange={(e) => updateService(tier.id, service.id, { description: e.target.value })}
                                                rows={2}
                                            />
                                        ) : (
                                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>{service.description}</p>
                                        )}
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Clock className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Service Frequency</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                className={`w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded px-2 py-1 text-sm`}
                                value={tier.frequency}
                                onChange={(e) => updateTier(tier.id, { frequency: e.target.value })}
                            />
                        ) : (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>{tier.frequency}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center space-x-2 mb-2">
                            <Bell className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                            <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Response Time</span>
                        </div>
                        {isEditing ? (
                            <input
                                type="text"
                                className={`w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded px-2 py-1 text-sm`}
                                value={tier.responseTime}
                                onChange={(e) => updateTier(tier.id, { responseTime: e.target.value })}
                            />
                        ) : (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-300' : ''}`}>{tier.responseTime}</p>
                        )}
                    </div>

                    <div>
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <Gift className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Exclusive Benefits</span>
                            </div>
                            {isEditing && (
                                <button
                                    onClick={() => addBenefit(tier.id)}
                                    className={`p-1 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors`}
                                >
                                    <Plus className="w-4 h-4 text-green-600" />
                                </button>
                            )}
                        </div>
                        <ul className="space-y-1 text-sm">
                            {tier.benefits.map((benefit, index) => (
                                <li key={index} className="flex items-center justify-between group">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle2 className="w-4 h-4 text-purple-500" />
                                        {isEditing ? (
                                            <input
                                                type="text"
                                                className={`${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded px-2 py-1 text-sm w-full sm:w-auto`}
                                                value={benefit}
                                                onChange={(e) => {
                                                    const newBenefits = [...tier.benefits];
                                                    newBenefits[index] = e.target.value;
                                                    updateTier(tier.id, { benefits: newBenefits });
                                                }}
                                            />
                                        ) : (
                                            <span className={theme === 'dark' ? 'text-gray-300' : ''}>{benefit}</span>
                                        )}
                                    </div>
                                    {isEditing && (
                                        <button
                                            onClick={() => removeBenefit(tier.id, index)}
                                            className={`p-1 ${theme === 'dark' ? 'hover:bg-gray-700' : 'hover:bg-gray-100'} rounded-full transition-colors opacity-0 group-hover:opacity-100`}
                                        >
                                            <Trash2 className="w-4 h-4 text-red-500" />
                                        </button>
                                    )}
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div className="pt-4 border-t border-gray-200">
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                                <DollarSign className={`w-4 h-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`} />
                                <span className={`font-medium ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Pricing</span>
                            </div>
                            {!isEditing && (
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => setBillingCycle('monthly')}
                                        className={`text-sm px-2 py-1 rounded ${billingCycle === 'monthly' ? 'bg-blue-100 text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
                                    >
                                        Monthly
                                    </button>
                                    <button
                                        onClick={() => setBillingCycle('yearly')}
                                        className={`text-sm px-2 py-1 rounded ${billingCycle === 'yearly' ? 'bg-blue-100 text-blue-600' : theme === 'dark' ? 'text-gray-300' : 'text-gray-500'}`}
                                    >
                                        Yearly
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className="space-y-2">
                            <div className="flex flex-col sm:flex-row items-baseline space-y-1 sm:space-y-0 sm:space-x-2">
                                {isEditing ? (
                                    <div className="flex items-center space-x-2 w-full sm:w-auto">
                                        <span className={theme === 'dark' ? 'text-gray-300' : ''}>Monthly: $</span>
                                        <input
                                            type="number"
                                            className={`w-full sm:w-24 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded px-2 py-1 text-xl font-bold`}
                                            value={tier.price.monthly}
                                            onChange={(e) => updateTier(tier.id, { price: { ...tier.price, monthly: parseFloat(e.target.value) || 0 } })}
                                        />
                                    </div>
                                ) : (
                                    <span className={`text-2xl font-bold ${theme === 'dark' ? 'text-white' : ''}`}>
                                        ${billingCycle === 'monthly' ? tier.price.monthly : (tier.price.yearly / 12).toFixed(2)}
                                    </span>
                                )}
                                <span className={theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}>/month</span>
                                {!isEditing && billingCycle === 'yearly' && (
                                    <span className="text-green-600 text-sm ml-2">Save {tier.save} %</span>
                                )}
                            </div>
                            {isEditing && (
                                <div className="flex items-center space-x-2 w-full sm:w-auto">
                                    <span className={theme === 'dark' ? 'text-gray-300' : ''}>Yearly: $</span>
                                    <input
                                        type="number"
                                        className={`w-full sm:w-24 ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded px-2 py-1 text-sm`}
                                        value={tier.price.yearly}
                                        onChange={(e) => updateTier(tier.id, { price: { ...tier.price, yearly: parseFloat(e.target.value) || 0 } })}
                                    />
                                </div>
                            )}
                            {!isEditing && billingCycle === 'yearly' && (
                                <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-500'}`}>
                                    Billed annually at ${tier.price.yearly}
                                </p>
                            )}
                        </div>
                    </div>

                    <div>
                        <label className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} font-medium block mb-1`}>Description</label>
                        {isEditing ? (
                            <textarea
                                className={`w-full ${theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-50'} border rounded px-2 py-1 text-sm`}
                                value={tier.description}
                                onChange={(e) => updateTier(tier.id, { description: e.target.value })}
                                rows={2}
                            />
                        ) : (
                            <p className={`text-sm ${theme === 'dark' ? 'text-gray-400' : 'text-gray-600'} italic`}>
                                {tier.description}
                            </p>
                        )}
                    </div>

                    {!isEditing && (
                        <button className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-2 rounded-lg font-medium hover:from-blue-600 hover:to-blue-700 transition-all duration-200 transform hover:scale-[1.02]">
                            Choose Plan
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

function App() {
    const { theme, toggleTheme } = useTheme();
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showPreview, setShowPreview] = useState(false);
    const [editingTier, setEditingTier] = useState(null);
    const [tiers, setTiers] = useState({
        basic: { 
            id: 'basic', 
            name: 'Basic Care', 
            icon: <Star className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : ''}`} />, 
            services: [], 
            frequency: '', 
            responseTime: '', 
            benefits: [], 
            price: { monthly: 0, yearly: 0 }, 
            description: '', 
            color: 'from-blue-500 to-blue-600', 
            isPopular: false 
        },
        professional: { 
            id: 'professional', 
            name: 'Professional Plus', 
            icon: <Award className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : ''}`} />, 
            services: [], 
            frequency: '', 
            responseTime: '', 
            benefits: [], 
            price: { monthly: 0, yearly: 0 }, 
            description: '', 
            color: 'from-purple-500 to-purple-600', 
            isPopular: true 
        },
        elite: { 
            id: 'elite', 
            name: 'Elite Service', 
            icon: <Crown className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : ''}`} />, 
            services: [], 
            frequency: '', 
            responseTime: '', 
            benefits: [], 
            price: { monthly: 0, yearly: 0 }, 
            description: '', 
            color: 'from-amber-500 to-amber-600', 
            isPopular: false 
        },
    });
    const [billingCycle, setBillingCycle] = useState('monthly');

    useEffect(() => {
        const fetchMembershipData = async () => {
            setLoading(true);
            setError(null);
            try {
                const response = await api.get('/serviceman/api/auth/getMembership');
                console.log("Response from getMembership:", response);
                
                if (response.data) {
                    const transformTierData = (tierData) => {
                        return {
                            services: tierData.includeService?.map((service, index) => ({
                                id: `service-${index}`,
                                name: service.service || '',
                                duration: service.time || 'ww',
                                description: service.description || 'bh'
                            })) || [],
                            frequency: tierData.frquency || '',
                            responseTime: tierData.Response || '',
                            benefits: tierData.benefits || [],
                            price: {
                                monthly: tierData.mprice || 0,
                                yearly: tierData.yprice || 0
                            },
                            description: tierData.description || '',
                            save: tierData.savepercentage || 0,
                        };
                    };

                    setTiers({
                        basic: { 
                            ...tiers.basic, 
                            ...transformTierData(response.data.basic || {}), 
                            icon: <Star className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : ''}`} />, 
                            id: 'basic' 
                        },
                        professional: { 
                            ...tiers.professional, 
                            ...transformTierData(response.data.professional || {}), 
                            icon: <Award className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : ''}`} />, 
                            id: 'professional' 
                        },
                        elite: { 
                            ...tiers.elite, 
                            ...transformTierData(response.data.elite || {}), 
                            icon: <Crown className={`w-6 h-6 ${theme === 'dark' ? 'text-gray-300' : ''}`} />, 
                            id: 'elite' 
                        },
                    });
                }
            } catch (err) {
                console.error("Error fetching membership data:", err);
                setError(err.response?.data?.message || err.message || "Failed to fetch membership data");
            } finally {
                setLoading(false);
            }
        };
        fetchMembershipData();
    }, [theme]);

    const handleEdit = (tierId) => {
        setEditingTier(tierId);
        setShowPreview(false);
    };

    const handleSave = (tierId) => {
        setEditingTier(null);
    };

    const updateTier = (tierId, updates) => {
        setTiers(prevTiers => {
            const updatedTier = { ...prevTiers[tierId], ...updates };
            return { ...prevTiers, [tierId]: updatedTier };
        });
    };

    const addService = (tierId) => {
        setTiers(prevTiers => ({
            ...prevTiers,
            [tierId]: {
                ...prevTiers[tierId],
                services: [...prevTiers[tierId].services, { 
                    id: `service-${Date.now()}`, 
                    name: 'New Service', 
                    duration: '1 hour', 
                    description: 'Service description' 
                }],
            },
        }));
    };

    const removeService = (tierId, serviceId) => {
        setTiers(prevTiers => ({
            ...prevTiers,
            [tierId]: { 
                ...prevTiers[tierId], 
                services: prevTiers[tierId].services.filter(s => s.id !== serviceId) 
            },
        }));
    };

    const updateService = (tierId, serviceId, updates) => {
        setTiers(prevTiers => ({
            ...prevTiers,
            [tierId]: {
                ...prevTiers[tierId],
                services: prevTiers[tierId].services.map(service => 
                    service.id === serviceId ? { ...service, ...updates } : service
                ),
            },
        }));
    };

    const addBenefit = (tierId) => {
        setTiers(prevTiers => ({
            ...prevTiers,
            [tierId]: { 
                ...prevTiers[tierId], 
                benefits: [...prevTiers[tierId].benefits, 'New Benefit'] 
            },
        }));
    };

    const removeBenefit = (tierId, index) => {
        setTiers(prevTiers => ({
            ...prevTiers,
            [tierId]: { 
                ...prevTiers[tierId], 
                benefits: prevTiers[tierId].benefits.filter((_, i) => i !== index) 
            },
        }));
    };

    const togglePopular = (tierId) => {
        setTiers(prevTiers => {
            const updatedTiers = {};
            for (const id in prevTiers) {
                updatedTiers[id] = { ...prevTiers[id], isPopular: false };
            }
            return { 
                ...updatedTiers, 
                [tierId]: { ...updatedTiers[tierId], isPopular: !prevTiers[tierId].isPopular } 
            };
        });
    };

    const handleSaveAll = async () => {
        setLoading(true);
        setError(null);
        
        const transformToBackendFormat = (tier) => {
            return {
                includeService: tier.services.map(s => ({ 
                    service: s.name, 
                    time: s.duration, 
                    description: s.description 
                })),
                frquency: tier.frequency,
                Response: tier.responseTime,
                benefits: tier.benefits,
                mprice: tier.price.monthly,
                yprice: tier.price.yearly
            };
        };

        const payload = {
            basic: transformToBackendFormat(tiers.basic),
            professional: transformToBackendFormat(tiers.professional),
            elite: transformToBackendFormat(tiers.elite)
        };

        try {
            const response = await api.put('/serviceman/api/auth/updateMembership', payload);
            
            if (response.data) {
                alert('Changes saved successfully!');
            } else {
                throw new Error("Failed to save changes");
            }
        } catch (err) {
            console.error("Error saving membership data:", err);
            setError(err.response?.data?.message || err.message || "Failed to save changes");
            alert(`Failed to save changes: ${err.response?.data?.message || err.message}`);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
                    <p className={`mt-4 ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>Loading membership data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className={`min-h-screen flex items-center justify-center ${theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'}`}>
                <div className={`text-center max-w-md p-6 ${theme === 'dark' ? 'bg-gray-800' : 'bg-white'} rounded-lg shadow-md`}>
                    <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className={`text-xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-800'} mb-2`}>Error loading membership data</h2>
                    <p className={`${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} mb-4`}>{error}</p>
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
        <div className={`min-h-screen ${theme === 'dark' ? 'bg-gray-900' : 'bg-gradient-to-br from-gray-50 to-gray-100'} py-12 px-4 sm:px-6 lg:px-8`}>
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    
                    <h1 className={`text-4xl font-bold ${theme === 'dark' ? 'text-white' : 'text-gray-900'} mb-4`}>
                        Customize Your Membership Plans
                    </h1>
                    
                    <p className={`mb-4 text-lg ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'} max-w-2xl mx-auto`}>
                        Define and manage your service tiers to provide the perfect options for your clients
                    </p>
                    <h7 className={`text-4xl font-bold text-purple-300 mb-4`}>
                        It Is ShowCase Only To Clients
                    </h7>
                    
                    <div className="flex items-center justify-center space-x-4 mt-6">
                        <button
                            onClick={() => setShowPreview(!showPreview)}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all duration-200 ${
                                showPreview 
                                    ? 'bg-purple-100 text-purple-600' 
                                    : theme === 'dark' 
                                        ? 'bg-gray-800 text-gray-300 hover:bg-gray-700' 
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                            }`}
                        >
                            <Info className="w-5 h-5" />
                            <span>{showPreview ? 'Exit Preview' : 'Preview Mode'}</span>
                        </button>
                        <button
                            className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-all duration-200"
                            onClick={handleSaveAll}
                            disabled={loading}
                        >
                            <Save className="w-5 h-5" />
                            <span>{loading ? 'Saving...' : 'Save All Changes'}</span>
                        </button>
                    </div>
                </div>
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {Object.values(tiers).map(tier => (
                        <TierCard
                            key={tier.id}
                            tier={tier}
                            editingTier={editingTier}
                            handleEdit={handleEdit}
                            handleSave={handleSave}
                            updateTier={updateTier}
                            togglePopular={togglePopular}
                            addService={addService}
                            removeService={removeService}
                            updateService={updateService}
                            addBenefit={addBenefit}
                            removeBenefit={removeBenefit}
                            billingCycle={billingCycle}
                            setBillingCycle={setBillingCycle}
                        />
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;