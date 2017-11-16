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

