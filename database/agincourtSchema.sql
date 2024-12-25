DROP TABLE IF EXISTS army_companies;
DROP TABLE IF EXISTS user_alliances;
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

CREATE TABLE alliances (
    id SERIAL PRIMARY KEY,
    alliance_name VARCHAR(100) NOT NULL, 
    leader_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to users
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alliance_members (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE, -- Link to users
    alliance_id INTEGER REFERENCES alliances(id) ON DELETE CASCADE, -- Link to alliances
    rank INTEGER DEFAULT 1,
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

CREATE TABLE army_companies (
    id SERIAL PRIMARY KEY,
    main_army_id INTEGER REFERENCES armies(id) ON DELETE CASCADE, -- link to main army
    allied_army_id INTEGER REFERENCES armies(id) ON DELETE CASCADE, -- link to allied army
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP     
);

