The OpenShift `nodejs` cartridge documentation can be found at:

http://openshift.github.io/documentation/oo_cartridge_guide.html#nodejs


//Making code changes
//Install the Git client for your operating system, and from your command line run
git clone ssh://557513a15973ca6b6a000050@alphabet-whatitis.rhcloud.com/~/git/alphabet.git/
cd alphabet/

//This will create a folder with the source code of your application. After making a change, add, commit, and push your changes.
git add .
git commit -m 'My changes'
git push
//When you push changes the OpenShift server will report back its status on deploying your code. The server will run any of your configured deploy hooks and then restart the application.

MongoDB 2.4 database added.  Please make note of these credentials:

   Root User:     admin
   Root Password: 
   Database Name: alphabet

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/

website is https:
http://alphabet-whatitis.rhcloud.com/

ssh 557513a15973ca6b6a000050@alphabet-whatitis.rhcloud.com
and use 'tail_all' to see console
command to REPLACE facts table with the data in facts.csv:


//make table
CREATE TABLE facts (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, category VARCHAR(20) NOT NULL, fact TEXT NOT NULL);
//or delete
truncate facts;

load data infile '/var/lib/openshift/557513a15973ca6b6a000050/app-root/repo/facts.csv' into table facts columns terminated by ',' optionally enclosed by '"' escaped by '"' lines terminated by '\n' ignore 1 lines;

load data infile 'D:/Shared Documents/GitHub/alphabet/facts.csv' into table facts columns terminated by ',' optionally enclosed by '"' escaped by '"' lines terminated by '\r\n' ignore 1 lines;

//local testing instructions
1. navigate to project directory (probably not necessary since the files are in the project directory now)
npm install express
npm install mysql
2. download mysql from the internets and install it using these instructions and a password of 'test' for root and ip of 127.0.0.1
https://netbeans.org/kb/docs/ide/install-and-configure-mysql-server.html
3. open mysql command line client and create the alphabet and facts database and table respectively
create database alphabet;
CREATE TABLE facts (id INT(10) UNSIGNED AUTO_INCREMENT PRIMARY KEY, category VARCHAR(20) NOT NULL, fact TEXT NOT NULL);
4. make sure mysql server is running
5. navigate to local directory in terminal and 
node server.js
6. open a browser and go to localhost:8080
