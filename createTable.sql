-- on macOS install postgress via brew
--    brew install postgres
-- on macOS start the server by running
--    brew services start postgresql

-- Execute script via (default port is 5432)
--    psql -U postgres -a -f createTable.sql -p 5432
-- postgres is the default user; change accordingly

-- create user 'user' and give them createdb priveledges
-- change user and password accordingly
CREATE USER "user" WITH PASSWORD 'pass' CREATEDB;

-- create a new database
CREATE DATABASE gbooksqueries;

-- connect to created database
\c gbooksqueries

-- create a new table in the created database
CREATE TABLE bookList (
  ID SERIAL PRIMARY KEY,
  search_term TEXT NOT NULL,
  og_search_timestamp TIMESTAMP,
  gbooks_id TEXT NOT NULL,
  gbooks_etag TEXT NOT NULL,
  title TEXT,
  subtitle TEXT,
  authors TEXT ARRAY,
  volume_description TEXT,
  categories TEXT ARRAY,
  publisher TEXT,
  published_date TEXT,
  volume_language VARCHAR(4),
  print_type VARCHAR(10),
  page_count INT,
  preview_link TEXT,
  cover_image_url TEXT
);