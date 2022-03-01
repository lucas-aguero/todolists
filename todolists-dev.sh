#/bin/bash
clear

echo "Development Mode: Local DB"
echo

echo "Loading Database Credentials"
cp src/keys-local.js src/keys.js


export PORT=3000

npm run dev


