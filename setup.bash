#!/bin/bash

PORT=$0

npm i
npm install jsonwebtoken

cd db
sqlite3 database.db < schema.sql
cd ..

