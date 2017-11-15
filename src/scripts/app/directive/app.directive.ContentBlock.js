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