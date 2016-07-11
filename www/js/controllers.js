angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
  $scope.playlists = [
    { title: 'Reggae', id: 1 },
    { title: 'Chill', id: 2 },
    { title: 'Dubstep', id: 3 },
    { title: 'Indie', id: 4 },
    { title: 'Rap', id: 5 },
    { title: 'Cowbell', id: 6 }
  ];
})

.controller('AuthCtrl', function($scope, $location, $stateParams, $ionicHistory, $http, $state, $auth, $rootScope){
  $scope.loginData = {}
  $scope.loginError = false;
  $scope.loginErrorText; 

  $scope.login = function() {
   
              var credentials = {
                  email: $scope.loginData.email,
                  password: $scope.loginData.password
              }
   
              console.log(credentials);
   
              $auth.login(credentials).then(function() {
                  // Return an $http request for the authenticated user
                  $http.get('http://localhost:8000/api/v1/authenticate/user').success(function(response){
                      // Stringify the retured data
                      var user = JSON.stringify(response.user);
   
                      // Set the stringified user data into local storage
                      localStorage.setItem('user', user);
   
                      // Getting current user data from local storage
                      $rootScope.currentUser = response.user;
                      // $rootScope.currentUser = localStorage.setItem('user');;
                      
                      $ionicHistory.nextViewOptions({
                        disableBack: true
                      });
   
                      $state.go('app.poems');
                  })
                  .error(function(){
                      $scope.loginError = true;
                      $scope.loginErrorText = error.data.error;
                      console.log($scope.loginErrorText);
                  })
              });
          }
})
 
.controller('PoemsCtrl', function($scope, $stateParams, $auth, $rootScope, $http, $ionicPopup, $timeout){
    
      $scope.poems = [];
      $scope.error;
      $scope.poem;
     
      $scope.listCanSwipe = true;

      console.log($rootScope.currentUser);
     
      // Update Popup
      $scope.updatePopup = function(poem, label) {
          console.log(poem,label);
          $scope.data = poem;
     
          var myPopup = $ionicPopup.show({
            template: '<input type="text" ng-model="data.poem">',
            title: 'Update poem',
            // subTitle: 'Please use normal things',
            scope: $scope,
            buttons: [
              // { text: 'Cancel' },
              {
                text: '<b>'+label+'</b>',
                type: 'button-positive',
                onTap: function(e) {
                  if (!$scope.data.poem) {
                    e.preventDefault();
                  } else {
                    return $scope.data;
                  }
                }
              }
            ]
          });

          myPopup.then(function(res) {
            $scope.updatePoem(res);
            console.log(res);
          });

      };
     
      $scope.init = function() {
          $scope.lastpage=1;
          $http({
              url: 'http://localhost:8000/api/v1/poems',
              method: "GET",
              params: {page: $scope.lastpage}
          }).success(function(poems, status, headers, config) {
              console.log(poems);
              $scope.poems = poems.data.data;
              $scope.currentpage = poems.current_page;
          });
      };

      $scope.addPoem = function(poem) {
   
        console.log("add poem: ",poem);
   
          $http.post('http://localhost:8000/api/v1/poems', {
              body: poem,
              user_id: $rootScope.currentUser.id
          }).success(function(response) {
              $scope.poems.unshift(response.data);
              console.log($scope.poems);
              $scope.poem = '';
              console.log("poem Created Successfully");
          }).error(function(){
            console.log("error");
          });
      };
   
      $scope.updatePoem = function(poem){
        console.log(poem);
        $http.put('http://localhost:8000/api/v1/poems/' + poem.poem_id, {
              body: poem.poem,
              user_id: $rootScope.currentUser.id
          }).success(function(response) {
              console.log("poem Updated Successfully");
          }).error(function(){
            console.log("error");
          });
      }
     
      $scope.deletePoem = function(index, poemId){
          console.log(index, poemId);
     
            $http.delete('http://localhost:8000/api/v1/poems/' + poemId)
                .success(function() {
                    $scope.poems.splice(index, 1);
                });;
        }
     
        $scope.init();
    
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
});


