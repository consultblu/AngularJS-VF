//var apiIp = '//' + window.location.hostname + '/';
//var apiIp = '//www.preprodvff.com/';
var apiIp = '//www.valleyforge.com/';
var apiUrl = apiIp + 'json';
var sharedScopeDefinition;
sharedScopeDefinition = {
    handler: '&customHandler',
    socialWidth: '@',
    socialHeight: '@'
};


var app = angular.module('valleyforge_frontend_cms', 
  [
    'ngAnimate'
    , 'ngCookies'
    , 'ngRoute' 
    , 'ngSanitize' 
    , 'btford.markdown' 
    , 'ui.router' 
    , 'youtube-embed' 
    , 'ui.bootstrap' 
    , 'ui.bootstrap.dropdown' 
    , 'ui.bootstrap.typeahead' 
    , 'ui.bootstrap.modal' 
    , 'dialogs.main' 
    , 'ui.select' 
    //, 'ui.slider' 
    , 'picardy.fontawesome'
    //, 'ngTagsInput'
    , 'duScroll'
    , 'angularUtils.directives.dirDisqus'
    , 'ngMaterial'
    , 'ngMdIcons'
    //, 'angular-advanced-searchbox'
  ]
);