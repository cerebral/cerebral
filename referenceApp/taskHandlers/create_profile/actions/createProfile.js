const utils = require('../../../../utils/common');

function createProfile(context) {
  const data = context.input.data;

  return {
    profile: {
      joinedDatetime: Date.now(),
      firstName: data.firstName,
      lastName: data.lastName,
      name: `${data.firstName} ${data.lastName}`,
      description: data.description || '',
      email: data.email,
      notificationsKey: utils.hashEmail(data.email),
      points: 0,
      co2: 0,
      showFavouriteTip: true,
      avatarImage: data.avatarImage || null
    }
  };
}

module.exports = createProfile;
