CREATE TABLE IF NOT EXISTS tap_events (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  card_id TEXT NOT NULL,
  tapped_at TEXT NOT NULL DEFAULT (datetime('now')),
  country TEXT,
  colo TEXT
);

CREATE INDEX IF NOT EXISTS idx_tap_events_card_id
  ON tap_events(card_id);

CREATE INDEX IF NOT EXISTS idx_tap_events_tapped_at
  ON tap_events(tapped_at);
