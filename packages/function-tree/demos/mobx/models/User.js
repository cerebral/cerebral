class User {
  constructor(data) {
    this.id = data.id;
    this.name = data.name;
  }
  toJS() {
    return {
      id: this.id,
      name: this.name
    };
  }
}

export default User;
