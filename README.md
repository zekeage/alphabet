The OpenShift `nodejs` cartridge documentation can be found at:
MALOUS
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
   Root Password: 5NcTw3ZcA-Em
   Database Name: alphabet

Connection URL: mongodb://$OPENSHIFT_MONGODB_DB_HOST:$OPENSHIFT_MONGODB_DB_PORT/