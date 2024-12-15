
DROP TABLE IF EXISTS buildings;
DROP TABLE IF EXISTS castles;
DROP TABLE IF EXISTS kingdoms;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    balance DECIMAL DEFAULT 0
); 

CREATE TABLE kingdoms (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to the user
    name VARCHAR(100) NOT NULL,                                             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP         
);

CREATE TABLE castles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to the user
    name VARCHAR(100) NOT NULL,                                   
    gold INTEGER DEFAULT 0,
    material INTEGER DEFAULT 0,                                                             
    food INTEGER DEFAULT 0,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    castle_id INTEGER REFERENCES castles(id) ON DELETE CASCADE, --Link to a castle
    production INTEGER DEFAULT 0,  
    barracks INTEGER DEFAULT 0,
    farm INTEGER DEFAULT 0,
    UNIQUE (castle_id)
);

