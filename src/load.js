$(() => {
  // Fetch the user profile
  $.get('profile', (data) => {
    const user = data;
    const { github, google, facebook, twitter } = user;

    if (github) {
      $('#connectGithub')
        .addClass('disabled')
        .removeClass('btn-lg')
        .find('span')
        .text('Connected');
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