
// const wfewhf = require('./test')
var app = angular.module("myApp", ["ngRoute"]);

app.config(function($routeProvider) {
	console.log($routeProvider);

    $routeProvider
    .when("/Create_1", {
      templateUrl: 'app/Create_1.html',
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
        controller: "myCtrl",
        css: 'Login.css'




    }).when("/Landing",{
        templateUrl: 'app/landpage.html',
        css: 'Main_Home.css'
      

    
    }).when("/Create_2", {
        templateUrl: 'app/Create_2.html',
        css: 'Create.css'

  
    })
      .when("/Cancel",{
        templateUrl:'app/Create_1.html',
        css: 'Create.css'

    })

    .when("/Create_3",{
        templateUrl:'app/Create_3.html',
        css: 'Create.css'

    })

    .when("/Create_4",{
        templateUrl:'app/Create_4.html',
        css: 'Create.css'

    })

    .when("/Create_5",{
        templateUrl:'app/Create_5.html',
        css: 'Create.css'

    })

    .when("/Create_6",{
        templateUrl:'app/Create_6.html',
        css: 'Create.css'

    })
    .when("/Create_7",{
        templateUrl:'app/Create_7.html',
        css: 'Create.css'

    })
    .when("/Create_8",{
        templateUrl:'app/Create_8.html',
        css: 'Create.css'

    })
    .when("/Create_9",{
        templateUrl:'app/Create_9.html',
              css: 'Create.css'

    })

    .when("/MyCapsule",{
        templateUrl:'app/MyCapsule.html',
        css: 'MyCapsule.css'

    })

    .when("/Event1",{
        templateUrl:'app/Event_page1.html',
        css: 'Event_page.css'

    })

    .when("/Event2",{
        templateUrl:'app/Event_page2.html',
        css: 'Event2.css'
    })

    .when("/Signout",{
        templateUrl:'app/Main_Home.html',
    })
});

app.factory('AuthService', function($http) {
    var authService = {};

    authService.login = function(credentials) {
        return $http
            .post('/login', credentials)
            .then((response) => {
                return response.data 
            })
    }

    return authService;
})

app.service('Session', function () {
    this.create = function (user) {
        this.user = user
    }
})