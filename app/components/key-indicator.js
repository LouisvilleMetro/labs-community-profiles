import Ember from 'ember'; // eslint-disable-line
import d3 from 'd3'; // eslint-disable-line

const { computed } = Ember;

export default Ember.Component.extend({
  borocd: '',
  column: '',
  data: [],
  unit: '',
  numeral_format: '0.0',

  sortedData: computed('data', 'borocd', function() {
    const borocd = this.get('borocd');
    return this.get('data').then(data => data.sortBy(`${this.get('column')}`).reverse().map((d) => {
      d.is_selected = (borocd === d.borocd); // eslint-disable-line
      return d;
    }));
  }),
});
