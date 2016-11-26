$(() => {
  // Fetch the user profile
  $.get('profile', (data) => {
    const user = data;
    const { github, google, facebook, twitter } = user;

    if (github) {
      // Disable Link
      $('#connectGithub')
        .addClass('disabled')
        .removeClass('btn-lg')
        .find('span')
        .text('Connected');

      const card = $('<div></div>')
        .addClass('card')
        .append('<div class="card-block"></div>')
        .last('.card-block')
        .append('<h4 class="card-title"><i class="fa fa-github"></i> GitHub</h4>')
        .append(`<h6 class="card-subtitle text-muted">Last updated ${moment(github.lastUpdated).fromNow()}</h6>`)
        .closest('.card')
        .append('<div class="card-block"></div>')
        .last('.card-block')
        .append('<p class="card-text"></p>')
        .last('.card-text')
        .append(`<span><a href="${github.profileUrl}"><b>${github.username}</b></a></span><br />`)
        .append(`<span>${github._json.total_private_repos + github._json.public_repos} Repositories</span><br />`)
        .append(`<span>${github._json.followers} Followers</span><br />`)
        .append(`<span>Joined ${moment(github._json.created_at).fromNow()}</span><br />`);

      $('.card-deck').append(card);
    }

    if (google) {
      $('#connectGoogle')
        .addClass('disabled')
        .removeClass('btn-lg')
        .find('span')
        .text('Connected');
    }

    if (facebook) {
      $('#connectFacebook')
        .addClass('disabled')
        .removeClass('btn-lg')
        .find('span')
        .text('Connected');
    }

    if (twitter) {
      $('#connectTwitter')
        .addClass('disabled')
        .removeClass('btn-lg')
        .find('span')
        .text('Connected');
    }
  });
});