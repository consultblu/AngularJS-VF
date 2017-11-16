<html>
<head>
<meta charset="utf-8">
<base href="/">
<title>Valley Forge Fabrics</title>
<meta http-equiv="Content-Type" content="text/html;" />
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="IE=edge,chrome=1" />
<meta name="fragment" content="!">
<meta name="description" content="">
<meta name="language" content="english">
<meta name="viewport" content="width=device-width, initial-scale=1.0" />

<link rel="stylesheet" href="dist/css/styles.min.css" />
<link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
<link rel="stylesheet" href="http://fonts.googleapis.com/css?family=Bevan%7CPontano+Sans&subset=latin,latin" />
<script src="http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js" class="lazyload" charset="utf-8"></script>
<link href="http://www.valleyforge.com/app/scripts/non-angular/css/themes/font/Bevan-PotanoSans.css?2.17" rel="stylesheet" class="lazyload" charset="utf-8">
</head>
<body ng-app="valleyforge_frontend_cms" id="scrollArea" ng-class="{ in : collapse }">
<section>
  <div id="outdated"></div>
</section>
<section id="splash">
  <m-app-loading></m-app-loading>
</section>
<section id="maincontent">
  <header-bar class="nav -fixed"></header-bar>
  <md-content flex="" >
    <div ui-view class="slideDown main"></div>
  </md-content>
</section>
<section id="home-footer">
  <div layout="column">
    <md-content  layout="column">
      <md-list class="fixedRows">
        <md-list-item>
          <md-toolbar id="footer-social" class="md-toolbar-tools">
            <p> <a href="https://weaveup.com" target="_blank">
              <md-icon aria-label="WeaveUp" md-svg-src="dist/assets/images/social-wup.svg" ></md-icon>
              </a> <a href="https://www.facebook.com/valleyforgefabrics" target="_blank">
              <md-icon aria-label="Facebook" md-svg-src="dist/assets/images/social-fb.svg"></md-icon>
              </a> <a href="https://www.instagram.com/valleyforgefabrics/" target="_blank">
              <md-icon aria-label="Instagram" md-svg-src="dist/assets/images/social-insta.svg"></md-icon>
              </a> <a href="https://twitter.com/VFFabrics" target="_blank">
              <md-icon aria-label="Twitter" md-svg-src="dist/assets/images/social-twitter.svg"></md-icon>
              </a> <a href="https://www.youtube.com/user/ValleyForgeFabrics" target="_blank">
              <md-icon aria-label="YouTube" md-svg-src="dist/assets/images/social-yt.svg"></md-icon>
              </a> 
			</p>
          </md-toolbar>
        </md-list-item>
        <md-list-item id="footer-nav">
          <md-nav-bar nav-bar-aria-label="navigation links">
            <md-nav-item name="Page1"><a ng-href="/#/contact-us" href="/#/contact-us">Contact<span hide-xs> Us</span></a></md-nav-item>
            <md-nav-item name="Page3"><a ng-href="/#/lp/terms-conditions" href="/#/lp/terms-conditions">Terms<span hide-xs> &amp; Conditions</span></a></md-nav-item>
            <md-nav-item name="Page2"><a ng-href="/#/lp/privacy-policy" href="/#/lp/privacy-policy">Privacy<span hide-xs> Policy</span></a></md-nav-item>
          </md-nav-bar>
        </md-list-item>
        <md-list-item>
          <md-content id="copyright">&copy; 2017 Valley Forge Fabrics, Inc.</md-content>
        </md-list-item>
      </md-list>
    </md-content>
  </div>
  <!--<footer-bar class="footer-bar"  style="width: 100%; /*display: block;*/ position: relative;"></footer-bar>--> 
</section>

<script type="text/javascript" src="dist/scripts/scripts.min.js"></script>

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){(i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');
  ga('create', 'UA-5147069-1', 'auto'); // Production
  ga('require', 'ecommerce');
  //ga('send', 'pageview');
</script>
	
<script>
  //event listener: DOM ready
  function addLoadEvent(func) {
    var oldonload = window.onload;
    if (typeof window.onload != 'function') {
        window.onload = func;
    } else {
      window.onload = function() {
        if (oldonload) {oldonload();}
        func();
      }
    }
  }
  //call plugin function after DOM ready
  addLoadEvent(function(){
    outdatedBrowser({
      bgColor: '#00ACEB',
      color: '#ffffff',
      lowerThan: 'transform',
      languagePath: '/app/scripts/outdatedbrowser/lang/en.html'
    })
  });
</script>
</body>
</html>
