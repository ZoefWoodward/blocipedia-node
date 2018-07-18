module.exports = class ApplicationPolicy {

    constructor(user, record) {
      this.user = user;
      this.record = record;
    }
  
    _isOwner() {
      return this.record && (this.record.userId == this.user.id);
    }
  
    _isAdmin() {
      return this.user && this.user.role == "admin";
    }

    _isMember() {
        return this.user && this.user.role == "member";
    }
  
    _isStandard() {
        return this.user && this.user.role == "standard";
    }

    _isPremium() {
        return this.user && this.user.role == "premium";
    }

    new() {
      return this.user != null;
    }
  
    create() {
      return this.new();
    }
  
    show() {
      return true;
    }
  
    edit() {
        return this.new() &&
        this.record && (this._isStandard() || this.isPremium() || this._isAdmin());
    }
  
    update() {
      return this.edit();
    }
  
    destroy() {
      return this.update();
    }
  }