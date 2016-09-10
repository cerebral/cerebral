function writeAvatars(context) {
  context.input.avatars.forEach((avatar, index) => {
    const writeStream = context.fs.createWriteStream('./' + avatar.login)

    context.request(avatar.url).pipe(writeStream);
  })
}

module.exports = writeAvatars;
