#/bin/bash
clear

# Credentials of User with permisions to create Databases and Users
local_db_user="YOUR_USER_HERE"
local_db_pass="YOUR_PASSWORD_HERE"

if [[ -n $1 ]] && [[ -n $2 ]]; then
    local_db_user=$1
    local_db_pass=$2
fi

if [ "$local_db_user" = "YOUR_USER_HERE" ] && [ "$local_db_pass" = "YOUR_PASSWORD_HERE" ]; then
    echo
    echo "Please edit this file and replace YOUR_USER_HERE and YOUR_PASSWORD_HERE"
    echo "with valid credentials to create Database and Users"
    echo "or use"
    echo "./install.sh user password"
    echo 
else
    # Load Schema from SQL File
    echo "Loading DB Schema"
    echo
    /usr/bin/mysql -u $local_db_user -p$local_db_pass < ./database/db.sql

    echo "Loading User Privileges"
    echo
    # Load User and Password for Schema
    /usr/bin/mysql -u $local_db_user -p$local_db_pass < ./database/usuario.sql

    echo
    echo "Installing Modules"
    /usr/bin/npm i

    echo
    echo "Run: todolists-dev -> This will run the server with the local database for development mode"
    echo
    echo "Run: todolists-pro -> This will run the server with the remote database for production mode"
    echo

fi