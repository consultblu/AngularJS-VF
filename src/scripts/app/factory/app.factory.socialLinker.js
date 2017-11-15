app.factory('socialLinker', ['$window', '$location', function($window, $location) {
        return function(urlFactory) {
            return function(scope, element, attrs) {
                var getCurrentUrl, handler, popupWinAttrs;
                popupWinAttrs = "status=no, width=" + (scope.socialWidth || 640) + ", height=" + (scope.socialHeight || 480) + ", resizable=yes, toolbar=no, menubar=no, scrollbars=no, location=no, directories=no";
                getCurrentUrl = function() {
                    return attrs.customUrl || $location.absUrl();
                };
                attrs.$observe('customUrl', function() {
                    var url;
                    url = urlFactory(scope, getCurrentUrl());
                    if (element[0].nodeName === 'A' && ((attrs.href == null) || attrs.href === '')) {
                        return element.attr('href', url);
                    }
                });
                element.attr('rel', 'nofollow');
                handler = function(e) {
                    var url, win;
                    e.preventDefault();
                    url = urlFactory(scope, getCurrentUrl());
                    return win = $window.open(url, 'popupwindow', popupWinAttrs).focus();
                };
                if (attrs.customHandler != null) {
                    element.on('click', handler = function(event) {
                        var url;
                        url = urlFactory(scope, getCurrentUrl());
                        element.attr('href', url);
                        return scope.handler({
                            $event: event,
                            $url: url
                        });
                    });
                } else {
                    element.on('click', handler);
                }
                return scope.$on('$destroy', function() {
                    return element.off('click', handler);
                });
            };
        };
    }]);