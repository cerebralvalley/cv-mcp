// API
export const API_BASE_URL = 'https://api.cerebralvalley.ai/v1';

// City filter values
export const CITY_FILTERS = {
  SF: 'SF & Bay Area',
  NYC: 'New York City',
  BOSTON: 'Boston',
  SEATTLE: 'Seattle',
  LONDON: 'London',
  REMOTE: 'Remote',
  OTHER: 'Other',
} as const;

// Array form for Zod enum
export const CITY_FILTER_VALUES = Object.values(
  CITY_FILTERS
) as unknown as readonly [
  (typeof CITY_FILTERS)[keyof typeof CITY_FILTERS],
  ...(typeof CITY_FILTERS)[keyof typeof CITY_FILTERS][]
];

// Event type values
export const EVENT_TYPES = {
  HACKATHON: 'HACKATHON',
} as const;

// Array form for Zod enum
export const EVENT_TYPE_VALUES = Object.values(
  EVENT_TYPES
) as unknown as readonly [
  (typeof EVENT_TYPES)[keyof typeof EVENT_TYPES],
  ...(typeof EVENT_TYPES)[keyof typeof EVENT_TYPES][]
];

// Defaults
export const DEFAULT_CITY_FILTER = CITY_FILTERS.SF;
export const DEFAULT_MAX_RESULTS = 20;
