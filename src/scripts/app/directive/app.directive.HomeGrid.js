app.directive('wuCmsContentBlockHomeGrid', function () {
  'use strict';
  return {
    templateUrl: 'components/cms/content_blocks/home_grid.html',
    restrict: 'E',
    replace: true,
    controller: ["$scope", function ($scope) {
      var gridArray = $scope.$parent.contentBlock.home_grid;

      function formatDate(date) {
        var month = ["01", "02", "03", "04", "05", "06", "07", "08", "09", "10", "11", "12"];
        var day = date.getDate();
        var monthIndex = date.getMonth();
        var year = date.getFullYear();
        return month[monthIndex] + day + year;
      }
      gridArray.forEach(function (tile) {
        //console.log(grid.title);
        var gridImages = tile.image_matrix;
        if (tile.randomize === "Yes") {
          var rand = gridImages[Math.floor(Math.random() * gridImages.length)];
          tile.image = rand.image_url;
        } else {
          var tileImageSelected = false;
          gridImages.forEach(function (image) {

            if (tileImageSelected === false) {
              var today = formatDate(new Date());
              if (image.start_date <= today && image.end_date >= today) {
                //console.log("Starts:",image.start_date);
                //console.log("Today:",today);
                //console.log("Ends:",image.end_date);                   
                tile.image = image.image_url;
                tileImageSelected = true;
              }
            }
          });
          if (tileImageSelected === false) {
            //console.log("No Date match for Grid => ", tile.title);                                        
            tile.image = gridImages[0].image_url;
            tileImageSelected = true;
          }
        }
      });
    }]
  };
});