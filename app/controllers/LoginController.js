angular.module('myApp')
  .controller('LoginController', ($scope, AuthService, Session, $location) => {
    $scope.credentials = {
      email: '',
      password: ''
    }

    $scope.login = function() {
      AuthService.login($scope.credentials)
        .then((user) => {
          console.log(user)
          if ('error' in user) {
            $scope.errors = user.error
          } else {
            $scope.errors = ''
            console.log('Login Completed')
            Session.create(user)
            $location.path('/MyCapsule')
          }
        })
        .catch((e) => {
          console.error('Could not login', e)
          $scope.errors = e
        })
    }
  })