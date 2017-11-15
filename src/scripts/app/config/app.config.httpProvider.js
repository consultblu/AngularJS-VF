app.config(function ($httpProvider) {
	$httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	var param = function (obj) {
		var query = '',
			name, value, fullSubName, subName, subValue, innerObj, i;
		for (name in obj) {
			value = obj[name];
			if (value instanceof Array) {
				for (i = 0; i < value.length; ++i) {
					subValue = value[i];
					fullSubName = name + '[' + i + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value instanceof Object) {
				for (subName in value) {
					subValue = value[subName];
					fullSubName = name + '[' + subName + ']';
					innerObj = {};
					innerObj[fullSubName] = subValue;
					query += param(innerObj) + '&';
				}
			} else if (value !== undefined && value !== null) query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
		}
		return query.length ? query.substr(0, query.length - 1) : query;
	};
	$httpProvider.defaults.transformRequest = [function (data) {
		return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
		}];
	$httpProvider.interceptors.push(function ($timeout, $q, $injector) {
		var loginModal, $http, $state;
		$timeout(function () {
			loginModal = $injector.get('loginModal');
			$http = $injector.get('$http');
			$state = $injector.get('$state');
			//console.log('$injector.get($state)', $injector.get('$state'));
		});
		return {
			responseError: function (rejection) {
				if (rejection.status !== 401) {
					return rejection;
				}
				var deferred = $q.defer();
				loginModal().then(function () {
					console.log('app.config');
					deferred.resolve($http(rejection.config));
				}).catch(function () {
					$state.go('home');
					deferred.reject(rejection);
				});
				return deferred.promise;
			}
		};
	});
});