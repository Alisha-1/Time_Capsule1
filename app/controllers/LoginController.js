angular.module('myApp')
  .controller('LoginController', ($scope, AuthService, $http , $rootScope, $location) => {
    $scope.credentials = {
      username: '',
      password: ''
    }

    
    // $scope.glogin = function(googleUser) {
    //   debugger;
    //   var profile = googleUser.getBasicProfile();
    //   console.log('ID: ' + profile.getId()); // Do not send to your backend! Use an ID token instead.
    //   console.log('Name: ' + profile.getName());
    //   console.log('Image URL: ' + profile.getImageUrl());
    //   console.log('Email: ' + profile.getEmail()); // This is null if the 'email' scope is not present.
    // }

  // //Google Login
  var windowOpened;

  $scope.glogin = function() {
    AuthService.glogin()
    .then((response,err) => {
      //Open new window, response=URL
        windowOpened = window.open(response);
          
      
    }) 
    .catch((e) => {
      console.error('Could not login', e)
      $scope.errors = e
    })
  };

  window.onmessage = function(e) {
    //Once login password correct entered come here 
    if(windowOpened){
    windowOpened.close();
    var urlWithCode = e.data;
    var idx = urlWithCode.lastIndexOf("code=");
    var code = urlWithCode.substring(idx + 5).replace("#", "");
    var splitCode = code.split("&");
    var oauthCode = splitCode[0];
    $http({
      //get session id 
      url: "token",
      method: "GET",
      params: { code: oauthCode }
    }).then(function(response) {

      console.log(response);
    });
  }
  };

    // $scope.gLogin = function(){
    //   AuthService.googlelogin()
    //   .then((user) => {
    //     if ('error' in user) {
    //       $scope.errors = user.error
    //     } else {
    //       debugger;
    //       $location.path('/MyCapsule')
    //     }
    //   })
    //   .catch((e) => {
    //     console.error('Could not login', e)
    //     $scope.errors = e
    //   })
    // }

    $scope.login = function() {
      AuthService.login($scope.credentials)
        .then((user) => {
          if ('error' in user) {
            $scope.errors = user.error
          } else {
            $scope.errors = ''
            console.log('Login Completed')
            $rootScope.user = user
            $rootScope.loggedIn = true
            $location.path('/MyCapsule')
          }
        }) 
        .catch((e) => {
          console.error('Could not login', e)
          $scope.errors = e
        })
    }
  })
