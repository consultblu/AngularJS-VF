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