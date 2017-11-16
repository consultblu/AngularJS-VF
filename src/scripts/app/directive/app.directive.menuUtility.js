app.directive('menuUtility', function () {
  'use strict';
  return {
    templateUrl: 'components/menu_utility/menu_utility.html',
    restrict: 'E',
    replace: true,
    controller: ["$scope", "$rootScope", "dialogs", "$modal", "$http", "$state", "$mdDialog", "dataFactory", function ($scope, $rootScope, dialogs, $modal, $http, $state, $mdDialog, dataFactory) {
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
        $scope.dlg = dialogs.create('/views/login-form/', 'LoginModalCtrl', {}, {
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
          templateUrl: '/views/logout-form',
          controller: function ($scope) {
            $scope.Yes = function () {
              $http({
                url: '/account/logout',
                method: "GET"
              }).success(function (response) {
                $scope.$close(undefined);
                //                        console.log('Bye bye');
              });
            };
          },
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