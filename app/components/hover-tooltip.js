import Ember from 'ember'; // eslint-disable-line

export default Ember.Component.extend({
  'tooltip-text': '',
  mouse: null,
  style: Ember.computed('mouse', function() {
    const mouse = this.get('mouse');
    return Ember.String.htmlSafe(`top: ${mouse.y}px;
                                  left: ${mouse.x - 20}px;`);
  }),
});
