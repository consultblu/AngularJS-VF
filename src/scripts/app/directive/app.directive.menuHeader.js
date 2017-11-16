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
				//console.log('headerMenu', data);
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