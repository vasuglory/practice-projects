-- structure of table
CREATE TABLE capitals(
  id SERIAL primary key,
  country VARCHAR(50) NOT NULL,
  capital VARCHAR(50) NOT NULL
);