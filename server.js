#!/bin/env node
//  OpenShift sample Node application
var ERRCONSOLE = ['firstElement'];
var queryResult = [];
var express = require('express');
var fs      = require('fs');
var mongo = require('mongodb').MongoClient;
var mysql      = require('mysql');
var connection = mysql.createConnection({
  host     : process.env.OPENSHIFT_MYSQL_DB_HOST,
  user     : process.env.OPENSHIFT_MYSQL_DB_USERNAME,
  password : process.env.OPENSHIFT_MYSQL_DB_PASSWORD,
  database : process.env.OPENSHIFT_GEAR_NAME,
});

/**
 *  Define the sample application.
 */
var alphabet = function() {
    //  Scope.
    var self = this;


    /*===================*/
    /* Helper functions. */
    /*===================*/

    // Set up server IP address and port # using env variables/defaults.
    self.setupVariables = function() {
        //  Set the environment variables we need.
        self.ipaddress = process.env.OPENSHIFT_NODEJS_IP;
        self.port      = process.env.OPENSHIFT_NODEJS_PORT || 8080;

        if (typeof self.ipaddress === "undefined") {
            //  Log errors on OpenShift but continue w/ 127.0.0.1 - this
            //  allows us to run/test the app locally.
            console.warn('No OPENSHIFT_NODEJS_IP var, using 127.0.0.1');
            self.ipaddress = "127.0.0.1";
        };
    };


    // Populate the cache.
    self.populateCache = function() {
        if (typeof self.zcache === "undefined") {
            self.zcache = { 'index.html': '' ,'feed.html': '' ,'facts.html': '' };
        }
        //  Local cache for static content.
        self.zcache['index.html'] = fs.readFileSync('./index.html');
        self.zcache['feed.html'] = fs.readFileSync('./feed.html');
        self.zcache['facts.html'] = fs.readFileSync('./facts.html');
    };


    // Retrieve entry (content) from cache.
    // key -> Key identifying content to retrieve from cache.
    self.cache_get = function(key) { return self.zcache[key]; };



    // terminator === the termination handler
    // Terminate server on receipt of the specified signal.
    // @param {string} sig  Signal to terminate on.
    self.terminator = function(sig){
        if (typeof sig === "string") {
           console.log('%s: Received %s - terminating sample app ...',
                       Date(Date.now()), sig);
           process.exit(1);
        }
        console.log('%s: Node server stopped.', Date(Date.now()) );
    };


    // Setup termination handlers (for exit and a list of signals).
    self.setupTerminationHandlers = function(){
        //  Process on exit and signals.
        process.on('exit', function() { self.terminator(); });

        // Removed 'SIGPIPE' from the list - bugz 852598.
        ['SIGHUP', 'SIGINT', 'SIGQUIT', 'SIGILL', 'SIGTRAP', 'SIGABRT',
         'SIGBUS', 'SIGFPE', 'SIGUSR1', 'SIGSEGV', 'SIGUSR2', 'SIGTERM'
        ].forEach(function(element, index, array) {
            process.on(element, function() { self.terminator(element); });
        });
    };




    /*=============================================*/
    /* App server functions (main app logic here). */
    /*=============================================*/

    // Create the routing table entries + handlers for the application.
    self.createGroutes = function() {
        self.groutes = { };

        self.groutes['/asciimo'] = function(req, res) {
            var link = "http://i.imgur.com/kmbjB.png";
            res.send("<html><body><img src='" + link + "'></body></html>");
        };

        self.groutes['/'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('index.html') );
        };

        self.groutes['/facts'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('facts.html') );
        };

        self.groutes['/randomfact'] = function(req, res) {
            var data = {
                "Data":""
            };
            connection.query("SELECT fact FROM facts LIMIT 1",function(err, rows, fields){
                if(rows.length != 0){
                    data["Data"] = rows;
                    res.send(data);
                }else{
                    data["Data"] = 'No data Found..';
                    res.send(data);
                }
            });
        };
//            console.log("fact request went through");
 //           res.setHeader('Content-Type', 'text/html');
  //          self.getRandomFact2("SELECT fact FROM facts LIMIT 1", function(results) {
   //           queryResult = results;
 //             ERRCONSOLE.push(queryResult);});
            //setTimeout(function() {res.send("<html>" + queryResult + "</html>");}, 500);
      //        res.send("<html>" + queryResult + "</html>");
        self.groutes['/console'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send("<html><body>" + ERRCONSOLE + "</body></html>");
        };
    };

    self.createProutes = function() {
        self.proutes = { };
        self.proutes['/feed'] = function(req, res) {
            res.setHeader('Content-Type', 'text/html');
            res.send(self.cache_get('feed.html') );
        };
    };


    // Initialize the server (express) and create the routes and register
    // the handlers.
    self.initializeServer = function() {
        self.createGroutes();
        self.createProutes();
        self.app = express.createServer();

        //  Add handlers for the app (from the routes).
        for (var r in self.groutes) {
            self.app.get(r, self.groutes[r]);
        }
        for (var r in self.proutes) {
            self.app.post(r, self.proutes[r]);
        }
    };

    // Initializes the sample application.
    self.initialize = function() {
        self.setupVariables();
        self.populateCache();
        self.setupTerminationHandlers();

        // Create the express server and routes.
        self.initializeServer();
    };


    // Start the server (starts up the sample application).
    self.start = function() {
        //  Start the app on the specific interface (and port).
        self.app.listen(self.port, self.ipaddress, function() {
            console.log('%s: Node server started on %s:%d ...',
                        Date(Date.now() ), self.ipaddress, self.port);
        });
    };

    // Gets a random fact from the "facts" table
    self.getRandomFact = function() {
        ERRCONSOLE.push('called me, maybe');
        var temp = connection.query('SELECT fact FROM facts LIMIT 1', function(err, rows, fields) {
          if (!err)
          {
            ERRCONSOLE.push('found rows');
            return 'NOT ERROR!';
          }
          else
          {
            console.log('Error while performing Query.');
            ERRCONSOLE.push('did not find rows');
            return 'OOPS I LET YOU DOWN';
          }
        });
        return temp[0];
    }
    self.getRandomFact2 = function(thequery,callback)
    {
      connection.query(thequery, function (error,results,fields) {
        if (error) {
            ERRCONSOLE.push('not found rows');
        }
        if (results.length  > 0) {
            ERRCONSOLE.push(' found rows');
            callback(results);
        }
      }) 
    }

};



/*============*/
/* Main code. */
/*============*/
var main = function() {
    var zapp = new alphabet();
    zapp.initialize();
    zapp.start();
    ERRCONSOLE.push('server is alive1? ');
    connection.connect();

    connection.query("SELECT fact FROM facts LIMIT 1", function(err, rows, fields) {
      if (!err)
      {
        console.log(rows);
        ERRCONSOLE.push('query succeeded');
      }
      else
      {
        console.log('Error while performing Query.');
        ERRCONSOLE.push('query failed');
      }
    });
    ERRCONSOLE.push('server is alive2? ');
}

main()
