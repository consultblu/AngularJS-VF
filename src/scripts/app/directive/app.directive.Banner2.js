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
