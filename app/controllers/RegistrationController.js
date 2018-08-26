angular.module('myApp')
  .controller('RegistrationController', ($scope, AuthService, $rootScope, $location) => {
    $scope.details = {
      username: '',
      password: '',
      name: '',
      password2: ''
    }

    $scope.register = () => {
      console.log('Starting registration')
      AuthService.register($scope.details)
        .then((data) => {
          if ('error' in data) {
            $scope.errors = data.error
          } else {
            $scope.errors = ''
            console.log('Registration Completed')
            $rootScope.user = data.user
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