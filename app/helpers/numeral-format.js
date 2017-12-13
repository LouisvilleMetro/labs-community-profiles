import Ember from 'ember'; // eslint-disable-line
import numeral from 'numeral';

export function numeralFormat(params) {
  const [number, template] = params;
  return numeral(number).format(template);
}

export default Ember.Helper.helper(numeralFormat);
