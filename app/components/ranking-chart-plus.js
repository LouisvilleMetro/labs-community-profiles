import Ember from 'ember';
import RankingChart from '../components/ranking-chart';
import carto from '../utils/carto';

export default RankingChart.extend({
  overlayColumn: '',
  didInsertElement() {
    this._super(...arguments);
    let svg = this.get('svg');
    let curr = svg.append('g')
      .attr('class', 'curr');
    this.set('curr', curr);
  },

  colors: {
    gray: '#dddddd',
    web_safe_orange: '#a24c0e',
    dcp_orange: '#de7d2c',
  },

  tooltip(d, current) {
    const selected = current || d;
    const { column, overlayColumn } = this.getProperties('column', 'overlayColumn');
    const denominator = selected[column];
    const numerator = selected[overlayColumn];
    const percent = this.get('percent');
    return `${selected.boro_district}: <strong>${percent(numerator / denominator * 100)}%</strong> <span class='moe-text'>of ${this.get('unit') || 'buildings'} are in floodplain</span>`;
  },

  drawChart(el, data) {
    this._super(...arguments);
    const bars = this.get('curr');
    const { x, y, colors, height, overlayColumn } =
      this.getProperties('x', 'y', 'colors', 'height', 'overlayColumn');
    const theseBars = bars
      .selectAll('.curr')
      .data(data, function (d) {
        return d.borocd;
      });

    theseBars
      .attr('fill', '#60acbf')
      .attr('width', () => x.bandwidth() - 2)
      .attr('x', d => x(d.borocd));

    theseBars.enter()
      .append('rect')
      .attr('class', (d, i) => `bar bar-${d.borocd} bar-index-${i}`)
      .attr('fill', '#60acbf')
      .attr('style', 'pointer-events: none;')
      .attr('y', d => height - y(d[overlayColumn]))
      .attr('width', d => x.bandwidth() - 2)
      .attr('x', d => x(d.borocd))
      .attr('height', d => y(d[overlayColumn]));
  },
  sql: Ember.computed('borocd', function() {
    const { column, overlayColumn } =
      this.getProperties('column', 'overlayColumn');

    return `SELECT ${column}, ${overlayColumn || 1},
      CASE
        WHEN LEFT(borocd::text, 1) = '1' THEN 'Manhattan ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '2' THEN 'Bronx ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '3' THEN 'Brooklyn ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '4' THEN 'Queens ' || borocd %25 100
        WHEN LEFT(borocd::text, 1) = '5' THEN 'Staten Island ' || borocd %25 100
      END as boro_district,
      borocd
      FROM community_district_profiles`;
  }),
  data: Ember.computed('sql', function() {
    const sql = this.get('sql');
    const borocd = this.get('borocd');
    return carto.SQL(sql, 'json').then(data => {
      return data.sortBy(this.get('overlayColumn')).reverse().map(d => {
        d.is_selected = (borocd === d.borocd) ? true : false;
        return d;
      });
    });
  }),
});
