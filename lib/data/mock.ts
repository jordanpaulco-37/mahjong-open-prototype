// All mock data for prototype/demo mode.
// Replace imports from this file with real Supabase queries when connecting to the database.

export const DEMO_USER_ID = "user-demo";

export const MOCK_USERS = [
  { id: "user-demo",  full_name: "Jordan Chen",    email: "jordan@themahjongopen.com", role: "admin"  as const },
  { id: "user-2",     full_name: "Morgan Park",     email: "morgan@example.com",        role: "commissioner" as const },
  { id: "user-3",     full_name: "Casey Huang",     email: "casey@example.com",         role: "player" as const },
  { id: "user-4",     full_name: "Alex Kim",        email: "alex@example.com",          role: "player" as const },
  { id: "user-5",     full_name: "Sam Rivera",      email: "sam@example.com",           role: "player" as const },
  { id: "user-6",     full_name: "Taylor Brooks",   email: "taylor@example.com",        role: "player" as const },
  { id: "user-7",     full_name: "Jamie Lee",       email: "jamie@example.com",         role: "player" as const },
  { id: "user-8",     full_name: "Avery Soo",       email: "avery@example.com",         role: "player" as const },
];

export const MOCK_CITIES = [
  { id: "city-la", name: "Los Angeles", state: "CA", slug: "los-angeles", is_active: true,  created_at: "2026-01-15T00:00:00Z" },
  { id: "city-ny", name: "New York",    state: "NY", slug: "new-york",    is_active: true,  created_at: "2026-01-15T00:00:00Z" },
  { id: "city-sf", name: "San Francisco", state: "CA", slug: "san-francisco", is_active: false, created_at: "2026-02-01T00:00:00Z" },
];

export const MOCK_SEASONS = [
  {
    id: "season-la-s26",
    city_id: "city-la",
    name: "Spring 2026",
    year: 2026,
    quarter: 2,
    starts_at: "2026-05-15",
    ends_at: "2026-07-17",
    total_weeks: 8,
    is_active: true,
    created_at: "2026-04-01T00:00:00Z",
    cities: { name: "Los Angeles" },
  },
  {
    id: "season-ny-s26",
    city_id: "city-ny",
    name: "Spring 2026",
    year: 2026,
    quarter: 2,
    starts_at: "2026-05-20",
    ends_at: "2026-07-22",
    total_weeks: 8,
    is_active: true,
    created_at: "2026-04-01T00:00:00Z",
    cities: { name: "New York" },
  },
];

export const MOCK_ADMIN_CONSOLE = {
  metrics: {
    registrationsThisSeries: 92,
    registrationsAllTime: 240,
    activePlayers: 68,
    revenueThisMonth: 6400,
    revenueThisSeries: 12800,
    activeCities: 2,
    tableFillRate: 0.76,
  },
  roles: [
    { role: "Admin", detail: "Full access" },
    { role: "Player", detail: "Portal-only experience" },
  ],
  scopes: [
    { label: "Current scope", value: "All cities" },
    { label: "Your role", value: "Admin" },
    { label: "Preview mode", value: "Console" },
  ],
  topFinisher: {
    player: "Morgan Park",
    week: 4,
    badge: "Top finisher",
  },
};

export const MOCK_MEMBERSHIP = {
  id: "mem-1",
  user_id: "user-demo",
  city_id: "city-la",
  season_id: "season-la-s26",
  status: "active"  as const,
  paid_status: "paid" as const,
  skill_level: "intermediate" as const,
  created_at: "2026-04-20T00:00:00Z",
  cities:  { name: "Los Angeles" },
  seasons: { name: "Spring 2026", total_weeks: 8 },
};

// Current week in the demo is Week 4 (Jun 5–11, 2026)
export const MOCK_TABLES = [
  // ── Week 1 completed ───────────────────────────────────────────────────────
  {
    id: "table-w1-1",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-2",
    week_number: 1, table_date: "2026-05-16", table_time: "18:00:00",
    location_name: "Philz Coffee Los Feliz", location_address: "2001 N Vermont Ave, Los Angeles",
    skill_level: "intermediate" as const, notes: null, status: "completed" as const,
    created_at: "2026-05-10T00:00:00Z",
    table_seats: [
      { id: "seat-w1-1-1", table_id: "table-w1-1", user_id: "user-2",    seat_number: 1, joined_at: "2026-05-10T00:00:00Z", canceled_at: null, profiles: { full_name: "Morgan Park"   } },
      { id: "seat-w1-1-2", table_id: "table-w1-1", user_id: "user-3",    seat_number: 2, joined_at: "2026-05-12T00:00:00Z", canceled_at: null, profiles: { full_name: "Casey Huang"   } },
      { id: "seat-w1-1-3", table_id: "table-w1-1", user_id: "user-demo", seat_number: 3, joined_at: "2026-05-12T00:00:00Z", canceled_at: null, profiles: { full_name: "Jordan Chen"   } },
      { id: "seat-w1-1-4", table_id: "table-w1-1", user_id: "user-4",    seat_number: 4, joined_at: "2026-05-13T00:00:00Z", canceled_at: null, profiles: { full_name: "Alex Kim"      } },
    ],
  },
  {
    id: "table-w1-2",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-5",
    week_number: 1, table_date: "2026-05-18", table_time: "14:00:00",
    location_name: "HomeHome Los Angeles", location_address: "1760 Hillhurst Ave, Los Angeles",
    skill_level: "beginner" as const, notes: null, status: "completed" as const,
    created_at: "2026-05-11T00:00:00Z",
    table_seats: [
      { id: "seat-w1-2-1", table_id: "table-w1-2", user_id: "user-5",  seat_number: 1, joined_at: "2026-05-11T00:00:00Z", canceled_at: null, profiles: { full_name: "Sam Rivera"    } },
      { id: "seat-w1-2-2", table_id: "table-w1-2", user_id: "user-6",  seat_number: 2, joined_at: "2026-05-13T00:00:00Z", canceled_at: null, profiles: { full_name: "Taylor Brooks" } },
      { id: "seat-w1-2-3", table_id: "table-w1-2", user_id: "user-7",  seat_number: 3, joined_at: "2026-05-14T00:00:00Z", canceled_at: null, profiles: { full_name: "Jamie Lee"     } },
      { id: "seat-w1-2-4", table_id: "table-w1-2", user_id: "user-8",  seat_number: 4, joined_at: "2026-05-14T00:00:00Z", canceled_at: null, profiles: { full_name: "Avery Soo"     } },
    ],
  },
  // ── Week 2 completed ───────────────────────────────────────────────────────
  {
    id: "table-w2-1",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-3",
    week_number: 2, table_date: "2026-05-23", table_time: "19:00:00",
    location_name: "Verve Coffee Silver Lake", location_address: "3826 Sunset Dr, Los Angeles",
    skill_level: "intermediate" as const, notes: null, status: "completed" as const,
    created_at: "2026-05-17T00:00:00Z",
    table_seats: [
      { id: "seat-w2-1-1", table_id: "table-w2-1", user_id: "user-3",  seat_number: 1, joined_at: "2026-05-17T00:00:00Z", canceled_at: null, profiles: { full_name: "Casey Huang"   } },
      { id: "seat-w2-1-2", table_id: "table-w2-1", user_id: "user-2",  seat_number: 2, joined_at: "2026-05-19T00:00:00Z", canceled_at: null, profiles: { full_name: "Morgan Park"   } },
      { id: "seat-w2-1-3", table_id: "table-w2-1", user_id: "user-5",  seat_number: 3, joined_at: "2026-05-19T00:00:00Z", canceled_at: null, profiles: { full_name: "Sam Rivera"    } },
      { id: "seat-w2-1-4", table_id: "table-w2-1", user_id: "user-6",  seat_number: 4, joined_at: "2026-05-20T00:00:00Z", canceled_at: null, profiles: { full_name: "Taylor Brooks" } },
    ],
  },
  {
    id: "table-w2-2",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-demo",
    week_number: 2, table_date: "2026-05-25", table_time: "13:00:00",
    location_name: "Gjusta Bakery Venice", location_address: "516 Rose Ave, Venice",
    skill_level: "intermediate" as const, notes: "Park on Rose — easy street parking on Sundays.", status: "completed" as const,
    created_at: "2026-05-18T00:00:00Z",
    table_seats: [
      { id: "seat-w2-2-1", table_id: "table-w2-2", user_id: "user-demo", seat_number: 1, joined_at: "2026-05-18T00:00:00Z", canceled_at: null, profiles: { full_name: "Jordan Chen"   } },
      { id: "seat-w2-2-2", table_id: "table-w2-2", user_id: "user-4",    seat_number: 2, joined_at: "2026-05-20T00:00:00Z", canceled_at: null, profiles: { full_name: "Alex Kim"      } },
      { id: "seat-w2-2-3", table_id: "table-w2-2", user_id: "user-7",    seat_number: 3, joined_at: "2026-05-21T00:00:00Z", canceled_at: null, profiles: { full_name: "Jamie Lee"     } },
      { id: "seat-w2-2-4", table_id: "table-w2-2", user_id: "user-8",    seat_number: 4, joined_at: "2026-05-21T00:00:00Z", canceled_at: null, profiles: { full_name: "Avery Soo"     } },
    ],
  },
  // ── Week 3 completed ───────────────────────────────────────────────────────
  {
    id: "table-w3-1",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-2",
    week_number: 3, table_date: "2026-05-30", table_time: "18:30:00",
    location_name: "Erewhon Culver City", location_address: "9349 Venice Blvd, Culver City",
    skill_level: "advanced" as const, notes: null, status: "completed" as const,
    created_at: "2026-05-24T00:00:00Z",
    table_seats: [
      { id: "seat-w3-1-1", table_id: "table-w3-1", user_id: "user-2",  seat_number: 1, joined_at: "2026-05-24T00:00:00Z", canceled_at: null, profiles: { full_name: "Morgan Park"   } },
      { id: "seat-w3-1-2", table_id: "table-w3-1", user_id: "user-4",  seat_number: 2, joined_at: "2026-05-26T00:00:00Z", canceled_at: null, profiles: { full_name: "Alex Kim"      } },
      { id: "seat-w3-1-3", table_id: "table-w3-1", user_id: "user-5",  seat_number: 3, joined_at: "2026-05-26T00:00:00Z", canceled_at: null, profiles: { full_name: "Sam Rivera"    } },
      { id: "seat-w3-1-4", table_id: "table-w3-1", user_id: "user-6",  seat_number: 4, joined_at: "2026-05-27T00:00:00Z", canceled_at: null, profiles: { full_name: "Taylor Brooks" } },
    ],
  },
  {
    id: "table-w3-2",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-demo",
    week_number: 3, table_date: "2026-06-01", table_time: "15:00:00",
    location_name: "Blue Bottle Coffee Pasadena", location_address: "33 E Holly St, Pasadena",
    skill_level: "intermediate" as const, notes: null, status: "completed" as const,
    created_at: "2026-05-25T00:00:00Z",
    table_seats: [
      { id: "seat-w3-2-1", table_id: "table-w3-2", user_id: "user-demo", seat_number: 1, joined_at: "2026-05-25T00:00:00Z", canceled_at: null, profiles: { full_name: "Jordan Chen"   } },
      { id: "seat-w3-2-2", table_id: "table-w3-2", user_id: "user-3",    seat_number: 2, joined_at: "2026-05-27T00:00:00Z", canceled_at: null, profiles: { full_name: "Casey Huang"   } },
      { id: "seat-w3-2-3", table_id: "table-w3-2", user_id: "user-7",    seat_number: 3, joined_at: "2026-05-27T00:00:00Z", canceled_at: null, profiles: { full_name: "Jamie Lee"     } },
      { id: "seat-w3-2-4", table_id: "table-w3-2", user_id: "user-8",    seat_number: 4, joined_at: "2026-05-28T00:00:00Z", canceled_at: null, profiles: { full_name: "Avery Soo"     } },
    ],
  },
  // ── Week 4 open (current week) ─────────────────────────────────────────────
  {
    id: "table-w4-1",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-demo",
    week_number: 4, table_date: "2026-06-09", table_time: "19:00:00",
    location_name: "Philz Coffee Los Feliz", location_address: "2001 N Vermont Ave, Los Angeles",
    skill_level: "intermediate" as const, notes: "Bring your own tiles if you have them — I have a backup set.", status: "open" as const,
    created_at: "2026-06-01T00:00:00Z",
    table_seats: [
      { id: "seat-w4-1-1", table_id: "table-w4-1", user_id: "user-demo", seat_number: 1, joined_at: "2026-06-01T00:00:00Z", canceled_at: null, profiles: { full_name: "Jordan Chen"   } },
      { id: "seat-w4-1-2", table_id: "table-w4-1", user_id: "user-2",    seat_number: 2, joined_at: "2026-06-02T00:00:00Z", canceled_at: null, profiles: { full_name: "Morgan Park"   } },
      { id: "seat-w4-1-3", table_id: "table-w4-1", user_id: "user-4",    seat_number: 3, joined_at: "2026-06-03T00:00:00Z", canceled_at: null, profiles: { full_name: "Alex Kim"      } },
    ],
  },
  {
    id: "table-w4-2",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-5",
    week_number: 4, table_date: "2026-06-10", table_time: "14:00:00",
    location_name: "HomeHome Los Angeles", location_address: "1760 Hillhurst Ave, Los Angeles",
    skill_level: "beginner" as const, notes: null, status: "open" as const,
    created_at: "2026-06-02T00:00:00Z",
    table_seats: [
      { id: "seat-w4-2-1", table_id: "table-w4-2", user_id: "user-5",  seat_number: 1, joined_at: "2026-06-02T00:00:00Z", canceled_at: null, profiles: { full_name: "Sam Rivera"    } },
      { id: "seat-w4-2-2", table_id: "table-w4-2", user_id: "user-6",  seat_number: 2, joined_at: "2026-06-04T00:00:00Z", canceled_at: null, profiles: { full_name: "Taylor Brooks" } },
    ],
  },
  {
    id: "table-w4-3",
    city_id: "city-la", season_id: "season-la-s26", creator_id: "user-7",
    week_number: 4, table_date: "2026-06-11", table_time: "11:00:00",
    location_name: "Verve Coffee Silver Lake", location_address: "3826 Sunset Dr, Los Angeles",
    skill_level: "beginner" as const, notes: "Great for newer players — happy to walk through rules!", status: "open" as const,
    created_at: "2026-06-03T00:00:00Z",
    table_seats: [
      { id: "seat-w4-3-1", table_id: "table-w4-3", user_id: "user-7",  seat_number: 1, joined_at: "2026-06-03T00:00:00Z", canceled_at: null, profiles: { full_name: "Jamie Lee"     } },
    ],
  },
];

export const MOCK_STANDINGS = [
  { id: "st-1", city_id: "city-la", season_id: "season-la-s26", user_id: "user-2",    total_points: 290, total_wins: 11, tables_played: 3, rank: 1, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Morgan Park"   } },
  { id: "st-2", city_id: "city-la", season_id: "season-la-s26", user_id: "user-5",    total_points: 242, total_wins: 9,  tables_played: 3, rank: 2, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Sam Rivera"    } },
  { id: "st-3", city_id: "city-la", season_id: "season-la-s26", user_id: "user-demo", total_points: 220, total_wins: 8,  tables_played: 2, rank: 3, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Jordan Chen"   } },
  { id: "st-4", city_id: "city-la", season_id: "season-la-s26", user_id: "user-4",    total_points: 195, total_wins: 7,  tables_played: 3, rank: 4, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Alex Kim"      } },
  { id: "st-5", city_id: "city-la", season_id: "season-la-s26", user_id: "user-3",    total_points: 180, total_wins: 6,  tables_played: 2, rank: 5, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Casey Huang"   } },
  { id: "st-6", city_id: "city-la", season_id: "season-la-s26", user_id: "user-6",    total_points: 155, total_wins: 5,  tables_played: 3, rank: 6, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Taylor Brooks" } },
  { id: "st-7", city_id: "city-la", season_id: "season-la-s26", user_id: "user-7",    total_points: 120, total_wins: 4,  tables_played: 2, rank: 7, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Jamie Lee"     } },
  { id: "st-8", city_id: "city-la", season_id: "season-la-s26", user_id: "user-8",    total_points: 90,  total_wins: 3,  tables_played: 2, rank: 8, updated_at: "2026-06-04T00:00:00Z", profiles: { full_name: "Avery Soo"     } },
];

export const MOCK_ANNOUNCEMENTS = [
  {
    id: "ann-1",
    city_id: "city-la",
    season_id: "season-la-s26",
    title: "Week 4 tables are open — join or create yours!",
    body: "Week 4 of Spring 2026 is here. Three tables are already posted for the Los Angeles city. Grab a seat before they fill up, or create your own and pick your spot.",
    pinned: true,
    created_by: "admin-1",
    created_at: "2026-06-05T10:00:00Z",
    profiles: { full_name: "League Admin" },
  },
  {
    id: "ann-2",
    city_id: null,
    season_id: null,
    title: "Spring Soirée — save the date: July 17",
    body: "Our season finale is on July 17. Final standings will be revealed, season awards announced, and the city champion crowned. More details coming soon. Block your calendar!",
    pinned: false,
    created_by: "admin-1",
    created_at: "2026-05-28T09:00:00Z",
    profiles: { full_name: "League Admin" },
  },
  {
    id: "ann-3",
    city_id: "city-la",
    season_id: "season-la-s26",
    title: "Week 3 wrap-up",
    body: "Great play this week, everyone. Two tables have submitted scores — they'll appear in standings once approved, typically within 24 hours. Week 3 results are looking competitive!",
    pinned: false,
    created_by: "admin-1",
    created_at: "2026-06-04T18:00:00Z",
    profiles: { full_name: "League Admin" },
  },
];

export const MOCK_SCORE_SUBMISSIONS = [
  {
    id: "score-1",
    table_id: "table-w1-1",
    submitted_by: "user-2",
    status: "approved" as const,
    admin_notes: null,
    created_at: "2026-05-16T22:00:00Z",
    approved_at: "2026-05-17T10:00:00Z",
    approved_by: "admin-1",
    scramble_tables: {
      week_number: 1, table_date: "2026-05-16", location_name: "Philz Coffee Los Feliz",
      city_id: "city-la", cities: { name: "Los Angeles" },
    },
    submitted_by_profile: { full_name: "Morgan Park" },
    score_submission_players: [
      { user_id: "user-2",    wins: 3, points: 96, profiles: { full_name: "Morgan Park"   } },
      { user_id: "user-3",    wins: 2, points: 72, profiles: { full_name: "Casey Huang"   } },
      { user_id: "user-demo", wins: 2, points: 68, profiles: { full_name: "Jordan Chen"   } },
      { user_id: "user-4",    wins: 1, points: 48, profiles: { full_name: "Alex Kim"      } },
    ],
  },
  {
    id: "score-2",
    table_id: "table-w1-2",
    submitted_by: "user-5",
    status: "approved" as const,
    admin_notes: null,
    created_at: "2026-05-18T20:00:00Z",
    approved_at: "2026-05-19T09:00:00Z",
    approved_by: "admin-1",
    scramble_tables: {
      week_number: 1, table_date: "2026-05-18", location_name: "HomeHome Los Angeles",
      city_id: "city-la", cities: { name: "Los Angeles" },
    },
    submitted_by_profile: { full_name: "Sam Rivera" },
    score_submission_players: [
      { user_id: "user-5",  wins: 3, points: 92, profiles: { full_name: "Sam Rivera"    } },
      { user_id: "user-6",  wins: 2, points: 70, profiles: { full_name: "Taylor Brooks" } },
      { user_id: "user-7",  wins: 1, points: 52, profiles: { full_name: "Jamie Lee"     } },
      { user_id: "user-8",  wins: 0, points: 38, profiles: { full_name: "Avery Soo"     } },
    ],
  },
  {
    id: "score-3",
    table_id: "table-w2-1",
    submitted_by: "user-3",
    status: "approved" as const,
    admin_notes: null,
    created_at: "2026-05-23T22:00:00Z",
    approved_at: "2026-05-24T11:00:00Z",
    approved_by: "admin-1",
    scramble_tables: {
      week_number: 2, table_date: "2026-05-23", location_name: "Verve Coffee Silver Lake",
      city_id: "city-la", cities: { name: "Los Angeles" },
    },
    submitted_by_profile: { full_name: "Casey Huang" },
    score_submission_players: [
      { user_id: "user-3",  wins: 3, points: 94, profiles: { full_name: "Casey Huang"   } },
      { user_id: "user-2",  wins: 2, points: 78, profiles: { full_name: "Morgan Park"   } },
      { user_id: "user-5",  wins: 1, points: 54, profiles: { full_name: "Sam Rivera"    } },
      { user_id: "user-6",  wins: 0, points: 36, profiles: { full_name: "Taylor Brooks" } },
    ],
  },
  {
    id: "score-4",
    table_id: "table-w2-2",
    submitted_by: "user-demo",
    status: "approved" as const,
    admin_notes: null,
    created_at: "2026-05-25T18:00:00Z",
    approved_at: "2026-05-26T09:00:00Z",
    approved_by: "admin-1",
    scramble_tables: {
      week_number: 2, table_date: "2026-05-25", location_name: "Gjusta Bakery Venice",
      city_id: "city-la", cities: { name: "Los Angeles" },
    },
    submitted_by_profile: { full_name: "Jordan Chen" },
    score_submission_players: [
      { user_id: "user-demo", wins: 3, points: 96, profiles: { full_name: "Jordan Chen"   } },
      { user_id: "user-4",    wins: 2, points: 74, profiles: { full_name: "Alex Kim"      } },
      { user_id: "user-7",    wins: 1, points: 52, profiles: { full_name: "Jamie Lee"     } },
      { user_id: "user-8",    wins: 0, points: 40, profiles: { full_name: "Avery Soo"     } },
    ],
  },
  {
    id: "score-5",
    table_id: "table-w3-1",
    submitted_by: "user-2",
    status: "approved" as const,
    admin_notes: null,
    created_at: "2026-05-30T22:00:00Z",
    approved_at: "2026-05-31T10:00:00Z",
    approved_by: "admin-1",
    scramble_tables: {
      week_number: 3, table_date: "2026-05-30", location_name: "Erewhon Culver City",
      city_id: "city-la", cities: { name: "Los Angeles" },
    },
    submitted_by_profile: { full_name: "Morgan Park" },
    score_submission_players: [
      { user_id: "user-2",  wins: 3, points: 100, profiles: { full_name: "Morgan Park"   } },
      { user_id: "user-4",  wins: 2, points: 76,  profiles: { full_name: "Alex Kim"      } },
      { user_id: "user-5",  wins: 2, points: 68,  profiles: { full_name: "Sam Rivera"    } },
      { user_id: "user-6",  wins: 0, points: 40,  profiles: { full_name: "Taylor Brooks" } },
    ],
  },
  {
    id: "score-6",
    table_id: "table-w3-2",
    submitted_by: "user-demo",
    status: "pending" as const,
    admin_notes: null,
    created_at: "2026-06-01T20:00:00Z",
    approved_at: null,
    approved_by: null,
    scramble_tables: {
      week_number: 3, table_date: "2026-06-01", location_name: "Blue Bottle Coffee Pasadena",
      city_id: "city-la", cities: { name: "Los Angeles" },
    },
    submitted_by_profile: { full_name: "Jordan Chen" },
    score_submission_players: [
      { user_id: "user-demo", wins: 2, points: 84, profiles: { full_name: "Jordan Chen"   } },
      { user_id: "user-3",    wins: 2, points: 80, profiles: { full_name: "Casey Huang"   } },
      { user_id: "user-7",    wins: 1, points: 52, profiles: { full_name: "Jamie Lee"     } },
      { user_id: "user-8",    wins: 0, points: 36, profiles: { full_name: "Avery Soo"     } },
    ],
  },
];

export const MOCK_PLAYERS = MOCK_USERS.map((u) => ({
  id: `mem-${u.id}`,
  status: "active" as const,
  paid_status: "paid" as const,
  skill_level: "intermediate" as const,
  created_at: "2026-04-20T00:00:00Z",
  profiles: { id: u.id, full_name: u.full_name, email: u.email, role: u.role },
  cities: { name: "Los Angeles" },
  seasons: { name: "Spring 2026" },
}));
