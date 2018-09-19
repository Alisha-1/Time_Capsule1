app.controller('Event_UploadMoreController', ($scope, $http, $rootScope, $location) => {

    $scope.activePage = 0
    $scope.images = []
    $scope.imageIndex = 0
    $scope.currentImageURL = ''
    $scope.tc = {}
  
    let userId = null
    
    if ($rootScope.user) {
      userId = $rootScope.user.UserID
    } else {
      $location.path('/Login')
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
  
  
    $scope.navToEvent = (finish) => {
      //Call to server.js
      $http.post('/event_uploadMore', {
        images: $scope.images,
        capsuleId: $rootScope.capsuleId
      }).then(resp => {
         $location.path('/Event/' + $rootScope.capsuleId)
       
          // $scope.activePage += 1
          // $rootScope.capsuleId = resp.data.capsuleId
      
      }).catch(e => {
        console.error(e)
        $scope.errors = e
      })
    }


    //   $scope.navToEvent = (capsuleId) => {  
    //     //Go to page Event with CapusleId of timecapsule 
    //   $location.path('/Event/' + capsuleId)
    // }
  
  })