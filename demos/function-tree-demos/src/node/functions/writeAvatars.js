'use strict'

function writeAvatars (context) {
  context.input.avatars.forEach((avatar, index) => {
    const writeStream = context.fs.createWriteStream('./out/' + avatar.login)

    context.request(avatar.url).pipe(writeStream)
  })
}

module.exports = writeAvatars
