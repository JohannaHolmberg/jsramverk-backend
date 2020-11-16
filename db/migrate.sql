CREATE TABLE IF NOT EXISTS users (
    email VARCHAR(255) NOT NULL,
    password VARCHAR(60) NOT NULL,
    UNIQUE(email)
);

CREATE TABLE IF NOT EXISTS reports (
    kmom VARCHAR(255) NOT NULL,
    report TEXT NOT NULL,
    UNIQUE(kmom)
);
