import Ember from 'ember'; // eslint-disable-line

export default Ember.Mixin.create({
  activate() {
    this._super();
    window.scrollTo(0, 0);
  },
});
