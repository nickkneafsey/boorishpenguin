angular.module('boorish.ask', [])

///////////////////////////////////////////////////////////////////////////////////////////////
///// Ask Controller: Pulls tags and courses from the database to display to the user. User
/////   writes question, and selects tag and course.
///// 
///// addQuestion: uses the addQuestion facotry to add question to the database
///////////////////////////////////////////////////////////////////////////////////////////////

.controller('askController', function($scope, $window, $location, Tags, Courses, Questions, Auth, Links) {
  $scope.question = {};
  $scope.user_id = parseInt($window.localStorage.getItem("com.boorish"))
  $scope.savedLinks = [{link_id: 1,title:"Test Google Test", tag:"FML", url:"www.google.com", text: "Google test description"}, {link_id: 2, title:"Yahoo test title", tag:"FML", url:"www.yahoo.com", text: "Yahoo test description"}, {link_id: 3, title:"test3", tag:"FML3", url:"www.wow.com", text: "test3"}];
  $scope.getSaved = function(){
    Links.getLinks($scope.user_id).then(function(data){
      $scope.savedLinks = data;
    })
  }
  $scope.deleteLink = function(linkId){
    Links.deleteLink(linkId).then(function(){
      $scope.getSaved();
    })
  }
  //TODO(me): link autofill to right data
  $scope.autofill= function(index){
    $scope.question.title = $scope.savedLinks[index].title
    $scope.question.tag = $scope.savedLinks[index].tag
    $scope.question.url = $scope.savedLinks[index].url
    $scope.question.text = $scope.savedLinks[index].text
    $scope.savedLinks.splice(index, 1);
    // $scope.deleteLink($scope.savedLinks[index].link_id)
  }

  if (!Auth.isAuth()) {
    $location.path('/signin');
  } else {

    Tags.getTags()
    .then(function(data) {
      $scope.tagOptions = {
        availableOptions: data.results,
        selectedOption: data.results[data.results.length - 1]
      };
      return;
    });
    // .then(function() {
    //   return Courses.getCourses();
    // })
    // .then(function(data) {
    //   $scope.courseOptions = {
    //     availableOptions: data.results,
    //     selectedOption: data.results[data.results.length - 1]
    //   };
    // });
    var embedly = {};
    //call url link

    $scope.addQuestion = function() {
      $scope.question.id_user = $window.localStorage.getItem('com.boorish');  // pulls userId from localStorage

      $scope.question.tag = $scope.question.tag || $scope.tagOptions.selectedOption.name;  // pulls selected tag
      
      Questions.embedLink($scope.question.link).then(function(data) {
        embedly = data.data;
        
        $scope.question.provider_url = embedly.provider_url || null;
        $scope.question.thumbnail_width = embedly.thumbnail_width || null;
        $scope.question.thumbnail_height = embedly.thumbnail_height || null;
        $scope.question.thumbnail_url = embedly.thumbnail_url || null;
        $scope.question.provider_url = embedly.provider_url || null;
        $scope.question.sitetitle = embedly.title || null;
        $scope.question.provider_name = embedly.provider_name || null;
        $scope.question.version = embedly.version || null;
        $scope.question.type = embedly.type || null;

      }).then(function(){
        Questions.addProduct($scope.question).then(function() { // adds new Question with addQuestion factory method
          $location.path('/questions'); // redirects to all questions
        });

      }).catch(function(err){
        alert(err);
      });

      // Questions.addProduct($scope.question).then(function() { // adds new Question with addQuestion factory method
      //   $location.path('/questions'); // redirects to all questions
      // });

    };



    // var embedder = function(){
    //   Questions.embedLink($scope.question.url).then(function(data){
    //     $scope.question.embedData = data.data;
    //   });
    // }

  }


})