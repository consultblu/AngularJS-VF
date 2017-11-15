    app.service('loginModal', function($modal, $rootScope) {
        function assignCurrentUser(user) {
            $rootScope.currentUser = user;
            console.log('user', user);
            return user;
        }
        return function() {
            console.log('app.service(loginModal)');
            var instance = $modal.open({
                templateUrl: 'views/login-form',
                controller: 'LoginModalCtrl',
                controllerAs: 'LoginModalCtrl'
            });
            console.log(instance.result);
            return instance.result.then(function(result) {
              console.log('hmmmm');
                assignCurrentUser(result);
            });
        };
    });