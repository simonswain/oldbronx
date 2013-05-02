DROP TABLE IF EXISTS users CASCADE;
DROP TABLE IF EXISTS user_priv CASCADE;
DROP TYPE IF EXISTS priv CASCADE;

CREATE TABLE users (
       id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
       username VARCHAR(64),
       password VARCHAR(64),
       email VARCHAR(64) DEFAULT '',
       name_given VARCHAR(64) DEFAULT '',
       name_family VARCHAR(64) DEFAULT ''
);

CREATE TYPE priv AS ENUM('admin');

CREATE TABLE user_priv (
       user_id uuid,
       priv priv
);
