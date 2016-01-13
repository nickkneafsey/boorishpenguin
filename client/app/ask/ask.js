angular.module('boorish.ask', [])

///////////////////////////////////////////////////////////////////////////////////////////////
///// Ask Controller: Pulls tags and courses from the database to display to the user. User
/////   writes question, and selects tag and course.
///// 
///// addQuestion: uses the addQuestion facotry to add question to the database
///////////////////////////////////////////////////////////////////////////////////////////////

.controller('askController', function($scope, $window, $location, Tags, Courses, Questions, Auth) {
  $scope.question = {};

  if (!Auth.isAuth()) {
    $location.path('/signin')
  } else {

    Tags.getTags()
    .then(function(data) {
      $scope.tagOptions = {
        availableOptions: data.results,
        selectedOption: data.results[data.results.length - 1]
      }
      return;
    })
    .then(function() {
      return Courses.getCourses();
    })
    .then(function(data) {
      $scope.courseOptions = {
        availableOptions: data.results,
        selectedOption: data.results[data.results.length - 1]
      };
    });

    $scope.addQuestion = function() {
      $scope.question.userId = $window.localStorage.getItem('com.boorish');  // pulls userId from localStorage
      $scope.question.course = $scope.question.course || $scope.courseOptions.selectedOption.name; // pulls selected course
      console.log($scope.question.course);
      $scope.question.tag = $scope.question.tag || $scope.tagOptions.selectedOption.name;  // pulls selected tag
      console.log($scope.question.tag);
      Questions.addQuestion($scope.question).then(function() { // adds new Question with addQuestion factory method
        $location.path('/questions'); // redirects to all questions
      });

    };


    $scope.embedder = function(){
      Questions.embedLink($scope.question.url).then(function(data){
        $scope.question.embedData = data.data;
      });
    }
  }


})