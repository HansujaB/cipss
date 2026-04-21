// fundingService.js
// Handles funding logic — currently uses local state (dummy).
// Replace with Firebase calls when backend is ready.

let fundingLog = []; // In-memory log of all funding transactions

/**
 * Submit a funding amount for a campaign.
 * @param {string} campaignId
 * @param {number} amount - Amount in INR
 * @param {string} donorName
 * @returns {{ success: boolean, message: string, transaction: object }}
 */
export const fundCampaign = (campaignId, amount, donorName = 'Anonymous') => {
  if (!campaignId || !amount || amount <= 0) {
    return { success: false, message: 'Invalid campaign or amount.' };
  }

  const transaction = {
    id: Date.now().toString(),
    campaignId,
    amount: parseFloat(amount),
    donorName,
    timestamp: new Date().toISOString(),
  };

  fundingLog.push(transaction);

  return {
    success: true,
    message: `Thank you, ${donorName}! ₹${amount} funded successfully.`,
    transaction,
  };
};

/**
 * Get all funding transactions for a specific campaign.
 * @param {string} campaignId
 */
export const getFundingByCampaign = (campaignId) => {
  return fundingLog.filter((t) => t.campaignId === campaignId);
};

/**
 * Get total amount raised for a campaign (in-session).
 * @param {string} campaignId
 */
export const getTotalFunded = (campaignId) => {
  return fundingLog
    .filter((t) => t.campaignId === campaignId)
    .reduce((sum, t) => sum + t.amount, 0);
};

/**
 * Get all transactions (for dashboard).
 */
export const getAllTransactions = () => {
  return [...fundingLog];
};