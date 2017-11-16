app.run(function ($rootScope, $state, loginModal, $http, cart) {
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
});

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
      controller: "DocsCtrl",
      data: {
        requireLogin: false
      }
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
      templateUrl: (_isNotMobile) ? "views/careerPage/index.html" : "views/careerPage/index-mobile.html",
      controller: "ProfessionalityCtrl",
      data: {
        requireLogin: false
      }
    })
    .state("careers", {
      //url: "/professionality/",
      templateUrl: "views/careerPage/index-no_parallax.html",
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