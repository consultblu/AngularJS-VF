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