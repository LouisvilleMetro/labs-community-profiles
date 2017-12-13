import Ember from 'ember'; // eslint-disable-line

export function addHttp(params) {
  let [url] = params;
  if (!/^(f|ht)tps?:\/\//i.test(url)) {
    url = `http://${url}`;
  }
  return url;
}

export default Ember.Helper.helper(addHttp);
