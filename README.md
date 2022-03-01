# todolists

Application allows to create an acoount using a valid email address and password.
Once system is loaded you can register yourself.

System is deployed live in 

https://todolists-ensonverls.herokuapp.com

Live Version is served by
    * https://www.heroku.com/
    * https://remotemysql.com


Technologies
    * Node v16.13.2
    * Express v4.17.3
    * MariaDB v10.7.3-1

Once code is downloaded there are three bash scripts

install.sh This will load the DB schema into de local mysql server. For this you need to provide USER and PASSWORD valid and with privilieges for this operations.
You can edit the file and replace them or pass them in the command line like:

./install.sh YOUR_USER YOUR_PASSWORD

This installation besides creatian the local DB schema will create and special user and password.

Then will install npm dependencies, npm must be available on your system.

When installation is finished you will have access development and production scripts

todolists-dev.sh Will run the server locally with the local database enabled which was setted up during install.sh script

todolists-pro.sh Will run the server locally with the remote database enabled.


