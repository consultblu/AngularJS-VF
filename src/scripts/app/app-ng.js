var apiIp = '//' + window.location.host + '/';
//var apiIp = '//www.preprodvff.com/';
//var apiIp = '//www.valleyforge.com/';
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
		, 'ui.router' 	
    , 'ui.bootstrap'
    , 'ui.bootstrap.dropdown' 
    , 'ui.bootstrap.typeahead' 
    , 'ui.bootstrap.modal'  
    , 'ui.select' 
    //, 'ui.slider'
		, 'dialogs.main'	
		, 'ngMaterial'
    , 'ngMdIcons'
		, 'mdMarkdownIt'
    , 'picardy.fontawesome'	
    //, 'ngTagsInput'
    , 'duScroll'
	  , 'youtube-embed' 
    , 'angularUtils.directives.dirDisqus'
    //, 'angular-advanced-searchbox'
  ]
);