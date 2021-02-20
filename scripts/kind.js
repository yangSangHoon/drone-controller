"use strict";

/**
 * kind Framework
 * 
 * @module kindFramework
 * @augments ngRoute
 */
var kindFramework = angular.module(
    'kindFramework',
    [
        /*'ngRoute',*/
         'pascalprecht.translate',
    ]
);

/**
 * 
 * @class config
 * @constructor
 * @param {function} callBack
 * @memberof module:kindFramework
 */
/*kindFramework
    .config(function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix("!");
        $locationProvider.html5Mode(false);

        $routeProvider
            .when('/login', {
                templateUrl: 'views/login/login.html'
            })
            .when('/home', {
                templateUrl: 'views/home/home.html'
            })
	.when('/flightPlan', {
                templateUrl: 'views/flightPlan/flightPlan.html'
            })
           .when('/mapTest', {
                templateUrl: 'views/mapTest.html'
            })
            .otherwise({
                redirectTo: '/home'
            });
    })
*/



