app.controller('CreateController', ($scope, $http, $rootScope) => {

  $scope.activePage = 0
  $scope.images = []
  $scope.imageIndex = 0
  $scope.currentImageURL = ''
  $scope.tc = {}

  let userId = null
  
  if ($rootScope.user) {
    userId = $rootScope.user.UserID
  }
  
  console.log('userId is', userId)

  $scope.nextPage = () => {
    $scope.activePage += 1
    console.log('Images are', $scope.images)
  }

  $scope.previousPage = () => {
    $scope.activePage -= 1
  }

  $scope.uploadMore = () => {
    $scope.imageIndex += 1
    $scope.activePage = 0
  }

  $scope.fileUpload = (files) => {
    var fd = new FormData();
    if ($rootScope.user)
      fd.append('userId', userId)
    fd.append("file", files[0]);
    $http.post('/upload', fd, { headers: {'Content-Type': undefined } })
      .then((resp) => {
        $scope.images.push(resp.data.result)
        $scope.activePage += 1
        $scope.currentImageURL = $scope.images[$scope.imageIndex].fileName
        console.log($scope.currentImageURL, $scope.images, $scope.imageIndex)
      })
      .catch(e => console.error(e))
  }

  $scope.createCapsule = () => {
    $http.post('/capsule', {
      images: $scope.images,
      date: new Date($scope.tc.date.getFullYear(), $scope.tc.date.getMonth(), $scope.tc.date.getDate(), $scope.tc.time.getHours(), $scope.tc.time.getMinutes()),
      recipient: $scope.tc.recipient,
      userId: userId
    }).then(resp => {
      console.log(resp)
    }).catch(e => {
      console.error(e)
      $scope.errors = e
    })
  }
})