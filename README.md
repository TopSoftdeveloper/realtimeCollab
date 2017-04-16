# Collab
> Web-based collaboration tool to help small teams do big things.

## Setting Up Development Environment

For OSX Users, It is highly recommended to install `brew` before following this guide.

`/usr/bin/ruby -e "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/master/install)"`


#### Clone project repository

`git clone git@github.com:collab-tools/collab.git`

#### Install MySQL and Node.js

MariaDB is highly recommended but feel free to use any mySQL variants.

- Linux

    ```
    sudo apt-get install software-properties-common
    sudo apt-key adv --recv-keys --keyserver hkp://keyserver.ubuntu.com:80 0xF1656F24C74CD1D8
    sudo add-apt-repository 'deb [arch=amd64,i386,ppc64el] http://sgp1.mirrors.digitalocean.com/mariadb/repo/10.2/ubuntu xenial main'
    sudo apt-get update
    sudo apt-get install mariadb-server
    ```

- OSX

    ```
    brew install mariadb
    ```

#### Create database

```
mysql -u root -p <password>
> CREATE DATABASE collab;
> CREATE DATABASE collab_logging;
```

#### Install dependencies

- Linux

    ```
    sudo apt-get install g++
    ```

- OSX

    ```bash
    brew install python
    sudo npm i -g node-gyp && node-gyp clean
    npm install`
    ```

(see section 5 to resolve NPM local dependencies in [Deployment Guide](https://github.com/collab-tools/collab/blob/master/DeploymentGuide.md))

#### Configure local environment

```
cd <project-root>/config
cp _local-template.json local-dev.json
```

Fill in `local-dev.json` with your server information (secret keys, database authentication).

#### Run the development server

Server will be accessible at localhost:8080

```
npm run dev
```

## Deployment

#### Dependencies

1. Install Flightplan globally with `npm install -g flightplan`
2. Add your SSH public key to the `collab` user on the production server.

    You can generate a new SSH key using `ssh-keygen`. To use a different key from your
    personal one (you should!), add the following to `~/.ssh/config`:

    ```
    Host nuscollab-i.comp.nus.edu.sg
        IdentityFile ~/.ssh/my_nuscollab_private_key
    ```

    Add your public key to `/home/collab/.ssh/authorized_keys` on production.

#### Deployment

To deploy to production:

```
fly production
```

To deploy a specific branch to production:

```
fly production --branch="origin/my_branch_name"
```


## Setting Up Production Environment

> WIP - Section to include information on how to deploy the application in its production state (w/ SSL, HTTP2, etc.) to any Ubuntu machine.

Find details in [Deployment Guide](https://github.com/collab-tools/collab/blob/master/DeploymentGuide.md)

## Testing Framework and Implementation

![Build Status](https://codeship.com/projects/167854/status?branch=master)

> WIP - Revision in Progress

Documentation
-----------------
Presentation slides on this project [can be found here](http://seowyanyi.org/pdfs/FYP_Final_Presentation.pdf)
