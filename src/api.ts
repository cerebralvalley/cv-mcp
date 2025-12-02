import type { CVEvent, FetchEventsParams } from './types.js';
import { API_BASE_URL, DEFAULT_CITY_FILTER } from './constants.js';

export async function fetchEvents(
  params: FetchEventsParams = {}
): Promise<CVEvent[]> {
  const url = new URL(`${API_BASE_URL}/public/event/pull`);

  // Default to approved events in SF & Bay Area
  url.searchParams.set('approved', String(params.approved ?? true));
  url.searchParams.set('cityFilter', params.cityFilter ?? DEFAULT_CITY_FILTER);

  if (params.featured !== undefined) {
    url.searchParams.set('featured', String(params.featured));
  }
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

export async function fetchEventById(id: string): Promise<CVEvent | null> {
  const events = await fetchEvents({ startDateTime: new Date().toISOString() });
  return events.find((e) => e.id === id) ?? null;
}
