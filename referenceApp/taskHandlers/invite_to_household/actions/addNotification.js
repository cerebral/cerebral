function addNotification(context) {
  const data = context.input.data;
  const notification = context.input.notification;
  const emailKey = data.emailKey;
  const notificationKey = data.notificationKey;

  return context.firebase.set(`notifications/${emailKey}/${notificationKey}`, notification)
    .then(context.path.success)
    .catch(context.path.error);
}

module.exports = addNotification;
