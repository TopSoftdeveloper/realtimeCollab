# Collab Setup Guide for Ubuntu 16.04LTS

This guide will assist you in setting up Collab in your Ubuntu environment.

##### 1. Install Git
To install and configure git follow the below steps or refer the [Ubuntu Git Installation Guide](https://help.ubuntu.com/lts/serverguide/git.html):
* Run following in terminal to install git :
  ```sh
  $ sudo apt-get install git
  ```
* Configure git:
  ```sh
  $ git config --global user.email "you@example.com"
  $ git config --global user.name "Your Name"
  ```
##### 2. Install NodeJS and npm
Excute the following if NodeJS and npm are not already installed:
```sh
$ sudo apt-get install nodejs-legacy
$ sudo apt-get install npm
```
##### 3. Install Apache2
Excute the following if Apache2 is not already installed:
  ```sh
  $ sudo apt-get install apache2
  ```
##### 4. Install [Mariya DB](https://downloads.mariadb.org/mariadb/repositories)
Install and configure MariyaDB for collab:
* Install MariyaDB
  ```sh
  $ sudo apt-get install software-properties-common
  $ sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:800xF1656F24C74CD1D8
  $ sudo add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://sgp1.mirrors.digitalocean.com/mariadb/repo/10.2/ubuntu xenial main'
  $ sudo apt-get update
  $ sudo apt-get install mariadb-server
  ```
* Create database
  ```sh
  $ mysql -u root -p <password>
	>CREATE DATABASE collab;
	>CREATE DATABASE collab_logging;
  ```
* Install phpMyAdmin to view database
 Select Apache2 server when prompted 
  ```sh
  $ sudo apt-get install phpmyadmin
  $ sudo service apache2 restart
  ```
  Login with mariadb credentials at http://localhost/phpmyadmin
##### 5. Clone all repositories
* collab: `git clone https://github.com/collab-tools/collab` 
* collab-db-logging: `git clone https://github.com/collab-tools/collab-db-logging`
* collab-db-application: `git clone https://github.com/collab-tools/collab-db-application`
* collab-analytics: `git clone https://github.com/collab-tools/collab-analytics`
##### 6. Resolve all NPM local dependencies
* npm install & link on collab-db-logging and collab-db-application:
    ```sh
    (collab-db-logging) $ sudo npm install
    (collab-db-logging) $ sudo npm link
    (collab-db-application) $ sudo npm install
    (collab-db-application) $ sudo npm link
    ```
* npm install & link on collab-analytics:
    ```sh
    (collab-analytics) $ sudo npm link collab-db-logging collab-db-application
    (collab-analytics) $ sudo npm install
    (collab-analytics) $ sudo npm link
    ```
* npm install & link on collab:
    ```sh
    (collab) $ sudo npm link collab-analytics collab-db-application
    (collab) $ sudo npm install
    ```
* Find more details about npm link [here](https://docs.npmjs.com/cli/link)
##### 7. Manage Google-Authentication requirements
* Create an account/log-in to [Google developer’s console](https://console.developers.google.com/)
* Create a new project
* Select the New Project > APIs & Services
* In the APIs & Services Page, the Dashboard lists the enabled API’s and services. Ensure that all the required APIs (Google+, Google Drive, Gmail) are enabled. If they are not listed, enable them using +Enable APIs and Services
* Navigate to Credentials. Select Web Client1 (any, web client1 is default). Edit it. Add the Authorised JavaScript Origins and Authorised redirect URIs. For a local set-up it should be as shown below:
    * Authorised JavaScript Origins
       * `http://localhost:8080`
       * `https://localhost:8080`
    * Authorised Redirect URIs
       * `http://localhost:8080/login`
       * `https://localhost:8080/login`
       * `http://localhost:8080`
       * `https://localhost:8080`
       * `http://localhost:8080/app`
       * `https://localhost:8080/app`
* Either download the JSON with credentials or make note of the Client-ID and Client Secret.
##### 8. Configure the local environment
* Go to config folder:
   ```sh
   $ cd collab/config
   ```
* Create a config file local-dev.json using _local-template.json
   ```sh
   $ cp _local-template.json local-dev.json
   ```
* Enter required credentials in local-dev.json
   ```json
   {
      "database": {
        "username": "your_username_collab_db",
        "password": "your_password_collab_db"
      },
      "logging_database": {
        "username": "your_username_collab_loging_db",
        "password": "your_password_collab_logging_db"
      },
      "authentication": {
        "privateKey": "some_auth_string"
      },
      "github": {
        "client_secret": ""
      },
      "google": {
        "client_secret": "google_client_secret"
      }
    }
   ```
* Populate only the google client-id in dev.json, production.json and test.json.
##### 9. Start the server
* Following command will start the server on port 8080 (default apache port).
    ```sh
    (collab) $ npm run dev
    ```
##### 10. Collab is now ready to use!
Open http://localhost:8080 in your browser.
