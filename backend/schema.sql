DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS feedback;

CREATE TABLE users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    password TEXT NOT NULL,
    role TEXT NOT NULL
);

CREATE TABLE feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    sender_id INTEGER NOT NULL,
    receiver_email TEXT NOT NULL,
    message TEXT NOT NULL,
    tag TEXT,
    is_anonymous INTEGER DEFAULT 0,
    acknowledged INTEGER DEFAULT 0,
    timestamp TEXT NOT NULL,
    FOREIGN KEY (sender_id) REFERENCES users (id)
);
