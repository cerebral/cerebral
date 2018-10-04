import uuid from 'uuid'

export const id = {
  create() {
    return uuid.v4()
  },
}
