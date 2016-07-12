import React, { Component } from 'react';
import Registry from '../utils/Registry';
import BaseComponent from './BaseComponent';
import Card from './Card';

export default class Dashboard extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {data: []};
  }

  componentDidMount() {
    this.setState({q: this.props.location.query});
  }
  /**
   * Recursively parse settings tree, rendering components
   * and children
   **/
  walkSettingsTree() {
    // recurse tree
    // render children
  }
  
  render() {
    let markup;
    let props = Object.assign({globalData: this.state.data || [], q: this.state.q}, this.props.route || this.props);
    if (props.layout) {
      let layout = (typeof this.props.layout === 'String') ? Registry.get(this.props.layout) : this.props.layout;
      return (
        <div className="container">
          <h1 className="dashboard-title">{this.props.title}</h1>
          {React.createElement(layout, props)}
        </div>
      );
    } 
    
    return (
        <div className="container">
          <h1 className="dashboard-title">{this.props.title}</h1>
          {props.components.map((element, key) => { 
            return (
              <Card key={key} {...element}>
                {React.createElement(Registry.get(element.type), Object.assign(props.components[key], {q: this.props.location.query}))}
              </Card>
            )
          })}
        </div>
    );
  }
}
