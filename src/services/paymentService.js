// paymentService.js
// Handles real payment integration with backend API

import { API_BASE_URL, getAuthToken } from './api';
// import RazorpayCheckout from 'react-native-razorpay'; // Commented out - not installed

const PLATFORM_FEE_RATE = 0.05; // 5%

/**
 * Create a payment order for a campaign
 * @param {string} campaignId
 * @param {number} amount - Amount in INR
 * @param {string} donorName
 * @param {string} donorEmail
 * @returns {Promise<{order: object, transaction: object} | {development: boolean, mock_verify_url: string}>}
 */
export const createPaymentOrder = async (campaignId, amount, donorName, donorEmail) => {
  try {
    const token = await getAuthToken();
    
    const headers = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    const response = await fetch(`${API_BASE_URL}/payments/create-order`, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        campaign_id: campaignId,
        amount,
        donor_name: donorName,
        donor_email: donorEmail,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to create payment order');
    }

    return data;
  } catch (error) {
    console.error('Create order error:', error);
    throw error;
  }
};

/**
 * Verify Razorpay payment
 * @param {string} orderId - Razorpay order ID
 * @param {string} paymentId - Razorpay payment ID
 * @param {string} signature - Razorpay signature
 * @returns {Promise<{success: boolean, transaction: object}>}
 */
export const verifyPayment = async (orderId, paymentId, signature) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/verify`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        razorpay_order_id: orderId,
        razorpay_payment_id: paymentId,
        razorpay_signature: signature,
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Payment verification failed');
    }

    return data;
  } catch (error) {
    console.error('Verify payment error:', error);
    throw error;
  }
};

/**
 * Mock payment verification (development only)
 * @param {string} transactionId
 * @returns {Promise<{success: boolean, transaction: object}>}
 */
export const mockVerifyPayment = async (transactionId) => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/mock-verify/${transactionId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Mock verification failed');
    }

    return data;
  } catch (error) {
    console.error('Mock verify error:', error);
    throw error;
  }
};

/**
 * Get user's transaction history
 * @returns {Promise<Array>}
 */
export const getTransactionHistory = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/transactions`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch transactions');
    }

    return data.transactions || [];
  } catch (error) {
    console.error('Get transactions error:', error);
    return [];
  }
};

/**
 * Get campaign funding details with donor list
 * @param {string} campaignId
 * @returns {Promise<{campaign: object, donors: Array, totalDonors: number}>}
 */
export const getCampaignFunding = async (campaignId) => {
  try {
    const response = await fetch(`${API_BASE_URL}/payments/campaign/${campaignId}`);
    
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch campaign funding');
    }

    return data;
  } catch (error) {
    console.error('Get campaign funding error:', error);
    return null;
  }
};

/**
 * Get platform payment stats (for companies/admins)
 * @returns {Promise<object>}
 */
export const getPaymentStats = async () => {
  try {
    const token = await getAuthToken();
    
    const response = await fetch(`${API_BASE_URL}/payments/stats`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || 'Failed to fetch payment stats');
    }

    return data;
  } catch (error) {
    console.error('Get payment stats error:', error);
    return null;
  }
};

/**
 * Calculate platform fee for an amount
 * @param {number} amount
 * @returns {{amount: number, platformFee: number, netAmount: number}}
 */
export const calculateFees = (amount) => {
  const platformFee = amount * PLATFORM_FEE_RATE;
  const netAmount = amount - platformFee;
  return {
    amount,
    platformFee: Math.round(platformFee * 100) / 100,
    netAmount: Math.round(netAmount * 100) / 100,
  };
};

/**
 * Process payment with Razorpay checkout
 * @param {object} order - Razorpay order object
 * @param {string} key - Razorpay key
 * @param {object} options - Additional options
 * @returns {Promise<{orderId: string, paymentId: string, signature: string}>}
 */
export const openRazorpayCheckout = (order, key, options = {}) => {
  return new Promise((resolve, reject) => {
    console.log('Opening Razorpay checkout for order:', order.id);
    
    // TODO: Install react-native-razorpay package for production
    // For now, return mock success
    console.warn('Razorpay not installed - returning mock payment success');
    
    setTimeout(() => {
      resolve({
        orderId: order.id,
        paymentId: 'mock_payment_' + Date.now(),
        signature: 'mock_signature',
      });
    }, 1000);

    /* Uncomment when react-native-razorpay is installed:
    const optionsData = {
      description: options.description || 'Payment for campaign',
      image: 'https://example.com/your_logo.png',
      currency: 'INR',
      key: key,
      amount: order.amount,
      name: 'CIPSS',
      order_id: order.id,
      prefill: {
        email: options.email,
        contact: '',
        name: options.name,
      },
      theme: { color: '#1D0A69' },
    };

    RazorpayCheckout.open(optionsData)
      .then((data) => {
        // Success
        resolve({
          orderId: data.razorpay_order_id,
          paymentId: data.razorpay_payment_id,
          signature: data.razorpay_signature,
        });
      })
      .catch((error) => {
        // Handle failure
        console.error('Razorpay error:', error);
        reject(new Error(error.description || error.code || 'Payment failed'));
      });
    */
  });
};
