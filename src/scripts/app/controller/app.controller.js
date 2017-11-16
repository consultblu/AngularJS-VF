	app.controller('LoginModalCtrl', function ($scope, $state, $stateParams, $http, UsersApi, $rootScope, dialogs, $modalInstance) {
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
	});

 app.controller("ExamplesCtrl", ["$scope", function($scope) {
		$scope.examples = [{
				"description": "Standard block",
				"content_block": {
						"content_block_type": "standard_block",
						"color": "black",
						"standard_block": {
								"headline": "You Dream It",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"link": {
										"label": "See More",
										"url": "/"
								}
						}
				}
		}, {
				"description": "Standard block -- centered with only a button",
				"content_block": {
						"content_block_type": "standard_block",
						"alignment": "center",
						"standard_block": {
								"button": {
										"label": "VIEW GUIDELINES",
										"url": "/",
										"style": "transparent-dark-gray"
								}
						 }
				}
		}, {
				"description": "Standard block -- right-aligned",
				"content_block": {
						"content_block_type": "standard_block",
						"alignment": "right",
						"standard_block": {
								"headline": "You Dream It",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"button": {
										"label": "DONT CLICK ME",
										"url": "/",
										"style": "blue"
								}
						}
				}
		}, {
				"description": "Two-column block with gray color",
				"content_block": {
						"content_block_type": "two_column",
						"color": "gray",
						"two_column": [{
								"headline": "Messenger bags are cool",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache."
						}, {
								"headline": "Sweet mix tape",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache."
						}]
				}
		}, {
				"description": "Two-column block with links and buttons",
				"content_block": {
						"content_block_type": "two_column",
						"two_column": [{
								"headline": "Messenger bags are cool",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"link": {
										"label": "See more",
										"url": "/"
								}
						}, {
								"headline": "Sweet mix tape",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"link": {
										"label": "MIX IT UP",
										"url": "/"
								}
						}, {
								"headline": "Best tofu",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"button": {
										"label": "I AM RED",
										"url": "/",
										"style": "red"
								}
						}, {
								"headline": "Best tofu",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"button": {
										"label": "Another button",
										"url": "/",
										"style": "transparent-blue"
								}
						}]
				}
		}, {
				"description": "Three column layout",
				"content_block": {
						"content_block_type": "three_column",
						"three_column": [{
								"headline": "Messenger bags are cool",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"link": {
										"label": "See more",
										"url": "/"
								}
						}, {
								"headline": "Sweet mix tape",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"link": {
										"label": "MIX IT UP",
										"url": "/"
								}
						}, {
								"headline": "Best tofu",
								"body": "90's mixtape retro kale chips. Messenger bag VHS pickled semiotics keytar, tofu Neutra hashtag American Apparel tousled kitsch. Beard heirloom kogi, gluten-free squid fixie sustainable health goth. Sartorial Portland Bushwick hashtag, distillery blog Shoreditch post-ironic PBR chia. Tote bag yr drinking vinegar cliche Odd Future pork belly. Williamsburg Brooklyn 8-bit migas. Chambray trust fund, American Apparel skateboard small batch cliche biodiesel fingerstache.",
								"button": {
										"label": "I AM RED",
										"url": "/",
										"style": "red"
								}
						}]
				}
		}, {
				"description": "Three column layout with super headline",
				"content_block": {
						"alignment": "center",
						"content_block_type": "three_column",
						"three_column": [{
								"super_headline": "1",
								"headline": "Messenger bags are cool"
						}, {
								"super_headline": "2",
								"headline": "Sweet mix tape"
						}, {
								"super_headline": "3",
								"headline": "Best tofu"
						}]
				}
		}, {
				"description": "A horizontal rule",
				"content_block": {
						"content_block_type": "horizontal_rule"
				}
		}, {
				"description": "A banner w/ link",
				"content_block": {
						"content_block_type": "banner",
						"banner": {
								"url": "/docs",
								"images": {
										"xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
										"sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
										"md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
										"lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
										"xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
								}
						}
				}
		}, {
				"description": "A banner without a link",
				"content_block": {
						"content_block_type": "banner",
						"banner": {
								"images": {
										"xs": "assets/images/mock_data/banners/inspire/banner_320x220_mobile.jpg",
										"sm": "assets/images/mock_data/banners/inspire/banner_480x320_mobile.jpg",
										"md": "assets/images/mock_data/banners/inspire/banner_768x600.jpg",
										"lg": "assets/images/mock_data/banners/inspire/banner_992x496.jpg",
										"xl": "assets/images/mock_data/banners/inspire/banner_1400x580.jpg"
								}
						}
				}
		}, {
				"description": "A carousel",
				"content_block": {
						"content_block_type": "banner_carousel",
						"banner_carousel": [{
								"url": "/docs",
								"images": {
										"xs": "assets/images/banners/vff-home_banner-elephant_320x220_mobile.jpg",
										"sm": "assets/images/banners/vff-home_banner-elephant_480x320_mobile.jpg",
										"md": "assets/images/banners/vff-home_banner-elephant_768x600.jpg",
										"lg": "assets/images/banners/vff-home_banner-elephant_992x496.jpg",
										"xl": "assets/images/banners/vff-home_banner-elephant_1400x580.jpg"
								}
						}, {
								"url": "/docs",
								"images": {
										"xs": "assets/images/banners/vff-home_banner-fresh_320x220_mobile.jpg",
										"sm": "assets/images/banners/vff-home_banner-fresh_480x320_mobile.jpg",
										"md": "assets/images/banners/vff-home_banner-fresh_768x600.jpg",
										"lg": "assets/images/banners/vff-home_banner-fresh_992x496.jpg",
										"xl": "assets/images/banners/vff-home_banner-fresh_1400x580.jpg"
								}
						}, {
								"url": "/docs",
								"images": {
										"xs": "assets/images/banners/vff-home_banner-fresh_320x220_mobile.jpg",
										"sm": "assets/images/banners/vff-home_banner-fresh_480x320_mobile.jpg",
										"md": "assets/images/banners/vff-home_banner-fresh_768x600.jpg",
										"lg": "assets/images/banners/vff-home_banner-fresh_992x496.jpg",
										"xl": "assets/images/banners/vff-home_banner-fresh_1400x580.jpg"
								}
						}]
				}
		}];
		$scope.getCodeBlock = function(obj) {
				return angular.toJson(obj, true);
		};
		//return $scope.getCodeBlock
}]);
app.controller("DocsCtrl", ["$scope", function($scope) {}]);

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
	app.controller('ProfessionalityCtrl', function ($scope, $location, $document, $window) {
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
	}).value('duScrollOffset', 30);
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
	app.controller('CollectionsCtrl', function ($scope, $filter, $location, $routeParams, dataFactory, $window) {
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
	});
	app.controller("modalFormCtrl", function ($rootScope, $scope, $http, $modal, transformRequestAsFormPost) {
		//        console.log('LandingPagesCtrl $scope', $scope);
		//        console.log('LandingPagesCtrl $rootScope', $rootScope);
	});