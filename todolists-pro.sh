#/bin/bash
clear

echo "Production Mode: Remote DB"
echo

echo "Loading Database Credentials"
cp src/keys-remote.js src/keys.js

export PORT=5000

npm start

