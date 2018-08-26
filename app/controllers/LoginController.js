angular.module('myApp')
  .controller('LoginController', ($scope, AuthService, $rootScope, $location) => {
    $scope.credentials = {
      email: '',
      password: ''
    }

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