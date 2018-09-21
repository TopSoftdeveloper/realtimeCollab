# Collab Deployment Guide 
## Connect to School Server
* Setup VPN tunnel using softwares such as FortiClient
* Go into the nus network(if you already in school and connected to the school wifi, then skip this section)
* ssh into the server

## Create new Branch and merge into Masters
* `git checkout -b <new_branch_name>`
* `git add .`
* `git commit -m "message"`
* `git push origin <new_branch_name>`
* Go to Github, submit new pull request
* CI will auto merge into masters