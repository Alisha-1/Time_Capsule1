app.controller('MyCapsuleController', ($scope, $rootScope, $location, $http) => {

  let userId = null
  
  if ($rootScope.user) {
    userId = $rootScope.user.UserID
    $http.get(`/user/${userId}/capsules`).then(resp => {
      if ('error' in resp.data) {
        console.error(resp.data.error)
        $scope.errors = resp.error
      } else {
        $scope.capsules = resp.data.result
      }
    }).catch(e => {
      console.error(e)
      $scope.errors = e
    })
  } else {
    $location.path('/Login')
  }

  $scope.navToEvent = (capsuleId) => {  
      //Go to page Event with CapusleId of timecapsule 
      $rootScope.capsuleId = capsuleId;
    $location.path('/Event/' + capsuleId)
  }
  
})