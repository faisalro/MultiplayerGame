--- load with 
--- sqlite3 database.db < schema.sql

drop table Users;

CREATE TABLE Users (
	Username VARCHAR(20) PRIMARY KEY,
	Email VARCHAR(20) NOT NULL,
	Password VARCHAR(20) NOT NULL,
	Score INT DEFAULT 0
);
