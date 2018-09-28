angular.module('myApp')
  .controller('LoginController', ($scope, AuthService, $http, $rootScope, $location) => {
    $scope.credentials = {
      username: '',
      password: ''
    }

  //Google Login
  $scope.glogin = function() {
    debugger;
    $http.get("url").then(function(response) {
      windowOpened = window.open(response.data);
    });
  };

  window.onmessage = function(e) {
    windowOpened.close();
    var urlWithCode = e.data;
    var idx = urlWithCode.lastIndexOf("code=");
    var code = urlWithCode.substring(idx + 5).replace("#", "");
    var splitCode = code.split("&");
    var oauthCode = splitCode[0];
    $http({
      url: "token",
      method: "GET",
      params: { code: oauthCode }
    }).then(function(response) {
      console.log(response);
    });
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
