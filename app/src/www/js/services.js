var db=null;
var lastUpdated=null;
angular.module('starter.services', [])

//Connects to the DB
.factory('DBService',['$cordovaSQLite', '$q', function($cordovaSQLite, $q){
    return{
        connectDB: function(){
            var deferred = $q.defer();
            console.log('Connecting to DB...');
            //Try to copy the DB in to the phone memory and open it.
            window.plugins.sqlDB.copy("productsDB.db", 0, function() {
                db = $cordovaSQLite.openDB("productsDB.db");
                getModifiedDate();
            }, function(error) {
                //Copy function fails if the DB is already. Therefore open DB
                console.error("There was an error copying the database: " + error);
                db = $cordovaSQLite.openDB("productsDB.db");
                getModifiedDate();
            });
            
            //Gets the last updated datetime.
            var getModifiedDate=function(){
                var query="SELECT * FROM updateLog ORDER BY updatedOn DESC LIMIT 1";
                
                $cordovaSQLite.execute(db, query, []).then(function(res){
                    //console.log(res.rows.item(0).updatedOn);
                    deferred.resolve(res);
                    lastUpdated=res.rows.item(0).updatedOn;
                    console.log("Getting last updated date :" + lastUpdated);
                    //return deferred.promise;
                })
            }
            return deferred.promise;
        }
    }
}])

//Reads content from the DB
.factory('productSevice',['$http', '$localstorage', '$q', '$cordovaSQLite', '$ionicLoading', '$ionicPopup', function($http, $localstorage, $q, $cordovaSQLite, $ionicLoading, $ionicPopup){
    var product = [];
    
	return {
        
        //Gets the product list from the DB
        getProductList:function(){
            
            //Show the loading message
            $ionicLoading.show({template:'Loading products...'});
            
            var products=[];
            var query="SELECT * FROM products";
            
            $cordovaSQLite.execute(db, query, []).then(function(res){
                for(var i=0; i<res.rows.length; i++){
                    //Store product names in the array.
                    products[i]=res.rows.item(i).productName;
                }
                
                //Hide loading message
                $ionicLoading.hide();
            }
            ), function(err){
                    //On error hide the loading message and show error message
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title:"ERROR 97",
                        template:"There was an error reading data. Please try reinstalling the app"
                });
            }
            //console.log('xxx:' + products.length);
            
            //Returns the product list
            return products;  
        },
        
        //Gets the pest information from the DB
        getPestList:function(){
            //console.log("Inside get pestList");
            $ionicLoading.show({template:'Loading pests...'});
            
            var query="SELECT * FROM pests GROUP BY pestName";
            var temp=[];
            var pests=[];
            var counter=0; //Number of pests
            
            //Get all pest names from the table
            $cordovaSQLite.execute(db, query, []).then(function(res){
                for(var i=0; i<res.rows.length; i++){
                   temp.push(res.rows.item(i).pestName);
                   //console.log(res.rows.item(i).pestName);

                }
                //console.log(temp.length);
                
                query="SELECT * FROM pests WHERE pestName=?";
                
                //This function will be called recursively for every pest
                //This section will get the products for the respective pest
                var xxx=function(){
                    //console.log("Count is: "+ counter);
                    var pName=temp[counter];
                    var obj=[]; //Temporary array to store product name and pests array
                    var obj2=[];// Temporary array to store pests
                    
                    $cordovaSQLite.execute(db, query, [pName]).then(function(res1){
                        
                        for(var y=0; y<res1.rows.length; y++){
                            obj2.push({name:res1.rows.item(y).productName});
                            //console.log(res1.rows.item(y).productName);
 
                        }
                        //Store pest name and all used products
                        obj={pestName:pName, usedProducts:obj2};

                        pests.push(obj);
                        
                        counter++;
                        if(counter<temp.length){
                            //console.log('Used products: ' + pests[0].usedProducts);
                            xxx();
                        }
                        else{
                            //console.log('in else');
                            $ionicLoading.hide();
                        }
                    }), function(err){
                            $ionicLoading.hide();
                            //Error codes are just for internal reference.
                            $ionicPopup.alert({
                                title:"ERROR 98",
                                template:"There was an error reading data. Please try reinstalling the app"
                             });
                    }   
                }
                xxx();
            }), function(err){
                    $ionicLoading.hide();
                    $ionicPopup.alert({
                        title:"ERROR 99",
                        template:"There was an error reading data. Please try reinstalling the app"
                    });
                }

            return pests;
        },
        
        //Store currently selected product in memory
		setCurrentProduct: function(productName){
            var deferred = $q.defer();
            
            var query="SELECT * FROM products WHERE productName=?";
            
            //Select all the information of the current product
            $cordovaSQLite.execute(db, query, [productName]).then(function(res){
                deferred.resolve(res);
                if(res.rows.length > 0){
                    //Convert the results into JSON
                    var results= JSON.parse(res.rows.item(0).productContent);
                    console.log("Setting current product: "+ results.product);
                    $localstorage.setObject('currentProduct', results);
                }
                else{
                    console.log('No resuls were found in the database');
                }
            })
            return deferred.promise;
		},
        
        //Gets the currenlt product from memory
        getCurrentProduct:function(){
            var currentProduct= $localstorage.getObject('currentProduct'); 
            console.log('Getting current product:' + currentProduct.product);
            return currentProduct;
        }
	}
}])

//Service for setting and getting values from the local storage
.factory('$localstorage', ['$window', function($window) {
  return {
    set: function(key, value) {
        //Store the Key, Value pair in memory
      $window.localStorage[key] = value;
    },
    get: function(key, defaultValue) {
        //Gets the Value of the specified key. If key is not found, returns the default value.
      return $window.localStorage[key] || defaultValue;
    },
    setObject: function(key, value) {
        //Store the Key, Value pair in memory as JSON data
      $window.localStorage[key] = JSON.stringify(value);
    },
    getObject: function(key) {
        //Gets the Value of the specified key. If key is not found, returns an empty array.
      return JSON.parse($window.localStorage[key] || '{}');
    }
  }
}])

//Service for replacing string values
.factory('stringModifyService', function(){
    return{
        addLineBreaks:function(stringVal){
            //console.log('stringVal :' + stringVal);
            //Search for ;; in the string and replace it with a linebreak.
            var newString=stringVal;
            if(typeof(stringVal) !=='undefined' && stringVal){
                newString= stringVal.replace(/;;/g, '<br />');//Replace with a line break
                newString= newString.replace(/\?\?\?/g, '\u2022  ');//Replave with a bullet point
            }
            return newString;
        }   
    }
})

//Setting system parameters
.factory('sysConfigService', ['$cordovaSQLite', '$q', function($cordovaSQLite, $q){
    return{
        getPreferredLan:function(){
            var deferred = $q.defer();
            
            //console.log("Inside getPreferredLan");
            var queryGet= "SELECT * FROM sysConfig WHERE fieldName='preferredLan'";
            
            //Gets the prefered language from the DB
            $cordovaSQLite.execute(db, queryGet, []).then(function(res){
                deferred.resolve(res);                
            }),
            function(err){
                console.log("There was an error getting preferred lan" + err);
                deferred.reject(err);
            }
            return deferred.promise;
        },
        savePreferredLan:function(lan){
            
            var queryAdd="UPDATE sysConfig SET val=? WHERE fieldName='preferredLan'";
            //console.log("Saving preferred Lan: " + lan);
            
            $cordovaSQLite.execute(db, queryAdd, [lan]).then(function(res){
                console.log("Preferred Lan saved: " + lan);
            }),
            function(err){
                console.log("There was an error saving preferred lan" + err);
            }
        }
    }
}])

//Service to download files from the server and update DB
.factory('fileDownloadService',['$http', '$ionicPopup', '$ionicLoading', '$cordovaSQLite', '$q', function($http, $ionicPopup, $ionicLoading, $cordovaSQLite, $q){
    return{
        fileDownload:function(){
            console.log("Inside file download...");
          
            // Files to get data from
            //Get the last DB updated date.
            var urlCheck = "https://labels.deohs.washington.edu/updatedb/updated_on";
            //var urlCheck="http://52.25.36.171:3000/checka/2016-02-23T22:49:05Z";
            //var urlDownload="http://newsite.viv.co/wp-content/uploads/export_labels_array.json";
            
            //JSON file to get data from
            var urlDownload="https://labels.deohs.washington.edu/updatedb/labels.json";
            
            //Check to see if there are new updates avilable
            $http.get(urlCheck, {
                transformResponse: function(data, headersGetter) {
                    //console.log(data); 
                    //data.replace("}{", "},{");
                    return angular.fromJson(data);
              }
            }).then(function(resp) {
                var serverDBUpdatedOn=resp.data;
                console.log("Server response: (DB Updated on: )"+ serverDBUpdatedOn);
                console.log("Locat Database last updated on: "+ lastUpdated);
                
                //Check if the DB update dates are different
                if(serverDBUpdatedOn != lastUpdated){
                    //console.log("Ready to download data");
                    //Ask user to download data
                    $ionicPopup.confirm({
                        title:"New Updates",
                        content:"Do you want to download new updates?"
                    }).then(function(result){
                        if(result){
                            //If the user select to download data
                            //Show dowloading message.
                            $ionicLoading.show({template:'Downloading new files...'});
                            console.log("Downloading data...");
                            
                            //Gets the JSON file from the server
                            $http.get(urlDownload).then(function(data){
                                console.log("Data download complete.");
                                console.log("Saving data to DB...");
                                
                                //Gets the number of recors in the JSON file
                                var recordCount= Object.keys(data.data).length;
                                console.log("Number of items retrieved: "+ recordCount);
                                //console.log(data[0]);
                                
                                var promises = [];
                                var deferred = $q.defer();
                                
                                //Delete existing data from the tables
                                //Delete products from table
                                var delProducts="DELETE FROM products";
                                $cordovaSQLite.execute(db, delProducts, []).then(function(res) {
                                    console.log("Products deleted");
                                    
                                    //Delete pests from the table
                                    var delPests="DELETE FROM pests";
                                    $cordovaSQLite.execute(db, delPests, []).then(function(res) {
                                        console.log("Pests deleted");
                                        
                                        //Once the pests are deleted do this.
                                        var queryInsProd="INSERT OR IGNORE INTO products (productName, productContent) VALUES(?, ?)";
                                        var productName=null;
                                        var content;

                                        //Update products table
                                        console.log("Updating products table...");
                                        for(var i=0; i< recordCount; i++){
                                            
                                            //Get the prductname from the JSON
                                            productName= data.data[i].product;
                                            if(typeof(productName) !== 'undefined' && productName){
                                                content= JSON.stringify(data.data[i]);
                                                $cordovaSQLite.execute(db, queryInsProd, [productName, content]).then(function(res){
                                                    //console.log("insertId: " + res.insertId);
                                                    deferred.resolve(res);
                                                    promises.push(deferred);
                                                })
                                            }
                                        }

                                        //Update pests table
                                        var pestName;
                                        var pestCount;
                                        var queryInsPest="INSERT OR IGNORE INTO pests (pestName, productName) VALUES(?, ?)";


                                        console.log("Updating pest table...");
                                        for(var i=0; i<recordCount; i++){
                                            productName= data.data[i].product;
                                            //console.log(productName);
                                            if(typeof(productName) !== 'undefined' && productName && data.data[i].pests){
                                                pestCount= Object.keys(data.data[i].pestsEsp).length;

                                                for(var x=0; x < pestCount; x++){
                                                    pestName= data.data[i].pestsEsp[x].name;
                                                    //console.log(pestName +" : " + productName);
                                                    //console.log(pestCount);
                                                    $cordovaSQLite.execute(db, queryInsPest, [pestName, productName]).then(function(res){
                                                        //console.log("Insert ID: " + res.insertId);
                                                        deferred.resolve(res);
                                                        promises.push(deferred);
                                                        //promises.push()

                                                    })
                                                }
                                            }

                                        }

                                        //Write to log file
                                        //var dateTime= new Date().toISOString();
                                        var queryLog="INSERT INTO updateLog (updatedOn) VALUES (?)";
                                        console.log("Updating update log... Datetime stamp: "+ serverDBUpdatedOn);
                                        $cordovaSQLite.execute(db, queryLog, [serverDBUpdatedOn]).then(function(res){
                                            deferred.resolve(res);
                                            promises.push(deferred);

                                        }),
                                        function(err){
                                            console.log("Error updating log file: " + err);
                                            $ionicLoading.hide();
                                            //$ionicPopup.alert({title:"Update sucessful."});
                                            $ionicPopup.alert({
                                                title:"ERROR 100",
                                                template:"There was an error updating database. Please try again"
                                            });
                                        }

                                        $q.all(promises).then(function(){
                                            $ionicLoading.hide();
                                            console.log("All updates complete.");
                                            $ionicPopup.alert({title:"Update Complete."});
                                        }),
                                        function(err){
                                            console.error('Error updating updating tables. ', err);
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({
                                                title:"ERROR 101",
                                                template:"There was an error updating database. Please try again"
                                            });
                                        }

                                    }), function(err){
                                            console.error('Error deleting pests. ', err);
                                            $ionicLoading.hide();
                                            $ionicPopup.alert({
                                                title:"ERROR 102",
                                                template:"There was an error updating database. Please try again"
                                            });
                                        }

                                }), function(err){
                                        console.error('Error deleting products. ', err);
                                        $ionicLoading.hide();
                                        $ionicPopup.alert({
                                            title:"ERROR 103",
                                            template:"There was an error updating database. Please try again"
                                        });
                                    }
                                
                            }),
                                function(err){
                                    console.error('Error downloading data from server. ', err);
                                    $ionicLoading.hide();
                                    $ionicPopup.alert({
                                        title:"ERROR 104",
                                        template:"There was an error downloading data. Please try again"
                                    });
                            }
                        }
                    })
                }
                
            }), function(err) {
                console.error('Error getting last modified date. ', err);
                $ionicLoading.hide();
                $ionicPopup.alert({
                     title:"ERROR 103",
                      template:"There was an error updating database. Please try again"
                });
            }

        }
        
    }
}]);