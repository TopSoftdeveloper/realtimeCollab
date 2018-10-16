# Collab Deployment Guide 
## Connect to School Server
* Setup VPN tunnel using softwares such as [FortiClient](https://forticlient.com/)
* Go into the nus network(if you already in school and connected to the school WiFi, then skip this section)
* ssh into the server `ssh sadm@<server_url>`

## Production Servers
* nuscollab-i.comp.nus.edu.sg
* nuscollab-i-backup.comp.nus.edu.sg
* password please ask from Professor

## Create new Branch and merge into Masters
* `git checkout -b <new_branch_name>`
* `git add .`
* `git commit -m "message"`
* `git push origin <new_branch_name>`
* Go to Github, submit new pull request
* CI will auto merge into masters

## Firewall
Please note that there will be 2 layers of firewall, one is from the school's IT department who is incharge of the server, the other one is from the Apache Server setting. 

## Apache Server Configuration
* Folder locations:
    * `cd /etc/httpd` - all configurations
    * `sudo vim /etc/httpd/conf/httpd.conf` - root configuration file, there are many descriptions in this file, please check
    * `cd /etc/httpd/conf.d` - This directory holds configuration files for the Apache HTTP Server; any files in this directory which have the ".conf" extension will be processed as httpd configuration files.
    * `sudo vim /etc/httpd/conf.d/userdir.conf` - This file holds configuration for user specific settings. For instance, if you need to open up a folder for public access, you need to add <UserDir your_public_folder_path> in the file
    * `sudo vim /etc/httpd/conf.d/collab.conf` - This is the collab config file, the collab project serves static files from the server directly instead of "/var/www/" public folder
* Check if the server is indeed listening on port `sudo netstat -tnlp`
* Examples: 
```sh
<VirtualHost *:80>
        ServerName nuscollab.comp.nus.edu.sg
        DocumentRoot "/var/www/"
        ProxyPreserveHost On
        ProxyRequests Off
        ProxyPass / http://localhost:8080/
        ProxyPassReverse / http://localhost:8080/

        RewriteEngine On
        RewriteCond %{HTTP:X-Forwarded-Protocol} !https
        RewriteRule ^.*$ https://%{SERVER_NAME}%{REQUEST_URI}
</VirtualHost>

## This is to listen at another port, need to add this to firewall whitelist
Listen 9000

<VirtualHost *:9000>
        ServerName nuscollab.comp.nus.edu.sg
        DocumentRoot "/home/sadm/NUSCollab/collab-dashboard/public/dist/app"

        ProxyPreserveHost On
        ProxyRequests Off
        ProxyPass /api http://localhost:4000/api
        ProxyPassReverse /api http://localhost:4000/api

        Alias "/assets" "/home/sadm/NUSCollab/collab-dashboard/public/dist/assets"
        Alias "/libs" "/home/sadm/NUSCollab/collab-dashboard/public/dist/libs"

        RewriteEngine on
        RewriteRule   ^/app/(.+)$  / [R]

        <Directory /home/sadm/NUSCollab/collab-dashboard/public/dist>
                Require all granted
                <IfModule dir_module>
                        DirectoryIndex index.html index.php app/index.html
                </IfModule>
        </Directory>
</VirtualHost>
```