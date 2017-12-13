import Ember from 'ember'; // eslint-disable-line
import DS from 'ember-data'; // eslint-disable-line
import neighborhoodsCrosswalk from '../utils/nabesCrosswalk';
import bbox from 'npm:@turf/bbox' // eslint-disable-line
import centroid from 'npm:@turf/centroid'; // eslint-disable-line
import numeral from 'npm:numeral'; // eslint-disable-line

const acronymCrosswalk = {
  Bronx: 'BX',
  Brooklyn: 'BK',
  Manhattan: 'MN',
  Queens: 'QN',
  'Staten Island': 'SI',
};

export default DS.Model.extend({
  borocd: DS.attr('number'),
  boro: DS.attr('string'),
  borocdAcronym: Ember.computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')];
    const cd = numeral(this.get('cd')).format('00');
    return `${acronym}${cd}`;
  }),
  borocdAcronymLowerCase: Ember.computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')].toLowerCase();
    const cd = numeral(this.get('cd')).format('00');
    return `${acronym}${cd}`;
  }),
  boroAcronym: Ember.computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')];
    return `${acronym}`;
  }),
  boroAcronymLowerCase: Ember.computed('boro', function() {
    const acronym = acronymCrosswalk[this.get('boro')].toLowerCase();
    return `${acronym}`;
  }),
  healthProfileLink: Ember.computed('boro', function() {
    const boroAcronymLowerCase = this.get('boroAcronymLowerCase');
    let cd = this.get('cd');
    if (boroAcronymLowerCase === 'si' || boroAcronymLowerCase === 'qn') {
      cd = numeral(cd).format('00');
    }
    return `https://www1.nyc.gov/assets/doh/downloads/pdf/data/2015chp-${boroAcronymLowerCase}${cd}.pdf`;
  }),
  cd: DS.attr('string'),
  geometry: DS.attr(),
  bounds: Ember.computed('geometry', function() {
    const geometry = this.get('geometry');
    return bbox(geometry);
  }),
  centroid: Ember.computed('geometry', function() {
    const geometry = this.get('geometry');
    return centroid(geometry).geometry.coordinates;
  }),
  neighborhoods: Ember.computed('borocd', function() {
    const borocd = this.get('borocd');
    return neighborhoodsCrosswalk[borocd].join(', ');
  }),
  dataprofile: {},
  name: Ember.computed('boro', 'cd', 'neighborhoods', function() {
    const { boro, cd, neighborhoods } =
      this.getProperties('boro', 'cd', 'neighborhoods');

    return `${boro} ${cd} - ${neighborhoods}`;
  }),
});
