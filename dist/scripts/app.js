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
 app.config(["$sceDelegateProvider", function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://4252805dae76ab552633-0bff195b1e52c63f8fae47f6b90459f3.ssl.cf1.rackcdn.com/**', 'http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/**','http://www.youtube.com/**','https://www.youtube.com/**', 'http://74c749ed3f1bace98461-2c2004dcc2fff845ee2077a362d57d4f.r23.cf1.rackcdn.com/**']);
  $sceDelegateProvider.resourceUrlBlacklist(['http://myapp.example.com/clickThru**']);
 }]);
app.config(["$httpProvider", function ($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function (obj) {
		var query = '',
			name, value, fullSubName, subName, subValue, innerObj, i;
		for (name in obj) {
			value = obj[name];
			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};
	$httpProvider.defaults.transformRequest = [function (data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
	$httpProvider.interceptors.push(["$timeout", "$q", "$injector", function ($timeout, $q, $injector) {
		var loginModal, $http, $state;
		$timeout(function () {
			loginModal = $injector.get('loginModal');
			$http = $injector.get('$http');
			$state = $injector.get('$state');
			//console.log('$injector.get($state)', $injector.get('$state'));
		});
		return {
			responseError: function (rejection) {
				if (rejection.status !== 401) {
					return rejection;
				}
				var deferred = $q.defer();
				loginModal().then(function () {
					console.log('app.config');
					deferred.resolve($http(rejection.config));
				}).catch(function () {
					$state.go('home');
					deferred.reject(rejection);
				});
				return deferred.promise;
			}
		};
	}]);
}]);
app.run(["$rootScope", "$state", "loginModal", "$http", "cart", function ($rootScope, $state, loginModal, $http, cart) {
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    var requireLogin = toState.data.requireLogin;
    angular.element("html").css("overflow", "visible");
    window.$parallaxBase = void 0;
    window.$parallaxFactory = void 0;
    window.para = void 0;
    window.parallax = void 0;
    angular.element("footer-bar").show();
    //console.log(window);

    var isLoggedIn = function () {
      return $http({
        method: "post",
        url: '/views/login',
      }).success(function (data) {

        if (data.logged_in === true) {
          $rootScope.currentUser = data.user.username;
          return true;
        } else {
          //console.log('logged_in != true');
          $rootScope.currentUrl = window.location;
          $rootScope.currentUser = undefined;
          return false;
        }
      });
    };

    isLoggedIn();

    //console.log('$rootScope',$rootScope);
    //console.log('requireLogin', requireLogin);
    //console.log('$rootScope.username', $rootScope.currentUser);

    if (requireLogin !== false && $rootScope.currentUser === undefined) {
      //console.log('requireLogin is true && currentUser is undefined!');
      event.preventDefault();
      $http({
        method: "post",
        url: '/views/login',
      }).success(function (data) {
        //console.log('isLoggedIn', data);
        //console.log('// get me a login modal!', data.isLoggedIn);
        //console.log('toState.name',toState.name);   
        //console.log('toParams',toParams);

        $rootScope.destUrl = {
          name: toState.name,
          book: toParams.book,
          page: toParams.page
        };

        if (data.logged_in === true) {
          //console.log('logged_in == true');
          $rootScope.currentUser = data.user.username;
          $state.go(toState.name, toParams);
        } else {
          //console.log('logged_in != true');
          $rootScope.currentUrl = window.location;
          $rootScope.currentUser = undefined;
          $rootScope.logIn();
          /*loginModal().then(function() {
                  console.log('toState.name',toState.name);
            console.log('toParams',toParams);
            $state.go(toState.name, toParams);
            //return 
          })
          .catch(function() {
            return $state.go('home');
          });*/
        }
        return data;
      });
    }
  });
}]);

app.config(["$urlMatcherFactoryProvider", "$stateProvider", "$urlRouterProvider", "$locationProvider", function ($urlMatcherFactoryProvider, $stateProvider, $urlRouterProvider, $locationProvider) {

  $locationProvider.html5Mode(true);

  $urlMatcherFactoryProvider.caseInsensitive(true);
  $urlMatcherFactoryProvider.strictMode(false);

  var _isNotMobile = (function () {
    var check = false;
    (function (a) {
      if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) check = true
    })(navigator.userAgent || navigator.vendor || window.opera);
    return !check;
  })();


  $stateProvider
  /*.state("/", {
              url: "/lp/home",
              templateUrl: "app/landing_page/landing_page.html",
              controller: "LandingPagesCtrl",
              data: {
                  requireLogin: false
              }
          })*/
    .state("home", {
      url: "/",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("login", {
      url: "/login",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("demo", {
      url: "/lp/demo",
      templateUrl: "app/demo/demo.html",
      controller: "DemoCtrl",
      data: {
        requireLogin: false
      }
    }).state("docs", {
      url: "/lp/docs",
      templateUrl: "app/docs/docs.html",
      controller: "DocsCtrl"
    }).state("examples", {
      url: "/lp/examples",
      templateUrl: "app/examples/examples.html",
      controller: "ExamplesCtrl",
      data: {
        requireLogin: false
      }
    }).state("bedding-spec-book", {
      url: "/online-library/bedding-spec-book",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "OnlineLibraryCtrl",
      data: {
        requireLogin: true
      }
    }).state("gradient-spec-book", {
      url: "/online-library/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("design-library", {
      url: "/design-library",
      templateUrl: "index_new.php/views/design_library",
      controller: "DesignLibraryCtrl",
      data: {
        requireLogin: true
      }
    }).state("design-library/:book", {
      url: "/design-library/:book",
      templateUrl: "index_new.php/views/design_library",
      controller: "DesignLibraryCtrl",
      data: {
        requireLogin: true
      }
    }).state("design-library-page", {
      url: "/design-library/:book/:page",
      templateUrl: "index_new.php/views/design_library",
      controller: "DesignLibraryCtrl",
      data: {
        requireLogin: true
      }
    }).state("fabric-collections", {
      url: "/fabric-collections/",
      templateUrl: "app/views/grid.html",
      controller: "CollectionsCtrl",
      data: {
        requireLogin: false
      }
    }).state("lp", {
      url: "/lp/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("/blog", {
      url: "/blog/:post",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "BlogPostCtrl",
      data: {
        requireLogin: false
      }
    }).state("employee-handbook", {
      url: "/employee-handbook",
      templateUrl: "views/employee-handbook",
      controller: "contactUsCtrl",
      data: {
        requireLogin: false
      }
    }).state("employee-handbook-acknowledgement", {
      url: "/employee-handbook-acknowledgement",
      templateUrl: "views/employee-handbook-acknowledgement",
      controller: "contactUsCtrl",
      data: {
        requireLogin: false
      }
    }).state("meet-us", {
      url: "/lp/media/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("advertising", {
      url: "/advertising",
      templateUrl: "index_new.php/views/ads",
      controller: "MediaAdsCtrl",
      data: {
        requireLogin: false
      }
    }).state("awards-recognition", {
      url: "/awards-recognition",
      templateUrl: "app/views/awards_recognition/awards_recognition.html",
      controller: "MediaAwardsRecognitionCtrl",
      data: {
        requireLogin: false
      }
    }).state("videos", {
      url: "/videos",
      templateUrl: "app/views/videos/videos.html",
      controller: "MediaVideosCtrl",
      data: {
        requireLogin: false
      }
    }).state("professionality", {
      //url: "/professionality/",
      //templateUrl: "views/professionality",
      url: "/professionality/:hash",
      templateUrl: (_isNotMobile) ? "app/views/careerPage/index.html" : "app/views/careerPage/index-mobile.html",
      controller: "ProfessionalityCtrl",
      data: {
        requireLogin: false
      }
    })
    .state("careers", {
      //url: "/professionality/",
      templateUrl: "app/views/careerPage/index-no_parallax.html",
      url: "/careers",
      //templateUrl: (_isNotMobile )? "app/views/careerPage/index.html" : "app/views/careerPage/index-mobile.html", 
      controller: "ProfessionalityCtrl",
      data: {
        requireLogin: false
      }
    }).state("product-detail", {
      url: "/product-detail/:id",
      templateUrl: "app/views/product-detail/product-detail.html",
      controller: "productDetailCtrl",
      data: {
        requireLogin: false
      }
    }).state("contact-us", {
      url: "/contact-us",
      templateUrl: "/views/contact-us",
      controller: "contactUsCtrl",
      data: {
        requireLogin: false
      }
    }).state("goto", {
      url: "/goto/:socialMedia/:variable",
      controller: "GotoCtrl",
      data: {
        requireLogin: false
      }
    }).state("cart", {
      url: "/cart/",
      templateUrl: "index.php/design-library/samples",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("favorites", {
      url: "/favorites",
      templateUrl: "index.php/account/favorites",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("favorites/", {
      url: "/favorites/",
      templateUrl: "index_new.php/account/favorites",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("history", {
      url: "/history",
      templateUrl: "index_new.php/account/samples",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("profile", {
      url: "/profile/",
      templateUrl: "index_new.php/account/profile",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("profile/edit", {
      url: "/profile/edit",
      templateUrl: "index_new.php/account/profile/edit",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("profile/password/saved", {
      url: "/profile/password/saved",
      templateUrl: "index_new.php/account/profile/password/saved",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: true
      }
    }).state("profile/password", {
      url: "/profile/password",
      templateUrl: "index_new.php/account/profile/password",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("profile/password/", {
      url: "/profile/password/",
      templateUrl: "index_new.php/account/profile/password",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    })
    /*.state("profile/:segment", {
        url: "/profile/:segment",
        templateUrl: "index_new.php/account/profile",
        controller: "LandingPagesCtrl",
        data: {
            requireLogin: true
        }
    })*/
    .state("register", {
      url: "/register/",
      templateUrl: "index_new.php/views/register",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("register/authorized", {
      url: "/register/authorized/:customerId",
      templateUrl: "index_new.php/views/register/authorized/",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("register/not-authorized", {
      url: "/register/not-authorized",
      templateUrl: "index_new.php/views/register/not-authorized",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("message", {
      url: "/message",
      templateUrl: "components/cms/content_blocks/message/message.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("message/:msgId", {
      url: "/message/:msgId",
      templateUrl: "components/cms/content_blocks/message/message.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("message/:msgId/:slug", {
      url: "/message/:msgId/:slug",
      templateUrl: "components/cms/content_blocks/message/message.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("reset", {
      url: "/reset",
      templateUrl: "index_new.php/views/reset-password",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("pageNotFound", {
      url: "/lp/:page",
      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    }).state("maintenance", {
      url: "/maintenance",
      templateUrl: "components/cms/content_blocks/maintenance/maintenance.html",
      data: {
        requireLogin: false,
        hideMenus: false
      }
    }).state('404', {
      url: '/lp/404',

      templateUrl: "app/landing_page/landing_page.html",
      controller: "LandingPagesCtrl",
      data: {
        requireLogin: false
      }
    });
  //return $urlRouterProvider.otherwise('/lp/page-not-found');
  $urlRouterProvider.otherwise('/');

}]);
app.factory('AuthenticationService', ['Base64', '$http', '$cookieStore', '$rootScope', '$timeout', function(Base64, $http, $cookieStore, $rootScope, $timeout) {
        var service = {};
        service.Login = function(username, password, callback) {
            $timeout(function() {
                var response = {
                    success: username === 'test' && password === 'test'
                };
                if (!response.success) {
                    response.message = 'Username or password is incorrect';
                }
                callback(response);
            }, 1000);
        };
        service.SetCredentials = function(username, password) {
            var authdata = Base64.encode(username + ':' + password);
            $rootScope.globals = {
                currentUser: {
                    username: username,
                    authdata: authdata
                }
            };
            $http.defaults.headers.common['Authorization'] = 'Basic ' + authdata;
            $cookieStore.put('globals', $rootScope.globals);
        };
        service.ClearCredentials = function() {
            $rootScope.globals = {};
            $cookieStore.remove('globals');
            $http.defaults.headers.common.Authorization = 'Basic ';
        };
        return service;
    }]);
app.factory('Base64', function() {
        var keyStr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=';
        return {
            encode: function(input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
                do {
                    chr1 = input.charCodeAt(i++);
                    chr2 = input.charCodeAt(i++);
                    chr3 = input.charCodeAt(i++);
                    enc1 = chr1 >> 2;
                    enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
                    enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);
                    enc4 = chr3 & 63;
                    if (isNaN(chr2)) {
                        enc3 = enc4 = 64;
                    } else if (isNaN(chr3)) {
                        enc4 = 64;
                    }
                    output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2) + keyStr.charAt(enc3) + keyStr.charAt(enc4);
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            },
            decode: function(input) {
                var output = "";
                var chr1, chr2, chr3 = "";
                var enc1, enc2, enc3, enc4 = "";
                var i = 0;
                var base64test = /[^A-Za-z0-9\+\/\=]/g;
                if (base64test.exec(input)) {
                    window.alert("There were invalid base64 characters in the input text.\n" + "Valid base64 characters are A-Z, a-z, 0-9, '+', '/',and '='\n" + "Expect errors in decoding.");
                }
                input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
                do {
                    enc1 = keyStr.indexOf(input.charAt(i++));
                    enc2 = keyStr.indexOf(input.charAt(i++));
                    enc3 = keyStr.indexOf(input.charAt(i++));
                    enc4 = keyStr.indexOf(input.charAt(i++));
                    chr1 = (enc1 << 2) | (enc2 >> 4);
                    chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
                    chr3 = ((enc3 & 3) << 6) | enc4;
                    output = output + String.fromCharCode(chr1);
                    if (enc3 != 64) {
                        output = output + String.fromCharCode(chr2);
                    }
                    if (enc4 != 64) {
                        output = output + String.fromCharCode(chr3);
                    }
                    chr1 = chr2 = chr3 = "";
                    enc1 = enc2 = enc3 = enc4 = "";
                } while (i < input.length);
                return output;
            }
        };
    });
    app.factory('dataFactory', ['$http', '$location', function($http, $location) {
        var dataFactory = {};
        var currentPath = $location.path();
        var results;
        var blogUrlBase = 'http://www.valleyforge.com/vffblog/?json=';
        var CseUrl = 'http://67.43.2.193/~searchpreprodvff/search.php?type=and&results=50&search=1&query=';
        dataFactory.getData = function(option) {
          // console.log('apiUrl@getData = ' + apiUrl + option);
          return $http.get(apiUrl + option);
        };
        dataFactory.getBlogData = function(option, page) {
          page = "&page="+page;
          // console.log('apiUrl@getBlogData = ' + blogUrlBase + option + page);
          return $http.get(blogUrlBase + option + page);
        };
        dataFactory.getCseData = function(option) {
          // console.log('Google_CSEAPI@getData = ' + CseUrl + option);
          return $http.get(CseUrl + option);
        };
        return dataFactory;
    }]);
/*app.value("$sanitize", function(html) {
  console.log('santize triggered');
  return (html);
});*/
app.factory('socialLinker', ['$window', '$location', function($window, $location) {
        return function(urlFactory) {
            return function(scope, element, attrs) {
                var getCurrentUrl, handler, popupWinAttrs;
                popupWinAttrs = "status=no, width=" + (scope.socialWidth || 640) + ", height=" + (scope.socialHeight || 480) + ", resizable=yes, toolbar=no, menubar=no, scrollbars=no, location=no, directories=no";
                getCurrentUrl = function() {
                    return attrs.customUrl || $location.absUrl();
                };
                attrs.$observe('customUrl', function() {
                    var url;
                    url = urlFactory(scope, getCurrentUrl());
                    if (element[0].nodeName === 'A' && ((attrs.href == null) || attrs.href === '')) {
                        return element.attr('href', url);
                    }
                });
                element.attr('rel', 'nofollow');
                handler = function(e) {
                    var url, win;
                    e.preventDefault();
                    url = urlFactory(scope, getCurrentUrl());
                    return win = $window.open(url, 'popupwindow', popupWinAttrs).focus();
                };
                if (attrs.customHandler != null) {
                    element.on('click', handler = function(event) {
                        var url;
                        url = urlFactory(scope, getCurrentUrl());
                        element.attr('href', url);
                        return scope.handler({
                            $event: event,
                            $url: url
                        });
                    });
                } else {
                    element.on('click', handler);
                }
                return scope.$on('$destroy', function() {
                    return element.off('click', handler);
                });
            };
        };
    }]);
app.factory("transformRequestAsFormPost", function() {
        function transformRequest(data, getHeaders) {
//            console.log('transformRequest triggered');
            var headers = getHeaders();
            headers["Content-type"] = "application/x-www-form-urlencoded; charset=utf-8";
            return (serializeData(data));
        }
        return (transformRequest);
        function serializeData(data) {
            if (!angular.isObject(data)) {
                return ((data == null) ? "" : data.toString());
            }
            var buffer = [];
            for (var name in data) {
                if (!data.hasOwnProperty(name)) {
                    continue;
                }
                var value = data[name];
                buffer.push(encodeURIComponent(name) + "=" + encodeURIComponent((value == null) ? "" : value));
            }
            var source = buffer.join("&").replace(/%20/g, "+");
//            console.log('buffer', source);
            return (source);
        }
    });
app.factory("UsersApi", ["$q", "$http", function($q, $http) {
        function _login(username, password) {
            var d = $q.defer();
            $http({
                url: 'views/login',
                method: "POST",
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function(response) {
//                console.log('auth response', response);
            });
            return d.promise
        }
        return {
            login: _login
        };
    }]);
    app.service('anchorSmoothScroll', function() {
        this.scrollTo = function(eID, PreviouseID) {
            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY);
                return;
            }
            var speed = Math.round(distance / 1);
            if (speed >= 20) speed = 40;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            if (PreviouseID != null) {
                //console.log(angular.element('#' + PreviouseID)[0]);
                if (angular.isUndefined(angular.element('#' + PreviouseID)[0])) {
                    console.log("it's undefined");
                } else {
                    var heightEiD = angular.element('#' + eID)[0].clientHeight;
                    var heightPreviouseID = angular.element('#' + PreviouseID)[0].clientHeight;
                    leapY = leapY - (heightPreviouseID - heightEiD);
                }
            }
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step;
                    if (leapY > stopY) leapY = stopY;
                    timer++;
                }
                return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step;
                if (leapY < stopY) leapY = stopY;
                timer++;
            }

            function currentYPosition() {
                if (self.pageYOffset) return self.pageYOffset;
                if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }

            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                }
                return y;
            }
        };
    });
    app.service('cart', ["$rootScope", function($rootScope) {
        return $.post('/views/cart_count').done(function(response) {
            response = angular.element.trim(response);
            //console.log('cart contents', response);
            //console.log('cart response.length', response.length);
            if (response.length > 0) {
                //console.log('the cart has ' + response + ' items');
                angular.element(".cart_count .count").load('views/cart_count');
                angular.element(".cart_count").show();
            } else {
                //console.log('the cart is empty');
                angular.element(".cart_count .count").load('views/cart_count');
                angular.element(".cart_count").hide();
            }
        });
    }]);
    app.service('loginModal', ["$modal", "$rootScope", function($modal, $rootScope) {
        function assignCurrentUser(user) {
            $rootScope.currentUser = user;
            console.log('user', user);
            return user;
        }
        return function() {
            console.log('app.service(loginModal)');
            var instance = $modal.open({
                templateUrl: 'views/login-form',
                controller: 'LoginModalCtrl',
                controllerAs: 'LoginModalCtrl'
            });
            console.log(instance.result);
            return instance.result.then(function(result) {
              console.log('hmmmm');
                assignCurrentUser(result);
            });
        };
    }]);
app.filter('htmlToPlaintext', function() {
    return function(text) {
      return  text ? String(text).replace(/<[^>]+>/gm, '') : '';
    };
  }
);
//replace uppercase to regular case
app.filter('humanizeDoc', function () {
  return function (doc) {
    if (!doc) return;
    if (doc.type === 'directive') {
      return doc.name.replace(/([A-Z])/g, function ($1) {
        return '-' + $1.toLowerCase();
      });
    }
    
    return doc.label || doc.name;
  };
});
app.filter('nospace', function () {
  return function (value) {
    return (!value) ? '' : value.replace(/ /g, '');
  };
});
app.filter('orderObjectBy', function(){
    return function(input, attribute) {
        if (!angular.isObject(input)) return input;
        var array = [];
        for(var objectKey in input) {
            array.push(input[objectKey]);
        }
        array.sort(function(a, b){
            a = parseInt(a[attribute]);
            b = parseInt(b[attribute]);
            return a - b;
        });
        return array;
    }
});
app.filter('split', function() {
    return function(input, splitChar, splitIndex) {
        // do some bounds checking here to ensure it has that index
        return input.split(splitChar)[splitIndex];
    }
});
	app.controller('LoginModalCtrl', ["$scope", "$state", "$stateParams", "$http", "UsersApi", "$rootScope", "dialogs", "$modalInstance", function ($scope, $state, $stateParams, $http, UsersApi, $rootScope, dialogs, $modalInstance) {
		$scope.checking = "test";
		$scope.cancel = $scope.$dismiss;
		$scope.submitVffLogin = function () {
			//          console.log(angular.element('#vff_login_form').serialize());
			$.post('/views/login-form', angular.element('#vff_login_form').serialize()).done(function (response, status) {
				if (status === 'success') {
					if ($rootScope.destUrl) {
						//                console.log('toState',$rootScope.destUrl.name );
						//                console.log('$stateParams',$stateParams);
						$stateParams.book = $rootScope.destUrl.book;
						$stateParams.page = $rootScope.destUrl.page;
						$state.go($rootScope.destUrl.name, $stateParams);
					}
					$rootScope.currentUser = 'My Account';
					$scope.dlg.close();
				} else {
					//              console.log('Login Error!');  
				}
			});
		}; // commented out 20170503 - Moving function to DialogController
		$scope.Register = function () {
			//          console.log('Register Function triggered');
			$http({
				method: "post",
				url: 'index_new.php/views/account-register',
			}).success(function (data) {
				//              console.log(data);
				//angular.element('.modal-content').empty();
				angular.element('.modal-content').append('Registration' + data);
			});
		};
	}]);

	app.controller("GotoCtrl", ["$scope", "$state", "$stateParams", function ($scope, $state, $stateParams) {
		'use strict';
		//        console.log('newUrl', $stateParams.socialMedia);
		if ($stateParams.socialMedia == "weaveup") {
			$state.go('home');
			if ($stateParams.variable) {
				window.open('https://app.weaveup.com/boards/' + $stateParams.variable);
			} else {
				window.open('https://weaveup.com/', '_self');
			}
		}
		if ($stateParams.socialMedia == "facebook") {
			$state.go('home');
			window.open('https://www.facebook.com/valleyforgefabrics', '_blank');
		}
		if ($stateParams.socialMedia == "instagram") {
			$state.go('home');
			window.open('https://www.instagram.com/valleyforgefabrics', '_blank');
		}
		if ($stateParams.socialMedia == "contest") {
			$state.go('home');
			window.open('http://contest.valleyforge.com');
		}
		if ($stateParams.socialMedia == "pdf") {
			$state.go('home');
			window.open(apiIp + '/uploads/pdf/' + $stateParams.variable, '_blank');
		}
	}]);
	app.controller("signOutCtrl", ["$scope", "$stateParams", function ($scope, $stateParams) {
		//        console.log('newUrl', $stateParams.newUrl);
		$state.go('home');
		window.open('https://www.facebook.com/valleyforgefabrics', '_blank');
		window.location.url = "/";
	}]).filter('trusted', ['$sce', function ($sce) {
		return function (url) {
			return $sce.trustAsResourceUrl(url);
		};
}]);
	app.controller("OnlineLibraryCtrl", ["$scope", "$state", "$stateParams", "dataFactory", "$location", "dialogs", "$modal", "$rootScope", "$http", "$sce", "$window", "$filter", function ($scope, $state, $stateParams, dataFactory, $location, dialogs, $modal, $rootScope, $http, $sce, $window, $filter) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		//        console.log('$state =>', $state);
		dataFactory.getData('/lp/' + $state.current.name).success(function (data) {
			if (data) {
				if (data.content_blocks == undefined) {
					console.log('Content blocks are undefined. Redirecting.');
					//$state.go('404');
					return dataFactory.getData('/lp/404-page-not-found').success(function (data) {
						$scope.contentBlockString = data.content_blocks;
						$scope.apply;
					});
				} else {
					$scope.contentBlockString = angular.fromJson(data.content_blocks);
					//$scope.contentBlocks = angular.fromJson(data.content_blocks);
					$scope.apply;
					//          console.log('Content_blocks_String', $scope.contentBlocks);
					//$scope.contentBlocks = data.content_blocks;

				}
			}
			//$scope.contentBlockString = $scope.contentBlocks;
			return $scope.$watch('contentBlockString', function (val) {
				var content, error;
				$scope.valid = true;
				content = {};
				try {
					content = angular.fromJson(val);
				} catch (_error) {
					error = _error;
					$scope.valid = false;
				}
				if ($scope.valid) {
					return $scope.contentBlocks = content;
				}
			});
		}).error(function (error) {});
		//    console.log('$scope', $scope);
	}]);
	app.controller("DialogController", ["$scope", "$mdDialog", function ($scope, $mdDialog) {
		$scope.hide = function () {
			$mdDialog.hide();
		};
		$scope.cancel = function () {
			$mdDialog.cancel();
		};
		$scope.answer = function (answer) {
			$mdDialog.hide(answer);
		};
}]);
	app.controller("LandingPagesCtrl", ["$scope", "$state", "$stateParams", "dataFactory", "$location", "dialogs", "$modal", "$rootScope", "$http", "$sce", "$window", "$filter", "$mdSidenav", function ($scope, $state, $stateParams, dataFactory, $location, dialogs, $modal, $rootScope, $http, $sce, $window, $filter, $mdSidenav) {
		//$scope.Carousel = Carousel;
		'use strict';
		//console.log("LandingPagesCtrl was triggered!");
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.selectPane = function (url) {
			//console.log('selectPane', url);
			$http({
				method: 'GET',
				url: url
			}).success(function (html) {
				angular.element('.tab-pane').empty();
				angular.element('.tab-pane').append(html);
			});
		};
		$scope.editFavorite = function (id, sku) {
			$modal.open({
				templateUrl: 'index_new.php/account/favorites-edit/entry/' + id + '/' + sku,
				controller: 'modalFormCtrl',
				controllerAs: 'modalFormCtrl'
			});
		};
		$scope.removeFavorite = function (item) {
			$modal.open({
				templateUrl: 'index_new.php/global/action/remove-favorite/' + item,
				controller: 'modalFormCtrl',
				controllerAs: 'modalFormCtrl'
			});
		};
		$scope.removeItem = function (item) {
			$modal.open({
				templateUrl: 'index_new.php/global/action/remove-item/' + item,
				controller: 'modalFormCtrl',
				controllerAs: 'modalFormCtrl'
			});
		};
		$scope.submitProfileChangePassword = function () {
			//          console.log('submitProfileChangePassword Function triggered');
			//$scope.dlg.close();
			//          console.log(angular.element('#password').serialize());
			$.post('account/profile/password', angular.element('#password').serialize()).done(function (response, status) {
				//            console.log('status => ',status );
				if (status === 'success') {
					//              console.log('response',response);
					var instance = $modal.open({
						template: response
					});
				} else {
					//              console.log('something went wrong!');  
				}
			});
		};
		/*$scope.tiles = buildGridModel({
			icon : "avatar:svg-",
			title: "Svg-",
			background: ""
	 });
	function buildGridModel(tileTmpl){
		var it, results = [ ], imgBase = "/app/images/home/";
		for (var j=0; j<8; j++) {
			it = angular.extend({},tileTmpl);
			//it.icon  = it.icon + (j+1);
			//it.title = it.title + (j+1);
			//it.span  = { row : 1, col : 1 };
			it.url = '#';
			switch(j+1) {
				case 1:
					//it.background = "rgba(0,0,0,.5)";
					it.img = imgBase + "VFF-Home_Page-Tiles_02.jpg";
					it.title = 'ABOUT US';
					break;
				case 2: 
					//it.background = "green";
					it.img = imgBase + "VFF-Home_Page-Tiles_04.jpg";            
					it.title = 'BOOK COLLECTION';
					break;
				case 3: 
					//it.background = "darkBlue";
					it.img = imgBase + "VFF-Home_Page-Tiles_06.jpg";
					it.title = 'ROLLER SHADES';
					break;
				case 4:
					//it.background = "blue";
					it.img = imgBase + "VFF-Home_Page-Tiles_08.jpg";
					it.title = 'FABRICATED PRODUCTS';
					break;
				case 5:
					//it.background = "yellow";
					it.img = imgBase + "VFF-Home_Page-Tiles_13.jpg";
					it.title = 'PRINTED FABRICS';
					break;
				case 6: 
					//it.background = "pink";          
					it.img = imgBase + "VFF-Home_Page-Tiles_14.jpg";
					it.title = 'TBD';
					break;
				case 7: 
					//it.background = "darkBlue";
					it.img = imgBase + "VFF-Home_Page-Tiles_15.jpg";
					it.title = 'VIDEOS';
					break;
				case 8: 
					//it.background = "purple";
					it.img = imgBase + "VFF-Home_Page-Tiles_17.jpg";
					it.title = 'CONTACT US';
					break;
			}
			results.push(it);
		}
		console.log(angular.toJson(results));
		return results;
	} */
		if (!$stateParams.page) {
			if ($stateParams.pageNotFound) {
				$stateParams.page = '404-page-not-found';
			} else {
				$stateParams.page = 'home';
			}
		}
		if ($stateParams.customerId) {
			//        console.log($stateParams.customerId);
			angular.element('#register #member_customer_number').val($stateParams.customerId);
		}
		if ($stateParams.msgId) {
			msg_Url = 'http:' + apiIp + 'index_new.php/message/' + $stateParams.msgId + '/' + $stateParams.slug;
			$http.get(msg_Url)
				.then(function (response) {
					//            console.log('Response', response.data);
					var msgHtml = angular.element('#message');
					msgHtml.replaceWith(response.data);
				});
		}
		if ($stateParams.page === 'blog') {
			var $blogObject;
			$scope.contentBlocks = [{
				"content_block_type": "title_bar",
				"title_bar": {
					"image_url": "http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/560c_title_bar-blog.jpg",
					"headline": "",
					"headline_svg": "http://www.valleyforge.com/uploads/media/title_bar-blog-54_118.svg",
					"body": ""
				}
					}, {
				"content_block_type": "blog",
				"blog": {
					"title": "Blog",
					"featured_posts": {},
					"latest_posts": {}
				},
				"blogPage": function (val) {
					//                  console.log('blogPage function');
					switch (val) {
						case "next":
							$scope.contentBlocks.currentPage++;
							//                      console.log($scope.contentBlocks.currentPage);
							break;
						case "previous":
							$scope.contentBlocks.currentPage--;
							//                      console.log($scope.contentBlocks.currentPage);
							break;
						default:
					}
				}
					}];
			$scope.contentBlocks.currentPage = 1;
			$scope.$watch($scope.contentBlocks, function (val) {
				//          console.log('trigger $scope.contentBlocks');
				//          console.log('dataFactory', dataFactory);
				dataFactory.getBlogData('get_category_posts&slug=featured').success(function (data) {
					//              console.log('featured post data', data);
					$blogObject = $filter('filter')($scope.contentBlocks, {
						content_block_type: 'blog'
					})[0];
					$blogObject.blog.featured_posts = data;
					$scope.apply;
				});
			});
			$scope.$watchGroup(['contentBlocks', 'contentBlocks.currentPage'], function (val) {
				dataFactory.getBlogData('get_recent_posts', $scope.contentBlocks.currentPage).success(function (data) {
					$blogObject = $filter('filter')($scope.contentBlocks, {
						content_block_type: 'blog'
					})[0];
					//          console.log($blogObject);
					var input = [];
					for (var i = 0; i < parseInt(data.pages); i++) {
						input.push(i + 1);
					}
					data.currentPage = $scope.contentBlocks.currentPage;
					//          console.log('current page',data.currentPage);
					data.pages = input;
					$blogObject.blog.latest_posts = data;
					$scope.apply;
					//          console.log('$scope', $scope);
					$scope.contentBlogString = $blogObject;
				}).error(function (error) {});
			});
		} else {
			dataFactory.getData('/lp/' + $stateParams.page).success(function (data) {
				if (data) {
					if (data.content_blocks === undefined) {
						//console.log('content blocks are undefined. Redirecting');
						//$state.go('404');
						return dataFactory.getData('/lp/404-page-not-found').success(function (data) {
							$scope.contentBlocks = data.content_blocks;
						});
					} else {
						// console.log('double execution check');
						//console.log('Content_blocks', data.content_blocks);
						$scope.contentBlocks = data.content_blocks;

					}
				}
				$scope.contentBlockString = $scope.contentBlocks;
				return $scope.$watch('contentBlockString', function (val) {
					var content, error;
					$scope.valid = true;
					content = {};
					try {
						content = angular.fromJson(val);
					} catch (_error) {
						error = _error;
						$scope.valid = false;
					}
					if ($scope.valid) {
						$scope.contentBlocks = content;
						return content;
					}
				});

			}).error(function (error) {});
		}
		/* if ($stateParams.page == 'online-videos'){
			 $scope.$watch($scope.contentBlocks, function(val) {         
				 dataFactory.getData('/media_videos').success(function(data) {
					 console.log(data);
					 $videoGridObject = $filter('filter')($scope.contentBlocks, {content_block_type: 'videos'})[0];
					 $videoGridObject.videos = data;
					 $scope.apply;
					 console.log($scope);
				 });
			 });
		 }*/
	 }]);
	app.controller("BlogPostCtrl", ["$scope", "$state", "$stateParams", "dataFactory", "$location", "dialogs", "$modal", "$rootScope", "$http", "$sce", "$window", "$filter", function ($scope, $state, $stateParams, dataFactory, $location, dialogs, $modal, $rootScope, $http, $sce, $window, $filter) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		//        console.log("$window.location.href", $window.location.href);
		//        console.log("encodeURI", $scope.encodedURIComponentPostLocation);
		//        console.log('This is the BlogPostCtrl', $scope.encodedURIComponentPostLocation);
		//        console.log('$stateParams.post', $stateParams.post);
		$scope.contentBlocks = [{
			"content_block_type": "title_bar",
			"title_bar": {
				"image_url": "http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/560c_title_bar-blog.jpg",
				"headline": "",
				"headline_svg": "http://www.valleyforge.com/uploads/media/title_bar-blog-54_118.svg",
				"body": ""
			}
			}, {
			"content_block_type": "blog",
			"blog": {
				"title": "Blog",
				"current_post": {}
			}
			}];
		//        console.log('Content_blocks', $scope.contentBlocks);
		$scope.$watch($scope.contentBlocks, function (val) {
			dataFactory.getBlogData('get_post&post_slug=' + $stateParams.post).success(function (data) {
				//                console.log('data', data);
				$titleBarObject = $filter('filter')($scope.contentBlocks, {
					content_block_type: 'title_bar'
				})[0];
				$blogObject = $filter('filter')($scope.contentBlocks, {
					content_block_type: 'blog'
				})[0];
				$blogObject.blog.current_post = data;
				$blogObject.blog.current_post.PostLocation = $window.location.href;
				$blogObject.blog.current_post.encodedURIComponentPostLocation = encodeURIComponent($window.location.href);
				$blogObject.blog.current_post.encodedTitle = encodeURI($blogObject.blog.current_post.title_plain);
				//                console.log('postThumbnail.url', data.post.thumbnail);
				$titleBarObject.title_bar.image_url = data.post.thumbnail;
				//                console.log('blogData', $scope);
				$scope.contentBlockString = angular.toJson($scope.contentBlocks, true);
				return $scope.$watch('contentBlockString', function (val) {
					var content, error;
					$scope.valid = true;
					content = {};
					try {
						content = angular.fromJson(val);
					} catch (_error) {
						error = _error;
						$scope.valid = false;
					}
					if ($scope.valid) {
						return $scope.contentBlocks = content;
					}
				});
			}).error(function (error) {});
		});
	}]);
	app.controller("DemoCtrl", ["$scope", "$state", "$stateParams", function ($scope, $state, $stateParams) {
		$scope.contentBlocks = [{
			content_block_type: 'title_bar',
			title_bar: {
				image_url: 'http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/Title_Bars/54f1_sustainability-title_bar.jpg',
				headline: $stateParams.page,
				body: 'This luxurious textured fabric is naturally elegant in earth tone colors, while saturated and sophisticated in the vibrant tones.'
			}
			}, {
			content_block_type: 'standard_block',
			color: 'black',
			alignment: 'center',
			standard_block: {
				body: "Valley Forge Fabrics is the world's leading supplier of decorative interior textiles for the Hospitality industry. As a part of our sustainability mission, Valley Forge is dedicated to living and working together harmoniously with our environment. Valley Forge uses its influence and size in the textile manufacturing industry to further the use of recycled fiber, fiber made from Eucalyptus and recyclable textiles. We have made preservation of our planet and its resources a priority since 2002 by including recycled product in our standard product line that is marketed around the world. Today that commitment has grown exponentially and FRESH® Fabrics now account for more than 50% of Valley Forge's running line collections.",
			}
			}, {
			content_block_type: 'tabs',
			style: 'transparent-black',
			tabs: [{
				label: 'FRESH',
				url: 'fresh',
				tabContentBlocks: [{
					content_block_type: 'standard_block',
					color: 'black',
					alignment: 'center',
					standard_block: {
						headline: 'FRESH',
						body: 'This luxurious textured fabric is naturally elegant in earth tone colors, while saturated and sophisticated in the vibrant tones.',
						button: {
							label: 'Browse Our Collections',
							url: '/fabric-collections',
							style: 'transparent-black'
						}
					}
							}]
					}, {
				label: 'Carbon Off-Setting',
				url: 'carbon-off-setting',
				tabContentBlocks: [{
					content_block_type: 'standard_block',
					color: 'black',
					alignment: 'center',
					standard_block: {
						headline: 'Carbon Off-Setting'
					}
							}, {
					content_block_type: 'banner_carousel',
					banner_carousel: [{
						url: '/search',
						images: {
							"xs": "assets/images/banner/vff-home_banner-elephant_320x220_mobile.jpg",
							"sm": "assets/images/banner/vff-home_banner-elephant_480x320_mobile.jpg",
							"md": "assets/images/banner/vff-home_banner-elephant_768x600.jpg",
							"lg": "assets/images/banner/vff-home_banner-elephant_992x496.jpg",
							"xl": "assets/images/banner/vff-home_banner-elephant_1400x580.jpg"
						}
									}, {
						url: '/search',
						images: {
							"xs": "assets/images/banner/vff-home_banner-fresh_320x220_mobile.jpg",
							"sm": "assets/images/banner/vff-home_banner-fresh_480x320_mobile.jpg",
							"md": "assets/images/banner/vff-home_banner-fresh_768x600.jpg",
							"lg": "assets/images/banner/vff-home_banner-fresh_992x496.jpg",
							"xl": "assets/images/banner/vff-home_banner-fresh_1400x580.jpg"
						}
									}, {
						url: '/search',
						images: {
							"xs": "assets/images/banner/vff-home_banner-dance_320x220_mobile.jpg",
							"sm": "assets/images/banner/vff-home_banner-dance_480x320_mobile.jpg",
							"md": "assets/images/banner/vff-home_banner-dance_768x600.jpg",
							"lg": "assets/images/banner/vff-home_banner-dance_992x496.jpg",
							"xl": "assets/images/banner/vff-home_banner-dance_1400x580.jpg"
						}
									}]
							}]
					}, {
				label: 'Preposition 65',
				url: 'preposition-65',
				tabContentBlocks: [{
					content_block_type: 'standard_block',
					color: 'black',
					alignment: 'center',
					standard_block: {
						headline: 'Preposition 65'
					}
							}]
					}, {
				label: 'Our Commitment',
				url: 'our-commitment',
				tabContentBlocks: [{
					content_block_type: 'standard_block',
					color: 'black',
					alignment: 'center',
					standard_block: {
						headline: 'Our Commitment'
					}
							}]
					}]
			}, {
			content_block_type: 'banner_carousel',
			banner_carousel: [{
				url: '/search',
				images: {
					"xs": "assets/images/banner/vff-home_banner-elephant_320x220_mobile.jpg",
					"sm": "assets/images/banner/vff-home_banner-elephant_480x320_mobile.jpg",
					"md": "assets/images/banner/vff-home_banner-elephant_768x600.jpg",
					"lg": "assets/images/banner/vff-home_banner-elephant_992x496.jpg",
					"xl": "assets/images/banner/vff-home_banner-elephant_1400x580.jpg"
				}
					}, {
				url: '/search',
				images: {
					"xs": "assets/images/banner/vff-home_banner-fresh_320x220_mobile.jpg",
					"sm": "assets/images/banner/vff-home_banner-fresh_480x320_mobile.jpg",
					"md": "assets/images/banner/vff-home_banner-fresh_768x600.jpg",
					"lg": "assets/images/banner/vff-home_banner-fresh_992x496.jpg",
					"xl": "assets/images/banner/vff-home_banner-fresh_1400x580.jpg"
				}
					}, {
				url: '/search',
				images: {
					"xs": "assets/images/banner/vff-home_banner-dance_320x220_mobile.jpg",
					"sm": "assets/images/banner/vff-home_banner-dance_480x320_mobile.jpg",
					"md": "assets/images/banner/vff-home_banner-dance_768x600.jpg",
					"lg": "assets/images/banner/vff-home_banner-dance_992x496.jpg",
					"xl": "assets/images/banner/vff-home_banner-dance_1400x580.jpg"
				}
					}]
			}, {
			content_block_type: 'standard_block',
			color: 'black',
			alignment: 'center',
			standard_block: {
				headline: "Create",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, arcu ac varius egestas, urna elit dignissim ipsum, tincidunt condimentum sapien neque eget risus. Proin semper dictum lorem, id consequat est volutpat quis. Phasellus ut commodo diam, quis ornare massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
			}
			}, {
			content_block_type: 'fluid_grid',
			fluid_grid: [{
				'url': '/boards/25',
				'image_url': 'assets/images/home/home_page-grid-1-Talio.jpg',
				'columns': '6',
				'size': 'full',
				'headline': 'Telaio',
				'body': 'This luxurious textured fabric is naturally elegant in earth tone colors, while saturated and sophisticated in the vibrant tones.',
				'button': {
					'label': 'Browse Our Collections',
					'url': '/fabric-collections',
					'style': 'transparent-black'
				}
					}, {
				'url': '/search',
				'image_url': 'assets/images/home/home_page-grid-2-Shibori.jpg',
				'columns': '3',
				'size': 'half',
				'headline': 'Shibori',
				'body': 'Inspired by the ancient Japanese dyeing technique known by the same name',
				'button': {
					'label': 'Browse Our Printed Collections',
					'url': '/custom-print',
					'style': 'transparent-black'
				}
					}, {
				'url': '/how-it-works',
				'image_url': 'assets/images/home/home_page-grid-3.jpg',
				'columns': '3',
				'size': 'half'
					}, {
				'url': '/how-it-works',
				'image_url': 'assets/images/home/home_page-grid-4.jpg',
				'columns': '6',
				'size': 'half'
					}, {
				'url': '/how-it-works',
				'image_url': 'assets/images/home/home_page-grid-5.jpg',
				'columns': '6',
				'size': 'half'
					}, {
				'url': '/how-it-works',
				'image_url': 'assets/images/home/home_page-grid-6.jpg',
				'columns': '3',
				'size': 'half'
					}, {
				'url': '/how-it-works',
				'image_url': 'assets/images/home/home_page-grid-7.jpg',
				'columns': '3',
				'size': 'half'
					}]
			}, {
			content_block_type: 'standard_block',
			color: 'black',
			alignment: 'center',
			standard_block: {
				headline: "Sustainability",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, arcu ac varius egestas, urna elit dignissim ipsum, tincidunt condimentum sapien neque eget risus. Proin semper dictum lorem, id consequat est volutpat quis. Phasellus ut commodo diam, quis ornare massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
			}
			}, {
			content_block_type: 'standard_block',
			alignment: 'center',
			standard_block: {
				headline: "Innovation",
				body: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aenean maximus, arcu ac varius egestas, urna elit dignissim ipsum, tincidunt condimentum sapien neque eget risus. Proin semper dictum lorem, id consequat est volutpat quis. Phasellus ut commodo diam, quis ornare massa. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.",
			}
			}];
		$scope.contentBlockString = angular.toJson($scope.contentBlocks, true);
		return $scope.$watch('contentBlockString', function (val) {
			var content, error;
			$scope.valid = true;
			content = {};
			try {
				content = angular.fromJson(val);
			} catch (_error) {
				error = _error;
				$scope.valid = false;
			}
			if ($scope.valid) {
				return $scope.contentBlocks = content;
			}
		});
	}]);
	app.controller("TimeLineCtrl", ["$scope", "$location", "$window", function ($scope, $location, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.contentBlocks = [];
	}]);
	app.controller('productDetailCtrl', ['$scope', '$rootScope', '$filter', '$http', 'dataFactory', '$stateParams', '$location', '$timeout', '$window', function ($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $location, $timeout, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.productDetail = {};
		dataFactory.getData('/product-detail/' + $stateParams.id).success(function (data) {
			//            console.log(data);
			$scope.productDetail = data;
		});
	}]);
	app.controller('MediaAdsCtrl', ['$scope', '$rootScope', '$filter', '$http', 'dataFactory', '$stateParams', '$location', '$timeout', '$window', function ($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $location, $timeout, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.Ads = {};
		dataFactory.getData('/media_advertising').success(function (data) {
			//            console.log(data);
			$scope.Ads = data;
		});
	}]);
	app.controller('MediaAwardsRecognitionCtrl', ['$scope', '$rootScope', '$filter', '$http', 'dataFactory', '$stateParams', '$location', '$timeout', '$window', function ($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $location, $timeout, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.Awards = {};
		dataFactory.getData('/media_awards').success(function (data) {
			//            console.log(data);
			$scope.Awards = data;
		});
		//        console.log($scope);
	}]);
	app.controller('MediaVideosCtrl', ['$scope', '$rootScope', '$filter', '$http', 'dataFactory', '$stateParams', '$location', '$timeout', '$window', function ($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $location, $timeout, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.Videos = {};
		dataFactory.getData('/media_videos').success(function (data) {
			//            console.log(data);
			$scope.Videos = data;
		});
		//        console.log($scope);
	}]);
	app.controller('contactUsCtrl', ['$scope', '$rootScope', '$filter', '$modal', 'dialogs', '$http', 'dataFactory', '$state', '$stateParams', '$location', '$timeout', '$window', function ($scope, $rootScope, $filter, $modal, dialogs, $http, dataFactory, $state, $stateParams, $location, $timeout, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.oneAtATime = true;
		$scope.groups = [
			{
				title: 'Dynamic Group Header - 1',
				content: 'Dynamic Group Body - 1'
					}, {
				title: 'Dynamic Group Header - 2',
				content: 'Dynamic Group Body - 2'
					}
				];
		$scope.items = ['Item 1', 'Item 2', 'Item 3'];
		$scope.addItem = function () {
			var newItemNo = $scope.items.length + 1;
			$scope.items.push('Item ' + newItemNo);
		};
		$scope.status = {
			isFirstOpen: true,
			isFirstDisabled: false
		};
		$scope.states = [{
			StateID: 'AL',
			StateName: 'Alabama'
			}, {
			StateID: 'AK',
			StateName: 'Alaska'
			}, {
			StateID: 'AZ',
			StateName: 'Arizona'
			}, {
			StateID: 'AR',
			StateName: 'Arkansas'
			}, {
			StateID: 'CA',
			StateName: 'California'
			}, {
			StateID: 'CO',
			StateName: 'Colorado'
			}, {
			StateID: 'CT',
			StateName: 'Connecticut'
			}, {
			StateID: 'DE',
			StateName: 'Delaware'
			}, {
			StateID: 'DC',
			StateName: 'District of Columbia'
			}, {
			StateID: 'FL',
			StateName: 'Florida'
			}, {
			StateID: 'GA',
			StateName: 'Georgia'
			}, {
			StateID: 'GU',
			StateName: 'Guam'
			}, {
			StateID: 'HI',
			StateName: 'Hawaii'
			}, {
			StateID: 'ID',
			StateName: 'Idaho'
			}, {
			StateID: 'IL',
			StateName: 'Illinois'
			}, {
			StateID: 'IN',
			StateName: 'Indiana'
			}, {
			StateID: 'IA',
			StateName: 'Iowa'
			}, {
			StateID: 'KS',
			StateName: 'Kansas'
			}, {
			StateID: 'KY',
			StateName: 'Kentucky'
			}, {
			StateID: 'LA',
			StateName: 'Louisiana'
			}, {
			StateID: 'ME',
			StateName: 'Maine'
			}, {
			StateID: 'MD',
			StateName: 'Maryland'
			}, {
			StateID: 'MA',
			StateName: 'Massachusetts'
			}, {
			StateID: 'MI',
			StateName: 'Michigan'
			}, {
			StateID: 'MN',
			StateName: 'Minnesota'
			}, {
			StateID: 'MS',
			StateName: 'Mississippi'
			}, {
			StateID: 'MO',
			StateName: 'Missouri'
			}, {
			StateID: 'MT',
			StateName: 'Montana'
			}, {
			StateID: 'NE',
			StateName: 'Nebraska'
			}, {
			StateID: 'NV',
			StateName: 'Nevada'
			}, {
			StateID: 'NH',
			StateName: 'New Hampshire'
			}, {
			StateID: 'NJ',
			StateName: 'New Jersey'
			}, {
			StateID: 'NM',
			StateName: 'New Mexico'
			}, {
			StateID: 'NY',
			StateName: 'New York'
			}, {
			StateID: 'NC',
			StateName: 'North Carolina'
			}, {
			StateID: 'ND',
			StateName: 'North Dakota'
			}, {
			StateID: 'OH',
			StateName: 'Ohio'
			}, {
			StateID: 'OK',
			StateName: 'Oklahoma'
			}, {
			StateID: 'OR',
			StateName: 'Oregon'
			}, {
			StateID: 'PA',
			StateName: 'Pennsylvania'
			}, {
			StateID: 'PR',
			StateName: 'Puerto Rico'
			}, {
			StateID: 'RI',
			StateName: 'Rhode Island'
			}, {
			StateID: 'SC',
			StateName: 'South Carolina'
			}, {
			StateID: 'SD',
			StateName: 'South Dakota'
			}, {
			StateID: 'TN',
			StateName: 'Tennessee'
			}, {
			StateID: 'TX',
			StateName: 'Texas'
			}, {
			StateID: 'UT',
			StateName: 'Utah'
			}, {
			StateID: 'VT',
			StateName: 'Vermont'
			}, {
			StateID: 'VA',
			StateName: 'Virginia'
			}, {
			StateID: 'VI',
			StateName: 'Virgin Islands'
			}, {
			StateID: 'WA',
			StateName: 'Washington'
			}, {
			StateID: 'WV',
			StateName: 'West Virginia'
			}, {
			StateID: 'WI',
			StateName: 'Wisconsin'
			}, {
			StateID: 'WY',
			StateName: 'Wyoming'
			}, ];
		$scope.submitForm = function (form) {
			//            console.log('form name', '#' + form.$name);
			//            console.log('form', form);
			$.post(apiIp + 'index.php?ACT=80', angular.element('#' + form.$name).serialize()).done(function (response) {
				//                console.log('angular.element success_form', angular.element('#' + form.$name).serialize());
				var contactResponse = angular.fromJson(response);
				//                console.log('done', contactResponse);
				if (contactResponse.success) {
					//                    console.log('success = true');
					switch (form.$name) {
						case 'document_approval':
							dialogs.notify('Employee Handbook Approval', 'Thank you for submitting.');
							break;
						case 'contact_valley_forge':
							dialogs.notify('Contact Form', 'Your inquiry has been submitted. Please allow 24 business hours for a reply.');
							break;
						default:
							dialogs.notify('Notification', 'Thank you.');
					};
					$state.go('home');
				} else {
					//                    console.log('success = false', contactResponse.errors[0]);
					dialogs.error('Error', contactResponse.errors);
				}
				//                console.log('done Json', angular.toJson(response));
			}).fail(function (response) {
				//                console.log('fail', response);
			});
		};
		$scope.xmail = function (name, xmailvar) {
			var name;
			var obj = angular.element('#' + xmailvar);
			var i;
			//          console.log(obj);
			//          console.log(name);          
			for (i = 0; i < obj.length; i++) {
				if (obj[i]) {
					switch (name) {
						case 'Africa':
							email = 'kroeser';
							break;
						case 'Alabama':
							email = 'lverhoff';
							break;
						case 'Alaska':
							email = 'cfoote';
							break;
						case 'Arizona':
							email = 'pfakhri';
							break;
						case 'Arkansas':
							email = 'astgermain';
							break;
						case 'Asia':
							email = 'kdaly';
							break;
						case 'Asia & India Subcontinent':
							email = 'kdaly';
							break;
						case 'Oceania & Pacific':
							email = 'kdaly';
							break;
						case 'Australia':
							email = 'kdaly';
							break;
						case 'Canada':
							email = 'kdaly';
							break;
						case 'China':
							email = 'kdaly';
							break;
						case 'HongKong':
							email = 'kdaly';
							break;
						case 'Singapore':
							email = 'kdaly';
							break;
						case 'Orange County':
							email = 'pfakhri';
							break;
						case 'Los Angeles':
							email = 'pfakhri';
							break;
						case 'Reno / Tahoe':
							email = 'cfoote';
							break;
						case 'San Diego / Southern CA':
							email = 'pfakhri';
							break;
						case 'San Francisco / Northern CA':
							email = 'cfoote';
							break;
						case 'Santa Barbara':
							email = 'pfakhri';
							break;
						case 'Alberta / Calgary':
							email = 'cfoote';
							break;
						case 'Halifax / NovaScotia':
							email = 'ssmith';
							break;
						case 'Vancouver / British Col':
							email = 'cfoote';
							break;
						case 'Manitoba / Winnepeg':
							email = 'cfoote';
							break;
						case 'Montreal / Quebec':
							email = 'astgermain';
							break;
						case 'Toronto / Ontario':
							email = 'ssmith';
							break;
						case 'Carribbean':
							email = 'jcontreras';
							break;
						case 'Trinidad':
							email = 'jcontreras';
							break;
						case 'Central & South America':
							email = 'jcontreras';
							break;
						case 'Central America':
							email = 'jcontreras';
							break;
						case 'South America':
							email = 'jcontreras';
							break;
						case 'Colorado':
							email = 'lbellamy';
							break;
						case 'Connecticut':
							email = 'ktrezza';
							break;
						case 'Delaware':
							email = 'mmagazzeni';
							break;
						case 'Middle East':
							email = 'kroeser';
							break;
						case 'Dubai':
							email = 'kroeser';
							break;
						case 'Europe':
							email = 'kroeser';
							break;
						case 'Florida':
							email = 'jcontreras';
							break;
						case 'Georgia':
							email = 'lverhoff';
							break;
						case 'Hawaii':
							email = 'cfoote';
							break;
						case 'Hong Kong':
							email = 'kdaly';
							break;
						case 'HPG HK':
							email = 'kdaly';
							break;
						case 'Idaho':
							email = 'cfoote';
							break;
						case 'Illinois':
							email = 'adobin';
							break;
						case 'Indiana':
							email = 'adobin';
							break;
						case 'Iowa':
							email = 'adobin';
							break;
						case 'Kansas':
							email = 'astgermain';
							break;
						case 'Kentucky':
							email = 'mmagazzeni';
							break;
						case 'Louisiana':
							email = 'astgermain';
							break;
						case 'Maine':
							email = 'ssmith';
							break;
						case 'Maryland':
							email = 'gphipps';
							break;
						case 'Massachusetts':
							email = 'ssmith';
							break;
						case 'Michigan':
							email = 'adobin';
							break;
						case 'Minnesota':
							email = 'adobin';
							break;
						case 'Mississippi':
							email = 'lverhoff';
							break;
						case 'Missouri':
							email = 'kgrupinski';
							break;
						case 'Montana':
							email = 'cfoote';
							break;
						case 'Nebraska':
							email = 'lbellamy';
							break;
						case 'Nevada':
							email = 'kdaly';
							break;
						case 'New Hampshire':
							email = 'ssmith';
							break;
						case 'New Jersey(Northern)':
							email = 'mmagazzeni';
							break;
						case 'Atlantic City':
							email = 'mmagazzeni';
							break;
						case 'New Mexico':
							email = 'lbellamy';
							break;
						case 'New York':
							email = 'ssmith';
							break;
						case 'NYC Main':
							email = 'ktrezza';
							break;
						case 'NYC Outskirts':
							email = 'mmagazzeni';
							break;
						case 'North Carolina':
							email = 'lverhoff';
							break;
						case 'North Dakota':
							email = 'adobin';
							break;
						case 'Ohio':
							email = 'mmagazzeni';
							break;
						case 'Oklahoma':
							email = 'astgermain';
							break;
						case 'Oregon':
							email = 'cfoote';
							break;
						case 'Pennsylvania':
							email = 'mmagazzeni';
							break;
						case 'Philadelphia Area':
							email = 'mmagazzeni';
							break;
						case 'Pittsburgh Area':
							email = 'mmagazzeni';
							break;
						case 'Rhode Island':
							email = 'ssmith';
							break;
						case 'South Carolina':
							email = 'lverhoff';
							break;
						case 'South Dakota':
							email = 'adobin';
							break;
						case 'Tennessee':
							email = 'lverhoff';
							break;
						case 'Texas':
							email = 'astgermain';
							break;
						case 'Utah':
							email = 'jgritten';
							break;
						case 'Vermont':
							email = 'ssmith';
							break;
						case 'Virginia':
							email = 'gphipps';
							break;
						case 'Washington':
							email = 'cfoote';
							break;
						case 'Washington, D.C.':
							email = 'gphipps';
							break;
						case 'West Virginia':
							email = 'gphipps';
							break;
						case 'Wisconsin':
							email = 'adobin';
							break;
						case 'Wyoming':
							email = 'lbellamy';
							break;
					}
					var domain = new Array('com', '.', 'forg', 'ley', 'val').reverse().toString();
					domain = domain.replace(/\,/g, '').replace(/(forg)/g, '$1e');
					//obj.href = 'mailto:' + name + '@' + domain + '?subject=Hello';
					obj[0].href = 'mailto:' + email + '@valleyforge.com?subject=Valley Forge Contact Form';
				}
			}
			return true;
		}
	}]);
	app.controller('ProfessionalityCtrl', ["$scope", "$location", "$document", "$window", function ($scope, $location, $document, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		angular.element('.footer-bar').hide();
		/*$scope.toTheTop = function() {
				$document.scrollTopAnimated(0, 5000).then(function() {
						console && console.log('You just scrolled to the top!');
				});
		}*/
		/*var section2 = angular.element(document.getElementById('section-2'));
		$scope.toSection2 = function() {
				$document.scrollToElementAnimated(section2);
		}*/
	}]).value('duScrollOffset', 30);
	app.controller('DesignLibraryCtrl', ['$scope', '$rootScope', '$filter', '$http', 'dataFactory', '$stateParams', '$modal', '$location', '$timeout', '$window', function ($scope, $rootScope, $filter, $http, dataFactory, $stateParams, $modal, $location, $timeout, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
			//            console.log('location.url', $location.url());
		});
		$scope.formData = {};
		$scope.currentSearchParams = {};
		$scope.searchParams = {};
		var design_library_url = '/design-library';
		var design_library_filters_url = '/design_library_filter';
		var book = $stateParams.book;
		var orderBy = $filter('orderBy');
		if (book != '') {
			//		   console.log('/design-library/'.book);
		}
		$scope.currentPage = 1;
		$scope.samples = {};
		$scope.samples.updateCallCount = 0;
		$scope.totalDisplayed = 36;
		$scope.reverse = 'false';
		$scope.predicate = '';
		$rootScope.previousSample = null;
		$scope.currentPredicate = '';
		$scope.getFilters = function (qs) {
			url = design_library_filters_url + '/' + qs;
			//            console.log('get filter url', url);
			dataFactory.getData(url).success(function (data) {
				$scope.filters = data;
				//                console.log('filters', data);
				//                console.log('use', data.use);
				$scope.availableSearchParams = [{
					key: "book",
					name: "Book",
					placeholder: "Book...",
					filter: data.book
							}, {
					key: "use",
					name: "Fabric Use",
					placeholder: "Use...",
					filter: ["bedskirt", "drapery", "duvet cover", "headboard only", "sheer", "sheets", "throw pillows", "top-of-the-bed", "upholstery"]
							}, {
					key: "type",
					name: "Type",
					placeholder: "Type...",
					filter: ["Boucle", "Chenille", "Crinkle", "Crypton", "Matelasse", "Nanotex", "PFP", "Sheer", "Sheeting", "Tafetta", "Velvet", "Vinyl"]
							}, {
					key: "style",
					name: "Style",
					placeholder: "Style...",
					filter: ["Abstract", "African", "Animal", "Arabesque", "Architecture", "Arrows", "Art", "Basketweave", "Batik", "Beach", "Borders", "Box", "Brocade", "Camouflage", "Celtic", "Check", "Chevron", "Chinese", "Circles", "Clouds", "Contemporary", "Critters", "Damask", "Deco", "Desert", "Diamond", "Dots", "Drinks", "Elements", "Embroidery", "Ethnic", "Fleur-de-lis", "Floral", "Fruits", "Geometric ", "Grasses", "Green", "Hearts", "Herringbone", "Houndstooth", "Ikat", "Indian", "Japanese", "Landscapes", "Latticework", "Leaf", "Letters", "Maps", "Marinelife", "Medallions", "Modern", "Moire", "Monochromatic", "Moroccan", "Musical", "Nautical", "Novelty", "Numbers", "Ombre", "Optical Illusions", "Organic", "Ornaments", "Oval", "Paisley", "Panels", "Photography", "Plaid", "Reptile", "Retro", "Scrolls", "Skins", "Solid", "Southwestern", "Stars", "Stripe", "Swirl", "Tapestry", "Texture", "Toile", "Traditional", "Transitional", "Trees", "Triangles", "Tribal", "Tropical", "Vegetables", "Vines", "Vintage", "Water", "Watercolors", "Wavy", "Whimsical", "Woodlands", "Words", "Wordy Words"]
							}, {
					key: "color",
					name: "Color",
					placeholder: "Color...",
					filter: ["Beige", "Black", "Blue", "Bronze", "Brown", "Cream", "Gold", "Green", "Grey", "Khaki", "Light Blue", "Merlot", "Multi", "Navy", "Off white", "Orange", "Pink", "Purple", "Red", "Salmon", "Silver", "Tan", "Taupe", "Turquoise", "Un-Dyed", "White", "Yellow"]
							}, {
					key: "content",
					name: "Content",
					placeholder: "Content...",
					filter: ["Acrylic", "Avora", "BACK: Acrylic", "BACK: Avora", "BACK: Cellulose", "BACK: Cotton", "BACK: FR Polyester", "BACK: FRESH", "BACK: Linen", "BACK: Lurex", "BACK: Lyocell", "BACK: Mohair", "BACK: Nylon", "BACK: Olefin", "BACK: Polyester ", "BACK: Polyolefin", "BACK: PU (Polyurethane)", "BACK: PVC (Polyvinyl Chloride)", "BACK: Rayon", "BACK: Recycled Polyester", "BACK: Silk", "BACK: Solution Dyed Acrylic", "BACK: Tencel+Plus™", "BACK: Trevira CS", "BACK: Viscose", "BACK: Wool", "Cellulose", "Cotton", "FACE: Acrylic", "FACE: Avora", "FACE: Cellulose", "FACE: Cotton", "FACE: FR Polyester", "FACE: FRESH", "FACE: Linen", "FACE: Lurex", "FACE: Lyocell", "FACE: Mohair", "FACE: Nylon", "FACE: Olefin", "FACE: Polyester ", "FACE: Polyolefin", "FACE: PU (Polyurethane)", "FACE: PVC (Polyvinyl Chloride)", "FACE: Rayon", "FACE: Recycled Polyester", "FACE: Silk", "FACE: Solution Dyed Acrylic", "FACE: Tencel+Plus™", "FACE: Trevira CS", "FACE: Viscose", "FACE: Wool", "FR Polyester", "FRESH", "Linen", "Lurex", "Lyocell", "Mohair", "Nylon", "Olefin", "Polyester ", "Polyolefin", "Post Consumer Recycled Polyester", "Pre Consumer Recycled Polyester", "PU (Polyurethane)", "PVC (Polyvinyl Chloride)", "Rayon", "Silk", "Solution Dyed Acrylic", "Tencel+Plus™", "Trevira CS", "Viscose", "Wool"]
							}];
			});
		};
		$scope.getFilters();
		$scope.availableInventory = '';
		var tempavailableInventory = '',
			inventoryTimeout, searchParamsTimeout;;
		$scope.tags = [];
		$scope.availableSearchParams = [{
			key: "book",
			name: "Book",
			placeholder: "Book..."
			}, {
			key: "use",
			name: "Fabric Use",
			placeholder: "Use...",
			filter: ["bedskirt", "drapery", "duvet cover", "headboard only", "sheer", "sheets", "throw pillows", "top-of-the-bed", "upholstery"]
			}, {
			key: "type",
			name: "Type",
			placeholder: "Type...",
			filter: ["Boucle", "Chenille", "Crinkle", "Crypton", "Matelasse", "Nanotex", "PFP", "Sheer", "Sheeting", "Tafetta", "Velvet", "Vinyl"]
			}, {
			key: "style",
			name: "Style",
			placeholder: "Style...",
			filter: ["Abstract", "African", "Animal", "Arabesque", "Architecture", "Arrows", "Art", "Basketweave", "Batik", "Beach", "Borders", "Box", "Brocade", "Camouflage", "Celtic", "Check", "Chevron", "Chinese", "Circles", "Clouds", "Contemporary", "Critters", "Damask", "Deco", "Desert", "Diamond", "Dots", "Drinks", "Elements", "Embroidery", "Ethnic", "Fleur-de-lis", "Floral", "Fruits", "Geometric ", "Grasses", "Green", "Hearts", "Herringbone", "Houndstooth", "Ikat", "Indian", "Japanese", "Landscapes", "Latticework", "Leaf", "Letters", "Maps", "Marinelife", "Medallions", "Modern", "Moire", "Monochromatic", "Moroccan", "Musical", "Nautical", "Novelty", "Numbers", "Ombre", "Optical Illusions", "Organic", "Ornaments", "Oval", "Paisley", "Panels", "Photography", "Plaid", "Reptile", "Retro", "Scrolls", "Skins", "Solid", "Southwestern", "Stars", "Stripe", "Swirl", "Tapestry", "Texture", "Toile", "Traditional", "Transitional", "Trees", "Triangles", "Tribal", "Tropical", "Vegetables", "Vines", "Vintage", "Water", "Watercolors", "Wavy", "Whimsical", "Woodlands", "Words", "Wordy Words"]
			}, {
			key: "color",
			name: "Color",
			placeholder: "Color...",
			filter: ["Beige", "Black", "Blue", "Bronze", "Brown", "Cream", "Gold", "Green", "Grey", "Khaki", "Light Blue", "Merlot", "Multi", "Navy", "Off white", "Orange", "Pink", "Purple", "Red", "Salmon", "Silver", "Tan", "Taupe", "Turquoise", "Un-Dyed", "White", "Yellow"]
			}, {
			key: "content",
			name: "Content",
			placeholder: "Content...",
			filter: ["Acrylic", "Avora", "BACK: Acrylic", "BACK: Avora", "BACK: Cellulose", "BACK: Cotton", "BACK: FR Polyester", "BACK: FRESH", "BACK: Linen", "BACK: Lurex", "BACK: Lyocell", "BACK: Mohair", "BACK: Nylon", "BACK: Olefin", "BACK: Polyester ", "BACK: Polyolefin", "BACK: PU (Polyurethane)", "BACK: PVC (Polyvinyl Chloride)", "BACK: Rayon", "BACK: Recycled Polyester", "BACK: Silk", "BACK: Solution Dyed Acrylic", "BACK: Tencel+Plus™", "BACK: Trevira CS", "BACK: Viscose", "BACK: Wool", "Cellulose", "Cotton", "FACE: Acrylic", "FACE: Avora", "FACE: Cellulose", "FACE: Cotton", "FACE: FR Polyester", "FACE: FRESH", "FACE: Linen", "FACE: Lurex", "FACE: Lyocell", "FACE: Mohair", "FACE: Nylon", "FACE: Olefin", "FACE: Polyester ", "FACE: Polyolefin", "FACE: PU (Polyurethane)", "FACE: PVC (Polyvinyl Chloride)", "FACE: Rayon", "FACE: Recycled Polyester", "FACE: Silk", "FACE: Solution Dyed Acrylic", "FACE: Tencel+Plus™", "FACE: Trevira CS", "FACE: Viscose", "FACE: Wool", "FR Polyester", "FRESH", "Linen", "Lurex", "Lyocell", "Mohair", "Nylon", "Olefin", "Polyester ", "Polyolefin", "Post Consumer Recycled Polyester", "Pre Consumer Recycled Polyester", "PU (Polyurethane)", "PVC (Polyvinyl Chloride)", "Rayon", "Silk", "Solution Dyed Acrylic", "Tencel+Plus™", "Trevira CS", "Viscose", "Wool"]
			}, {
			key: "yardage",
			name: "Yardage",
			placeholder: "Yardage..."
			}];
		$scope.availableSP = {
			book: {
				key: "book",
				name: "Book",
				placeholder: "Book..."
			},
			use: {
				key: "use",
				name: "Fabric Use",
				placeholder: "Use...",
				filter: ["bedskirt", "drapery", "duvet cover", "headboard only", "sheer", "sheets", "throw pillows", "top-of-the-bed", "upholstery"]
			},
			type: {
				key: "type",
				name: "Type",
				placeholder: "Type...",
				filter: ["Boucle", "Chenille", "Crinkle", "Crypton", "Matelasse", "Nanotex", "PFP", "Sheer", "Sheeting", "Tafetta", "Velvet", "Vinyl"]
			},
			style: {
				key: "style",
				name: "Style",
				placeholder: "Style...",
				filter: ["Abstract", "African", "Animal", "Arabesque", "Architecture", "Arrows", "Art", "Basketweave", "Batik", "Beach", "Borders", "Box", "Brocade", "Camouflage", "Celtic", "Check", "Chevron", "Chinese", "Circles", "Clouds", "Contemporary", "Critters", "Damask", "Deco", "Desert", "Diamond", "Dots", "Drinks", "Elements", "Embroidery", "Ethnic", "Fleur-de-lis", "Floral", "Fruits", "Geometric ", "Grasses", "Green", "Hearts", "Herringbone", "Houndstooth", "Ikat", "Indian", "Japanese", "Landscapes", "Latticework", "Leaf", "Letters", "Maps", "Marinelife", "Medallions", "Modern", "Moire", "Monochromatic", "Moroccan", "Musical", "Nautical", "Novelty", "Numbers", "Ombre", "Optical Illusions", "Organic", "Ornaments", "Oval", "Paisley", "Panels", "Photography", "Plaid", "Reptile", "Retro", "Scrolls", "Skins", "Solid", "Southwestern", "Stars", "Stripe", "Swirl", "Tapestry", "Texture", "Toile", "Traditional", "Transitional", "Trees", "Triangles", "Tribal", "Tropical", "Vegetables", "Vines", "Vintage", "Water", "Watercolors", "Wavy", "Whimsical", "Woodlands", "Words", "Wordy Words"]
			},
			color: {
				key: "color",
				name: "Color",
				placeholder: "Color...",
				filter: ["Beige", "Black", "Blue", "Bronze", "Brown", "Cream", "Gold", "Green", "Grey", "Khaki", "Light Blue", "Merlot", "Multi", "Navy", "Off white", "Orange", "Pink", "Purple", "Red", "Salmon", "Silver", "Tan", "Taupe", "Turquoise", "Un-Dyed", "White", "Yellow"]
			},
			content: {
				key: "content",
				name: "Content",
				placeholder: "Content...",
				filter: ["Acrylic", "Avora", "BACK: Acrylic", "BACK: Avora", "BACK: Cellulose", "BACK: Cotton", "BACK: FR Polyester", "BACK: FRESH", "BACK: Linen", "BACK: Lurex", "BACK: Lyocell", "BACK: Mohair", "BACK: Nylon", "BACK: Olefin", "BACK: Polyester ", "BACK: Polyolefin", "BACK: PU (Polyurethane)", "BACK: PVC (Polyvinyl Chloride)", "BACK: Rayon", "BACK: Recycled Polyester", "BACK: Silk", "BACK: Solution Dyed Acrylic", "BACK: Tencel+Plus™", "BACK: Trevira CS", "BACK: Viscose", "BACK: Wool", "Cellulose", "Cotton", "FACE: Acrylic", "FACE: Avora", "FACE: Cellulose", "FACE: Cotton", "FACE: FR Polyester", "FACE: FRESH", "FACE: Linen", "FACE: Lurex", "FACE: Lyocell", "FACE: Mohair", "FACE: Nylon", "FACE: Olefin", "FACE: Polyester ", "FACE: Polyolefin", "FACE: PU (Polyurethane)", "FACE: PVC (Polyvinyl Chloride)", "FACE: Rayon", "FACE: Recycled Polyester", "FACE: Silk", "FACE: Solution Dyed Acrylic", "FACE: Tencel+Plus™", "FACE: Trevira CS", "FACE: Viscose", "FACE: Wool", "FR Polyester", "FRESH", "Linen", "Lurex", "Lyocell", "Mohair", "Nylon", "Olefin", "Polyester ", "Polyolefin", "Post Consumer Recycled Polyester", "Pre Consumer Recycled Polyester", "PU (Polyurethane)", "PVC (Polyvinyl Chloride)", "Rayon", "Silk", "Solution Dyed Acrylic", "Tencel+Plus™", "Trevira CS", "Viscose", "Wool"]
			},
			yardage: {
				key: "yardage",
				name: "Yardage",
				placeholder: "Yardage..."
			}
		};
		$scope.order = 'false';
		$scope.openAddToCartModal = function () {};

		function updateQuery(trigger) {
			if ($scope.samples.updateCallCount <= 1) {
				$scope.samples.updateCallTime = new Date().getTime();
				//console.log('updateCallTime',$scope.samples.updateCallTime);
			}
			$scope.currentPage = 1;
			//          console.log('searchParams', $scope.searchParams);
			if ($scope.searchParams) {
				if ($scope.searchParams['query']) {
					$scope.currentSearchParams['keywords'] = $scope.searchParams['query'];
				} else {
					delete $scope.currentSearchParams['keywords']
				}
				if ($scope.searchParams['use']) {
					$scope.currentSearchParams['use'] = $scope.searchParams['use'];
				} else {
					delete $scope.currentSearchParams['use']
				}
				if ($scope.searchParams['type']) {
					$scope.currentSearchParams['type'] = $scope.searchParams['type'];
				} else {
					delete $scope.currentSearchParams['type']
				}
				if ($scope.searchParams['style']) {
					$scope.currentSearchParams['style'] = $scope.searchParams['style'];
				} else {
					delete $scope.currentSearchParams['style']
				}
				if ($scope.searchParams['color']) {
					$scope.currentSearchParams['color'] = $scope.searchParams['color'];
				} else {
					delete $scope.currentSearchParams['color']
				}
				if ($scope.searchParams['content']) {
					$scope.currentSearchParams['content'] = $scope.searchParams['content'];
				} else {
					delete $scope.currentSearchParams['content']
				}
				if ($scope.searchParams['book']) {
					$scope.currentSearchParams['book'] = $scope.searchParams['book'];
				} else {
					delete $scope.currentSearchParams['book']
				}
				if ($stateParams.book) {
					book = $stateParams.book;
					$scope.search += '&book=' + book;
					$scope.currentSearchParams['book'] = book;
				}
				if ($scope.searchParams['yardage']) {
					if ($scope.searchParams['yardage'] || $scope.availableInventory != '') {
						$scope.availableInventory = $scope.searchParams['yardage'];
					}
					//                console.log('from=inventory%3A' + $scope.availableInventory);
					$scope.currentSearchParams['from'] = 'inventory:' + $scope.searchParams['yardage'];
				} else {
					delete $scope.currentSearchParams['from']
				}
			}
			if ($scope.availableInventory) {
				if ($scope.searchParams['yardage'] || $scope.availableInventory != '') {
					$scope.searchParams['yardage'] = $scope.availableInventory;
				}
				//             console.log('from=inventory%3A' + $scope.availableInventory);
				$scope.currentSearchParams['from'] = 'inventory:' + $scope.searchParams['yardage'];
			}
			//$scope.search = jQuery.param($scope.currentSearchParams);
			$scope.search = jQuery.param($scope.currentSearchParams).replace(/%2B/g, "+");
			//          console.log('currentSearchParams', $scope.search);
			$scope.samples = {};
			$scope.getSamples($scope.search, 'false');
			$scope.samples.updateCallCount = 0;
			$scope.apply;
		};
		$scope.resetSearch = function () {
			$scope.searchParams['query'] = "";
			$scope.searchParams['use'] = "";
			$scope.searchParams['type'] = "";
			$scope.searchParams['style'] = "";
			$scope.searchParams['color'] = "";
			$scope.searchParams['content'] = "";
			$scope.searchParams['book'] = "";
			$scope.availableInventory = "0";
		};
		$scope.$watchGroup(['availableInventory', 'searchParams', 'searchParams["query"]', 'searchParams["use"]', 'searchParams["type"]', 'searchParams["style"]', 'searchParams["color"]', 'searchParams["content"]', 'searchParams["yardage"]'], function (val) {
			if (searchParamsTimeout) $timeout.cancel(searchParamsTimeout);
			tempSearchParams = val;
			searchParamsTimeout = $timeout(function () {
				$scope.searchParams['yardage'] = $scope.availableInventory;
				$scope.apply;
				//              console.log($scope.searchParams);  
				updateQuery();
			}, 700);
		});
		/* $scope.setOrder = function(p) {
				console.log('p = ' + p);
				if (p.length > 1) {
						$scope.predicate = p;
				}
				if ($scope.currentPredicate.indexOf("-") > -1) {
						var pval = $scope.currentPredicate.split("-");
						$scope.currentPredicate = pval[1];
				} else {
						$scope.currentPredicate = String.fromCharCode(45) + $scope.predicate;
				}
				$scope.predicate = $scope.currentPredicate;
				//$scope.samples = orderBy($scope.samples, $scope.predicate, true);
				//var i;
				//for (i = 0; i < $scope.samples.length; i++) {
				//    $scope.samples[i].order = i;
				//}
		};*/
		function inArray(a, value) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === value) {
					return true;
				}
			}
			return false;
		}

		function calcGridPosition() {
			for (var i = 0; i < $scope.samples.length; i++) {
				var sample = $scope.samples[i];
				//                console.log('hashKey[' + sample.$$hashKey + '] / Order[' + sample.order + ']');
				var columns = 5;
				sample.column = sample.order % columns;
				sample.row = Math.floor(sample.order / columns);
			}
		}
		$scope.showPreview = function (i) {
			var previewPosition = ((Math.round(i / 3) + 1) * 3) + 1;
		};
		$scope.getSamples = function (query, loadMore) {
			$scope.isSearching = true;
			//          console.log("someone called getSamples!!!");
			var sample_url = design_library_url
			if (loadMore == 'true') {
				$scope.currentPage++;
				var last = $scope.samples[$scope.samples.length - 1];
				//                console.log('loadmore = true');
			}
			if (query) {
				$scope.sample_url = design_library_url + '/?pattern_status=visible&' + query + '&page=' + $scope.currentPage;
			} else {
				$scope.sample_url = design_library_url + '/?pattern_status=visible&page=' + $scope.currentPage;
			}
			//            console.log($scope.sample_url);
			dataFactory.getData($scope.sample_url).success(function (data) {
					var keys = Object.keys(data);
					var len = keys.length;
					//              console.log('loadMore == ' + loadMore);
					//              console.log('getData resultSet =>', data);
					if (loadMore == 'false') {
						if (keys.length > 0) {
							$scope.samples = angular.element.map(data, function (value, index) {
								return [value];
							});
							$scope.showNoDesigns = false;
						} else {
							$scope.samples = [];
							$scope.showNoDesigns = true;
						}
						/*var result = data.map(function (obj) {
								var subArr = Object.keys(obj).slice(1).map(function(key) {
										return obj[key];
								});
								return [obj[0], subArr];
						});
						console.log('Array resultSet',JSON.stringify(result, null, 4));*/
						//                  console.log('new sample =>', data);
						$scope.apply;
						//console.log($scope);
					}
					if (loadMore == 'true') {
						var keys = Object.keys(data);
						var len = keys.length;
						//                  console.log('new sample =>', data);
						//                  console.log('sample.length =>', len);
						$scope.totalDisplayed += 36;
						angular.forEach(data, function (sample) {
							//                    console.log('sample =>', sample);
							$scope.samples.push(sample);
							//$scope.samples[sample.name] = sample;
						});
						//                  console.log('sample Object after insert =>', $scope.samples);
					}
					//$scope.setOrder($scope.currentPredicate);
					angular.element('dl-grid li').addClass('close').removeClass('expand');
				}).error(function (error) {})
				.finally(function () {
					$scope.isSearching = false;
				});
		};
		this.totalDisplayed = $scope.totalDisplayed;
		$scope.apiSearch = function () {
			var service = designLibraryService.samples,
				eventName = 'design-library';
			if ($scope.currentController === 'DesignLibraryCtrl') {
				service = designLibraryService.samples;
				eventName = 'post';
			}
			service.async({
				query: $scope.search.color
			}, function (resp) {
				$scope.$broadcast(eventName, resp);
			});
		};
		$scope.getFilterOption = function () {};
		var loadMoreTimeout = $timeout(function () {
			//            console.log('#loadMore', angular.element('#loadMore'));
			if (angular.element('#loadMore').is(":visible")) {
				//                console.log('auto load more triggered');
			}
		}, 500);
	}]);
	app.controller('CollectionsCtrl', ["$scope", "$filter", "$location", "$routeParams", "dataFactory", "$window", function ($scope, $filter, $location, $routeParams, dataFactory, $window) {
		$scope.$on('$viewContentLoaded', function (event) {
			$window.ga('send', 'pageview', {
				page: $location.url()
			});
		});
		$scope.collections = {};
		var orderBy = $filter('orderBy');
		$scope.order = 'false';
		$scope.$watch('cat', function () {
			$scope.setCollectionsOrder();
		});
		$scope.number = 5;
		$scope.getNumber = function (num) {
			return new Array(num);
		}
		$scope.setOrder = function (p) {
			//            console.log('p = ' + p);
			if (p.length > 1) {
				$scope.predicate = p;
			}
			if ($scope.currentPredicate.indexOf("-") > -1) {
				var pval = $scope.currentPredicate.split("-");
				$scope.currentPredicate = pval[1];
			} else {
				$scope.currentPredicate = String.fromCharCode(45) + $scope.predicate;
			}
			$scope.predicate = $scope.currentPredicate;
			//$scope.samples = orderBy($scope.samples, $scope.predicate, true);
			/* var i;
			 for (i = 0; i < $scope.samples.length; i++) {
					 $scope.samples[i].order = i;
			 }*/
		};
		$scope.setCollectionsOrder = function (predicate, reverse) {
			//            console.log('sort ' + predicate + ' reverse is ' + reverse);
			$scope.collections = orderBy($scope.collections, predicate, reverse);
			var i;
			if ($scope.order === 'random') {
				var t = [];
				for (i = 0; i < $scope.collections.length; i++) {
					var r = Math.floor(Math.random() * $scope.collections.length);
					while (inArray(t, r)) {
						r = Math.floor(Math.random() * $scope.collections.length);
					}
					t.push(r);
					$scope.collections[i].order = r;
				}
			} else if ($scope.order === 'false') {
				for (i = 0; i < $scope.collections.length; i++) {
					$scope.collections[i].order = i;
				}
			} else {
				for (i = 0; i < $scope.collections.length; i++) {
					$scope.collections[i].order = ($scope.collections.length - 1 - i);
				}
			}
			//            console.log('order function triggered for ' + predicate + '.');
			calcGridPosition();
		};

		function inArray(a, value) {
			for (var i = 0; i < a.length; i++) {
				if (a[i] === value) {
					return true;
				}
			}
			return false;
		}

		function calcGridPosition() {
			for (var i = 0; i < $scope.collections.length; i++) {
				var item = $scope.collections[i];
				var columns = 5;
				item.column = item.order % columns;
				item.row = Math.floor(item.order / columns);
			}
		}
		//$scope.collections = 
		dataFactory.getData('/channel/collections/').success(function (collection_data) {
			//            console.log(collection_data);
			$scope.collections = collection_data;
			$scope.setCollectionsOrder('entry_date', true);
		});
		$scope.preview = function (i) {
			//            console.log('preview invoked for ' + i);
			var previewPosition = ((Math.round(i / 3) + 1) * 3) + 1;
			//            console.log('we will insert the preview at position ' + previewPosition);
		};
	}]);
	app.controller("modalFormCtrl", ["$rootScope", "$scope", "$http", "$modal", "transformRequestAsFormPost", function ($rootScope, $scope, $http, $modal, transformRequestAsFormPost) {
		//        console.log('LandingPagesCtrl $scope', $scope);
		//        console.log('LandingPagesCtrl $rootScope', $rootScope);
	}]);
app.directive('wuCmsContentBlockBanner', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/banner/banner.html',
    restrict: 'E',
    replace: true,
    scope: {
      contentBlock: '='
    }
  };
});
app.directive('wuCmsContentBlockBanner2', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/banner2/banner2.html',
    restrict: 'E',
    replace: true,
    scope: {
      contentBlock: '='
    },
    link: function (scope, element, attributes, controller, $transclude) {
      element.addClass('rsBanner fullWidth');
    }
  };
});

app.directive('wuCmsContentBlockBannerCarousel', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/banner_carousel/banner_carousel.html',
    restrict: 'E',
    replace: true,
    controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
      $scope.owlOptions = {
        navText: '',
        nav: false,
        items: 1,
        responsive: {
          1168: {
            nav: true
          }
        }
      };
      return $scope.slides = _.map($scope.contentBlock.banner_carousel, function (banner) {
        return {
          banner: banner
        };
      });
    }]
  };
});
app.directive('wuCmsContentBlockBannerCarousel2', ["$compile", "$sce", function ($compile, $sce) {
  'use strict';
  return {
    compile: function (tElem, tAttrs) {
      return function (scope, iElem, iAttrs) {
        // When trying to add the same markup here, Angular will no longer
        // process the "another-directive" directive since the compilation is
        // already done and we're merely linking with the scope here
        //iElem.append('<div another-directive></div>');
        var escapeHtml = function (value) {
          var trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
          };
          var htmlEntities = value.replace(/[\u00A0-\u9999<>\&\'\"]/gim, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
          });
          return htmlEntities;
        };
        var carousel = {};
        //          console.log(scope.contentBlock);
        angular.forEach(scope.contentBlock, function (value, key) {
          if (value.background_video) {
            carousel.$bannerBackground = '<video class=\"rsVideo\" name=\"media\" poster=\"' + value.background_image + '\" loop muted>        <source src=\"' + value.background_video + '\" type=\"video/mp4\" /></video>';
          } else {
            carousel.$bannerBackground = '<img class=\"rsImg\" src=\"' + value.background_image + '\" alt=\"\" />\n';
          }
          //carousel.$bannersubHeader = '<p>' + value.subhead_text + '</p>\n';
          //carousel.$bannerHeaderImage = '<img class=\"HeaderImg\" src=\"' + value.header_image + '\" />\n';
          carousel.$bannerHeader = '<div class=\"rsABlock\">\n<div class=\"container\">';
          if (value.alignment && value.alignment != " ") {
            carousel.$bannerHeader = carousel.$bannerHeader + '<div class=\"jumbotron jumbotron-' + value.alignment + '\">';
          } else {
            carousel.$bannerHeader = carousel.$bannerHeader + '<div class=\"jumbotron\">';
          }
          if (value.header_image) {
            carousel.$bannerHeader = carousel.$bannerHeader + '<img class=\"HeaderImg\" src=\"' + value.header_image + '\" />';
          }
          if (value.subhead_text) {
            carousel.$bannerHeader = carousel.$bannerHeader + '<p class=\"HeaderText\" ng-bind-html=\"value.subhead_text\">' + escapeHtml(value.subhead_text) + '</p>';
          }
          if (value.button_text || value.url) {
            carousel.$bannerHeader = carousel.$bannerHeader + '<p><a class="wu-btn wu-btn--inline ng-binding wu-btn--transparent-black" href="' + value.url + '">' + value.button_text + '</a></p>';
          }
          carousel.$bannerHeader = carousel.$bannerHeader + '</div>\n</div>\n</div>';
          carousel.$banner = '<div id="' + key + '">' + carousel.$bannerBackground + carousel.$bannerHeader + '</div>';
          carousel.$banners = carousel.$banners + carousel.$banner;
        });
        carousel.$container = $("<div id=\"full-width-slider\" class=\"royalSlider heroSlider rsMinW rsHor rsWithBullets\"></div>").append(carousel.$banners);
        carousel.$rSlider = $("<div class=\"sliderContainer fullWidth clearfix\"></div>").append(carousel.$container);
        iElem.append(carousel.$rSlider);
        iElem.append("<p ng-bind-html=\"contentBlock.subhead_text\"></p>");
        var callRS = function () {
          iElem.find('#full-width-slider').royalSlider({
            arrowsNav: true,
            loop: true,
            keyboardNavEnabled: true,
            controlsInside: false,
            imageScaleMode: 'fill',
            arrowsNavAutoHide: true,
            autoScaleSlider: true,
            autoScaleSliderWidth: 992,
            autoScaleSliderHeight: 300,
            controlNavigation: 'bullets',
            thumbsFitInViewport: false,
            navigateByClick: false,
            startSlideId: 0,
            autoPlay: {
              enabled: true,
              stopAtAction: true,
              pauseOnHover: true,
              delay: 3000
            },
            transitionType: 'move',
            globalCaption: false,
            deeplinking: {
              enabled: true,
              change: false
            },
            // size of all images http://help.dimsemenov.com/kb/royalslider-jquery-plugin-faq/adding-width-and-height-properties-to-images 
            imgWidth: 1400,
            imgHeight: 680
          });
          var slider = angular.element(".royalSlider").data('royalSlider'),
            prevSlideVideo,
            playSlideVideo = function () {
              if (prevSlideVideo) {
                prevSlideVideo.pause();
              }
              var video = slider.currSlide.content.find('video');
              if (video.length) {
                prevSlideVideo = video[0];
                prevSlideVideo.play();
              } else {
                prevSlideVideo = null;
              }

            };
          slider.ev.on('rsAfterSlideChange', playSlideVideo);
          playSlideVideo();
          slider.playVideo();
        };
        callRS();
      };
    },
    restrict: 'AE',
    scope: {
      contentBlock: '='
    },
    replace: true
  };
}]);
app.directive('wuCmsContentBlockCallToAction', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/call_to_action/call_to_action.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlock', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/content_block/content_block.html',
    scope: {
      contentBlock: '='
    },
    restrict: 'E',
    replace: true,
    controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
      $scope.getContentBlockClass = function () {
        var cssClasses;
        cssClasses = [];
        if ($scope.contentBlock.alignment === 'center') {
          cssClasses.push('wu-cms-content-block--center');
        }
        if ($scope.contentBlock.alignment === 'right') {
          cssClasses.push('wu-cms-content-block--right');
        }
        if ($scope.contentBlock.alignment === 'justified') {
          cssClasses.push('wu-cms-content-block--justified');
        }
        if ($scope.contentBlock.color === 'gray') {
          cssClasses.push('wu-cms-content-block--gray');
        }
        if ($scope.contentBlock.content_block_type === 'banner') {
          cssClasses.push('wu-cms-content-block--nopad');
        }
        if ($scope.contentBlock.alignment === 'blog') {
          cssClasses.push('wu-cms-content-block--center');
        }
        return cssClasses;
      };
      return $scope.getButtonClass = function (style) {
        var buttonClass;
        if (!style) {
          return '';
        }
        buttonClass = '';
        switch (style) {
          case 'transparent-white':
            buttonClass = 'wu-btn--transparent-white';
            break;
          case 'transparent-black':
            buttonClass = 'wu-btn--transparent-black';
            break;
          case 'transparent-dark-gray':
            buttonClass = 'wu-btn--transparent-dark-gray';
            break;
          case 'transparent-blue':
            buttonClass = 'wu-btn--transparent-blue';
            break;
          case 'dark-gray':
            buttonClass = 'wu-btn--dark-gray';
            break;
          case 'blue':
            buttonClass = 'wu-btn--blue';
            break;
          case 'red':
            buttonClass = 'wu-btn--red';
        }
        return buttonClass;
      };
    }]
  };
});
app.directive('wuCmsContentBlockFiveColumn', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/five_column/five_column.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockFluidGrid', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/fluid_grid/fluid_grid.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockFourColumn', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/four_column/four_column.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockHomeGrid', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/home_grid.html',
    restrict: 'E',
    replace: true,
    controller: ["$scope", function ($scope) {
      var gridArray = $scope.$parent.contentBlock.home_grid;

      function formatDate(date) {
        var month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return month[monthIndex] + day + year;
      }
      gridArray.forEach(function (tile) {
        //console.log(grid.title);
        var gridImages = tile.image_matrix;
        if (tile.randomize === "Yes") {
          var rand = gridImages[Math.floor(Math.random() * gridImages.length)];
          tile.image = rand.image_url;
        } else {
          var tileImageSelected = false;
          gridImages.forEach(function (image) {

            if (tileImageSelected === false) {
              var today = formatDate(new Date());
              if (image.start_date <= today && image.end_date >= today) {
                //console.log("Starts:",image.start_date);
                //console.log("Today:",today);
                //console.log("Ends:",image.end_date);                   
                tile.image = image.image_url;
                tileImageSelected = true;
              }
            }
          });
          if (tileImageSelected === false) {
            //console.log("No Date match for Grid => ", tile.title);                                        
            tile.image = gridImages[0].image_url;
            tileImageSelected = true;
          }
        }
      });
    }]
  };
});
app.directive('wuCmsContentBlockHorizontalRule', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/horizontal_rule/horizontal_rule.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('mAppLoading', ["$animate", function ($animate) {
  'use strict';
  return ({
    templateUrl: 'components/cms/splash/splash.html',
    replace: true,
    //link: link,
    restrict: "E",
    controller: ["$scope", "$rootScope", "$window", "$element", "$attrs", "$state", "$location", "anchorSmoothScroll", "dataFactory", function ($scope, $rootScope, $window, $element, $attrs, $state, $location, anchorSmoothScroll, dataFactory) {
      var keys = {
        37: 1,
        38: 1,
        39: 1,
        40: 1
      };

      function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault) {
          e.preventDefault();
        }
        e.returnValue = false;
      }

      function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
          preventDefault(e);
          return false;
        }
      }

      function disableScroll() {
        if (window.addEventListener) { // older FF
          window.addEventListener('DOMMouseScroll', preventDefault, false);
          window.onwheel = preventDefault; // modern standard
          window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
          window.ontouchmove = preventDefault; // mobile
          document.onkeydown = preventDefaultForScrollKeys;
          //angular.element('.scrollArea').
        }
      }

      function enableScroll() {
        if (window.removeEventListener) {
          window.removeEventListener('DOMMouseScroll', preventDefault, false);
          window.onmousewheel = document.onmousewheel = null;
          window.onwheel = null;
          window.ontouchmove = null;
          document.onkeydown = null;
        }
      }
      if ($window.location.pathname !== "/lp/home") {
        $element.remove();
      } else {
        disableScroll();
        dataFactory.getData('/menu').success(function (data) {
          //console.log('headerMenu', data.header);
          $scope.splash = data.splash;
        });
        //				var splashArray = $scope.splash;
        //				console.log($scope.splash);
      }
      //$element.bind("wheel", function() {
      //event.preventDefault($window);            
      //  console.log('Scrolling to MainContent');
      //});
      $scope.leave = function () {
        anchorSmoothScroll.scrollTo('maincontent', 'splash');
        setTimeout(
          function () {
            $element.remove();
            enableScroll();
          }, (2 * 900)
        );
        //$element.hide();
      };

    }]
  });

  function link(scope, element, attributes) {
    $animate.leave(element.children().eq(1)).then(function () {
      function cleanupAfterAnimation() {
        //        console.log(element);
        //        console.log(scope);
        element.remove();
        scope = element = attributes = null;
      }
    });
  }
}]);
app.directive('menuHeader', function () {
  'use strict';
  return {
    templateUrl: 'components/menu_header/menu_header.html',
    restrict: 'E',
    replace: true,
    controller: ["$scope", "dataFactory", "$mdSidenav", "$filter", function ($scope, dataFactory, $mdSidenav, $filter) {
      $scope.collapse = false;
      $scope.$watch('collapse', function () {});
      var closeMenu = function () {
        //console.log($scope.collapse);
      };
      $scope.opened = false;
      $scope.isSidenavOpen = false;
      $scope.menuTitle = "Menu";

      function buildToggler(componentId) {
        return function () {
          $mdSidenav(componentId).toggle();
          //console.log('sidenav is ' + ($scope.isSidenavOpen ? 'open' : 'closed'));
          angular.element(document).find('#nav-icon3').toggleClass('open');
          $scope.mainMenu ? true : false;
          $scope.submenu ? true : false;
          //angular.element('.mainmenu').toggleClass('ng-hide');
          $scope.nav('main');
        };
      }
      $scope.toggleLeft = buildToggler('left');
      $scope.toggleRight = buildToggler('right');
      dataFactory.getData('/menu').success(function (data) {
        //console.log('headerMenu', data.header);
        $scope.headerMenu = data.header;
        $scope.splash = data.splash;
      });
      //$scope.error(function(error) {});
      $scope.mainMenu = true;
      $scope.hassubmenu = false;
      $scope.donotshow = true;
      $scope.close = function () {
        $mdSidenav('right').close()
          .then(function () {
            $log.debug("close RIGHT is done");
          });
      };
      $scope.nav = function (obj, $event) {
        $scope.donotshow = false;
        //console.log(obj);
        if (obj === 'main') {
          //console.log('Parent Found', obj.parent);
          $scope.menuTitle = "Menu";
          $scope.mainMenu = true;
          $scope.showsubmenu = false;
          $scope.donotshow = true;
        }
        if (obj.hassubmenu === true) {
          //console.log('HasSubmenu is True', obj.parent);
          //console.log(obj.submenu);
          $scope.menuTitle = obj.label;
          $scope.mainMenu = false;
          $scope.showsubmenu = true;
          $scope.submenu = obj.submenu;
        }
      };
      $scope.apply;
      return $scope;
    }]
  };
});
app.directive('menuUtility', function () {
  'use strict';
  return {
    templateUrl: 'components/menu_utility/menu_utility.html',
    restrict: 'E',
    replace: true,
    controller: ["$scope", "$rootScope", "dialogs", "$modal", "$http", "$state", "$mdDialog", "dataFactory", function ($scope, $rootScope, dialogs, $modal, $http, $state, $mdDialog, dataFactory) {
      DialogController.$inject = ["$scope", "$mdDialog"];
      $scope.collapse = false;
      //$scope.showSearch = true;
      $scope.$watch('collapse', function () {});
      var closeMenu = function () {
        //        console.log($scope.collapse);
      };
      //    console.log('$rootScope.currentUser', $rootScope.currentUser);
      $scope.username = $rootScope.currentUser;
      $scope.home_url = function () {
        if ($rootScope.currentUser === 'procsupportgroup@marriott.com') {
          return "http://vffabrics.com/marriott/";
        } else {
          return "/#/lp/home";
        }
      };
      $rootScope.logIn = function () {
        //      console.log("Login function executed!!");
        $scope.dlg = dialogs.create('index_new.php/views/login-form/', 'LoginModalCtrl', {}, {
          key: true,
          back: 'static'
        });
        $scope.dlg.result.then(function (username) {
          //          console.log($rootScope.currentUser);
          //$scope.currentUser = username;
        }, function () {
          $scope.email = 'You decided not to enter in your name, that makes me sad.';
        });
      };
      $scope.logOut = function ($scope) {
        var instance = $modal.open({
          templateUrl: 'index_new.php/views/logout-form',
          controller: ["$scope", function ($scope) {
            $scope.Yes = function () {
              $http({
                url: 'index_new.php/account/logout',
                method: "GET"
              }).success(function (response) {
                $scope.$close(undefined);
                //                        console.log('Bye bye');
              });
            };
          }],
          controllerAs: 'LoginModalCtrl'
        });
        instance.result.then(function (result) {
          $rootScope.currentUser = undefined;
          $state.go('home');
        });
      };
      $scope.resetPassword = function () {
        $scope.dlg = dialogs.create('/views/reset-password', '', {}, {
          key: false,
          back: 'static'
        });
        $scope.dlg.result.then(function (email) {
          $scope.name = email;
        }, function () {
          $scope.email = 'You decided not to enter in your name, that makes me sad.';
        });
      };
      $scope.submitResetPassword = function () {
        $scope.dlg.close();
        //        console.log(angular.element('#forgot_password_form').serialize());
        $.post('/views/reset-password', angular.element('#forgot_password_form').serialize()).done(function (response) {
          //            console.log('submitResetPassword', response);
        });
      };
      $scope.showAdvanced = function (ev) {
        $mdDialog.show({
            controller: DialogController,
            templateUrl: '/views/login-form/',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          })
          .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            $scope.status = 'You cancelled the dialog.';
          });
      };
      $scope.showSearch = function (data) {
        $mdDialog.show({
            locals: {
              dataToPass: $scope.searchResults
            },
            controller: DialogController,
            templateUrl: 'components/cms/content_blocks/search_results.html',
            parent: angular.element(document.body),
            //targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
          })
          .then(function (answer) {
            $scope.status = 'You said the information was "' + answer + '".';
          }, function () {
            $scope.status = 'You cancelled the dialog.';
          });
      };
      var timeoutPromise;
      var delayInMs = 2000;
      $scope.$watch('GoogleCSE', function (GoogleCSE) {
        //    console.log(GoogleCSE);
        if (GoogleCSE !== undefined) {
          clearTimeout(timeoutPromise); //does nothing, if timeout alrdy done
          timeoutPromise = setTimeout(function () { //Set timeout
            dataFactory.getCseData(GoogleCSE).success(function (data) {
              //          console.log('results', data);
              $scope.searchResults = data;
              $scope.showSearch(data);
            });
          }, delayInMs);
        }
      });

      function DialogController($scope, $mdDialog) {
        $scope.hide = function () {
          $mdDialog.hide();
        };
        $scope.cancel = function () {
          $mdDialog.cancel();
        };
        $scope.answer = function (answer) {
          $mdDialog.hide(answer);
        };
        //    console.log($scope);
        /* $scope.submitVffLogin = function() {
      console.log(angular.element('#vff_login_form').serialize());
      $.post('/views/login-form', angular.element('#vff_login_form').serialize()).done(function(response, status) {
        if(status === 'success') {
					console.log('toState',$rootScope.destUrl.name);
					console.log('$stateParams',$stateParams);
          $stateParams.book = $rootScope.destUrl.book;
          $stateParams.page = $rootScope.destUrl.page;
          $state.go($rootScope.destUrl.name, $stateParams);
          $scope.dlg.close();
        } else 
          console.log('something went wrong!');  
        }
      });
    };*/
      }
      $scope.openProfileMenu = function () {
        angular.element('#user_menu').show();
      };
      $scope.closeProfileMenu = function () {
        angular.element('#user_menu').hide();
      };
      $scope.utilityMenu = [{
        "url": "/profile/",
        "custom_url": "",
        "label": "Profile",
        "icon": "",
        "channel": "lp",
        "parent": "0"
      }, {
        "url": "/cart/",
        "custom_url": "",
        "label": "Cart",
        "icon": "",
        "channel": "lp",
        "parent": "0"
      }, {
        "url": "/history/",
        "custom_url": "",
        "label": "Sample Request History",
        "icon": "",
        "channel": "lp",
        "parent": "0"
      }, {
        "url": "/favorites/",
        "custom_url": "",
        "label": "Favorites",
        "icon": "",
        "channel": "lp",
        "parent": "0"
      }];
      $scope.apply;
      return $scope;
    }]
  };
});
app.directive('wuCmsContentBlockStandardBlock', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/standard_block/standard_block.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockStandardBlockVideo', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/standard_block_video/standard_block_video.html',
    restrict: 'E',
    replace: true
  };
});
app.directive("sticky", ["$window", function ($window) {
  'use strict';
  return {
    link: function (scope, element, attrs) {
      var $win = angular.element($window);
      if (scope._stickyElements === undefined) {
        scope._stickyElements = [];
        $win.bind("scroll.sticky", function (e) {
          var pos = $win.scrollTop();
          for (var i = 0; i < scope._stickyElements.length; i++) {
            var item = scope._stickyElements[i];
            if (!item.isStuck && pos > item.start) {
              item.element.addClass("stuck");
              item.element.parent().addClass("fixed_nav");
              item.isStuck = true;
              if (item.placeholder) {
                item.placeholder = angular.element("<div></div>").css({
                  height: item.element.outerHeight() + "px"
                }).insertBefore(item.element);
              }
            } else if (item.isStuck && pos < item.start) {
              item.element.removeClass("stuck");
              item.element.parent().removeClass("fixed_nav");
              item.isStuck = false;
              if (item.placeholder) {
                item.placeholder.remove();
                item.placeholder = true;
              }
            }
          }
        });
        var recheckPositions = function () {
          for (var i = 0; i < scope._stickyElements.length; i++) {
            var item = scope._stickyElements[i];
            if (!item.isStuck) {
              item.start = item.element.offset().top;
            } else if (item.placeholder) {
              item.start = item.placeholder.offset().top;
            }
          }
        };
        $win.bind("load", recheckPositions);
        $win.bind("resize", recheckPositions);
      }
      var item = {
        element: element,
        isStuck: false,
        placeholder: attrs.usePlaceholder !== undefined,
        start: element.offset().top
      };
      scope._stickyElements.push(item);
    }
  };
}]);
app.directive('wuCmsContentBlockTabs', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/tabs/tabs.html',
    scope: {
      contentBlock: '=',
      tabContentBlock: '='
    },
    restrict: 'E',
    replace: true,
    controller: ["$scope", "$element", "$attrs", function ($scope, $element, $attrs) {
      $scope.getTabContentBlockClass = function (tabContentBlock) {
        var cssClasses;
        cssClasses = [];
        if (tabContentBlock.alignment === 'center') {
          cssClasses.push('wu-cms-content-block--center');
        }
        if (tabContentBlock.alignment === 'right') {
          cssClasses.push('wu-cms-content-block--right');
        }
        if (tabContentBlock.alignment === 'justified') {
          cssClasses.push('wu-cms-content-block--justified');
        }
        if (tabContentBlock.color === 'gray') {
          cssClasses.push('wu-cms-content-block--gray');
        }
        if (tabContentBlock.content_block_type === 'banner') {
          cssClasses.push('wu-cms-content-block--nopad');
        }
        return cssClasses;
      };
      return $scope.getButtonClass = function (style) {
        var buttonClass;
        if (!style) {
          return '';
        }
        buttonClass = '';
        switch (style) {
          case 'transparent-white':
            buttonClass = 'wu-btn--transparent-white';
            break;
          case 'transparent-black':
            buttonClass = 'wu-btn--transparent-black';
            break;
          case 'transparent-dark-gray':
            buttonClass = 'wu-btn--transparent-dark-gray';
            break;
          case 'transparent-blue':
            buttonClass = 'wu-btn--transparent-blue';
            break;
          case 'dark-gray':
            buttonClass = 'wu-btn--dark-gray';
            break;
          case 'blue':
            buttonClass = 'wu-btn--blue';
            break;
          case 'red':
            buttonClass = 'wu-btn--red';
        }
        return buttonClass;
      };
    }]
  };
});
app.directive('wuCmsContentBlockProducts', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/products/products.html',
    restrict: 'E',
    replace: true,
    scope: {
      contentBlock: '='
    }
  };
});
app.directive('slide', function () {});
app.directive('owlCarousel', function () {
  'use strict';
  return {
    restrict: 'A',
    transclude: true,
    link: function (scope, element, attributes, controller, $transclude) {
      var options, owlCarousel, propertyName, setupPageControls;
      owlCarousel = null;
      propertyName = attributes.owlCarousel;
      options = JSON.parse(attributes.owlOptions);
      setupPageControls = function (ev) {
        var setupPageControl;
        setupPageControl = function (className) {
          var navElement;
          navElement = element.find('.' + className);
          if (ev.item.count > ev.page.size) {
            return navElement.addClass(className + '--shown');
          } else {
            return navElement.removeClass(className + '--shown');
          }
        };
        setupPageControl('owl-nav');
        return setupPageControl('owl-dots');
      };
      element.on('initialized.owl.carousel', setupPageControls);
      element.on('resized.owl.carousel', setupPageControls);
      return scope.$watchCollection(propertyName, function (newItems, oldItems) {
        var i, item, len;
        if (owlCarousel) {
          element.html('');
          owlCarousel.trigger('destroy.owl.carousel');
          element.off('initialized.owl.carousel');
          element.off('resized.owl.carousel');
        }
        element.on('initialized.owl.carousel', setupPageControls).on('resized.owl.carousel', setupPageControls);
        for (i = 0, len = newItems.length; i < len; i++) {
          item = newItems[i];
          $transclude(function (clone, scope) {
            scope.item = item;
            return element.append(clone[1]);
          });
        }
        return owlCarousel = element.owlCarousel(options);
      });
    }
  };
});
app.directive('headerBar', function () {
  'use strict';
  return {
    templateUrl: 'components/header/header.html',
    restrict: 'E',
  };
});
app.directive('footerBar', function () {
  'use strict';
  return {
    templateUrl: 'components/footer/footer.html',
    restrict: 'E',
    scope: {
      collapse: '='
    }
  };
});
app.directive('backgroundImage', function () {
  'use strict';
  return {
    scope: {
      config: '='
    },
    link: function (scope, element, attrs) {
      attrs.$observe('backgroundImage', function (value) {
        var cssProps;
        if (!value) {
          return;
        }
        cssProps = {
          'background-size': 'cover',
          'background-image': 'url(' + value + ')'
        };
        return element.css(cssProps);
      });
      return scope.$watch('config', function (newValue, oldValue) {
        if (typeof newValue !== 'undefined') {
          if (!_.isEqual(newValue, oldValue)) {
            return element.css(newValue);
          }
        }
      });
    }
  };
});
app.directive('toggleClass', function () {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      element.bind('click', function () {
        element.toggleClass(attrs.toggleClass);
      });
    }
  };
});
app.directive('tabs', function () {
  'use strict';
  return {
    restrict: 'E',
    transclude: true,
    scope: {},
    controller: ["$scope", function ($scope) {
      var panes = $scope.panes = [];
      $scope.select = function (pane) {
        angular.forEach(panes, function (pane) {
          pane.selected = false;
        });
        pane.selected = true;
      };
      this.addPane = function (pane) {
        if (panes.length === 0) {
          $scope.select(pane);
          panes.push(pane);
        }
      };
    }],
    template: '<div class="tabbable  col-xs-12 col-sm-12 col-md-12 col-lg-12">' + '<ul class="nav nav-tabs">' + '<li ng-repeat="pane in panes" ng-class="{active:pane.selected}">' + '<a href="" ng-click="select(pane)">{{pane.title}}</a>' + '</li>' + '</ul>' + '<div class="tab-content" ng-transclude></div>' + '</div>',
    replace: true
  };
});
app.directive('pane', function () {
  'use strict';
  return {
    require: '^tabs',
    restrict: 'E',
    transclude: true,
    scope: {
      title: '@'
    },
    link: function (scope, element, attrs, tabsCtrl) {
      tabsCtrl.addPane(scope);
    },
    template: '<div class="tab-pane" ng-class="{active: selected}" ng-transclude>' + '</div>',
    replace: true
  };
});
app.directive('wuCmsContentBlockTimeline', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/timeline/timeline.html',
    restrict: 'E'
  };
});
app.directive('wuCmsContentBlockBlog', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/blog/blog.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockBlogPage', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/blog/blog_page.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockBlogPost', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/blog/blog_post.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockMediaAds', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/media/advertising.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockMediaAwards', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/media/awards.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockMediaOnlineVideo', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/media/videos.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockFabricCollection', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/fabric_collection/fabric_collection.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockBeddingSpecBook', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/online_library/bedding_spec_book.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockGradientSpecBook', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/online_library/gradient_spec_book.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('lightgallery', function () {
  'use strict';
  return {
    restrict: 'A',
    link: function (scope, element, attrs) {
      if (scope.$last) {
        // ng-repeat is completed
        element.parent().lightGallery();
      }
    }
  };
});
/*app.directive('wuCmsContentBlockMediaAds', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/ads.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaAwards', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/awards.html',
        restrict: 'E',
        replace: true
    };
});
app.directive('wuCmsContentBlockMediaOnlineVideos', function()  {
    'use strict';
    return {
        templateUrl: 'components/cms/content_blocks/media/videos.html',
        restrict: 'E',
        replace: true
    };
});*/
app.directive('unbindable', function () {
  'use strict';
  return {
    scope: true
  };
});
app.directive('sample', ['$timeout', '$document', '$state', '$modal', 'dialogs', '$compile', 'anchorSmoothScroll', "$location", '$window', function (timer, $document, $state, $modal, dialogs, $compile, $location, $window) {
  'use strict';
  return {
    restrict: "EA",
    replace: true,
    controller: ['$scope', '$rootScope', '$document', '$state', 'anchorSmoothScroll', "$location", '$window', function ($scope, $rootScope, $document, $state, anchorSmoothScroll, $location, $window) {
      this.setPreviousSample = function (v) {
        $rootScope.previousSample = v;
        $scope.$apply;
      };
      this.getPreviousSample = function () {
        return $scope.previousSample;
      };
      this.gotoElement = function (eID) {
        $window.ga('send', 'pageview', {
          page: $location.url() + '/' + $('#' + eID + ' a').attr('id')
        });
        anchorSmoothScroll.scrollTo(eID, $scope.previousSample);
      };
      this.selectedItem = function (v) {
        $rootScope.item = v;
        $scope.$apply;
      };
      $scope.updatePreview = function (index, name, content, pattern_repeat, pattern_name, pattern_name_color, inventory, large) {
        console.log('updatePreview was triggered for ', name);
        console.log('element', angular.element("." + $scope.currentSamplePreview));
        angular.element(".og-details_inner h1").empty().append(name);
        angular.element(".sample_pattern_name").empty().append(pattern_name);
        angular.element(".sample_color_name").empty().append(pattern_name_color);
        angular.element(".sample_content").empty().append(content);
        angular.element(".sample_repeat").empty().append(pattern_repeat);
        angular.element(".sample_inventory").empty().append(inventory + ' yrds');
        angular.element(".sample_image img").attr('src', large);
        //angular.element(".sample_image img").attr('src', '/images/made/uploads/skus/' + name + '_1200_800_70_assetsimagesvff-watermark.png.jpg');
        angular.element(".og-details_inner .wu-btn").remove();
      };
    }],
    link: function (scope, element, attributes, $scope, $rootScope, $location, anchorSmoothScroll) {
      $document.bind('click', function (e) {
        e.stopPropagation();
      });
      $scope.replaceStr = function (oldString, lookFor, replaceWith) {
        // get & replce the input value
        return oldString.replace(lookFor, replaceWith);
      };
      scope.submitSample = function () {
        $scope.selectedItem(scope.item);
        //window.ga('set', 'color', 'custom data');
        console.log('color', scope.item.color);
        window.ga('send', 'pageview', {
          'page': $window.url() + '/sample_request/' + scope.item.name,
          'color': scope.item.color
        });
        window.ga('ecommerce:addItem', {
          'id': scope.item.name,
          'name': scope.item.name,
          'sku': scope.item.name,
          'category': scope.item.book,
          'price': '0',
          'quantity': '1',
          'color': scope.item.color
        });
        console.log('addItem ' + scope.item.name);
        $.post(apiIp + 'views/ajax/', angular.element('#add_to_cart_form_' + scope.item.name).serialize()).done(function (response) {
          console.log(response);
          dialogs.notify('Add to Request Basket', scope.item.name + ' is now in your basket.');
          angular.element(".cart_count .count").load('views/cart_count');
          angular.element(".cart_count").show();
        });
      };
      scope.showPreview = function () {
        console.log('showPreview scope', scope.$parent);
        if (scope.opening == true || scope.destroying == true) {
          return false;
        }
        scope.currentSamplePreview = attributes.id;
        $scope.gotoElement(attributes.id);
        var destroyPreview = function (x, $location) {
          if (scope.destroying == true && scope.closingPreview == scope.openingPreview) {} else {

            if (angular.isUndefined(x[0])) {} else {
              scope.destroying = true;
              scope.closingPreview = x[0].id;
              timer(function () {
                x.children('.og-expander').css("cssText", "height: 0;");
              }, 0);
              x.addClass('not-og-expanded');
              x.removeClass('og-expanded');
              timer(function () {
                x.children('.og-expander').remove();
                scope.destroying = false;
                scope.closingPreview = null;
              }, 800);
            }
          }
        };
        var createPreview = function (x, $location) {
          if (scope.opening == true && scope.openingPreview == scope.currentSamplePreview) {} else {
            scope.opening = true;
            scope.openingPreview = x[0].id;
            element.addClass('og-expanded');
            element.removeClass('not-og-expanded');
            element.append($compile(preview.$previewEl)(scope));
            timer(function () {
              element.children('.og-expander').css("cssText", "");
              scope.opening = false;
              scope.openingPreview = null;
            }, 200);
            $scope.setPreviousSample(x[0].id);
          }
        };
        var preview = {};
        if (scope.$parent.samples) {
          var srHtml = $.ajax({
            url: '/views/sr/' + scope.item.name,
            type: 'get',
            dataType: 'html',
            async: false,
            cache: false,
            success: function (data) {
              srHtml = data;
            }
          }).responseText;
          preview.$image = $('<div class="sample_image col-xs-12" style="/*background-image: url(' + attributes.largesrc + ');*/ height: inherit; background-size: cover;" unbindable ><img src="' + attributes.largesrc + '" unbindable /></div>');
          preview.$href = srHtml;
          preview.$title = $('<h1 class="hide-for-small  col-xs-12">' + scope.item.name + '</h1>');
          //var testContent = $scope.replaceStr(scope.item.content, ",",", ");
          //console.log('testContent', testContent);
          var $isRailRoaded;
          console.log('is rail_roaded?', scope.item.rail_roaded);
          switch (scope.item.rail_roaded) {
            case 'y':
              $isRailRoaded = 'SHOWN RAILROADED';
              break;
            case 'n':
              $isRailRoaded = 'NO';
              break;
            default:
              $isRailRoaded = 'NO';
          }
          preview.$description = $('<p class="col-xs-6 col-lg-4" style="font-weight:bold;">Pattern:</p><p class="sample_pattern_name col-xs-6 col-lg-8">' + scope.item.pattern_name + '</p><p class="col-xs-6 col-lg-4" style="font-weight:bold;">Color:</p><p class="sample_color_name col-xs-6 col-lg-8">' + scope.item.pattern_name_color + '</p><p class="col-xs-6 col-lg-4" style="font-weight:bold;">Content:</p><p class="sample_content col-xs-6 col-lg-8">' + scope.item.content + '</p><p class="col-xs-6 col-lg-4" style="font-weight:bold;">Repeat:</p><p class="sample_repeat col-xs-6 col-lg-8">' + scope.item.pattern_repeat + '</p><p class="col-xs-6 col-lg-4" style="clear: left; font-weight:bold;">Railroaded:</p><p class="sample_repeat col-xs-6 col-lg-8">' + $isRailRoaded + '</p><p class="col-xs-6 col-lg-4" style="clear: left; font-weight: bold;">In Stock:</p><p class="sample_inventory col-xs-6 col-lg-8">' + scope.item.inventory + ' yrds</p><p style="clear: both; display: block;"><a tooltip="Add to Favorites" data-toggle="modal" class="product_icon hide" data-target="#favorite-' + scope.item.name + '" ><i class="fa fa-star-o" style="font-size: 30px;"></i></a><a class="product_icon" tooltip="Print Specs" href="custom/specs/' + scope.item.name + '" target="_blank" class="js_window"><img ng-src="http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/icon-specsheet.png" style="margin-top: -13px;"/></a></p>');
          preview.$alternativesInner = '';
          /*if(scope.item.alternate){*/
          angular.forEach(scope.item.alternate, function (value) {
            preview.$alternativesInner = preview.$alternativesInner + '<div class="alternative-item  col-lg-2 col-xs-2"><img src="' + apiIp + 'images/made/uploads/skus/' + value.name + '_99_66_70.jpg" " alt="' + value.name + '" /></div>';
          });

          preview.$alternatives = $('<div class="og-alternatives col-lg-4 col-md-4 col-sm-4 col-xs-12"><h4>Available in-stock alternatives</h4></div>').append(preview.$alternativesInner);
          /*}*/
          preview.$moreItems = '';
          angular.forEach(scope.item.more, function (value, index) {
            /*preview.$moreItems = preview.$moreItems + '<div class="more-item more-item- col-lg-2 col-xs-2"><a id="' + value.name + '" ng-click="updatePreview(\'' + index + '\', \'' + value.name + '\', \'' + value.content + '\', \'' + value.pattern_repeat + '\', \'' + value.pattern_name + '\', \'' + value.pattern_name_color + '\', \'' + value.inventory + '\', \'' + value.large + '\')" ><img src="' + apiIp + 'images/made/uploads/skus/' + value.name + '_99_66_70.jpg" " /><div class="more-item-text"><p>' + value.name + '</p></div></a></div>';
                    });*/
            preview.$moreItems = preview.$moreItems + '<div class="more-item more-item- col-lg-2 col-xs-2"><a id="' + value.name + '" ng-click="updatePreview(\'' + index + '\', \'' + value.name + '\', \'' + value.content + '\', \'' + value.pattern_repeat + '\', \'' + value.pattern_name + '\', \'' + value.pattern_name_color + '\', \'' + value.inventory + '\', \'' + value.large + '\')" ><img src="' + apiIp + value.thumb + '" /><div class="more-item-text"><p>' + value.name + '</p></div></a></div>';
          });
          preview.$moreInner = $('<div style="height: 202px; overflow:scroll;" ></div>').append(preview.$moreItems);
          preview.$more = $('<div class="og-more col-lg-8 col-md-8 col-sm-8 col-xs-12"><h4>Available Colors</h4></div>').append(preview.$moreInner);
        }
        var cb = scope.$parent.$parent.contentBlock;
        if (typeof cb != "undefined") {

          if (cb.fabric_collection && scope.$parent.$parent.contentBlock.fabric_collection != "undefined") {
            preview.$image = $('<div class="col-xs-12" style="/*background-image: url(' + attributes.largesrc + ');*/ height: inherit; background-size: cover;"><img src="' + attributes.largesrc + '" /></div>');
            preview.$title = $('<h1 class="hide-for-small">' + scope.item.title + '</h1>');
            preview.$description = $('<p>' + scope.item.summary + '</p>');
            preview.$href = $('<a ng-href="' + '/#/design-library/' + scope.item.book + '" class="wu-btn wu-btn--transparent-black"  id="dlLink">' + attributes.button + '</a>');
            preview.$more = $('');
          }
          if (cb.advertising && cb.advertising != "undefined") {
            preview.$image = $('<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit;  background-size: 100%;  background-repeat: no-repeat"><img src="dist/assets/images/clear.png" /></div>');
            preview.$title = $('<h1 class="hide-for-small">' + scope.item.name + '</h1>');
            preview.$description = $('<h5>' + scope.item.year + '</h5>');
            preview.$href = $('');
            preview.$more = $('');
          }
          if (cb.awards && cb.awards != "undefined") {
            preview.$image = $('<div class="col-xs-12" style="background-image: url(' + attributes.largesrc + '); height: inherit; background-size: 100%;  background-repeat: no-repeat"><img src="dist/assets/images/clear.png" /></div>');
            preview.$title = $('<h1 class="hide-for-small">' + scope.item.name + '</h1>');
            preview.$description = $('<h5>' + scope.item.year + '</h5><h5>' + scope.item.frm + '</h5>');
            preview.$href = $('');
            preview.$more = $('');
          }
          if (cb.videos && cb.videos != "undefined") {
            preview.$image = $('<div class="col-xs-12" style="-background-image: url(' + attributes.largesrc + '); height: inherit; background-size: cover; background-position: 50% 50%; height: 433px;"><youtube-video video-id="\'' + attributes.videoid + '\'"></youtube-video></div>');
            preview.$title = $('<h1 class="hide-for-small">' + scope.item.name + '</h1>');
            preview.$description = $('<h5>' + scope.item.summary + '</h5>');
            preview.$href = $('');
            preview.$more = $('');
          }
          if (cb.bedding_spec_book && cb.bedding_spec_book != "undefined") {
            preview.$image = $('<div class="col-xs-12" style="/*background-image: url(' + attributes.largesrc + ');*/ height: inherit; background-size: cover;"><img src="' + attributes.largesrc + '" /></div>');
            preview.$title = $('<h1 class="hide-for-small">' + scope.item.title + '</h1>');
            preview.$description = $('');
            preview.$href = $('<div class="cLink"><a ng-href="' + attributes.largesrc + '" class="wu-btn wu-btn--transparent-black"  id="dlLink" target="_blank">Get Image</a></div><div  class="cLink"><a ng-href="' + scope.item.editable_spec + '" class="wu-btn wu-btn--transparent-black"  id="dlLink" target="_self">Get Editable Spec</a></div>');
            preview.$more = $('');
          }
        }
        preview.$detailsInner = $('<div class="og-details_inner  col-xs-12"></div>').append(preview.$title, preview.$description, preview.$href);
        preview.$details = $('<div class="og-details xlarge-4 col-lg-4 col-md-4 col-sm-4 col-xs-4 columns"></div>').append(preview.$detailsInner);
        preview.$loading = $('<div class="og-loading-"></div>');
        preview.$fullimage = $('<div class="og-fullimg xlarge-8 col-lg-8 col-md-8 col-sm-8 col-xs-8"></div>').append(preview.$loading).append(preview.$image);
        preview.$closePreview = $('<span class="preview-close"></span>');
        preview.$previewInner = $('<div class="og-expander-inner preview-inner"></div>').append(preview.$closePreview, preview.$details, preview.$fullimage, preview.$alternatives, preview.$more);
        preview.$previewContainer = $('<div class="container"></div>').append(preview.$previewInner);
        preview.$previewEl = $('<div class="og-expander" style="height:0px;"></div>').append(preview.$previewContainer);
        if (element.hasClass('og-expanded')) {
          scope.closingPreview = element[0].id;
          destroyPreview(element);
          return false
        }
        if (element.hasClass('not-og-expanded')) {
          if (scope.opening == true) {
            return false;
          } else {
            scope.openingPreview = scope.currentSamplePreview;
            if (element[0].id != $scope.getPreviousSample() && $scope.getPreviousSample() != null) {
              scope.closingPreview = $scope.getPreviousSample();
              destroyPreview(angular.element('#' + $scope.getPreviousSample()));
            }
            createPreview(element);
          }
        }
      };
    }
  }
}]);
app.directive('socialFacebook', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: angular.extend({
      status: '@status',
      title: '@title'
    }, sharedScopeDefinition),
    link: linker(function (scope, url) {
      var shareUrl;
      shareUrl = ["https://facebook.com/sharer.php?"];
      shareUrl.push("u=" + (encodeURIComponent(url)));
      shareUrl.push("title=" + scope.title);
      return shareUrl.join('&');
    })
  };
}]);
app.directive('socialTwitter', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: angular.extend({
      status: '@status',
      title: '@title'
    }, sharedScopeDefinition),
    link: linker(function (scope, url) {
      scope.status || (scope.status = scope.title + " - " + url);
      return "https://twitter.com/intent/tweet?text=" + (encodeURIComponent(scope.status));
    })
  };
}]);
app.directive('socialGplus', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: sharedScopeDefinition,

    link: linker(function (scope, url) {
      var shareUrl;
      shareUrl = ["https://plus.google.com/share?"];
      shareUrl.push("url=" + (encodeURIComponent(url)));
      shareUrl.push("title=" + scope.title);
      shareUrl.push("media=" + (encodeURIComponent(scope.media)));
      return shareUrl.join('&');
    })
  };
}]);
app.directive('socialPinterest', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: angular.extend({
      media: '@media',
      description: '@description',
      title: '@title'
    }, sharedScopeDefinition),
    link: linker(function (scope, url) {
      var shareUrl;
      shareUrl = ["http://pinterest.com/pin/create/button/?"];
      shareUrl.push("url=" + (encodeURIComponent(url)));
      shareUrl.push("title=" + scope.title);
      shareUrl.push("media=" + (encodeURIComponent(scope.media)));
      shareUrl.push("description=" + scope.title);
      return shareUrl.join('&');
    })
  };
}]);
app.directive('socialStumbleupon', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: sharedScopeDefinition,
    link: linker(function (scope, url) {
      return "https://stumbleupon.com/submit?url=" + (encodeURIComponent(url));
    })
  };
}]);
app.directive('socialLinkedin', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: angular.extend({
      title: '@title',
      media: '@media',
      description: '@description'
    }, sharedScopeDefinition),
    link: linker(function (scope, url) {
      var shareUrl;
      shareUrl = ["https://linkedin.com/shareArticle?"];
      shareUrl.push("url=" + (encodeURIComponent(url)));
      shareUrl.push("title=" + scope.title);
      shareUrl.push("summary=" + (encodeURIComponent(scope.description)));
      shareUrl.push("media=" + (encodeURIComponent(scope.media)));
      return shareUrl.join('&');
    })
  };
}]);
app.directive('socialReddit', ['socialLinker', function (linker) {

  return {
    restrict: 'ACEM',
    scope: sharedScopeDefinition,
    link: linker(function (scope, url) {
      return "https://www.reddit.com/submit?url=" + (encodeURIComponent(url));
    })
  };
}]);
app.directive('socialVk', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: sharedScopeDefinition,
    link: linker(function (scope, url) {
      return "http://vkontakte.ru/share.php?url=" + (encodeURIComponent(url));
    })
  };
}]);
app.directive('socialOk', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: sharedScopeDefinition,
    link: linker(function (scope, url) {
      return "http://www.odnoklassniki.ru/dk?st.cmd=addShare&st._surl=" + (encodeURIComponent(url));
    })
  };
}]);
app.directive('socialXing', ['socialLinker', function (linker) {
  return {
    restrict: 'ACEM',
    scope: sharedScopeDefinition,
    link: linker(function (scope, url) {
      return "https://www.xing.com/spi/shares/new?url=" + (encodeURIComponent(url));
    })
  };
}]);
app.directive('wuCmsContentBlockThreeColumn', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/three_column/three_column.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockTitleBar', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/title_bar/title_bar.html',
    restrict: 'E',
    replace: true
  };
});
app.directive('wuCmsContentBlockTwoColumn', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/two_column/two_column.html',
    restrict: 'E',
    replace: true
  };
});
app.run(["$templateCache", function($templateCache) {
 'use strict';
 $templateCache.put("app/demo/demo.html", "<div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\" style=\"display:none;\"><h2 class=\"content\">Demo</h2><p>The content below the horizontal line is dynamically generated. Jump to the very bottom of page to edit the content on the page.</p></div></div></div><div class=\"divider-bar\" /><wu-cms-content-block content-block=\"contentBlock\" ng-repeat=\"contentBlock in contentBlocks\"></wu-cms-content-block><div class=\"divider-bar\" /><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\"><h1 class=\"content\">Try it out</h1><p class=\"content\">Edit the JSON below to change the content which is displayed above.</p><div class=\"clearfix\"><span class=\"pull-right label label-success\" ng-show=\"valid\">Valid</span><span class=\"pull-right label label-danger\" ng-show=\"!valid\">Invalid </span></div><br /><textarea class=\"json-area\" ng-model=\"contentBlockString\" /></div></div></div>");
 $templateCache.put("app/examples/examples.html", "<div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-12\"><h1 class=\"content\">Examples</h1></div></div></div><div ng-repeat=\"example in examples\"><div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-12\"><h3 class=\"content\"> Example {{ $index + 1 }}: {{ example.description }}</h3><pre ng-bind=getCodeBlock(example.content_block)></pre></div></div></div><wu-cms-content-block content-block=\"example.content_block\"></wu-cms-content-block></div>");
 $templateCache.put("app/docs/docs.html", "<div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-12 content\"><h1 class=\"content\">Documentation</h1><p>See the <a href=\"#/examples\">Examples</a> page for examples.</p><div btf-markdown ng-include=\"\'docs/DOCUMENTATION.md\'\"></div></div></div></div>");
 $templateCache.put('app/landing_page/landing_page.html', '<wu-cms-content-block content-block="contentBlock" ng-repeat="contentBlock in contentBlocks"></wu-cms-content-block>');
 $templateCache.put('components/cms/content_blocks/content_block/content_block.html', '<div class="wu-cms-content-block" ng-class="getContentBlockClass()"><div ng-switch on="contentBlock.content_block_type"><wu-cms-content-block-title_bar content-block="contentBlock" ng-switch-when="title_bar"></wu-cms-content-block-title_bar><wu-cms-content-block-banner content-block="contentBlock" ng-switch-when="banner"></wu-cms-content-block-banner><wu-cms-content-block-banner-carousel ng-switch-when="banner_carousel"></wu-cms-content-block-banner-carousel><wu-cms-content-block-banner2 content-block="contentBlock.banner2" content-block="contentBlock" ng-switch-when="banner2"></wu-cms-content-block-banner2><wu-cms-content-block-banner-carousel2 content-block="contentBlock.banner_carousel2" ng-switch-when="banner_carousel2"></wu-cms-content-block-banner-carousel2><wu-cms-content-block-fluid-grid ng-switch-when="fluid_grid"></wu-cms-content-block-fluid-grid><wu-cms-content-block-home-grid ng-switch-when="home_grid"></wu-cms-content-block-home-grid><wu-cms-content-block-call-to-action ng-switch-when="call_to_action"></wu-cms-content-block-call-to-action><wu-cms-content-block-horizontal-rule ng-switch-when="horizontal_rule"></wu-cms-content-block-horizontal-rule><wu-cms-content-block-standard-block-video ng-switch-when="standard_block_video"></wu-cms-content-block-standard-block-video><wu-cms-content-block-standard-block ng-switch-when="standard_block"></wu-cms-content-block-standard-block><wu-cms-content-block-products content-block="contentBlock" ng-switch-when="products"></wu-cms-content-block-products><wu-cms-content-block-two-column ng-switch-when="two_column"></wu-cms-content-block-two-column><wu-cms-content-block-three-column ng-switch-when="three_column"></wu-cms-content-block-three-column><wu-cms-content-block-four-column ng-switch-when="four_column"></wu-cms-content-block-four-column><wu-cms-content-block-five-column ng-switch-when="five_column"></wu-cms-content-block-five-column><wu-cms-content-block-tabs content-block="contentBlock" ng-switch-when="tabs"></wu-cms-content-block-tabs><wu-cms-content-block-timeline source="contentBlock.timeline" ng-switch-when="timeline"></wu-cms-content-block-timeline><wu-cms-content-block-blog source="contentBlock" ng-switch-when="blog"></wu-cms-content-block-blog><wu-cms-content-block-media-ads ng-switch-when="advertising" content-block="contentBlock.advertising"></wu-cms-content-block-media-ads><wu-cms-content-block-media-awards ng-switch-when="awards" content-block="contentBlock.awards"></wu-cms-content-block-media-awards><wu-cms-content-block-media-online_video ng-switch-when="videos" content-block="contentBlock.videos"></wu-cms-content-block-media-online_video><wu-cms-content-block-fabric-collection ng-switch-when="fabric_collection" content-block="contentBlock.fabric_collection"></wu-cms-content-block-fabric-collection><wu-cms-content-block-bedding-spec-book ng-switch-when="bedding_spec_book" content-block="contentBlock.bedding_spec_book"></wu-cms-content-block-bedding-spec-book><wu-cms-content-block-gradient-spec-book ng-switch-when="gradient_spec_book" content-block="contentBlock.gradient_spec_book"></wu-cms-content-block-gradient-spec-book><div ng-switch-default ng-bind="contentBlock.content_block_type"></div></div></div>');
 $templateCache.put('components/cms/splash/splash.html',
 '<div m-app-loading class="m-app-loading" ng-animate-children md-swipe-down="onSwipeDown()" ng-show="showSplash" data-ng-hide="showSplash">' +
 '	<div class="animated-container">' +
 '		<div id="splash-logo"><img src="http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/logo-white.svg"></div>' +
 '		<a ng-click="leave()"><span id="scrolly"></span><span id="splash-enter">CLICK TO ENTER</span></a>' +
 '	</div>' +
 '</div>');
// $templateCache.put("components/menu_utility/menu_utility.html", "<div class=\"nav__utility\"><div class=\"nav__utility__inner clearfix\"><div class=\"cshero-menu-dropdown\"><ul class=\"cshero-dropdown main-menu menu-item menu-item-padding right\" -dropdown on-toggle=\"toggled(open)\"><li></li><li class=\"hide\"><a ng-hide=\"currentUser\" href=\"/views/account-register#/\">Register</a></li><li class=\"menu-item menu-item menu__item__has__children\"><a ng-hide=\"currentUser\" href=\"/#/design-library\">Login</a><a href ng-if=\"currentUser\" class=\"dropdown-toggle\" dropdown-toggle><span ng-bind=\"currentUser\"></span><ul ng-if=\"currentUser\" class=\"standar-dropdown standard autodrop_submenu sub-menu\"><li uMenu=\"utilityMenu\" ng-repeat=\"item in utilityMenu\" id=\"menu-item menu-item-{{item.entry_id}}\" class=\"menu-item\"><a href=\"/#{{item.url}}\">{{item.label}}</a></li><li><a ng-click=\"logOut()\">Sign Out</a></li></ul></li><li class=\"menu-item\"><a href=\"/#/cart/\"><i style=\"line-height: 2em;\" class=\"fa fa-shopping-cart\"></i><div class=\"cart_count\" style=\"display: none;\"><div class=\"count\"></div></div></a></li></ul></div></div></div>");
$templateCache.put('components/menu_utility/menu_utility.html', 
' <div><div layout="row" layout-align="space-between center" hide-gt-xs flex="" class="layout-align-space-between-center layout-row flex">' +
' <md-toolbar>' +
' <div class="md-toolbar-tools">' +
' <div ng-show="showSearch" layout="column" flex="100" flex-sm="100" flex-xs="100" layout-align="center center" class="layout-align-center-center layout-column flex-xs-100 flex-sm-100 flex-100"><a ng-href="/#/lp/home" href="/#/lp/home"><img class="wu-logo" src="http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/logo.svg"></a></div>' +
' </div>' +
' </md-toolbar>' +
' </div>' +
' <div layout="row" layout-align="space-between center" flex="" class="layout-align-space-between-center layout-row flex">' +
' <div layout="column" flex="20" flex-sm="100" flex-xs="100" layout-align="center start" >' +
' <div ng-show="showSearch" class="md-toolbar-tools" layout="column" layout-align="center start">' +
' <md-button class="md-icon-button md-primary" aria-label="Menu" ng-click="toggleLeft()">' +
' <ng-md-icon icon="menu"></ng-md-icon>' +
' </md-button>' +
' </div>' +
' <div ng-show="!showSearch" class="md-toolbar-tools">' +
' <md-button class="md-icon-button md-primary" ng-click="showSearch = !showSearch" aria-label="Back">' +
' <ng-md-icon icon="arrow_back"></ng-md-icon>' +
' </md-button>' +
' <md-button class="md-icon-button md-primary" ng-click="showSearch = !showSearch" aria-label="Back"></md-button>' +
' </div>' +
' </div>' +
' <div layout="column" hide-xs flex="50" flex-sm="100" flex-xs="100" layout-align="center center">' +
' <a ng-show="showSearch" ng-href="/#/lp/home" href="/#/lp/home"><img class="wu-logo" src="http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/logo.svg"></a>' +
' <md-content id="header_search" flex="none">' +
' <md-input-container ng-show="!showSearch" md-theme="input" >' +
' <label>&nbsp;</label>' +
' <input ng-model="GoogleCSE" placeholder="enter search">' +
' </md-input-container>' +
' </md-content>' +
' </div>' +
' <div layout="column" flex="30" flex-sm="100" flex-xs="100" layout-align="end center">' +
' <div layout="row">' +
' <md-toolbar>' +
' <div class="md-toolbar-tools">' +
' <a href="http://livingfresh.com" target="_blank">BUY OUR BEDDING</a>' +
' <md-button class="md-icon-button md-primary" aria-label="Search" ng-click="showSearch = !showSearch">' +
' <ng-md-icon icon="search" aria-label="Search"></ng-md-icon>' +
' </md-button>' +
' <md-button class="md-icon-button md-primary" aria-label="Shopping Cart">' +
' <ng-md-icon icon="shopping_cart">' +
' <a href="/#/cart/"> ' +
' <div class="cart_count" style="display: none;">' +
' <div class="count"></div>' +
' </div>' +
' </a>' +
' </ng-md-icon>' +
' </md-button>' + 
' <md-button ng-if="!currentUser" aria-label="Login" ng-hide="currentUser" class="md-primary" ng-click="logIn()" ng-click="-showAdvanced($event)">Login</md-button>' +
//' <md-menu-bar id="user-menu" role="menubar" class="_md md-default-theme md-keyboard-mode md-open">' +
//' <md-menu md-position-mode="left bottom" class="md-menu _md" >' +
' <button ng-if="currentUser" class="dropdown-toggle user-button md-button md-default-theme md-ink-ripple" type="button" ng-mouseenter="openProfileMenu()" ng-click="openProfileMenu()" aria-label="User settings" translate="" aria-haspopup="true" aria-expanded="true" aria-owns="menu_container_9"><img md-menu-align-target="" class="avatar" src="dist/assets/images/avatars/profile.jpg"></button>' +
//' </md-menu>' +
//' </md-menu-bar>' +
' </div>' +
' </md-toolbar>' +
' </div>' +
' </div>' +
' <div class="_md md-open-menu-container md-whiteframe-z2 md-default-theme md-active md-clickable" id="user_menu" aria-hidden="false" style="display:none;" ng-mouseleave="closeProfileMenu()">' +
' <md-menu-content width="3" class="md-menu-bar-menu md-dense md-default-theme" role="menu">' +
' <md-menu-item ng-repeat="item in utilityMenu" class="md-indent md-in-menu-bar" >' +
' <md-button class="md-button md-default-theme md-ink-ripple" type="button" role="menuitem" href="/#{{item.url}}">{{item.label}}<div class="md-ripple-container"></div></md-button>' +
' </md-menu-item>' +
' <md-menu-divider role="separator"></md-menu-divider>' +
' <md-menu-item class="md-indent md-in-menu-bar">' +
//' <md-icon md-font-icon="icon-logout" class="icon md-default-theme md-font material-icons icon-logout" role="img" aria-label="icon-logout"></md-icon>' +
' <md-button class="md-button md-default-theme md-ink-ripple" type="button" ng-click="logOut()" role="menuitem">Logout<div class="md-ripple-container"></div></md-button>' +
' </md-menu-item>' +
' </md-menu-content>' +
' </div>' + 
'</div>'); 
 $templateCache.put('components/menu_header/menu_header.html', '<md-sidenav md-component-id="left" class="md-sidenav-left">' +
 '<md-toolbar md-scroll-shrink>' +
 ' <div class="md-toolbar-tools">' +
 ' <h1>{{menuTitle}}</h1>' +
 ' <span flex></span>' +
 ' <md-button ng-click="toggleLeft()">Close</md-button>' +
 ' </div>' +
 ' </md-toolbar>' +
 ' <md-content>' +
 ' <div ng-show="mainMenu" class="mainmenu">' +
 ' <md-list role="list">' +
 ' <md-item ng-repeat="item in headerMenu" role="listitem" ng-click="nav(item)" aria-label="{{item.label}}">' +
 ' <a ng-if="item.hassubmenu" >' +
 ' <md-item-content layout="role" layout-align="center center" class="md-secondary md-icon-button" ng-click="nav(item)" id="{{item.entry_id}}">' +
 ' <div class="inset"><strong>{{item.label}}</strong><md-icon aria-label="chevron_right" class="material-icons">chevron_right</md-icon></div>' +
// ' ' +
 ' </md-item-content>' + 
 ' </a>' + 
 ' <a ng-if="!item.hassubmenu" ng-href="{{item.url}}">' +
 ' <md-item-content layout="role" layout-align="center center" class="md-secondary md-icon-button" ng-click="toggleLeft()" id="{{item.entry_id}}">' +
 ' <div class="inset"><strong>{{item.label}}</strong></div>' +
// ' <md-icon aria-label="chevron_right" class="material-icons">chevron_right</md-icon>' +
 ' </md-item-content>' + 
 ' </a>' +
 ' </md-item>' +
 ' </md-list>' +
 ' </div>' +
 ' <div ng-show="showsubmenu" ng-class="{hassubmenu: hassubmenu}" > ' +
 ' <md-list>' +
 ' <md-item >' +
 ' <md-item-content layout="role" layout-align="center center" class="md-secondary md-icon-button" ng-click="nav(\'main\')" id="{{item.entry_id}}">' +
 ' <div class="inset"><md-icon aria-label="chevron_right" class="material-icons">chevron_left</md-icon><strong>Back</strong></div>' +
 ' ' + 
 ' </md-item-content>' + 
 ' </md-item>' +
 ' <md-item ng-repeat="item in submenu" ng-click="nav(item)">' +
 ' <a ng-href="{{item.url}}" ng-click="toggleLeft()">' +
 ' <md-item-content layout="role" layout-align="center center" class="md-secondary md-icon-button" id="{{item.entry_id}}">' +
 ' <div class="inset"><strong>{{item.label}}</strong></div>' +
 ' </md-item-content>' + 
 ' </a>' +
 ' </md-item>' +
 ' </md-list>' +
 ' </div> ' +
 ' </md-content>' +
 '</md-sidenav>');
 
 $templateCache.put('components/header/header.html', 
 '<div>' +
 ' <div style="display:none; margin: 0 auto; text-align: center; font-weight: bold;" class="alert alert-info">The Valley Forge Office is closed due to inclement weather in our area. If you are a customer with questions related to your project, please contact your assigned Account Manager. We are reopening on Monday.</div>' +
 ' <menu_utility></menu_utility>' +
 ' <menu-header></menu-header>' +
 ' <div style="visibility: hidden">' +
 ' <div class="md-dialog-container" id="myDialog">' +
 ' <md-dialog aria-label="VFF)" layout-padding="">' +
 ' <h2>Pre-Rendered Dialog</h2>' +
 ' <p>' +
 ' This is a pre-rendered dialog, which means that <code>$mdDialog</code> doesn\'t compile its' +
 ' template on each opening.' +
 ' <br><br>' +
 ' The Dialog Element is a static element in the DOM, which is just visually hidden.<br>' +
 ' Once the dialog opens, we just fetch the element from the DOM into our dialog and upon close' +
 ' we restore the element back into its old DOM position.' +
 ' </p>' +
 ' </md-dialog>' +
 ' </div>' +
 ' </div>' +
 '</div>');
 $templateCache.put('components/cms/content_blocks/search_results.html',
 '<md-dialog aria-label="Mango (Fruit)"><md-dialog-content>' +
 //'<pre>{{$parent}}</pre><pre>{{$parent.searchResults}}</pre><pre>{{$parent.searchResults.items}}</pre>' +
 '<md-toolbar layout="row" class="" style="color: #2b2b2b; border-color: #2b2b2b; background-color: transparent;">' +
 ' <div class="md-toolbar-tools">' +
 ' <span>Search Results</span>' +
 ' </div>' +
 '</md-toolbar>' +
 '<md-content>' +
 '<md-list class="md-dense" flex>' +
 ' <md-subheader class="md-no-sticky">{{$parent.searchResults.displaying}}</md-subheader>' +
 ' <md-list-item class="md-3-line" ng-repeat="item in $parent.searchResults.results" ng-click="cancel()">' +
 ' <img ng-src="{{item.face}}?{{$index}}" class="md-avatar" alt="{{item.who}}" />' +
 ' <div class="md-list-item-text" layout="column">' +
 ' <a ng-href="{{ item.url }}"><h3>{{ item.title }}</h3>' +
 ' <h4 ng-bind-html="item.description"></h4>' +
 ' <p>{{ item.url }}</p></a>' +
 ' </div>' +
 ' </md-list-item>' +
 '</md-content>' +
 '</md-dialog-content></md-dialog>'); 
 $templateCache.put('components/cms/content_blocks/home_grid.html', 
 '<div class="fluid-container">' +
 // ' <link rel="stylesheet" href="https://cdn.gitcdn.link/cdn/angular/bower-material/v1.1.1/angular-material.css" />' +
 // ' <!-- <link rel="stylesheet" href="https://material.angularjs.org/1.1.1/docs.css" /> -->' +
 ' <div flex="" ng-cloak="" class="gridListdemoDynamicTiles" >' +
 ' <md-grid-list md-cols-xs="1" md-cols-sm="2" md-cols-md="3" md-cols-gt-md="4" md-row-height="2:2" md-gutter="4px" md-gutter-gt-sm="4px">' +
 ' <md-grid-tile ng-repeat="tile in contentBlock.home_grid">' +
 ' <md-card layout-fill ng-class="tile.background">' +
 ' <a ng-href="{{tile.grid_url}}">' +
 ' <md-card-title style="position: absolute;">' +
 ' <md-card-title-text>' +
 ' <span class="md-headline" style="text-transform: uppercase;">{{tile.title}}</span>' +
 ' </md-card-title-text>' +
 ' </md-card-title>' +
 ' </a>' +
 ' <img ng-src="{{tile.image}}" style="height: 100%; width: 100%;" />' +
 ' </md-card>' +
 ' </md-grid-tile>' +
 ' </md-grid-list>' +
 ' </div>' +
 '</div>');
 $templateCache.put('components/cms/content_blocks/title_bar/title_bar.html', '<a ng-href="{{contentBlock.title_bar.url}}"><div class="wu-cms-content-block__title_bar__inner" style=""><div class="container"><div id="" class="row"><div class="col-xs-12 col-sm-12 col-md-12 col-lg-12"><div class="title_bar"><h1 ng-if="!contentBlock.title_bar.headline_svg" class="page-title">{{ contentBlock.title_bar.headline }}</h1><img ng-show="contentBlock.title_bar.headline_svg != \'\'" ng-src="{{contentBlock.title_bar.headline_svg}}" style="max-height: 77px;"></div></div></div></div><span class="wu-content-block_title_bar_blackout_{{ contentBlock.title_bar.custom_css }}"></span><span class="wu-cms-content-block__title_bar__overlay " style="background-color:rgba(0, 0, 0, 0.3); background-image: url( {{ contentBlock.title_bar.image_url }} ); opacity: 0.4 "></span></div></a>');
 $templateCache.put('components/cms/content_blocks/banner/banner.html', '<div class="wu-cms-content-block__banner"><img class="wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--320" ng-src="{{ contentBlock.banner.images.xs }}" /><img class="wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--480" ng-src="{{ contentBlock.banner.images.sm }}" /><img class="wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--768" ng-src="{{ contentBlock.banner.images.md }}" /><img class="wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--992" ng-src="{{ contentBlock.banner.images.lg }}" /><div class="wu-cms-content-block__banner__inner wu-cms-content-block__banner__inner--1400" background-image="{{ contentBlock.banner.images.xl }}"></div><a ng-show="contentBlock.banner.url" ng-href="/#{{ contentBlock.banner.url }}" class="wu-cms-content-block__banner__link"></a></div>');
 
 $templateCache.put('components/cms/content_blocks/banner_carousel/banner_carousel.html', '<div class="wu-cms-content-block__carousel"><div ng-carousel ng-carousel-name="example-carousel4" ng-carousel-timer="1000"><div class="wu-cms-content-block__carousel__inner owl-carousel" owl-carousel="slides" owl-options="{{ owlOptions }}"><wu-cms-content-block-banner content-block="item"></wu-cms-content-block-banner></div></div>');
 $templateCache.put("components/cms/content_blocks/fluid_grid/fluid_grid.html", "<div class=\"container\"><div class=\"row home-grid\"><div ng-repeat=\"block in contentBlock.fluid_grid\" class=\"col-xs-12 col-sm-{{ block.columns }} {{ block.size }} \" ><div ng-style=\" { 'background': 'url( {{ block.image_url }} ) center center / cover no-repeat' } \" ng-mouseenter=\"caption = !caption\" ng-class=\"{ active: caption }\" ><img src=\"dist/assets/images/clear.png\" /></div><div class=\"grid-caption\" ng-mouseleave=\"caption = false\" ng-show=\"caption\"><h1>{{ block.headline }}</h1><p ng-if=\"block.body\">{{ block.body }}</p><p ng-if=\"block.link\"><a ng-href=\"/#{{ block.link.url }}\" class=\"wu-btn wu-btn--{{ block.link.style }}\">{{ block.link.label }}</a></p><p ng-if=\"block.button\"><a ng-href=\"/#{{ block.button.url }}\" class=\"wu-btn wu-btn--{{ block.button.style }}\">{{ block.button.label }}</a></p></div></div></div></div>");
 $templateCache.put("components/cms/content_blocks/call_to_action/call_to_action.html", "<div class=\"wu-cms-content-block__call-to-action\"><div class=\"wu-cms-content-block__call-to-action__inner clearfix\"><div ng-repeat=\"cta in contentBlock.call_to_action\" class=\"wu-cms-content-block__call-to-action__item\"><div class=\"wu-cms-content-block__call-to-action__item__inner\" background-image=\"{{ cta.image_url }}\"><a ng-href=\"#{{ cta.url }}\"></a></div></div></div></div>");
 $templateCache.put("components/cms/content_blocks/horizontal_rule/horizontal_rule.html", "<div class=\"container\"><div class=\"row\"><div class=\"col-xs-12 col-sm-12\"></div></div></div>");
 $templateCache.put("components/cms/content_blocks/products/products.html", "<div class=\"container\"><div class=\"row\"><div><div class=\"wu-cms-content-block__products\" ng-repeat=\"product in contentBlock.products\"><div class=\"col-xs-4\"><img class=\"image\" ng-if=\"product.image\" ng-src=\"{{product.image}}\" /></div><div class=\"info col-xs-8\"><h5 ng-if=\"product.name\" ng-bind=\"product.name\"></h5><p ng-if=\"product.summary\" ng-bind=\"product.summary\"></p><div class=\"button_container\"><div><a class=\"wu-btn wu-btn--inline wu-btn wu-btn--transparent-black\" ng-href=\"/#/product-detail/{{product.id}}\">Read More</a></div><div><i class=\"product_icon sustainable_icon\"></i><a class=\"hide product_icon spec_icon\" ng-href=\"#{{product.spec}}\"></a></div></div></div></div></div></div></div>");
 $templateCache.put("components/cms/content_blocks/standard_block_video/standard_block_video.html", "<div class=\"container\"><div class=\"row\"><div class=\"\"><div class=\"wu-cms-content-block__standard_block__youtube\"><a ng-href=\"{{contentBlock.standard_block_video.link}}\" target=\"_blank\"><video ng-if=\"contentBlock.standard_block_video.video_src\" ng-attr-poster=\"{{contentBlock.standard_block_video.poster}}\" ng-attr-loop=\"{{ contentBlock.standard_block_video.loop || undefined}}\" ng-attr-autoplay=\"{{ contentBlock.standard_block_video.autoplay || undefined}}\" controls=\"true\" class=\"img-responsive wu-cms-content-block__standard_block__youtube\" tabindex=\"0\" autobuffer=\"autobuffer\" preload=\"preload\" type=\"video/mp4\"><source type=\"video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;\" ng-src=\"{{contentBlock.standard_block_video.video_src | trusted}}\"><source type=\"video/mp4; codecs=&quot;avc1.42E01E, mp4a.40.2&quot;\" ng-src=\"{{contentBlock.standard_block_video.video_src | trusted}}\"><p>Sorry, your browser does not support the &lt;video&gt; element.</p></video></a></div></div></div></div>");
 $templateCache.put("components/cms/content_blocks/standard_block/standard_block.html", "<div class=\"container\"><div class=\"row\"><div class=\"\"><div class=\"wu-cms-content-block__standard_block\"><h1 ng-bind=\"contentBlock.standard_block.headline\" ng-if=\"contentBlock.standard_block.headline\"></h1><h5 ng-bind=\"contentBlock.standard_block.sub_headline\" ng-if=\"contentBlock.standard_block.sub_headline\"></h5><youtube-video- video-id=\"contentBlock.standard_block.youtube\" ng-hide=\"contentBlock.standard_block.youtube\" ></youtube-video-><img class=\"-image\" ng-if=\"contentBlock.standard_block.image\" ng-src=\"{{contentBlock.standard_block.image}}\" /><p ng-bind-html=\"contentBlock.standard_block.body\" ng-if=\"contentBlock.standard_block.body\"></p><p ng-if=\"contentBlock.standard_block.button\"><a class=\"wu-btn wu-btn--inline\" ng-class=\"getButtonClass(contentBlock.standard_block.button.style)\" ng-href=\"/#{{ contentBlock.standard_block.button.url }}\" ng-bind=\"contentBlock.standard_block.button.label\"></a></p><p ng-if=\"contentBlock.standard_block.link.url\"><a ng-href=\"/#{{ contentBlock.standard_block.link.url }}\" ng-bind=\"contentBlock.standard_block.link.label\"></a></p></div></div></div></div>");
 $templateCache.put("components/cms/content_blocks/two_column/two_column.html", "<div class=\"container\"><div class=\"row\"><div class=\"wu-cms-content-block__standard_block\"><h1 ng-bind=\"contentBlock.two_column.headline\" ng-if=\"contentBlock.two_column.headline\"></h1><h5 ng-bind=\"contentBlock.two_column.sub_headline\" ng-if=\"contentBlock.two_column.sub_headline\"></h5><youtube-video ng-if=\"contentBlock.two_column.youtube\" video-id=\"{{contentBlock.two_column.youtube}}\"></youtube-video><img class=\"-image\" ng-if=\"contentBlock.two_column.image\" ng-src=\"{{contentBlock.two_column.image}}\" /><p ng-bind-html=\"contentBlock.two_column.body\" ng-if=\"contentBlock.two_column.body\"></p></div><div class=\"wu-cms-content-block__two_column\"><div class=\"col-sm-6 col-md-6 wu-cms-content-block__two-column\" ng-repeat=\"column in contentBlock.two_column.columns\"><h1 class=\"wu-cms-content-block__two-column__headline\" ng-bind=\"column.headline\" ng-if=\"column.headline\"></h1><h5 class=\"wu-cms-content-block__two-column__sub_headline\" ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\"></h5><youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__two-column__youtube\"></youtube-video><img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" /><p class=\"wu-cms-content-block__two-column__body\" ng-bind-html=\"column.body\" ng-if=\"column.body\"></p><a ng-if=\"column.button\" class=\"wu-btn wu-btn--inline\" ng-class=\"getButtonClass(column.button.style)\" ng-href=\"#{{ column.button.url }}\" ng-bind=\"column.button.label\"> {{ column.button.label }}</a><p ng-if=\"column.link.url\"><a ng-href=\"#{{ column.link.url }}\" ng-bind=\"column.link.label\"></a></p></div></div></div>");
 $templateCache.put("components/cms/content_blocks/three_column/three_column.html", "<div class=\"container\"><div class=\"row\"><div class=\"\"><div class=\"wu-cms-content-block__standard_block\"><h1 ng-bind=\"contentBlock.three_column.headline\" ng-if=\"contentBlock.three_column.headline\"></h1><h5 ng-bind=\"contentBlock.three_column.sub_headline\" ng-if=\"contentBlock.three_column.sub_headline\"></h5><youtube-video ng-if=\"contentBlock.three_column.youtube\" video-id=\"{{contentBlock.three_column.youtube}}\"></youtube-video><img class=\"-image\" ng-if=\"contentBlock.three_column.image\" ng-src=\"{{contentBlock.three_column.image}}\" /><p ng-bind-html=\"contentBlock.three_column.body\" ng-if=\"contentBlock.three_column.body\"></p></div></div><div class=\"row\"><div class=\"col-sm-4 col-md-4 wu-cms-content-block__three-column\" ng-repeat=\"column in contentBlock.three_column.columns\"><h1 class=\"wu-cms-content-block__three-column__headline\" ng-bind=\"column.headline\" ng-if=\"column.headline\"></h1><h5 class=\"wu-cms-content-block__three-column__sub_headline\" ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\"></h5><youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__three-column__youtube\"></youtube-video><img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" /><p class=\"wu-cms-content-block__three-column__body\" ng-bind-html=\"column.body\" ng-if=\"column.body\"></p><a ng-if=\"column.button\" class=\"wu-btn wu-btn--inline\" ng-class=\"getButtonClass(column.button.style)\" ng-href=\"/{{ column.button.url }}\" ng-bind=\"column.button.label\"> {{ column.button.label }}</a><p ng-if=\"column.link.url\"><a ng-href=\"{{ column.link.url }}\" ng-bind=\"column.link.label\"></a></p></div></div></div>");
 $templateCache.put("components/cms/content_blocks/four_column/four_column.html", "<div class=\"container\"><div class=\"row\"><div class=\"\"><div class=\"wu-cms-content-block__standard_block\"><h1 ng-bind=\"contentBlock.four_column.headline\" ng-if=\"contentBlock.four_column.headline\"></h1><h5 ng-bind=\"contentBlock.four_column.sub_headline\" ng-if=\"contentBlock.four_column.sub_headline\"></h5><youtube-video ng-if=\"contentBlock.four_column.youtube\" video-id=\"{{contentBlock.four_column.youtube}}\"></youtube-video><img class=\"-image\" ng-if=\"contentBlock.four_column.image\" ng-src=\"{{contentBlock.four_column.image}}\" /><p ng-bind-html=\"contentBlock.four_column.body\" ng-if=\"contentBlock.four_column.body\"></p></div></div><div class=\"row\"><div class=\"col-sm-6 col-md-6 wu-cms-content-block__four-column\" ng-repeat=\"column in contentBlock.four_column.columns\"><h1 class=\"wu-cms-content-block__four-column__headline\" ng-bind=\"column.headline\" ng-if=\"column.headline\"></h1><h5 class=\"wu-cms-content-block__four-column__sub_headline\" ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\"></h5><youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__four-column__youtube\"></youtube-video><img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" /><p class=\"wu-cms-content-block__four-column__body\" ng-bind-html=\"column.body\" ng-if=\"column.body\"></p><a ng-if=\"column.button\" class=\"wu-btn wu-btn--inline\" ng-class=\"getButtonClass(column.button.style)\" ng-href=\"#{{ column.button.url }}\" ng-bind=\"column.button.label\"> {{ column.button.label }}</a><p ng-if=\"column.link.url\"><a ng-href=\"#{{ column.link.url }}\" ng-bind=\"column.link.label\"></a></p></div></div></div>");
 $templateCache.put("components/cms/content_blocks/five_column/five_column.html", "<div class=\"container\"><div class=\"row\"><div class=\"\"><div class=\"wu-cms-content-block__standard_block\"><h1 ng-bind=\"contentBlock.five_column.headline\" ng-if=\"contentBlock.five_column.headline\"></h1><h5 ng-bind=\"contentBlock.five_column.sub_headline\" ng-if=\"contentBlock.five_column.sub_headline\"></h5><youtube-video ng-if=\"contentBlock.five_column.youtube\" video-id=\"{{contentBlock.five_column.youtube}}\"></youtube-video><img class=\"-image\" ng-if=\"contentBlock.five_column.image\" ng-src=\"{{contentBlock.five_column.image}}\" /><p ng-bind-html=\"contentBlock.five_column.body\" ng-if=\"contentBlock.five_column.body\"></p></div></div><div class=\"row\"><div class=\"col-xs-2_5 wu-cms-content-block__five-column\" ng-repeat=\"column in contentBlock.five_column.columns\"><h1 class=\"wu-cms-content-block__five-column__headline\" ng-bind=\"column.headline\" ng-if=\"column.headline\"></h1><h5 class=\"wu-cms-content-block__five-column__sub_headline\" ng-bind=\"column.sub_headline\" ng-if=\"column.sub_headline\"></h5><youtube-video ng-if=\"column.youtube\" video-id=\"column.youtube\" class=\"wu-cms-content-block__five-column__youtube\"></youtube-video><img class=\"image\" ng-if=\"column.image\" ng-src=\"{{column.image}}\" /><p class=\"wu-cms-content-block__five-column__body\" ng-bind-html=\"column.body\" ng-if=\"column.body\"></p><a ng-if=\"column.button\" class=\"wu-btn wu-btn--inline\" ng-class=\"getButtonClass(column.button.style)\" ng-href=\"#{{ column.button.url }}\" ng-bind=\"column.button.label\">{{ column.button.label }}</a><p ng-if=\"column.link.url\"><a ng-href=\"#{{ column.link.url }}\" ng-bind=\"column.link.label\"></a></p></div></div></div>");
 $templateCache.put("components/cms/content_blocks/tabs/tabs.html", "<div class=\"container\"><div class=\"row \"><tabs><pane ng-repeat=\"tab in contentBlock.tabs\" title=\"{{ tab.label}}\"><div ng-repeat=\"contentBlock in tab.tabContentBlocks\" tab-content-block=\"contentBlock\" class=\"wu-cms-content-block\" ng-class=\"getTabContentBlockClass(contentBlock)\"><div ng-switch on=\"contentBlock.content_block_type\" class=\"col-xs-12 col-sm-12 col-md-12 col-lg-12\"><wu-cms-content-block-banner tab-content-block=\"tabContentBlock\" ng-switch-when=\"banner\"></wu-cms-content-block-banner><wu-cms-content-block-banner-carousel ng-switch-when=\"banner_carousel\"></wu-cms-content-block-banner-carousel><wu-cms-content-block-fluid-grid ng-switch-when=\"fluid_grid\"></wu-cms-content-block-fluid-grid><wu-cms-content-block-call-to-action ng-switch-when=\"call_to_action\"></wu-cms-content-block-call-to-action><wu-cms-content-block-horizontal-rule ng-switch-when=\"horizontal_rule\"></wu-cms-content-block-horizontal-rule><wu-cms-content-block-standard-block-video ng-switch-when=\"standard_block_video\"></wu-cms-content-block-standard-block-video><wu-cms-content-block-standard-block tab-content-block=\"contentBlock\" ng-switch-when=\"standard_block\"></wu-cms-content-block-standard-block><wu-cms-content-block-two-column ng-switch-when=\"two_column\"></wu-cms-content-block-two-column><wu-cms-content-block-three-column ng-switch-when=\"three_column\"></wu-cms-content-block-three-column><wu-cms-content-block-four-column ng-switch-when=\"four_column\"></wu-cms-content-block-four-column><wu-cms-content-block-five-column ng-switch-when=\"five_column\"></wu-cms-content-block-five-column><wu-cms-content-block-products content-block=\"contentBlock\" ng-switch-when=\"products\"></wu-cms-content-block-products></div></div></pane></tabs></div></div>");
$templateCache.put("components/cms/content_blocks/timeline/timeline.html", "<div id=\"timeline-embed\"></div><script type=\"text/javascript\"> var timeline_config = \{width: '100%', height: '80%', source: 'index_new.php/json/timeline', embed_id: 'timeline-embed', start_at_end: false, start_at_slide: '0', start_zoom_adjust: '3', hash_bookmark: false, font: 'Bevan-PotanoSans', debug: true, lang: 'en', maptype: 'watercolor', css: 'app/styles/timeline.css', js: 'app/scripts/non-angular/timeline-min.js'\} </script><script type=\"text/javascript\" src=\"app/scripts/non-angular/storyjs-embed.js\"></script>");
 //$templateCache.put("components/cms/content_blocks/media/advertising.html", "<div class=\"container\"><section><div class=\"main\"><ul id=\"og-grid\" class=\"og-grid ads\"><li sample xscroll-to=\"anchor{{$index}} \" class=\"col-xs-12 col-sm-6 col-md-4 col-lg-3 not-og-expanded\" id=\"anchor{{$index}}\" ng-repeat=\"item in contentBlock.advertising\" data-url=\"/#{{item.image}}\" data-largesrc=\"{{item.image}}\" data-button=\"Request Sample\" ng-click=\"-showPreview()\"><a id=\"{{ item.name }}\"><img ng-src=\"{{item.thumbnail}}\" alt=\"{{ item.name }}\" /></a></li></ul></div></section></div>");
 //$templateCache.put("components/cms/content_blocks/media/awards.html", "<div class=\"container\"><section><div class=\"main\"><ul id=\"og-grid\" class=\"og-grid awards\"><li sample xscroll-to=\"anchor{{$index}} \" class=\"not-og-expanded\" id=\"anchor{{$index}}\" ng-repeat=\"item in contentBlock.awards\" data-url=\"/#{{item.name}}\" data-largesrc=\"{{item.image}}\" data-button=\"Request Sample\" ng-click=\"-showPreview()\"><a id=\"{{ item.name }}\"><img ng-src=\"{{item.thumbnail}}\" alt=\"{{ item.name }}\"/></a></li></ul></div></section></div>");
 $templateCache.put('components/cms/content_blocks/media/advertising.html', '<div class="container">' + 
 '<section>' + 
 '<div class="main">' + 
 ' <ul id="og-grid" class="og-grid ads" >' + 
 ' <li lightgallery xscroll-to="anchor{{$index}} " class="col-xs-12 col-sm-6 col-md-4 col-lg-3 not-og-expanded" id="anchor{{$index}}" ng-repeat="item in contentBlock.advertising" data-url="/#{{item.image}}" data-src="{{item.image}}" data-button="Request Sample" -ng-click="-showPreview()" >' + 
 ' <a id="{{ item.name }}">' + 
 ' <img ng-src="{{item.thumbnail}}" alt="{{ item.name }}" />' + 
 ' </a>' + 
 ' </li>' + 
 ' </ul>' + 
 ' </div>' + 
 ' </section>' + 
 '</div>');
 $templateCache.put('components/cms/content_blocks/media/awards.html', '<div class="container">' +
 '<section>' +
 ' <div class="main">' +
 ' <ul id="og-grid" class="og-grid awards" >' +
 ' <li lightgallery xscroll-to="anchor{{$index}} " class="not-og-expanded" id="anchor{{$index}}" ng-repeat="item in contentBlock.awards" data-url="/#{{item.name}}" data-src="{{item.image}}" data-button="Request Sample" -ng-click="-showPreview()" >' +
 ' <a id="{{ item.name }}">' +
 ' <img ng-src="{{item.thumbnail}}" alt="{{ item.name }}"/>' +
 ' </a>' +
 ' </li>' +
 ' </ul>' +
 ' </div>' +
 ' </section>' +
 '</div>');
 $templateCache.put("components/cms/content_blocks/media/videos.html", "<div class=\"container\"><section><div class=\"main\"><ul id=\"og-grid\" class=\"og-grid videos\"> <li lightgallery -sample xscroll-to=\"anchor{{$index}} \" class=\"col-xs-12 col-sm-6 col-md-4 col-lg-3 not-og-expanded\" count=\"{{$index}}\" id=\"anchor{{$index}}\" ng-repeat=\"item in contentBlock.videos track by $index\" data-src=\"{{item.link}}\"><img ng-src=\"dist/assets/images/clear.png\" style=\"background:url(http://img.youtube.com/vi/{{item.id | split:'=':1}}/maxresdefault.jpg); background-size: cover; background-position-x: 50%;\"/></li></ul></div></section></div>");
 $templateCache.put("components/cms/content_blocks/blog/blog_post.html", "<div ng-if=\"contentBlock.blog.current_post\" class=\"row\" title=\"\"><div class=\"post_list_preview \"><h1 ng-bind=\"contentBlock.blog.current_post.post.title\"></h1><div><ul class=\"sharetools\"><li class=\"sharetool facebook\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-facebook class=\"icon-facebook facebook-popup \" title=\"{{contentBlock.blog.current_post.post.title}}\" ></a></li><li class=\"sharetool twitter\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-twitter class=\"icon-twitter\" title=\"{{contentBlock.blog.current_post.post.title}}\"></a></li><li class=\"sharetool googleplus\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-gplus class=\"icon-googleplus \" title=\"{{contentBlock.blog.current_post.post.title}}\" ></a></li><li class=\"sharetool pinterest\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-pinterest class=\"icon-pinterest\" title=\"{{contentBlock.blog.current_post.post.title}}\" media=\"{{contentBlock.blog.current_post.post.thumbnail}}\" description=\"{{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\" ></a></li><li class=\"sharetool linkedin\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-linkedin class=\"icon-linkedin\" title=\"{{contentBlock.blog.current_post.post.title}}\" media=\"{{contentBlock.blog.current_post.post.thumbnail}}\" description=\"{{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\" ></a></li><li class=\"sharetool email\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a class=\"icon-email \" href=\"mailto:?subject={{contentBlock.blog.current_post.post.title}}&amp;body={{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\" data-link=\"/#/blog/{{contentBlock.blog.current_post.post.slug}}\" target=\"_blank\"></a></li></ul></div><p class=\"postContent\" ng-bind-html=\"contentBlock.blog.current_post.post.content\"></p><div><ul class=\"sharetools\"><li class=\"sharetool facebook\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-facebook class=\"icon-facebook facebook-popup \" title=\"{{contentBlock.blog.current_post.post.title}}\"></a></li><li class=\"sharetool twitter\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-twitter class=\"icon-twitter\" title=\"{{contentBlock.blog.current_post.post.title}}\"></a></li><li class=\"sharetool googleplus\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-gplus class=\"icon-googleplus \" title=\"{{contentBlock.blog.current_post.post.title}}\" media=\"{{contentBlock.blog.current_post.post.thumbnail}}\" description=\"{{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\" ></a></li><li class=\"sharetool pinterest\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-pinterest class=\"icon-pinterest\" title=\"{{contentBlock.blog.current_post.post.title}}\" media=\"{{contentBlock.blog.current_post.post.thumbnail}}\" description=\"{{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\"></a></li><li class=\"sharetool linkedin\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a social-linkedin class=\"icon-linkedin\" title=\"{{contentBlock.blog.current_post.post.title}}\" media=\"{{contentBlock.blog.current_post.post.thumbnail}}\" description=\"{{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\" ></a></li><li class=\"sharetool email\" style=\"touch-action: pan-y; -webkit-user-drag: none; -webkit-tap-highlight-color: rgba(0, 0, 0, 0);\"><a class=\"icon-email \" href=\"mailto:?subject={{contentBlock.blog.current_post.post.title}}&amp;body={{contentBlock.blog.current_post.post.excerpt | htmlToPlaintext }}\" data-link=\"/#/blog/{{contentBlock.blog.current_post.post.slug}}\" target=\"_blank\"></a></li><dir-disqus disqus-shortname=\"fiftyfour118\" disqus-identifier=\"{{ identifier }}\" disqus-url=\"{{contentBlock.blog.current_post.PostLocation}}\"></dir-disqus></div></div></div>");
 $templateCache.put("components/cms/content_blocks/blog/blog_page.html", "<div><div class=\"row home-grid\"><div ng-repeat=\"post in contentBlock.blog.featured_posts.posts | limitTo : 4 : 0\" class=\"featured-post-{{$index}} \"><a href=\"/#/blog/{{post.slug}}\"><div class=\"featured-post-bg\" ng-style=\"{ 'background': 'url({{post.thumbnail}}) center center / cover no-repeat' }\" ><img src=\"dist/assets/images/clear.png\"></div><div class=\"grid-caption\"><h1 ng-bind=\"post.title\"></h1></div></a></div></div><div class=\"row\"><articles-feed-header><div class=\"article-feed__bar clearfix ng-scope\"><h3 class=\"article-feed__header module-title\"><span><span class=\"module-title__capital\">Latest Posts</span></span></h3></div></articles-feed-header><div class=\"article-feed__feed prerender_success_indicator\" complex-articles-load=\"\"><div ng-repeat=\"post in contentBlock.blog.latest_posts.posts\"><div class=\"article-feed__article\"><div class=\"feed-article clearfix\" ng-click=\"linkService(article, $event, 'go')\"><div class=\"feed-article__thumb\"><a ng-href=\"/#/blog/{{post.slug}}\" target=\"_self\" class=\"feed-article__thumb-image\" href=\"/#/blog/{{post.slug}}\"><img lazy-load-image=\"\" data-original=\"{{post.thumbnail_images.thumbnail.url}}\" alt=\"\" class=\"lazy\" ng-src=\"{{post.thumbnail_images.thumbnail.url}}\" style=\"display: inline;\"></a></div><div class=\"feed-article__info\"><h2 class=\"feed-article__title\"><a ng-href=\"/#/blog/{{post.slug}}\" ng-bind-html=\"post.title\" target=\"_self\" class=\"ng-binding\" href=\"/#/blog/{{post.slug}}\"></a></h2></div></div></div></div><div class=\"nav\"><div class=\"pageCount\">Page {{contentBlock.blog.latest_posts.currentPage}} of {{contentBlock.blog.latest_posts.pages.length}}</div><button ng-hide=\"contentBlock.blog.latest_posts.currentPage <= 1\" ng-click=\"contentBlock.blogPage('previous')\" class=\"wu-btn wu-btn--inline wu-btn--transparent-black\">Previous</button><a href=\"\" ng-repeat=\"page in contentBlock.blog.latest_posts.pages\">{{page}}</a><button ng-hide=\"contentBlock.blog.latest_posts.currentPage >= contentBlock.blog.latest_posts.pages.length \" ng-click=\"contentBlock.blogPage('next')\" class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" class=\"wu-btn wu-btn--inline wu-btn--transparent-black\">Next</button></div></div></div></div>");
 $templateCache.put("components/cms/content_blocks/blog/blog.html", "<div class=\"container\"><wu-cms-content-block-blog-page ng-if=\"contentBlock.blog.latest_posts\"></wu-cms-content-block-blog-page><wu-cms-content-block-blog-post ng-if=\"contentBlock.blog.current_post\" content-block=\"contentBlock.blog.current_post\"></wu-cms-content-block-blog-post></div>");
 $templateCache.put("components/cms/content_blocks/maintenance/maintenance.html", "<div class=\"container\"><div class=\"row\"><div class=\"col-xs-12\"><img src=\"" + apiIp + "assets/images/underconstructions.jpg\" style=\"width:100%\" /></div></div></div>");
 $templateCache.put("components/cms/content_blocks/message/message.html", "<div class=\"container\"><div class=\"col-sm-6\" style=\"margin: 0 auto; float:none;\" id=\"message\"></div></div>");
 $templateCache.put("components/cms/content_blocks/fabric_collection/fabric_collection.html","<div class=\"container\"><section><div class=\"row\"><div class=\"col-xs-12 collection_filters\"><div class=\"col-xs12 text-center\"><h4>Filter</h4></div><div class=\"col-xs-12 text-center\"><ul class=\"col-xs-12\"><li><a ng-click=\"cat = ''\">all</a></li><!-- <li><a ng-click=\"cat = 'bedding'\">bedding</a></li> --><li><a ng-click=\"cat = 'blackout'\">blackout</a></li><li><a ng-click=\"cat = 'drapery'\">drapery</a></li><li><a ng-click=\"cat = 'outdoor'\">outdoor</a></li><li><a ng-click=\"cat = 'rollershade'\">rollershade</a></li><li><a ng-click=\"cat = 'sheer'\">sheer</a></li><li><a ng-click=\"cat = 'throw pillow'\">throw pillow</a></li><li><a ng-click=\"cat = 'upholstery'\">upholstery</a></li><li><a ng-click=\"cat = 'vinyl'\">vinyl</a></li></ul></div></div></div><div class=\"row\"><div class=\"main\"><ul id=\"og-grid\" class=\"og-grid collections\" style=\"min-height:3168px\"><li sample xscroll-to=\"anchor{{$index}}\" id=\"anchor{{$index}}\" class=\"not-og-expanded\" ng-repeat=\"item in filtered = (contentBlock.fabric_collection | filter: cat) \" data-target=\"{{item.book}}\" data-largesrc=\"{{item.post_img}}\" data-title=\"{{item.title}}\" data-description=\"{{item.summary}}\" data-button=\"Browse Collection\" ng-click=\"showPreview()\"><a id=\"{{item.title}}\" name=\"{{item.title}}\" title=\"{{item.title}}\"><div style=\"min-height: 180px;\"><div class=\"item_info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6\"><div class=\"item_container\" style=\"display: table-cell; text-align: center; vertical-align: middle;\" ng-bind-html=\"item.title\" ></div></div><div class=\"item_image col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6\" style=\"background-image: url('{{item.post_thumb}}'); \"><img src=\"dist/assets/images/clear.png\"></div></div></a></li></ul></div></div></section></div>");
 $templateCache.put("components/cms/content_blocks/online_library/bedding_spec_book.html","<div class=\"container\"><section><div class=\"row\"><div class=\"col-xs-12 collection_filters\"><div class=\"col-xs12 text-center\"><h4>Filter</h4></div><div class=\"col-xs-12 text-center\"><ul class=\"col-xs-12\"><li><a ng-click=\"cat = ''\">All</a></li><li><a ng-click=\"cat = 'Bed Scarves'\">Bed Scarves</a></li><li><a ng-click=\"cat = 'Bed Skirts'\">Bed Skirts</a></li><li><a ng-click=\"cat = 'Bolsters & Pillows'\">Bolsters & Pillows</a></li><li><a ng-click=\"cat = 'Box Spring Covers'\">Box Spring Covers</a></li><li><a ng-click=\"cat = 'Coverlets'\">Coverlets</a></li><li><a ng-click=\"cat = 'Duvet Covers'\">Duvet Covers</a></li><li><a ng-click=\"cat = 'Encasements'\">Encasements</a></li><li><a ng-click=\"cat = 'Pillow Shams'\">Pillow Shams</a></li><li><a ng-click=\"cat = 'PreTenDuvet'\">PreTenDuvet</a></li><a ng-click=\"cat = 'Sheets'\">Sheets</a></li></ul></div></div></div><div class=\"row\"><div class=\"main\"><ul id=\"og-grid\" class=\"og-grid collections\" style=\"min-height:3168px\"><li sample xscroll-to=\"anchor{{$index}}\" id=\"anchor{{$index}}\" class=\"not-og-expanded\" ng-repeat=\"item in filtered = (contentBlock.bedding_spec_book | filter: cat) \" data-target=\"{{item.book}}\" data-largesrc=\"uploads/images/bedding_spec_book/{{item.spec_image}}.jpg\" data-title=\"{{item.title}}\" data-description=\"{{item.summary}}\" ng-click=\"showPreview()\"><a id=\"{{item.title}}\" name=\"{{item.title}}\" title=\"{{item.title}}\"><div style=\"min-height: 180px;\"><div class=\"item_info col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6\"><div class=\"item_container\" style=\"display: table-cell; text-align: center; vertical-align: middle;\" ng-bind-html=\"item.title\" ></div></div><div class=\"item_image col-xs-6 col-sm-6 col-md-6 col-lg-6 col-xl-6\" style=\"background-image: url('uploads/images/bedding_spec_book/thumbs/{{item.spec_image}}.jpg'); \"><img src=\"dist/assets/images/clear.png\"></div></div></a></li></ul></div></div></section></div>");
 $templateCache.put("components/cms/content_blocks/online_library/gradient_spec_book.html","<div class=\"container\"><section id=\"gradient_spec_book\"><div class=\"row\"><h1 class=\"text-center\">Gradient Spec</h1><div class=\"col-xs-12 collection_filters\"><div class=\"col-xs12 text-center\"><h4>Filter</h4></div><div class=\"col-xs-12 text-center\"><ul class=\"col-xs-12\"><li><a ng-click=\"cat = ''\">All</a></li><li><a ng-click=\"cat = 'across the roll'\">Across The Roll</a></li><li><a ng-click=\"cat = 'up the roll'\">Up The Roll</a></li></ul></div></div></div>{{}}<div class=\"row\"><div ng-repeat=\"item in filtered = (contentBlock.gradient_spec_book | filter: cat) \"><div class=\"row\" ng-if=\"$even\"><div ng-if=\"filtered[$index].title\" class=\"col-sm-6 gradientItemOutter\"><div class=\"col-md-5 gradientNameOutter\"><h2>{{filtered[$index ].title}}</h2><p>{{filtered[$index ].sub_headline}}</p></div><div class=\"col-md-7 gradientSpecOutter\"><div class=\"col-lg-7 getSpec\">Get Editable Spec by Size</div><div class=\"col-lg-5\"><a class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" target=\"_self\" ng-href=\"{{filtered[$index].link[0].url}}\">7ft</a><a class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" target=\"_self\" ng-href=\"{{filtered[$index].link[1].url}}\">8ft</a><a class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" target=\"_self\" ng-href=\"{{filtered[$index].link[2].url}}\">9ft</a></div></div></div><div ng-if=\"filtered[$index+1].title\" class=\"col-sm-6 gradientItemOutter\"><div class=\"col-md-5 gradientNameOutter\"><h2>{{filtered[$index+1].title}}</h2><p>{{filtered[$index+1].sub_headline}}</p></div><div class=\"col-md-7 gradientSpecOutter\"><div class=\"col-lg-7 getSpec\">Get Editable Spec by Size</div><div class=\"col-lg-5\"><a class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" target=\"_self\" ng-href=\"{{filtered[$index+1].link[0].url}}\">7ft</a><a class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" target=\"_self\" ng-href=\"{{filtered[$index+1].link[1].url}}\">8ft</a><a class=\"wu-btn wu-btn--inline wu-btn--transparent-black\" target=\"_self\" ng-href=\"{{filtered[$index+1].link[2].url}}\">9ft</a></div></div></div></div></div></div></section></div>");
 $templateCache.put("components/footer/footer.html", 
 "<footer class=\"footer navbar navbar-default navbar-fixed-bottom\" style=\"background-color: #222222; width: 100%; display: block; position: relative;\"><div class=\"wu-cms-content-block\" style=\"color: #fff; \"><div class=\"wu-cms-content-block__footer\" ><div class=\"container\"><div class=\"col-xs-12 col-sm-6\"><div class=\"col-xs-12\"><p><a href=\"/#/contact-us\"> Contact Us </a><!-- | Site Map --> | <a href=\"/#/lp/privacy-policy\">Privacy Policy</a> | <a href=\"/#/lp/terms-conditions\"> Terms and Conditions </a></p></div><div class=\"col-xs-12\" ><p>Copyright 2016 Valley Forge Fabrics, Inc. All Rights Reserved <br/>1650 W. McNab Road, Fort Lauderdale, FL 33309 <br/>954 971 1776 </p></div></div><div class=\"footer-social\" style=\"text-align: center;\"><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px;\"><a href=\"#/lp/blog\" class=\"icon-wordpress\" target=\"_blank\" tooltip=\"Follow our Blog\"></a></div><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px;\"><a href=\"https://www.linkedin.com/company/valley-forge-fabrics-inc-\" class=\"icon-linkedin\" target=\"_blank\" tooltip=\"Connect with us on LinkedIn\"></a></div><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px;\"><a tooltip=\"Follow us on Instagram\" href=\"https://www.instagram.com/valleyforgefabrics/\" class=\"icon-instagram\" target=\"_blank\"></a></div><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px;\"><a href=\"https://twitter.com/VFFabrics\" class=\"icon-twitter\" target=\"_blank\" tooltip=\"Follow us on Twitter\"></a></div><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px;\"><a href=\"https://www.youtube.com/user/ValleyForgeFabrics\" class=\"icon-youtube\" target=\"_blank\" tooltip=\"Subscribe and watch us on Youtube\"></a></div><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px;\"><a href=\"https://www.facebook.com/valleyforgefabrics\" class=\"icon-facebook\" target=\"_blank\" tooltip=\"Follow us on Facebook\"></a></div><div class=\"col-xs-3 col-sm-2 col-lg-1\" style=\"float:right; margin-right: -20px; \"><a href=\"https://www.weaveup.com\" class=\"icon-weaveup\" target=\"_blank\" tooltip=\"Start customizing on WeaveUp\"></a></div></div></div></div></div></div></footer>");
 $templateCache.put("components/cms/content_blocks/banner2/banner2.html","<div class=\"rsSlide clearfix\"><img class=\"rsImg\" ng-src=\"{{contentBlock.background_image}}\" alt=\"\" style=\"width: 100%; margin-left: 0;\" /><div class=\"rsABlock\"><div class=\"container\"><div class=\"jumbotron\"><h1 ngif=\"contentBlock.header_text\" ng-bind=\"{{contentBlock.header_text}}\" /></h1><img class=\"HeaderImg\" ngif=\"contentBlock.header_image\" ng-src=\"{{contentBlock.header_image}}\" /><p ng-bind-html=\"contentBlock.subhead_text\" ></p><p ng-if=\"contentBlock.link\" ><a class=\"wu-btn wu-btn--inline ng-binding wu-btn--transparent-black\" href=\"#\" role=\"button\">Learn more</a></p></div></div></div>");
 /*$templateCache.put("components/cms/content_blocks/banner_carousel2/banner_carousel2.html","<div class=\"sliderContainer fullWidth clearfix\"><div id=\"full-width-slider\" class=\"royalSlider heroSlider rsMinW rsHor rsWithBullets\"><div><img class=\"rsImg\" src=\"http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/5704_infuse-bg.jpg\" alt=\"\" /><div class=\"rsABlock\"><div class=\"container\"><div class=\"jumbotron\"><img class=\"HeaderImg\" src=\"http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/5704_infuse-text.png\" /><p>54\" Inherently flame resistant drapery fabrics</p><p><a class=\"wu-btn wu-btn--inline ng-binding wu-btn--transparent-black\" href=\"#\" role=\"button\">Learn more</a></p></div></div></div></div><div><video class=\"rsVideo\" name=\"media\" poster=\"http://4252805dae76ab552633-0bff195b1e52c63f8fae47f6b90459f3.r55.cf1.rackcdn.com/Open_House_Invitation_Video-Final_HD_reduced.JPG\" loop muted><source src=\"http://4252805dae76ab552633-0bff195b1e52c63f8fae47f6b90459f3.r55.cf1.rackcdn.com/Open_House_Invitation_Video-Final_HD_reduced.mp4\" type=\"video/mp4\" /></video><div class=\"rsABlock\"><div class=\"container\"><div class=\"jumbotron\"><h1>Hello, world!</h1><p>This is a simple hero unit, a simple jumbotron-style component for calling extra attention to featured content or information.</p><p><a class=\"wu-btn wu-btn--inline ng-binding wu-btn--transparent-black\" href=\"#\" role=\"button\">Learn more</a></p></div></div></div></div></div></div>");*/
 $templateCache.put("components/cms/pages/career/career.html", '<div id="wrapper"><div class="career-body" stellar-background="0.8"><main style="width: 3000px">[[\'jquery.stellar.min.js running\']]</main><div class="planet" stellar="0.8" stellar-hor="0.8"></div><div class="sun" stellar="1.2" stellar-vert="1.2"></div></div></div>');
/*$templateCache.put('partials/menu-toggle.tmpl.html',
 '<md-button class="md-button-toggle"' +
 ' ng-click="toggle()"' +
 ' aria-controls="docs-menu-{{item.label | nospace}}"' +
 ' flex layout="row"' +
 ' aria-expanded="{{isOpen()}}">' +
 ' {{item}}-{{item.label}}' +
 ' <span aria-hidden="true" class=" pull-right fa fa-chevron-down md-toggle-icon"' +
 ' ng-class="{\'toggled\' : isOpen()}"></span>' +
 '</md-button>' +
 '<ul ng-show="isOpen()" id="docs-menu-{{item.label | nospace}}" class="menu-toggle-list">' +
 ' <li ng-repeat="page in section.pages">' +
 ' <menu-link section="page"></menu-link>' +
 ' </li>' +
 '</ul>');
 $templateCache.put('partials/menu-link.tmpl.html',
 '<md-button ng-class="{\'{{item.icon}}\' : true}" ui-sref-active="active"' +
 ' ui-sref="{{item.url}}" ng-click="focusSection()">' +
 ' {{item | humanizeDoc}}' +
 ' <span class="md-visually-hidden "' +
 ' ng-if="isSelected()">' +
 ' current page' +
 ' </span>' +
 '</md-button>');*/
}]);