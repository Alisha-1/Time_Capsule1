angular.module('myApp')
  .controller('LoginController', ($scope, AuthService, $rootScope, $location) => {
    $scope.credentials = {
      username: '',
      password: ''
    }

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