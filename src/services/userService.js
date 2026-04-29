import { apiFetch } from './api';

export const getMyProfile = async () => {
  return apiFetch('/users/me');
};

export const claimDailyBonus = async () => {
  return apiFetch('/users/me/rewards/daily', {
    method: 'POST',
  });
};

export const redeemReward = async (payload) => {
  return apiFetch('/users/me/rewards/redeem', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
