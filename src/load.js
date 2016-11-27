$(() => {
  // Fetch the user profile
  $.get('profile', (data) => {
    const user = data;
    const { github, google, facebook, twitter } = user;

    $('.lastLogin').text(`Last login ${moment(user.lastLogin).fromNow()}`);

    if (github) {
      $('#connectGithub')
        .addClass('btn-success')
        .removeClass('btn-info')
        .find('span')
        .text('Update');

      $('#disconnectGithub')
        .removeClass('hidden-xs-up');

      $('.githubCard .card-subtitle')
        .text(`Last updated ${moment(github.lastUpdated).fromNow()}.`);

      $('.githubCard .card-text')
        .append(`<span><a href="${github.profileUrl}"><b>${github.username}</b></a></span><br />`)
        .append(`<span>Joined ${moment(github._json.created_at).fromNow()}</span><br />`)
        .append(`<span>${github._json.company}</span><br />`)
        .append(`<span>${github._json.location}</span><br />`)
        .append(`<span>${github._json.total_private_repos + github._json.public_repos} Repositories</span><br />`)
        .append(`<span>${github._json.followers} Followers</span><br />`);
    }

    if (google) {
      $('#connectGoogle')
        .addClass('btn-success')
        .removeClass('btn-info')
        .find('span')
        .text('Update');

      $('#disconnectGoogle')
        .removeClass('hidden-xs-up');

      $('.googleCard .card-subtitle')
        .text(`Last updated ${moment(google.lastUpdated).fromNow()}`);

      $('.googleCard .card-text')
        .append(`<span><a href="${google._json.url}"><b>${google.displayName}</b></a></span><br />`)
        .append(`<span>"${google._json.placesLived[0].value}"</span><br />`)
        .append(`<span>"${google._json.occupation}"</span><br />`)
        .append(`<span>${google._json.aboutMe}</span><br />`);
    }

    if (facebook) {
      $('#connectFacebook')
        .addClass('btn-success')
        .removeClass('btn-info')
        .find('span')
        .text('Update');

      $('#disconnectFacebook')
        .removeClass('hidden-xs-up');

      $('.facebookCard .card-subtitle')
        .text(`Last updated ${moment(facebook.lastUpdated).fromNow()}`);

      $('.facebookCard .card-text')
        .append(`<span><a href="${facebook.profileUrl}"><b>${facebook.displayName}</b></a></span><br />`)
        .append(`<span>${facebook._json.friends.summary.total_count} Friends</span><br />`)
        .append(`<span>${facebook._json.gender}</span><br />`);
    }

    if (twitter) {
      $('#connectTwitter')
        .addClass('btn-success')
        .removeClass('btn-info')
        .find('span')
        .text('Update');

      $('#disconnectTwitter')
        .removeClass('hidden-xs-up');

      $('.twitterCard .card-subtitle')
        .text(`Last updated ${moment(twitter.lastUpdated).fromNow()}`);

      $('.twitterCard .card-text')
        .append(`<span><a href="${twitter._json.url}"><b>@${twitter._json.screen_name} (${twitter._json.name})</b></a></span><br />`)
        .append(`<span>Joined ${moment(twitter._json.created_at).fromNow()}</span><br />`)
        .append(`<span>${twitter._json.statuses_count} Tweets</span><br />`)
        .append(`<span>${twitter._json.followers_count} Followers</span><br />`)
        .append(`<br /><span>${twitter._json.description}</span>`);
    }
  });
});