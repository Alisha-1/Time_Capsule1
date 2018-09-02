app.controller('EventController', ($scope, $http, $routeParams) => {
  var id = $routeParams.id

  $http.get(`/capsule/${id}`)
    .then(resp => {
      if ('error' in resp.data) {
        console.error(resp.data.error)
        $scope.errors = resp.error
      } else {
        console.log(resp.data.result)
        $scope.capsule = resp.data.result
      }
    })
    .catch(e => {
      console.error(resp.data.error)
      $scope.errors = resp.error
    })
})