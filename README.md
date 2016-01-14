# Collab
Web-based collaboration tool to help small teams do big things

Installation
-----------------

1. Clone the repo

   `git clone https://github.com/seowyanyi/tiny.git`


2. Install MySQL and Nodejs if not installed

3. Create database

  The below command assumes your mysql login is root without password:

  `mysql -u root -p`
  
  `> CREATE DATABASE collab;`
  

4. Install required dependencies

  `sudo apt-get install g++`
  `sudo npm i -g node-gyp && node-gyp clean`
  `npm install`

5. Run the development server

  `npm run dev`


Testing
-----------------

Testing is done with [Chai](http://chaijs.com/), [Supertest](https://github.com/visionmedia/supertest) and [Mocha](https://mochajs.org/).
Make sure the server is already running.

`npm test`
