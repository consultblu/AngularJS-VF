 app.config(function($sceDelegateProvider) {
  $sceDelegateProvider.resourceUrlWhitelist(['self', 'https://4252805dae76ab552633-0bff195b1e52c63f8fae47f6b90459f3.ssl.cf1.rackcdn.com/**', 'http://c67bfc7c934596c5d2de-384a0fe271c727cec0e8a9b32788243a.r54.cf1.rackcdn.com/**','http://www.youtube.com/**','https://www.youtube.com/**', 'http://74c749ed3f1bace98461-2c2004dcc2fff845ee2077a362d57d4f.r23.cf1.rackcdn.com/**']);
  $sceDelegateProvider.resourceUrlBlacklist(['http://myapp.example.com/clickThru**']);
 });