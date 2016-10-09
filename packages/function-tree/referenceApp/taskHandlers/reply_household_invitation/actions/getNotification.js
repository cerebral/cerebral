function getNotification(context) {
  const notificationsKey = context.input.profile.notificationsKey;
  const notificationKey = context.input.data.notificationKey;

  return context.firebase.value(`notifications/${notificationsKey}/${notificationKey}`)
    .then((result) => context.path.success({notification: result.value}))
    .catch((error) => context.path.error({error}));
}

module.exports = getNotification;
