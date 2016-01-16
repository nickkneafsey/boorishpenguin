angular.module('boorish.questions', [])

.controller('questionsController', function($scope, $window, $location, Questions, Auth, Trending) {
  $scope.questions = [];
  $scope.trending = [];
  $scope.isTrend = true;


  $scope.getProds = function() {
    Questions.getAllProducts().then(function(data) {
      $scope.questions = data.results;
    });
  };
  $scope.getTrends = function() {
    Trending.getTopTrending().then(function(data) {
      $scope.trending = data.results;
    });
  };
  $scope.getMostTalkedAbout = function() {
    Trending.getTalkedAbout().then(function(data){
      $scope.trending = data.results;
    })
  };

  $scope.init = function() {
    $scope.getProds();
    $scope.getTrends();
    // Questions.getAllProducts().then(function(data) {
    //   $scope.questions = data.results;
    // });

    // Trending.getTopTrending().then(function(data) {
    //   $scope.trending = data.results;
    // });

    // Trending.getTopTrending().then(function(data){
    //   $scope.trending = data.results;
    // })
    
  };

  $scope.giveLike = function(postid) {
    var obj = {};
    obj.id_user = localStorage.getItem('com.boorish');
    obj.id_post = postid;
    Questions.addLike(obj).then(function(){
      $scope.getProds();
    });
  }


  // if user is not authenticated, reroute to /signin
  Auth.setUser().then(function(){

  })

  if(Auth.isAuth()){
    $scope.init()
  } else {
    $location.path('/signin')
  }
  //if (!Auth.isAuth()) {
  //  $location.path('/signin')
  //// else show questions
  //} else {
  //  $scope.init();
  //}
});

//TODO: ASYNC between setUSER and checking auth