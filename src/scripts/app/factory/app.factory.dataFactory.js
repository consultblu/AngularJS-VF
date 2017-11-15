    app.factory('dataFactory', ['$http', '$location', function($http, $location) {
        var dataFactory = {};
        var currentPath = $location.path();
        var results;
        var blogUrlBase = 'http://www.valleyforge.com/vffblog/?json=';
        var CseUrl = 'http://67.43.2.193/~searchpreprodvff/search.php?type=and&results=50&search=1&query=';
        dataFactory.getData = function(option) {
          // console.log('apiUrl@getData = ' + apiUrl + option);
          return $http.get(apiUrl + option);
        };
        dataFactory.getBlogData = function(option, page) {
          page = "&page="+page;
          // console.log('apiUrl@getBlogData = ' + blogUrlBase + option + page);
          return $http.get(blogUrlBase + option + page);
        };
        dataFactory.getCseData = function(option) {
          // console.log('Google_CSEAPI@getData = ' + CseUrl + option);
          return $http.get(CseUrl + option);
        };
        return dataFactory;
    }]);