angular.module('souls').factory(
  'GitHub', ['$resource', $resource => $resource('https://api.github.com/:path', null)]);