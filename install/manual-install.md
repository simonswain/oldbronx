Manual Install

Install some packages
---------------------

```
sudo apt-get install git-core postgresql postgresql-server-dev-9.1 postgresql-contrib-9.1 redis-server libssl-dev build-essential curl screen
```


Set up postgresql auth-option
-----------------------------

```sh
$EDITOR /etc/postgresql/9.1/main/pg_hba.conf
```

Change this line (md5 at the end):

```
local   all         all                          md5
```

```sh
$ sudo service postgresql restart       
```

Create the databases
--------------------

Replace bronx with the name of your app.

```sh
sudo su - postgres
createuser -D -A -P bronx
createdb -O bronx bronx_dev
createdb -O bronx bronx_test
```

enable the uuid extension

```
psql -c psql -d bronx_dev -c 'CREATE EXTENSION "uuid-ossp";'
psql -c psql -d bronx_test -c 'CREATE EXTENSION "uuid-ossp";'
```

Install NVM and NodeJS
----------------------

```
git clone https://github.com/creationix/nvm.git

. ~/nvm/install.sh
```

open a new shell

```
nvm install 0.10
nvm alias default 0.10
```

Confirm it worked

```
node --version
```
