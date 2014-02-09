 'use strict';

angular.module('Webid',['restangular','factory.session']).
config(function(RestangularProvider,$httpProvider ,$routeProvider) {


      $httpProvider.defaults.useXdomain = true;
      delete $httpProvider.defaults.headers.common['X-Requested-With'];
    
      RestangularProvider.setBaseUrl("http://127.0.0.1:8000/api/v1/");


       $routeProvider.when('/join', {
	   		templateUrl:'views/signup.html',
	   		controller: 'SignupCtrl'
	   })
	  .when('/login', { 
	  	templateUrl:'views/login.html',
	  	controller:"LoginCtrl"	
	  })
	  .when('/home' , { 
	  templateUrl: 'views/home.html', 
	   controller: "HomeCtrl"})
	  .when('/create', {
	  	templateUrl:'views/create_profile.html',
	  	controller: "WebidCreateCtrl"
	  })
  	  .when('/edit', {
	  	templateUrl:'views/edit_profile.html',
	  	controller: "WebidEditCtrl"
	  })
	  .when('/contacts',{
	  		templateUrl: 'views/contacts_list.html',
	  		controller: "ContactsCtrl"
	  })
	  .when('/contacts/:Contact_id',{
	  		templateUrl: 'views/contact.html',
	  		controller: "WebidCtrl"
	  })
	  .when('/phones/:phone_id', {
	  		templateUrl:'views/view_phone.html',
	  		controller:"ViewPhoneCtrl"
	  })
  	  .when('/social/:social_id', {
	  		templateUrl:'views/view_social.html',
	  		controller:"ViewSocialCtrl"
	  })
	  .when('/email/:email_id', {
	  		templateUrl:'views/view_email.html',
	  		controller:"ViewEmailCtrl"
	  })
	  .when('/website/:web_id', {
		templateUrl:'views/view_website.html',
		controller:"ViewWebCtrl"

	  })	
	  .when('/add/phones', {
	  		templateUrl:'views/add_phone.html',
	  		controller:"AddPhoneCtrl"
	  })

	  .when('/add/social', {
	  		templateUrl:'views/add_social.html',
	  		controller: "AddSocialCtrl"
	  })
  	  .when('/add/email', {
	  		templateUrl:'views/add_email.html',
	  		controller: "AddEmailCtrl"
	  })
	  .when('/add/website', {
	  		templateUrl:'views/add_website.html',
	  		controller: "AddWebsiteCtrl"
	  })  
  	  .when('/phones', {
	  		templateUrl: 'views/phones.html',
	  		controller:"PhoneList"
	  })
	  .when('/social', {
	  		templateUrl:'views/social.html',
	  		controller: "SocialList"
	  })
	  .when('/email', {
	  		templateUrl:'views/email.html',
	  		controller: "EmailList"
	  })
	  .when('/website', {
	  		templateUrl:'views/	website.html',
	  		controller: "WebsiteList"
	  })
	  .otherwise({ redirectTo: '/login'});
	   
});

//Signup Controller - User Signup or User Post logic with JS 
function SignupCtrl($scope,Restangular){
				$scope.Signup = function(){Restangular.all('signup').post($scope.register).then(function(register)
{
$scope.$emit('event:auth-join', {username: $scope.register.username, password: $scope.register.password});

})}
	}
//Create WebId Page
function WebidCreateCtrl($scope,Restangular,$location){
		$scope.user = lscache.get('userData');
		
	//	console.log(data);
		$scope.Webid = function(){
				//var data = {user: $scope.user.resource_uri ,first_name:$scope.first_name,last_name:$scope.last_name}
				$scope.$emit('event:auth-webid', {user:$scope.user.resource_uri, first_name: $scope.first_name, last_name:$scope.last_name});
				
				}
		}
//Controller to Edit Uer Profile 

function WebidEditCtrl($scope,Restangular,$location,$q,$http)	{
		$scope.user = lscache.get('userData');
		var baseAccount = Restangular.one("profiles",$scope.user.user_pk);
		//console.log(baseAccount.first_name);
		baseAccount.get().then(function(account){
			//$scope.Account = account;
			$scope.profile = Restangular.copy(account);

		});

		$scope.Submit = function() {

			$scope.profile.first_name = $scope.first_name;
			$scope.profile.put();
			baseAccount.put();


		}
			
}


//Login Controller - Userl login method , returns username 
function LoginCtrl($log, $Session,$scope,$rootScope,$location){
	$scope.Login = function(){
			$scope.$emit('event:auth-login',{username:$scope.username, password:$scope.password});
	}
}

function HomeCtrl($scope,Restangular,$q){
    
    $scope.user = lscache.get('userData');
  //  var data = { user : $scope.user.resource_uri , username : $scope.user.username }
   // console.log(data);
   	var defer = $q.defer();
   	defer.promise = $scope.profile = Restangular.one("profiles" , $scope.user.user_pk).get();

   	defer.promise.then(function(response){
   		var data = Restangular.copy(response);
   		lscache.set('profileData', data);
   		return data	
   	});
   	defer.resolve();

    $scope.Logout = function() {
    		$scope.$emit('event:auth-logout',{});
    }
          
	} 

// List all the users Contacts 

function ContactsCtrl($scope,Restangular){
		$scope.user = lscache.get('userData');
		$scope.Contacts = Restangular.one("profiles",$scope.user.user_pk).getList("contacts");
		//$scope.Phones = Restangular.one("profiles",$scio)
}

// Public View of WebID controller 

function WebidCtrl($scope,Restangular,$routeParams,$q,$location){
		$scope.user = lscache.get('userData');
		$scope.pin = $routeParams.Contact_id;
		var defer = $q.defer();
		defer.promise = $scope.profile = Restangular.one("profiles",$scope.pin).get();
	
		$scope.Add = function () {
			defer.promise.then(function (response) {
				// body...
				var data = Restangular.copy(response);
				//lscache.set('contactData',data);
				$scope.$emit('event:auth-addcontact',{ follower : lscache.get('profileData').resource_uri , followee: data.resource_uri});
			});
			
			
		}
		defer.resolve();
				
}

function ViewPhoneCtrl($scope,Restangular,$routeParams,$q,$location){
		$scope.user = lscache.get('userData')
		$scope.id = $routeParams.phone_id;
		var defer = $q.defer();
		defer.promise = $scope.phone = Restangular.one("phonenumber",$scope.id).get();
		$scope.Delete = function() {
			    defer.promise.then(function(response){
			    	var data = Restangular.copy(response);
			    	Restangular.one("phonenumber",data.id).remove().then(function(){$location.path('/home')});
			    });

		}
}

function ViewSocialCtrl($scope,Restangular,$routeParams,$q,$location){
		$scope.user = lscache.get('userData')
		$scope.id = $routeParams.social_id;
		var defer = $q.defer();
		defer.promise = $scope.social = Restangular.one("social",$scope.id).get();
		$scope.Delete = function() {
			    defer.promise.then(function(response){
			    	var data = Restangular.copy(response);
			    	Restangular.one("social",data.id).remove().then(function(){$location.path('/home')});
			    });

		}
}

function ViewEmailCtrl($scope,Restangular,$routeParams,$q,$location){
		$scope.user = lscache.get('userData')
		$scope.id = $routeParams.email_id;
		var defer = $q.defer();
		defer.promise = $scope.email = Restangular.one("email",$scope.id).get();
		$scope.Delete = function() {
			    defer.promise.then(function(response){
			    	var data = Restangular.copy(response);
			    	Restangular.one("email",data.id).remove().then(function(){$location.path('/email')});
			    });

		}
}

function ViewWebCtrl($scope,Restangular,$routeParams,$q,$location){
		$scope.user = lscache.get('userData')
		$scope.id = $routeParams.web_id;
		var defer = $q.defer();
		defer.promise = $scope.web = Restangular.one("web",$scope.id).get();
		$scope.Delete = function() {
			    defer.promise.then(function(response){
			    	var data = Restangular.copy(response);
			    	Restangular.one("web",data.id).remove().then(function(){$location.path('/website')});
			    });

		}
}

function AddPhoneCtrl($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData')
		$scope.Add = function () {
				$scope.$emit('event:auth-addphone', {contact:$scope.user.resource_uri , type : $scope.type , phone: $scope.phone});

					}
		}

function AddSocialCtrl($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData')
		$scope.Add = function () {
				$scope.$emit('event:auth-addsocial', {contact:$scope.user.resource_uri , type : $scope.type , handle:$scope.handle });

					}
		}

function AddEmailCtrl($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData')
		$scope.Add = function () {
				$scope.$emit('event:auth-addemail', {contact:$scope.user.resource_uri , type : $scope.type , email:$scope.email });

					}
		}

function AddWebsiteCtrl($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData')
		$scope.Add = function () {
				$scope.$emit('event:auth-addwebsite', {contact:$scope.user.resource_uri , website:$scope.website });

					}
		}


function PhoneList($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('userData');
		
		var defer = $q.defer();
		defer.promise = $scope.Phones =  Restangular.one("profiles", $scope.user.user_pk).getList("phonenumber");
		defer.promise.then(function(response) {
		var data = Restangular.copy(response);

//		console.log(data.phones[0].id);
		/*for (var i =0 ; i < data.phones.length ;i++){
		console.log(data.phones[i].id);	
		Restangular.one("phonenumber",data.phones[i].id).remove();
		}
	});}*/});
		defer.resolve();

}



function SocialList($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData');
		$scope.Socials = Restangular.one("profiles", $scope.user.contact_id).getList("social");
}

function EmailList($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData');
		$scope.Emails = Restangular.one("profiles", $scope.user.contact_id).getList("email");
}
function WebsiteList($scope,Restangular,$q,$location) {
		$scope.user = lscache.get('profileData');
		$scope.Website = Restangular.one("profiles", $scope.user.contact_id).getList("website");
}
