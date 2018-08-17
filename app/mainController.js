app.controller("myCtrl", function($scope, $http, $location, $route, $rootScope) {
  $scope.totalData = [];
  $scope.displayBtn = false;
  $scope.login = true;
  self =  $scope;
  
  $scope.editBtn = false;
  $scope.driverData = [];
  $scope.css = "Main_Home.css";
  $scope.$watch(
    function() {
      return $route.current && $route.current.css;
    },
    function(value) {
      debugger;
      $scope.css = value;
      if(self.loginChecked){
         $scope.login = false;
      }
      if(self.signOut){
        $scope.login = true;
      }
    }
  );

  /*
$scope.$on('$locationChangeSuccess', function(//EDIT: remove params for jshint ) {

    var path = $location.path();
    //EDIT: cope with other path
    $scope.templateUrl = (path==='/Signin' || path==='/Login'|| path==='/Home') ? 'template/header4signin.html' : 'template/header4normal.html' ;
});
*/
  $scope.editdetail = function(evt) {
    $scope.$broadcast("editDetails", { action: "edit" });
  };
  $scope.displaydetail = function(evt) {
    $scope.$broadcast("editDetails", { action: "display" });
  };

  $scope.deletedetail = function(evt) {
    $scope.$broadcast("editDetails", { action: "delete" });
  };

  $scope.driverList = function(event) {
    debugger;
    $http({
      url: "/app",
      method: "post",
      data: { action: "getData" }
    }).then(
      function(response) {
        debugger;
        alert(response.data.confirm);
        $scope.driverData = response.data.driverData;
        // $location.path( "/details" );
      },
      function(response) {
        // optional
        debugger;
      }
    );
  };
  $scope.detailPage = function(drvData) {
    debugger;
    var carno = drvData["CARNUM"];
    $scope.editBtn = true;

    $location.path("/details/" + carno);
  };
  $scope.loginData = function(){
      debugger;
   
      $scope.loginChecked = true;
    $location.path("/Landing");
   

  }
  $scope.logIn = function() {
    debugger;
    $location.path("/Login");
  };

  $scope.home = function() {
    debugger;
    $location.path("/");
  };

  $scope.signUp = function() {
    debugger;
    $location.path("/SignUp");
  };


  $scope.navCreate1 = function() {
    debugger;
    $location.path("/Create_1");
  };

  $scope.navCreate2 = function() {
    debugger;
    $location.path("/Create_2");
  };

  $scope.navCancel = function() {
    debugger;
    $location.path("/Cancel");
  };

  $scope.navCreate3 = function() {
    debugger;
    $location.path("/Create_3");
  };

  $scope.navCreate4 = function() {
    debugger;
    $location.path("/Create_4");
  };

  $scope.navCreate5 = function() {
    debugger;
    $location.path("/Create_5");
  };

  $scope.navCreate6 = function() {
    debugger;
    $location.path("/Create_6");
  };

  $scope.navCreate7 = function() {
    debugger;
    $location.path("/Create_7");
  };

  $scope.navCreate8 = function() {
    debugger;
    $location.path("/Create_8");
  };

  $scope.navCreate9 = function() {
    debugger;
    $location.path("/Create_9");
  };

  $scope.navMyCapsule = function() {
    debugger;
    $location.path("/MyCapsule");
  };

  $scope.navEvent1 = function() {
    debugger;
    $location.path("/Event1");
  };

  $scope.navEvent2 = function() {
    debugger;
    $location.path("/Event2");
  };

  $scope.navSignout = function() {
    debugger;
    $scope.signOut = true;
    $location.path("/Signout");
  };

  $scope.createData = {
    title: "",
    author: "",
    description: ""
  };
  $scope.create = function(event) {
    debugger;
    $location.path("/register");
  };
  $scope.saveData = function(event) {
    console.log($scope);
    $http({
      url: "/app",
      method: "POST",
      data: { action: "create", data: $scope.createData }
    }).then(
      function(response) {
        // success
        debugger;
        alert(response.data.confirm);
        $scope.totalData = response.data.createdData;
        // $location.path( "/details" );
      },
      function(response) {
        // optional
        // failed
        debugger;
      }
    );
  };
});
