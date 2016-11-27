angular.module('souls').factory(
  'User', ['$resource', $resource => $resource('profile')]);