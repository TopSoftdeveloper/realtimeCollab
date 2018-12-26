# Collab Deployment Guide using Node v8
> * This doc contains all necessary steps to deploy nuscollab in CentOS7 Environment
> * All variables below that should be substituted are represent by `{variable}`

#### 1. Install dependencies
###### (Make sure your account has sudo access)
* Login:
  * `ssh {user}@nuscollab-i.comp.nus.edu.sg`
* install Git:
  * `sudo yum install git`

#### 2.1 Install NPM
  * `sudo yum install epel-release`
  * `sudo yum install nodejs`
  * Find More details [here](https://www.digitalocean.com/community/tutorials/how-to-install-node-js-on-a-centos-7-server#InstallNodefromtheEPELRepository)

#### 2.2 Install NVM and install Node v8 & NPM v5
* To install `nvm` click [HERE](https://gist.github.com/d2s/372b5943bce17b964a79)

#### 3. Install MariaDB & Configuration
  * install:
    * `sudo yum install MariaDB-server MariaDB-client`
  * If NOT WORKING, try [THIS](https://www.digitalocean.com/community/tutorials/how-to-install-mariadb-on-centos-7)

  * start service:
    * `sudo systemctl enable mariadb`
    * `sudo systemctl start mariadb`

  * connect to root account:
    * `mysql -u root`
  * use the following commands to reset root’s password. Replace {password} with a strong password
    * `> use mysql;`
    * `> update user SET PASSWORD=PASSWORD({password}) WHERE USER='root';`
    * `> flush privileges;`
    * `> exit;`
  * login to root again:
    * `mysql -u root -p{password}`
  * create database:
    * `> CREATE DATABASE collab;`
    * `> CREATE DATABASE collab_logging;`
    * `> CREATE DATABASE collab_test;`
    * `> CREATE DATABASE collab_logging_test;`
  * Find More details [here](https://www.linode.com/docs/databases/mariadb/how-to-install-mariadb-on-centos-7)
  * Install on mac os x:
    * `brew install mariadb`
    * `brew services start mariadb`

#### 4. Install Apache Server
  * install:
    * `sudo yum -y install httpd`
  * allow apache through the firewall:
    * `sudo firewall-cmd --permanent --add-port=80/tcp`
    * `sudo firewall-cmd --permanent --add-port=8080/tcp`
    * `sudo firewall-cmd --reload`
  * start on boot:
      * `sudo systemctl start httpd`
      * `sudo systemctl enable httpd`

  * Find More details [here](https://www.liquidweb.com/kb/how-to-install-apache-on-centos-7/)

#### 5. Resolve NPM local dependencies
  * clone repos:
    * [collab](https://github.com/collab-tools/collab): `git clone https://github.com/collab-tools/collab`
    * [collab-db-logging](https://github.com/collab-tools/collab-db-logging): `git clone https://github.com/collab-tools/collab-db-logging`
    * [collab-db-application](https://github.com/collab-tools/collab-db-application): `git clone https://github.com/collab-tools/collab-db-application`
    * [collab-analytics](https://github.com/collab-tools/collab-analytics): `git clone https://github.com/collab-tools/collab-analytics`
  * npm install & link on collab-db-logging and collab-db-application:
    * `(collab-db-logging) $ sudo npm install`
    * `(collab-db-logging) $ sudo npm link`
    * `(collab-db-application) $ sudo npm install`
    * `(collab-db-application) $ sudo npm link`
  * npm install & link on collab-analytics:
    * `(collab-analytics) $ sudo npm link collab-db-logging collab-db-application`
    * `(collab-analytics) $ sudo npm install`
    * `(collab-analytics) $ sudo npm link`
  * npm install & link on collab:
    * `(collab) $ sudo npm link collab-analytics collab-db-application`
    * `(collab) $ sudo npm install`
  * Find more details about npm link [here](https://docs.npmjs.com/cli/link)

#### 6. Local Configuration
  * cd to config folder:
    * `(collab) $ cd config`
  * create *local-production.json* following this [template](https://github.com/collab-tools/collab/blob/master/config/_local-template.json)

#### 7. Deployment
  * Build project
    * `sudo npm run build`
  * Start
    * `sudo nohup npm run start  >app.log 2>&1 &`
  * View log info in real-time  
    * `tail -f app.log`

#### APPENDIX: Database Backup
  * set password config for *mysqldump* in */etc/my.cnf*
    ```
    [mysqldump]
    user=root
    password={password}
    ```
  * create script like this
  ```
  DB_SAVE_PATH=/sites/DB/backup/
  DATE=`date +"%d-%m-%y"`
  DB_ADM=root
  MAIL=your@email.com

  cd $DB_SAVE_PATH

  mysqldump -u $DB_ADM --all-databases | gzip -9 > all-databases-$DATE.sql.gz
  printf "MariaDB databases backup complete\n\n`ls -lth`" | mail -s "MariaDB daily  backup -- $DATE" $MAIL
  ```
  * add cron job:
    * `sudo crontab -e`
    ```
    # Daily MariaDB backup
    30 2 * * *  /path/to/the/script.sh
    ```
  * Find more details [here](https://hacklog.mu/database-daily-backup/)
