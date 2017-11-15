app.directive('mAppLoading', function ($animate) {
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
});