import { DataHandler } from '../src/ReactDashboard'
import { find, min, max, mean, isArray } from 'lodash';

let customDataHandlers = {
  getClimateMetric: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let data = dashboardData.climateData;
    let output;

    if (isArray(data) && data.length > 0) {
      if (handler.field === 'TMIN') {
        output = data.map(r => { return r.TMIN });
        return [min(output)]
      }
      
      if (handler.field === 'TMAX') {
        output = data.map(r => { return r.TMAX });
        return [max(output)]
      }

      if (handler.field === 'TAVG') {
        output = data.map(r => { return parseInt(r.TAVG) });
        return [mean(output).toPrecision(4)];
        let n = mean(output).toPrecision(4);
        return [n];
      }
    }
    
    return ["..."];
  },

  // @@TODO clean up NAN values
  getMapData: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let field = 'PHDI';
    let NaNRows = {};
    let _data = dashboardData.climateData;
    let mapped;
    
    if (_data && _data.length > 0) {
      mapped = _data.map(row => {
        
        Object.keys(row).forEach((k) => {
          row[k] = Number(row[k]);
          if (row[k] === -99.99 )  row[k] = 0; // not sure the cause of this but ain't got time to sort it out
        });

        // assign label from stateArray to row, based on matching id
        let state = find(handler.stateArray, r => {
         return ( r.value === row.StateCode ) 
        });

        if (state) {
          row.name = state.label;
        }
        
        return row;
      });
    }

    return mapped;
  },

  // start dataHandler example
  /**
   * Extract indicator values from dashboard data
   */
  getBarChartData: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    let indicators = handler.indicators;
    let colors = handler.colors;
    let data = dashboardData.climateData || [];
    let series = indicators.map((ind, i) => {
      let values = data.map(row => {
        return {
          x: row['YearMonth'],
          y: row[ind]
        }
      }).filter(row => {
        return (!isNaN(row.y) && row.y > -10 && row.y < 10);
      });
      return {key: ind, values: data, color: colors[i]}
    });

    return series;
  },
  // end dataHandler example

  getTableData: function (componentData, dashboardData, handler, e, appliedFilters, pipelineData) {
    if (dashboardData.climateData) {
      return dashboardData.climateData;
    }
  }
}

for (let k in customDataHandlers) {
  DataHandler.set(k, customDataHandlers[k]);
}

/**
 * Helpers
 **/
let _inYear = function (row, years) {
  let y = row.YearMonth.toString().substring(0,4);
  return (years.indexOf(y) >= 0);
}

let _inState = function (row, states) {
  return (states.indexOf(row.StateCode) >= 0);
}

export default customDataHandlers;
