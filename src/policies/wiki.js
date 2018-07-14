const ApplicationPolicy = require("./application");

module.exports = class TopicPolicy extends ApplicationPolicy {

  new() {
    return this._isMember() || this._isAdmin();
    
  }

  create() {
    return this.new();
  }

  edit() {
    return this.new() &&
    this.record && (this._isOwner() || this._isAdmin());
  }

  update() {
    return this.edit();
  }

  destroy() {
    return this.update();
  }
}