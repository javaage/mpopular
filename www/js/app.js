// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'starter.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })

  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.short', {
        url: '/short',
        views: {
          'menuContent': {
            templateUrl: 'templates/short.html',
            controller: 'ShortCtrl'
          }
        }
      })
      .state('app.action', {
        url: '/action',
        views: {
          'menuContent': {
            templateUrl: 'templates/action.html',
            controller: 'ActionCtrl'
          }
        }
      })
      .state('app.cal', {
        url: '/cal',
        views: {
          'menuContent': {
            templateUrl: 'templates/cal.html',
            controller: 'CalCtrl'
          }
        }
      })
      .state('app.trend', {
        url: '/trend',
        views: {
          'menuContent': {
            templateUrl: 'templates/trend.html',
            controller: 'TrendCtrl'
          }
        }
      })
      .state('app.pref', {
        url: '/pref',
        views: {
          'menuContent': {
            templateUrl: 'templates/pref.html',
            controller: 'PrefCtrl'
          }
        }
      })
      .state('app.holder', {
        url: '/holder',
        views: {
          'menuContent': {
            templateUrl: 'templates/holder.html',
            controller: 'HolderCtrl'
          }
        }
      })
      .state('app.wave', {
        url: '/wave',
        views: {
          'menuContent': {
            templateUrl: 'templates/chart.html',
            controller: 'WaveCtrl'
          }
        }
      })
      .state('app.popular', {
        url: '/popular',
        views: {
          'menuContent': {
            templateUrl: 'templates/popular.html',
            controller: 'PopularCtrl'
          }
        }
      })
      ;
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/short');
  });
