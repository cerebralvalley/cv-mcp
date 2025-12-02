import type { CVEvent, FetchEventsParams } from './types.js';
import { API_BASE_URL, DEFAULT_CITY_FILTER } from './constants.js';

export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<CVEvent[]> {
  const url = new URL(`${API_BASE_URL}/public/event/pull`);

  // Default to approved, featured events in SF & Bay Area
  url.searchParams.set('approved', String(params.approved ?? true));
  url.searchParams.set('featured', String(params.featured ?? true));
  url.searchParams.set('cityFilter', params.cityFilter ?? DEFAULT_CITY_FILTER);
  if (params.startDateTime) {
    url.searchParams.set('startDateTime', params.startDateTime);
  }
  if (params.endDateTime) {
    url.searchParams.set('endDateTime', params.endDateTime);
  }
  if (params.type) {
    url.searchParams.set('type', params.type);
  }

  const res = await fetch(url.toString());

  if (!res.ok) {
    throw new Error(`API error: ${res.status} ${res.statusText}`);
  }

  const data = await res.json();
  return data as CVEvent[];
}

export interface SubscribeResult {
  success: boolean;
  message: string;
}

export async function subscribeToNewsletter(
  email: string
): Promise<SubscribeResult> {
  const response = await fetch(`${API_BASE_URL}/public/beehiiv/subscribe`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email }),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.detail || 'Subscription failed',
    };
  }

  return {
    success: true,
    message: data.detail || `Subscribed ${email} to Cerebral Valley newsletter`,
  };
}

export interface EventSubmitParams {
  submitterEmail: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  url: string;
  featureRequested: boolean;
  cvEventsPlatformInfoRequested: boolean;
}

export interface SubmitResult {
  success: boolean;
  message: string;
}

export async function submitEvent(
  params: EventSubmitParams
): Promise<SubmitResult> {
  const response = await fetch(`${API_BASE_URL}/public/event/submit`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  });

  const data = await response.json();

  if (!response.ok) {
    return {
      success: false,
      message: data.detail || 'Event submission failed',
    };
  }

  return {
    success: true,
    message: data.detail || 'Event submitted successfully!',
  };
}
