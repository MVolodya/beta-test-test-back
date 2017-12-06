var Votest = angular.module('Votest', ['ngRoute'])
  .config(function($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: './app/partials/home.html',
      })
      .when('/type', {
        templateUrl: './app/partials/type.html',
        controller: 'Controller'
      })
      .when('/question', {
        templateUrl: './app/partials/question.html',
        controller: 'questionController'
      })
      .when('/poll', {
        templateUrl: './app/partials/poll.html',
        controller: 'pollController'
      })
  });