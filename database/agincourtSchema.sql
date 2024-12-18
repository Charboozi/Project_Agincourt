
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
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to the users
    name VARCHAR(100) NOT NULL,                                             
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP 
    gold INTEGER DEFAULT 0,        
);

CREATE TABLE user_alliances (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to users
    ally_user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to ally users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE castles (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to the users
    name VARCHAR(100) NOT NULL,                                   
    material INTEGER DEFAULT 0,                                                             
    food INTEGER DEFAULT 0,  
    x INTEGER DEFAULT 0,                                                             
    y INTEGER DEFAULT 0,  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    UNIQUE (x, y)
);

CREATE TABLE buildings (
    id SERIAL PRIMARY KEY,
    castle_id INTEGER REFERENCES castles(id) ON DELETE CASCADE, --Link to a castles
    production INTEGER DEFAULT 0,  
    barracks INTEGER DEFAULT 0,
    farm INTEGER DEFAULT 0,
    UNIQUE (castle_id)
);

CREATE TABLE armies (
    id SERIAL PRIMARY KEY,
    castle_id INTEGER REFERENCES castles(id) ON DELETE SET NULL, -- Army can be stationed in a castle
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to users
    cavalry INTEGER DEFAULT 0,                                  
    infantry INTEGER DEFAULT 0,                                
    archers INTEGER DEFAULT 0,                                 
    x INTEGER NOT NULL,                                         
    y INTEGER NOT NULL,                                         
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE warparties (
    id SERIAL PRIMARY KEY,
    created_by INTEGER REFERENCES users(id) ON DELETE CASCADE, --Link to users
    x INTEGER NOT NULL,                                       
    y INTEGER NOT NULL,                                       
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP            
);

CREATE TABLE warparty_members (
    id SERIAL PRIMARY KEY,
    warparty_id INTEGER REFERENCES warparties(id) ON DELETE CASCADE, -- Link to the warparty
    army_id INTEGER REFERENCES armies(id) ON DELETE CASCADE,         -- Link to the army in the warparty
    joined_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP                   
);

