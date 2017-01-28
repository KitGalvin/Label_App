angular.module('starter.controllers', [])    
//This controller loads the product list from the json files
    .controller('productListCtrl',['$scope', '$http', '$translate', 'productSevice', '$localstorage', '$state',
      function($scope, $http, $translate, productSevice, $localstorage, $state){
          $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
          $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
          //console.log(productSevice.getProductList());
          $scope.products=productSevice.getProductList();
          
          //Sets the current product so it can be referred in other tabs
          $scope.setCrProduct=function(cProd){
                //console.info(cProd); 
                productSevice.setCurrentProduct(cProd).then(function(){
                    //console.log('Resolved?');
                    $state.go('productInfoMain');
                });
                //productSevice.setCurrentProduct(cProd);
                //$state.go('productInfoMain');
          }


      }]
    )//End of productListCtrl
    
    //Controller for the first page screen
    .controller('firstPageCtrl',['$scope', '$state', '$http', '$translate', 'appInfo', 'productSevice', '$localstorage', 'sysConfigService',
            function($scope, $state, $http, $translate, appInfo, productSevice, $localstorage, sysConfigService){
                //Gets the application details and stores it in the appInfo array.
                $scope.appInfo=appInfo;
                
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                //Stores the product list in the device memory
                //productSevice.setProductList();
                $scope.continueAs= function(lan){
                    //console.log(lan);
                    $localstorage.set('lan', lan);
                    sysConfigService.savePreferredLan(lan);
                    $translate.use(lan);
                    $state.go('welcome');
                }
            }])

    //Controller for the welcome screen
    .controller('welcomeCtrl',['$scope','$http', '$translate', 'appInfo', 'productSevice', '$localstorage',
            function($scope, $http, $translate, appInfo, productSevice, $localstorage){
                //Gets the application details and stores it in the appInfo array.
                $scope.appInfo=appInfo;
                
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
            }])

     //Controller for the searchBy screen
    .controller('searchByCtrl',['$scope', '$http', '$translate', 'appInfo', '$localstorage',
            function($scope, $http, $translate, appInfo, $localstorage){
                //Gets the app information from the json file.
                //console.log('Inside Search by.');
                $scope.appInfo=appInfo;
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
            }])

//Controller for the product info main screen
    .controller('productInfoMainCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', '$localstorage', 'productSevice',
            function($scope, $http, $translate, $stateParams, $ionicHistory, $localstorage, productSevice){
                
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                
                //console.log('Inside productInfoMain');
                
                
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
            }])

//Controller for pests screen
    .controller('pestsCtrl',['$scope', '$http', '$translate', 'productSevice', '$localstorage', '$state',
            function($scope, $http, $translate, productSevice, $localstorage, $state){
                //console.log('Inside pest controler');
                //$scope.pestInfo=pestInfo;
                $scope.pestInfo=productSevice.getPestList();
                //console.log("--------"+JSON.stringify(productSevice.getPestList()));
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                 $scope.toggleGroup = function(group) {
                    if ($scope.isGroupShown(group)) {
                        $scope.shownGroup = null;
                    } else {
                      $scope.shownGroup = group;
                    }
                }
                 
                $scope.isGroupShown = function(group) {
                    return $scope.shownGroup === group;
                }
                //Sets the current product so it can be referred in other tabs
                $scope.setCrProduct=function(cProd){
                    productSevice.setCurrentProduct(cProd).then(function(){
                        //console.log('Resolved?');
                        $state.go('productInfoMain');
                    });
                }
            }])

//Controller for protective clothing page
    .controller('productInfoProducerCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
            }])

//Controller for storage page
    .controller('productInfoStorageCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for producer Information page
    .controller('productInfoProtectiveClothingCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for Credits page
    .controller('productInfoCreditsCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                //Function to change language
                //This function is called when the change language button is clicked.
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for Engineering control page
    .controller('productInfoEngControlCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for safety page
    .controller('productInfoSafelyInfoCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for First Aid page
    .controller('productInfoFirstAidCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for Health page
    .controller('productInfoHealthCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })

                
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    //console.log('---inside txtWithLineBreaks--- txt value:' + txt);
                    return stringModifyService.addLineBreaks(txt);
                }
            }])

//Controller for Product info page
    .controller('productInfoInfoCtrl',['$scope', '$translate', '$stateParams', '$ionicHistory', 'productSevice', '$localstorage',
            function($scope, $translate, $stateParams, $ionicHistory, productSevice, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                //console.info(JSON.stringify($scope.productInfo));
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
            }])

//Controller for Chemical Hazards page
    .controller('productInfoChemicalHazardsCtrl',['$scope', '$http', '$translate', '$stateParams', '$ionicHistory', 'productSevice', 'stringModifyService', '$localstorage',
            function($scope, $http, $translate, $stateParams, $ionicHistory, productSevice, stringModifyService, $localstorage){
                $scope.$on('$ionicView.enter', function() {
                    //console.log('Page Opened');
                    $scope.productInfo=productSevice.getCurrentProduct();
                 })
                
                //console.log($scope.productInfo);
                $scope.goBack=function(){
                    $ionicHistory.goBack();
                }
                
                //Function to change language
                $scope.getLan=function(){
                    var lan= $localstorage.get('lan');
                    //console.log('Getting Lan:' + lan);
                    return lan;
                }
                
                $scope.setLan= function(lan){
                    //console.log('Setting Lan:' + lan);
                    $localstorage.set('lan', lan);
                    $translate.use(lan);
                }
                
                $scope.textWithLineBreaks=function(txt){
                    //console.log('Text received: '+ txt);
                    return stringModifyService.addLineBreaks(txt);
                }
            }]);