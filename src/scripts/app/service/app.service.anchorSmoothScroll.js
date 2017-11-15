    app.service('anchorSmoothScroll', function() {
        this.scrollTo = function(eID, PreviouseID) {
            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY);
                return;
            }
            var speed = Math.round(distance / 1);
            if (speed >= 20) speed = 40;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            if (PreviouseID != null) {
                //console.log(angular.element('#' + PreviouseID)[0]);
                if (angular.isUndefined(angular.element('#' + PreviouseID)[0])) {
                    console.log("it's undefined");
                } else {
                    var heightEiD = angular.element('#' + eID)[0].clientHeight;
                    var heightPreviouseID = angular.element('#' + PreviouseID)[0].clientHeight;
                    leapY = leapY - (heightPreviouseID - heightEiD);
                }
            }
            var timer = 0;
            if (stopY > startY) {
                for (var i = startY; i < stopY; i += step) {
                    setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                    leapY += step;
                    if (leapY > stopY) leapY = stopY;
                    timer++;
                }
                return;
            }
            for (var i = startY; i > stopY; i -= step) {
                setTimeout("window.scrollTo(0, " + leapY + ")", timer * speed);
                leapY -= step;
                if (leapY < stopY) leapY = stopY;
                timer++;
            }

            function currentYPosition() {
                if (self.pageYOffset) return self.pageYOffset;
                if (document.documentElement && document.documentElement.scrollTop) return document.documentElement.scrollTop;
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }

            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                }
                return y;
            }
        };
    });