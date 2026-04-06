import type { B2bLead, B2bLeadResponse } from './types';

export const LEAD_THANK_YOU_STORAGE_KEY = 'b2bLeadThankYou';

export type ThankYouPayload = {
  leadData: B2bLead;
  savedResponse?: B2bLeadResponse;
};
