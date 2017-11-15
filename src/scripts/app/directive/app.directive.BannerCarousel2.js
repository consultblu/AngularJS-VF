app.directive('wuCmsContentBlockBannerCarousel2', function ($compile, $sce) {
  'use strict';
  return {
    compile: function (tElem, tAttrs) {
      return function (scope, iElem, iAttrs) {
        // When trying to add the same markup here, Angular will no longer
        // process the "another-directive" directive since the compilation is
        // already done and we're merely linking with the scope here
        //iElem.append('<div another-directive></div>');
        var escapeHtml = function (value) {
          var trustAsHtml = function (value) {
            return $sce.trustAsHtml(value);
          };
          var htmlEntities = value.replace(/[\u00A0-\u9999<>\&\'\"]/gim, function (i) {
            return '&#' + i.charCodeAt(0) + ';';
          });
          return htmlEntities;
        };
        var carousel = {};
        //          console.log(scope.contentBlock);
        angular.forEach(scope.contentBlock, function (value, key) {
          if (value.background_video) {
            carousel.$bannerBackground = '<video class=\"rsVideo\" name=\"media\" poster=\"' + value.background_image + '\" loop muted>        <source src=\"' + value.background_video + '\" type=\"video/mp4\" /></video>';
          } else {
            carousel.$bannerBackground = '<img class=\"rsImg\" src=\"' + value.background_image + '\" alt=\"\" />\n';
          }
          //carousel.$bannersubHeader = '<p>' + value.subhead_text + '</p>\n';
          //carousel.$bannerHeaderImage = '<img class=\"HeaderImg\" src=\"' + value.header_image + '\" />\n';
          carousel.$bannerHeader = '<div class=\"rsABlock\">\n<div class=\"container\">';
          if (value.alignment && value.alignment != " ") {
            carousel.$bannerHeader = carousel.$bannerHeader + '<div class=\"jumbotron jumbotron-' + value.alignment + '\">';
          } else {
            carousel.$bannerHeader = carousel.$bannerHeader + '<div class=\"jumbotron\">';
          }
          if (value.header_image) {
            carousel.$bannerHeader = carousel.$bannerHeader + '<img class=\"HeaderImg\" src=\"' + value.header_image + '\" />';
          }
          if (value.subhead_text) {
            carousel.$bannerHeader = carousel.$bannerHeader + '<p class=\"HeaderText\" ng-bind-html=\"value.subhead_text\">' + escapeHtml(value.subhead_text) + '</p>';
          }
          if (value.button_text || value.url) {
            carousel.$bannerHeader = carousel.$bannerHeader + '<p><a class="wu-btn wu-btn--inline ng-binding wu-btn--transparent-black" href="' + value.url + '">' + value.button_text + '</a></p>';
          }
          carousel.$bannerHeader = carousel.$bannerHeader + '</div>\n</div>\n</div>';
          carousel.$banner = '<div id="' + key + '">' + carousel.$bannerBackground + carousel.$bannerHeader + '</div>';
          carousel.$banners = carousel.$banners + carousel.$banner;
        });
        carousel.$container = $("<div id=\"full-width-slider\" class=\"royalSlider heroSlider rsMinW rsHor rsWithBullets\"></div>").append(carousel.$banners);
        carousel.$rSlider = $("<div class=\"sliderContainer fullWidth clearfix\"></div>").append(carousel.$container);
        iElem.append(carousel.$rSlider);
        iElem.append("<p ng-bind-html=\"contentBlock.subhead_text\"></p>");
        var callRS = function () {
          iElem.find('#full-width-slider').royalSlider({
            arrowsNav: true,
            loop: true,
            keyboardNavEnabled: true,
            controlsInside: false,
            imageScaleMode: 'fill',
            arrowsNavAutoHide: true,
            autoScaleSlider: true,
            autoScaleSliderWidth: 992,
            autoScaleSliderHeight: 300,
            controlNavigation: 'bullets',
            thumbsFitInViewport: false,
            navigateByClick: false,
            startSlideId: 0,
            autoPlay: {
              enabled: true,
              stopAtAction: true,
              pauseOnHover: true,
              delay: 3000
            },
            transitionType: 'move',
            globalCaption: false,
            deeplinking: {
              enabled: true,
              change: false
            },
            // size of all images http://help.dimsemenov.com/kb/royalslider-jquery-plugin-faq/adding-width-and-height-properties-to-images 
            imgWidth: 1400,
            imgHeight: 680
          });
          var slider = angular.element(".royalSlider").data('royalSlider'),
            prevSlideVideo,
            playSlideVideo = function () {
              if (prevSlideVideo) {
                prevSlideVideo.pause();
              }
              var video = slider.currSlide.content.find('video');
              if (video.length) {
                prevSlideVideo = video[0];
                prevSlideVideo.play();
              } else {
                prevSlideVideo = null;
              }

            };
          slider.ev.on('rsAfterSlideChange', playSlideVideo);
          playSlideVideo();
          slider.playVideo();
        };
        callRS();
      };
    },
    restrict: 'AE',
    scope: {
      contentBlock: '='
    },
    replace: true
  };
});