// Labels App

angular.module('starter', ['ionic', 'starter.services', 'starter.controllers', 'pascalprecht.translate', 'ngCordova'])

.run(function($ionicPlatform, $ionicPopup, fileDownloadService, DBService, $ionicLoading, $ionicHistory, $localstorage, sysConfigService, $translate) {
  $ionicPlatform.ready(function() {
      
        // Native transition settings
        window.plugins.nativepagetransitions.globalOptions.duration = 500;
        window.plugins.nativepagetransitions.globalOptions.iosdelay = 350;
        window.plugins.nativepagetransitions.globalOptions.androiddelay = 350;
        window.plugins.nativepagetransitions.globalOptions.winphonedelay = 350;
        window.plugins.nativepagetransitions.globalOptions.slowdownfactor = 4;
        // these are used for slide left/right only currently
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsTop = 0;
        window.plugins.nativepagetransitions.globalOptions.fixedPixelsBottom = 0;
      
      
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
      //Show loading message till the app loads.
    $ionicLoading.show({
      template: 'Loading data...'
    });
      
      //Connect to the DB
    DBService.connectDB().then(function(res){
        console.log("DB Connection complete.");
        
        //Store the default language in memory
        sysConfigService.getPreferredLan().then(function(res){

            var lan= res.rows.item(0).val;
            //console.log("Returned preferred lan: " + lan);
            $localstorage.set('lan', lan);
            $translate.use(lan);
        })
        
        $ionicLoading.hide();
         //Checks network connectivity at startup
        if(window.Connection) {
                //If device is cnnected to WiFi then
                if(navigator.connection.type == Connection.WIFI) {
                    console.log("WiFi connection detected.");
                    fileDownloadService.fileDownload();
                }
        }
    }), function(err){
        console.log("There was an error connecting to the DB." + err);
        $ionicLoading.hide();
    }
    //res.then(function(res){
        
    //})
   
  }),
    //Prevent the app from going to the welcome screen when back button is pressed.
   $ionicPlatform.registerBackButtonAction(function (event) {
      if ($ionicHistory.currentStateName() === 'searchBy' || $ionicHistory.currentStateName() === 'firstPage'){
        sysConfigService.savePreferredLan($localstorage.get('lan'));
        event.preventDefault();
        ionic.Platform.exitApp();
      } else {
        $ionicHistory.goBack();
      }
  }, 100);
})

.config(['$stateProvider', '$urlRouterProvider', '$ionicConfigProvider',
             function($stateProvider, $urlRouterProvider, $ionicConfigProvider){
          
        //Sets the tabs (if used) at the bottom of the page.         
         $ionicConfigProvider.tabs.position('bottom');
        //This section is where you define the templates for each page
        $stateProvider
            .state('firstPage',{
                url:'/',
                templateUrl:'templates/firstPage.html',
                controller:'firstPageCtrl',
                resolve:{
                    appInfo:['$http', function($http){
                        return $http.get('projectData/appInfo.json').then(function(response){return response.data})
                    }]
                }
            })
            .state('welcome',{
                url:'/welcome',
                templateUrl:'templates/welcome.html',
                controller:'welcomeCtrl',
                resolve:{
                    appInfo:['$http', function($http){
                        return $http.get('projectData/appInfo.json').then(function(response){return response.data})
                    }]
                }
            })
            .state('searchBy',{
                url:'/searchBy',
                templateUrl:'templates/searchBy.html',
                controller:'searchByCtrl',
                resolve:{
                    appInfo:['$http', function($http){
                        return $http.get('projectData/appInfo.json').then(function(response){return response.data})
                    }]
                }
            })
            .state('productList',{
                url:'/productList',
                templateUrl:'templates/productList.html',
                controller:'productListCtrl'
            })
        
            .state('productInfoMain',{
                url:'/productInfoMain/:productName',
                templateUrl:'templates/productInfoMain.html',
                controller:'productInfoMainCtrl'
            })
        
            .state('productInfoProducer',{
                url:'/productInfoProducer/:productName',
                templateUrl:'templates/productInfoProducer.html',
                controller:'productInfoProducerCtrl'
            })
        
            .state('productInfoCredits',{
                url:'/productInfoCredits/:productName',
                templateUrl:'templates/productInfo-credits.html',
                controller:'productInfoCreditsCtrl'
            })
        
            .state('productInfoEngControl',{
                url:'/productInfoEngControl/:productName',
                templateUrl:'templates/productInfo-engControl.html',
                controller:'productInfoEngControlCtrl'
            })
        
            .state('productInfoFirstAid',{
                url:'/productInfoFirstAid/:productName',
                templateUrl:'templates/productInfo-firstAid.html',
                controller:'productInfoFirstAidCtrl'
            })
        
            .state('productInfoHealth',{
                url:'/productInfoHealth/:productName',
                templateUrl:'templates/productInfo-health.html',
                controller:'productInfoHealthCtrl'
            })
        
            .state('productInfoProtectiveClothing',{
                url:'/productInfoProtectiveClothing/:productName',
                templateUrl:'templates/productInfoProtectiveClothing.html',
                controller:'productInfoProtectiveClothingCtrl'
            })
        
            .state('productInfoChemicalHazards',{
                url:'/productInfoChemicalHazards/:productName',
                templateUrl:'templates/productInfoChemicalHazards.html',
                controller:'productInfoChemicalHazardsCtrl'
            })
        
            .state('productInfoStorage',{
                url:'/productInfoStorage/:productName',
                templateUrl:'templates/productInfoStorage.html',
                controller:'productInfoStorageCtrl'
            })
        
            .state('productInfoSafelyInfo',{
                url:'/productInfoSafelyInfo/:productName',
                templateUrl:'templates/productInfoSafelyInfo.html',
                controller:'productInfoSafelyInfoCtrl'
            })
        
            .state('productInfoInfo',{
                url:'/productInfoInfo/:productName',
                templateUrl:'templates/productInfo-info.html',
                controller:'productInfoInfoCtrl'
            })
        
            .state('pests',{
                url:'/pests',
                templateUrl:'templates/pests.html',
                controller:'pestsCtrl'
            })
        
        //Sets the default URL if a user navigates to a non existing page.
        $urlRouterProvider.otherwise('/');
            
    }])
    //Intercepts the HTTP and modify the header.
.config(['$httpProvider', function($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
        }])
    
    //enable native scrolling by dissabling ionic scrolling to improve scrolling
.config(['$ionicConfigProvider', function($ionicConfigProvider) {
        $ionicConfigProvider.scrolling.jsScrolling(false);
    }])

    //Translate provider
.config(['$translateProvider',
            function($translateProvider){
                //Ads the EN and ES languages/ lables in to the translateProvider
                //Translations variable is from appLables.js file which is loaded in the index.html
                for(lang in translations){
		          $translateProvider.translations(lang, translations[lang]);
	            }
                //Setting the prefered and fall back language
                $translateProvider.preferredLanguage("en");
                $translateProvider.fallbackLanguage("en");
            }])

//This filter is used to sanitize the content read from the DB so that HTML syntax in the content can be rendered.
.filter('sanitize', ['$sce', function($sce) {
        return function(htmlCode){
            return $sce.trustAsHtml(htmlCode);
        }
}]);
