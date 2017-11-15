    app.service('cart', function($rootScope) {
        return $.post('/views/cart_count').done(function(response) {
            response = angular.element.trim(response);
            //console.log('cart contents', response);
            //console.log('cart response.length', response.length);
            if (response.length > 0) {
                //console.log('the cart has ' + response + ' items');
                angular.element(".cart_count .count").load('views/cart_count');
                angular.element(".cart_count").show();
            } else {
                //console.log('the cart is empty');
                angular.element(".cart_count .count").load('views/cart_count');
                angular.element(".cart_count").hide();
            }
        });
    });