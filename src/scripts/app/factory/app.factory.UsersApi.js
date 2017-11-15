app.factory("UsersApi", function($q, $http) {
        function _login(username, password) {
            var d = $q.defer();
            $http({
                url: 'views/login',
                method: "POST",
                data: {
                    username: username,
                    password: password
                },
                withCredentials: true,
                headers: {
                    'Content-Type': 'application/json; charset=utf-8'
                }
            }).success(function(response) {
//                console.log('auth response', response);
            });
            return d.promise
        }
        return {
            login: _login
        };
    });