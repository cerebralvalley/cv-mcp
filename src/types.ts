import type { CITY_FILTERS, EVENT_TYPES } from './constants.js';

export type CityFilter = (typeof CITY_FILTERS)[keyof typeof CITY_FILTERS];
export type EventType = (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES];

export interface Media {
  url: string;
  type?: string;
}

export interface CVEvent {
  id: string;
  name: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  url: string;
  type?: string;
  description?: string;
  descriptionSummary?: string;
  venue?: string;
  featured: boolean;
  timeZone?: string;
  media?: Media[];
  cityFilter?: CityFilter;
}

export interface FetchEventsParams {
  featured?: boolean;
  approved?: boolean;
  startDateTime?: string;
  endDateTime?: string;
  cityFilter?: CityFilter;
  type?: string;
}
