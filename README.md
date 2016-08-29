# Collab
> Web-based collaboration tool to help small teams do big things.

Setting Up Development Environment
-----------------
*For OSX Users, It is highly recommended to install `brew` before following this guide.*
> *`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`*

**1. Clone project repository**
  *HTTP Auth*: `git clone https://github.com/collab-tools/collab.git`
  *SSH Auth*: `git clone git@github.com:collab-tools/collab.git`

**2. Install MySQL and Node.js **
*MariaDB is highly recommended but feel free to use any mySQL variants.*

**Linux Variants**
`sudo apt-get install software-properties-common`
`sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8`
`sudo add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://sgp1.mirrors.digitalocean.com/mariadb/repo/10.2/ubuntu xenial main'`
`sudo apt-get update`
`sudo apt-get install mariadb-server`

**OSX**
`brew install mariadb`

**3. Create database**
  `mysql -u root -p <password>`

  `> CREATE DATABASE collab;`
  `> CREATE DATABASE collab_logging;`

**4. Install required dependencies**
  **Linux Variants**
  `sudo apt-get install g++`
  **OSX**
  *Python 2.7*: `brew install python`


  `sudo npm i -g node-gyp && node-gyp clean`
  `npm install`

**5. Configure local environment**
  `cd <project-root>/config`
  `cp _local-template.json  local-dev.json`
  Fill in `local-dev.json` with your server information *(secret keys, database authentication)*.

**6. Run the development server**
  `npm run dev`
  `default browser access: http://127.0.0.1:8080`

Setting Up Production Environment
--------------
> WIP - Section to include information on how to deploy the application in its production state (w/ SSL, HTTP2, etc.) to any Ubuntu machine.

Testing Framework and Implementation
-----------------
![Build Status](https://codeship.com/projects/167854/status?branch=master)

> WIP - Revision in Progress

Documentation
-----------------
Presentation slides on this project [can be found here](http://seowyanyi.org/pdfs/FYP_Final_Presentation.pdf)
