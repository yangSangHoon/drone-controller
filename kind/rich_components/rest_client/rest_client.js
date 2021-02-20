/**
 * @fileoverview The Rest Client of client.
 * @name Smith
 */

/**
 * kindFramework module
 * @module kindFramework
 * @augments ngRoute
 */

/**
 * Rich components의 Restful client
 *
 * @class RestClient
 * @augments $http
 * @augments SERVER
 * @memberof module:kindFramework
 */

kindFramework
    .service('RestClient', function($http, RESTCLIENT_CONFIG){
        var _server = 'http://' + RESTCLIENT_CONFIG.IP + ':' + RESTCLIENT_CONFIG.PORT;
    
        var _seconds = 10000;

        var _ajax = function(method, url, jsonData){
            var config = {
                method: method,
                url: _server + url,
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: _seconds
            };
            
            if(jsonData !== undefined){
                config.data = jsonData;
            }
            
            return $http(config);
        };
       
        this.post = function(url, jsonData){
            return _ajax("POST", url, jsonData);
        };
     
        this.get = function(url){
            return _ajax("GET", url);
        };
   
        this.put = function(url, jsonData){
            return _ajax("PUT", url, jsonData);
        };

        this.del = function(url){
            return _ajax("DELETE", url);
        };
    
        this.setHeaders = function(name, value){
            $http.defaults.headers.common[name] = value;
            return this;
        };
    
        this.setRequestTimeout = function(seconds){
            _seconds = seconds;
            return this;
        };
    });