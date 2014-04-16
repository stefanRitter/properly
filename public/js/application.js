angular.module("app",["ngResource","ngRoute"]),angular.module("app").config(["$routeProvider","$locationProvider",function(a,b){"use strict";var c={user:{auth:["appAuth",function(a){return a.authorizeLoggedInUserForRoute()}]}};b.html5Mode(!0),b.hashPrefix("!"),a.when("/",{templateUrl:"/partials/index/index",controller:"appIndexCtrl"}).when("/map",{templateUrl:"/partials/map/map",controller:"appMapCtrl"}).when("/pro",{templateUrl:"/partials/pro/pro",controller:"appProCtrl"}).when("/saved",{templateUrl:"/partials/saved/saved",controller:"appSavedCtrl"}).when("/login",{templateUrl:"/partials/account/login",controller:"appLoginCtrl"}).when("/join",{templateUrl:"/partials/account/join",controller:"appJoinCtrl"}).when("/home/:id",{templateUrl:"/partials/home/show",controller:"appHomeShowCtrl"}),a.when("/pro/dashboard",{templateUrl:"/partials/pro/dashboard",controller:"appProDashboardCtrl"}).when("/pro/tenant/:id",{templateUrl:"/partials/profile/show",controller:"appProfileShowCtrl"}).when("/pro/home/:id/:step",{templateUrl:"/partials/homes/edit",controller:"appHomeEditCtrl"}).when("/pro/home/:id",{templateUrl:"/partials/homes/show",controller:"appHomeEditCtrl"}),a.when("/verify",{templateUrl:"/partials/profile/edit",controller:"appVerifyCtrl"}).when("/account/profile",{templateUrl:"/partials/profile/edit",controller:"appProfileEditCtrl",resolve:c.user}),a.when("/account/settings",{templateUrl:"/partials/account/settings",controller:"appSettingsCtrl",resolve:c.user})}]),angular.module("app").run(["$rootScope","$location",function(a,b){"use strict";a.$on("$routeChangeError",function(a,c,d,e){"not authorized"===e&&b.path("/")})}]),angular.module("app").factory("AppUser",["$resource","$rootScope",function(a,b){"use strict";var c=a("/api/users/:id",{_id:"@id"},{update:{method:"PUT",isArray:!1}});return c.prototype.isAdmin=function(){return this.roles&&this.roles.indexOf("admin")>-1},c.prototype.addBuzzr=function(a){-1===this.buzzrs.indexOf(a)&&(this.buzzrs.push(a),this.$update(),b.$broadcast("buzzrsChanged"))},c.prototype.removeBuzzr=function(a){var c=this.buzzrs.indexOf(a);c>-1&&(this.buzzrs.splice(c,1),this.$update(),b.$broadcast("buzzrsChanged"))},c.prototype.saveLink=function(a){this.recordActivity("saved",a.url,a.topic),this.readlater.push(a),this.$update(),b.$broadcast("readlaterChanged")},c.prototype.removeSavedLink=function(a){var c=-1;this.readlater.forEach(function(b,d){b.url===a&&(c=d)}),c>-1&&(this.readlater.splice(c,1),this.$update(),b.$broadcast("readlaterChanged"))},c.prototype.removeLink=function(a,c){this.recordActivity("removed",a,c),this.$update(),b.$broadcast("removedLink")},c.prototype.trackView=function(a,b){this.recordActivity("viewed",a,b),this.$update()},c.prototype.trackShare=function(a,b){this.recordActivity("shared",a,b),this.$update()},c.prototype.recordActivity=function(a,b,c){var d=-1;this.activities.forEach(function(a,b){a.topic===c&&(d=b)}),-1===d&&(this.activities.push({topic:c,removed:[],viewed:[],saved:[],shared:[]}),d=0),this.activities[d][a].push(b)},c}]),angular.module("app").factory("appAuth",["$http","$q","$rootScope","appIdentity","AppUser",function(a,b,c,d,e){"use strict";return{authenticateUser:function(c,f){var g=b.defer();return a.post("/login",{email:c,password:f}).then(function(a){if(a.data.success){var b=new e;angular.extend(b,a.data.user),d.currentUser=b,g.resolve(!0)}else g.resolve(!1)}),g.promise},createUser:function(a){var c=new e(a),f=b.defer();return c.$save().then(function(){d.currentUser=c,f.resolve(!0)},function(a){f.reject(a.data.reason)}),f.promise},updateCurrentUser:function(a){var c=b.defer();return a.$update().then(function(){d.currentUser=a,c.resolve(!0)},function(a){c.reject(a.data.reason)}),c.promise},logoutUser:function(){var c=b.defer();return a.post("/logout",{logout:!0}).then(function(){d.currentUser=void 0,c.resolve(!0)}),c.promise},authorizeCurrentUserForRoute:function(a){return d.isAuthorized(a)?!0:b.reject("not authorized")},authorizeLoggedInUserForRoute:function(){return d.isAuthenticated()?!0:b.reject("not authorized")}}}]),angular.module("app").factory("appIdentity",["$window","$location","AppUser",function(a,b,c){"use strict";var d={currentUser:void 0,isAuthenticated:function(){return!!this.currentUser},isAuthorized:function(a){return!!this.currentUser&&this.hasRole(a)},hasRole:function(a){return this.currentUser.isAdmin()||this.currentUser.roles.indexOf(a)>-1}};if(a.bootstrappedUser){var e=new c;angular.extend(e,a.bootstrappedUser),d.currentUser=e}return d}]),angular.module("app").controller("appJoinCtrl",["$scope","$location","appAuth","appNotifier",function(a,b,c,d){"use strict";a.signup=function(){var e={email:a.email,password:a.password};c.createUser(e).then(function(){b.path("/verify")},function(b){d.error(b,a)})}}]),angular.module("app").controller("appLoginCtrl",["$scope","$location","appAuth","appNotifier","appIdentity",function(a,b,c,d,e){"use strict";a.signin=function(){c.authenticateUser(a.email,a.password).then(function(c){c?b.path(e.hasRole("pro")?"/pro/dashboard":"/map"):d.error("email/password combination incorrect",a)})}}]),angular.module("app").controller("appSettingsCtrl",["$scope","$location","appAuth","appIdentity","appNotifier",function(a,b,c,d,e){"use strict";a.currentUser=angular.copy(d.currentUser),a.email={valid:d.currentUser.email.match(/^[\S]+@[\S]+\.[\S]+$/)},a.update=function(){c.updateCurrentUser(a.currentUser).then(function(){return a.email.valid?void e.notify("Your account has been updated",a):b.path("/")},function(b){e.error(b,a)})}}]),angular.module("app").controller("appVerifyCtrl",["$scope",function(a){"use strict";a.verify=function(){window.alert()}}]),angular.module("app").controller("appAdminUsersCtrl",["$scope","AppUser",function(a,b){"use strict";a.users=b.query()}]),angular.module("app").factory("appIsMobile",function(){"use strict";var a={Android:function(){return navigator.userAgent.match(/Android/i)?!0:!1},BlackBerry:function(){return navigator.userAgent.match(/BlackBerry/i)?!0:!1},iOS:function(){return navigator.userAgent.match(/iPhone|iPad|iPod/i)?!0:!1},Windows:function(){return navigator.userAgent.match(/IEMobile/i)?!0:!1},any:function(){return a.Android()||a.BlackBerry()||a.iOS()||a.Windows()}};return a}),angular.module("app").factory("appNotifier",function(){"use strict";return{notify:function(a,b){b.notifier={},b.notifier.notice=a,setTimeout(function(){b.notifier.notice="",b.$digest()},4e3)},error:function(a,b){b.notifier={},b.notifier.error=a,setTimeout(function(){b.notifier.error="",b.$digest()},4e3)}}}),angular.module("app").factory("appTopics",["$window",function(a){"use strict";var b=[];return a.bootstrappedTopics&&(b=a.bootstrappedTopics),b}]),angular.module("app").factory("appFeedback",["$rootScope",function(a){"use strict";return{toggle:function(){a.$broadcast("toggleFeedback")}}}]),angular.module("app").controller("appFeedbackCtrl",["$scope","$location","$window","$http","appIdentity","appNotifier",function(a,b,c,d,e,f){"use strict";a.success=!1,a.show=!1,a.feedback={},a.feedback.userAgent=c.navigator.userAgent,e.isAuthenticated()&&(a.feedback.name=e.currentUser.name,a.feedback.email=e.currentUser.email),a.send=function(){a.feedback.currentPath=b.path(),d.post("/api/feedback",a.feedback).then(function(b){b.data.success?a.success=!0:f.error(b.data.err||"unknown error",a)},function(b){f.error("error "+b.status+" occurred - please email help@buzzr.io",a)})},a.toggle=function(){a.show=!a.show},a.$on("toggleFeedback",function(){a.toggle()})}]),angular.module("app").controller("appHeaderCtrl",["$scope","$location","appIdentity","appAuth",function(a,b,c,d){"use strict";a.onPath=function(){for(var a=0,c=arguments.length;c>a;a++)if(arguments[a]===b.path())return!0},a.isLoggedIn=function(a){return a?c.isAuthorized(a):c.isAuthenticated()},a.signout=function(){d.logoutUser().then(function(){b.path("/")})},a.toggleDropdown=function(){a.openDropdown=!a.openDropdown}}]),angular.module("app").controller("appHomeEditCtrl",["$scope","$routeParams",function(a,b){"use strict";a.id=b.id,a.step=b.step,a.getStep=function(){return"/partials/homes/edit/"+a.step},a.activeStep=function(b){return b===a.step}}]),angular.module("app").controller("appHomeShowCtrl",["$scope","$routeParams",function(a,b){"use strict";a.id=b.id}]),angular.module("app").controller("appIndexCtrl",["$scope","$location","$anchorScroll",function(a,b,c){"use strict";c(),a.gotoAbout=function(){b.hash("about")}}]),angular.module("app").value("appGoogle",window.google),angular.module("app").factory("appMap",["appGoogle","appIsMobile",function(a,b){"use strict";function c(){var a={zoom:13,minZoom:12,maxZoom:20,zoomControl:!0,zoomControlOptions:{style:e.maps.ZoomControlStyle.DEFAULT},center:g,mapTypeId:e.maps.MapTypeId.ROADMAP,scrollwheel:!b.any(),panControl:!1,mapTypeControl:!1,scaleControl:!1,streetViewControl:!1,overviewMapControl:!1,rotateControl:!1};f=new e.maps.Map(document.getElementById("map-canvas"),a)}function d(){f||c();var a=new e.maps.Marker({position:g,icon:h,map:f,title:"new home?"}),b=new e.maps.InfoWindow({content:"<h3>Snowdown Summit Cafe</h3><p>Railway Drive-through available.</p>"});e.maps.event.addListener(a,"click",function(){b.open(f,a)})}var e=a,f={},g=new e.maps.LatLng(51.5096283,-.1114692),h=new e.maps.MarkerImage("http://www.creare.co.uk/wp-content/uploads/2013/08/marker.png",null,null,null,new e.maps.Size(40,52));return{init:c,setMarker:d}}]),angular.module("app").controller("appMapCtrl",["$scope","appMap",function(a,b){"use strict";a.map={},b.init(),b.setMarker()}]),angular.module("app").factory("appSearch",function(){"use strict"}),angular.module("app").controller("appProCtrl",["$scope","$location","appAuth","appNotifier",function(a,b,c,d){"use strict";a.signup=function(){var e={email:a.email,password:a.password,roles:["pro"]};c.createUser(e).then(function(){b.path("/pro/dashboard")},function(b){d.error(b,a)})}}]),angular.module("app").controller("appProDashboardCtrl",["$scope","$location","appAuth",function(a,b,c){"use strict";a.signout=function(){c.logoutUser().then(function(){b.path("/")})}}]),angular.module("app").controller("appProfileEditCtrl",["$scope",function(a){"use strict";a.id=0}]),angular.module("app").controller("appProfileShowCtrl",["$scope",function(a){"use strict";a.id=0}]),angular.module("app").controller("appSavedCtrl",["$scope",function(a){"use strict";a.readlater=[]}]);