$(() => {
  // Fetch the user profile
  $.get('profile', (data) => {
    const user = data;
    const { github, google, facebook, twitter } = user;

    if (github) {
      $('#connectGithub')
        .addClass('btn-success')
        .removeClass('btn-info')
        .find('span')
        .text('Update');

      $('#disconnectGithub')
        .removeClass('hidden-xs-up');

      $('.card-columns')
        .append('<div class="card"></div>')
        .find('.card:last-child')
        .addClass('card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .append('<h4 class="card-title"><i class="fa fa-github"></i> GitHub</h4>')
        .append(`<h6 class="card-subtitle text-muted">Last updated ${moment(github.lastUpdated).fromNow()}</h6>`)
        .closest('.card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .last()
        .append('<p class="card-text"></p>')
        .find('.card-text')
        .append(`<span><a href="${github.profileUrl}"><b>${github.username}</b></a></span><br />`)
        .append(`<span>${github._json.total_private_repos + github._json.public_repos} Repositories</span><br />`)
        .append(`<span>${github._json.followers} Followers</span><br />`)
        .append(`<span>Joined ${moment(github._json.created_at).fromNow()}</span><br />`);
    }

    if (google) {
      $('#connectGoogle')
        .addClass('btn-success')
        .removeClass('btn-info')
        .find('span')
        .text('Update');

      $('#disconnectGoogle')
        .removeClass('hidden-xs-up');

      $('.card-columns')
        .append('<div class="card"></div>')
        .find('.card:last-child')
        .addClass('card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .append('<h4 class="card-title"><i class="fa fa-google"></i> Google</h4>')
        .append(`<h6 class="card-subtitle text-muted">Last updated ${moment(google.lastUpdated).fromNow()}</h6>`)
        .closest('.card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .last()
        .append('<p class="card-text"></p>')
        .find('.card-text')
        .append(`<span><a href="${google._json.url}"><b>${google.displayName}</b></a></span><br />`)
        .append(`<span>"${google._json.tagline}"</span><br />`)
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

      $('.card-columns')
        .append('<div class="card"></div>')
        .find('.card:last-child')
        .addClass('card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .append('<h4 class="card-title"><i class="fa fa-facebook"></i> Facebook</h4>')
        .append(`<h6 class="card-subtitle text-muted">Last updated ${moment(facebook.lastUpdated).fromNow()}</h6>`)
        .closest('.card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .last()
        .append('<p class="card-text"></p>')
        .find('.card-text')
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

      $('.card-columns')
        .append('<div class="card"></div>')
        .find('.card:last-child')
        .addClass('card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .append('<h4 class="card-title"><i class="fa fa-twitter"></i> Twitter</h4>')
        .append(`<h6 class="card-subtitle text-muted">Last updated ${moment(twitter.lastUpdated).fromNow()}</h6>`)
        .closest('.card')
        .append('<div class="card-block"></div>')
        .find('.card-block')
        .last()
        .append('<p class="card-text"></p>')
        .find('.card-text')
        .append(`<span><a href="${twitter._json.url}"><b>@${twitter._json.screen_name} (${twitter._json.name})</b></a></span><br />`)
        .append(`<span>${twitter._json.description} Tweets</span><br />`)
        .append(`<span>${twitter._json.statuses_count} Tweets</span><br />`)
        .append(`<span>${twitter._json.followers_count} Followers</span><br />`)
        .append(`<span>Joined ${moment(twitter._json.created_at).fromNow()}</span><br />`);
    }
  });
});