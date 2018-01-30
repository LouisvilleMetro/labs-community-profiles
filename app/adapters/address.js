import DS from 'ember-data';

const geoSearchAPI = 'https://geosearch.planninglabs.nyc/v1/autocomplete?text=';

export default DS.JSONAPIAdapter.extend({
  keyForAttribute(key) {
    return key;
  },
  buildURL(modelName, id, snapshot, requestType, query) {
    const url = `${geoSearchAPI}${query}`;
    return url;
  },
});
