angular.module('souls').controller(
  'MainController', function (User, moment) {
    const vm = this;

    vm.user = User.get((user) => {
      vm.lastLogin = moment(user.lastLogin).fromNow();

      angular.forEach(user.accounts, (account) => {
        // eslint-disable-next-line no-param-reassign
        account.lastUpdatedStr = moment(account.lastUpdated).fromNow();
      });
    });
  });