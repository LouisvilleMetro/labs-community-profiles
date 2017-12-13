import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  didRender() {
    $(this.element).foundation();
  },
});
