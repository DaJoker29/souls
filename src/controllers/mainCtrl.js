angular.module('souls').controller(
  'MainController', ['User', 'GitHub', 'moment', function (User, GitHub, moment) {
    const vm = this;

    vm.user = User.get((user) => {
      vm.lastLogin = moment(user.lastLogin).fromNow();

      angular.forEach(user.accounts, (account) => {
        // eslint-disable-next-line no-param-reassign
        account.lastUpdatedStr = moment(account.lastUpdated).fromNow();
        vm[account.provider] = {};
      });

      GitHub.query({ path: 'issues', access_token: vm.user.accounts.github.accessToken }, (issues) => {
        vm.github.issueCount = issues.length;
        vm.github.prCount = issues.filter(issue => !!issue.pull_request).length;
      });
    });
  }]);