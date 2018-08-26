app.factory('AuthService', function($http) {
  var authService = {};

  authService.login = (credentials) => {
      return $http
          .post('/login', credentials)
          .then((response) => {
              return response.data 
          })
  }

  authService.register = (details) => {
    return $http
          .post('/register', details)
          .then((response) => {
              return response.data 
          })
  }

  return authService;
})