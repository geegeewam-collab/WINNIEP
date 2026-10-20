import type { Availability, FulfilmentStatus, PaymentStatus } from './types';

export const AVAILABILITY_LABEL: Record<Availability, string> = {
  available: 'In stock',
  confirmation_required: 'Supplier confirmation',
  unavailable: 'Out of stock',
};

export const AVAILABILITY_BADGE: Record<Availability, string> = {
  available: 'bg-green-100 text-green-800',
  confirmation_required: 'bg-amber-100 text-amber-800',
  unavailable: 'bg-red-100 text-red-800',
};

export const FULFILMENT_LABEL: Record<FulfilmentStatus, string> = {
  awaiting_availability: 'Awaiting availability check',
  awaiting_delivery_quote: 'Awaiting delivery quote',
  awaiting_customer_approval: 'Awaiting customer approval',
  awaiting_payment: 'Awaiting payment',
  processing: 'Processing',
  dispatched: 'Dispatched',
  delivered: 'Delivered',
  cancelled: 'Cancelled',
};

export const FULFILMENT_BADGE: Record<FulfilmentStatus, string> = {
  awaiting_availability: 'bg-amber-100 text-amber-800',
  awaiting_delivery_quote: 'bg-amber-100 text-amber-800',
  awaiting_customer_approval: 'bg-blue-100 text-blue-800',
  awaiting_payment: 'bg-purple-100 text-purple-800',
  processing: 'bg-sky-100 text-sky-800',
  dispatched: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-gray-200 text-gray-600',
};

export const PAYMENT_LABEL: Record<PaymentStatus, string> = {
  not_started: 'Not started',
  pending: 'Pending',
  successful: 'Paid',
  failed: 'Failed',
  cancelled: 'Cancelled',
  expired: 'Expired',
};

export const PAYMENT_BADGE: Record<PaymentStatus, string> = {
  not_started: 'bg-gray-100 text-gray-600',
  pending: 'bg-amber-100 text-amber-800',
  successful: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  cancelled: 'bg-gray-200 text-gray-600',
  expired: 'bg-gray-200 text-gray-600',
};

/** Orders that need the shop owner to do something. */
export const NEEDS_ACTION: FulfilmentStatus[] = ['awaiting_availability', 'awaiting_delivery_quote'];
