
// const wfewhf = require('./test')
var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
	
    $routeProvider
    .when("/Create", {
      templateUrl: 'app/Create_1.html',
      controller: "CreateController",
      css: 'Create.css'

     }).when("/",{
    	templateUrl: 'app/Main_Home.html',
        css: 'Main_Home.css'

    }).when("/Login",{
    	templateUrl: 'app/Login.html',
        controller: "LoginController",
        css: 'Login.css'

    }).when("/SignUp",{
    	templateUrl: 'app/Sign_Up.html',
        controller: "RegistrationController",
        css: 'Login.css'

    }).when("/Landing",{
        templateUrl: 'app/landpage.html',
        css: 'Main_Home.css'

    
    }).when("/MyCapsule",{
        templateUrl:'app/MyCapsule.html',
        controller: "MyCapsuleController",
        css: 'MyCapsule.css'

    })
      .when("/Cancel",{
        templateUrl:'app/Create_1.html',
        css: 'Create.css'

    })
    .when("/Signout",{
        templateUrl:'app/Main_Home.html',
    })
});