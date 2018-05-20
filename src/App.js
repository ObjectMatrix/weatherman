import React from 'react';
import { Component } from 'react';
import fetch from 'node-fetch';
import './App.css';
import Plot from 'react-plotly.js';

let  Button = function(props) {
  return (
    <button onClick={props.onClick}>{ props.text }</button>
  );
}

class App extends Component {

  constructor() {
    super();
    this.state = {
      place:'Boston, USA',
      data: {},
      dates:[],
      temps:[]
    }

    this.changePlace = this.changePlace.bind(this);
    this.fetchData = this.fetchData.bind(this);
    this.plotData = this.plotData.bind(this);
    this.fetchURL = this.fetchURL.bind(this);
  }

fetchURL = (location) => {
  const urlPrefix = 'http://api.openweathermap.org/data/2.5/forecast?q=';
  const API_KEY ='b1c468432c6770a36c29bd5484a787c2';
  const urlSuffix = '&APPID=' + API_KEY + '&units=metric';
  const url = urlPrefix + location + urlSuffix;

  fetch(url)
          .then(r => r.json())
          .then((json) => {
          console.log('json', json);
          let body = json;
          let list = body.list;
          let dates = [];
          let temps = [];
          
          for (var i = 0; i < list.length; i++) {
            dates.push(list[i].dt_txt);
            let f = (list[i].main.temp * 9/5 )+ 32;
            f = f.toFixed(2);
            temps.push(f);
          }

          this.setState({ 
              data: body,
              dates: dates,
              temps: temps             
          })
          }).catch((err) => {
            // console.log(e);
          });
}

  fetchData = (evt) => {
    evt.preventDefault();
      let location = encodeURIComponent(this.state.place);
      this.fetchURL(location);
    };
  
  changePlace = (evt) => {
    this.setState({
      place: evt.target.value
    });
  };

  plotData = () => {
    
    let data = 
      [{
        x: this.state.dates,
        y: this.state.temps,
        type: 'scatter',
        mode: 'lines+points',
        marker: {color: 'green'},
      },
      { 
        type: 'bar', 
        x: this.state.dates, 
        y: this.state.temps 
      }];
  };
  componentDidMount() {
    this.fetchURL('Boston, USA');
    this.plotData();
  }
  render() {
    let currentTemp = 0;
    let tMax =0;
    let tMin = 0;
    let humidity = 0;

    if (this.state.data.list) {
      tMax = this.state.data.list[0].main.temp_max;
      tMax = (tMax * 9/5) + 32;
      tMax = tMax.toFixed(2);
      tMin = this.state.data.list[0].main.temp_min;
      tMin = (tMin * 9/5) + 32;
      tMin = tMin.toFixed(2);
      humidity = this.state.data.list[0].main.humidity;
    }
    if (this.state.data.list) {
      currentTemp = this.state.data.list[0].main.temp;
      currentTemp = currentTemp * 9/5 + 32;
      currentTemp = currentTemp.toFixed(2);
    }
    return (
      
      <div className="App">
      <div>
            <input
            value={this.state.place}  
            placeholder={"City, Country"} 
            onChange={this.changePlace }
            type="text" 
            />
            <Button text="Fetch" onClick={this.fetchData} />
        </div>

        <p className="temp-wrapper">
          <span className="temp">{ currentTemp}</span>
          <span className="temp-symbol">°F</span>

        <p className="desc">
          Max Temp: {tMax}F  Min: {tMin}F  humidity: {humidity}%
        </p>

        </p>


        <div>
        <Plot
        data={[
          {
            x: this.state.dates,
            y: this.state.temps,
            type: 'scatter',
            mode: 'lines+points',
            marker: {color: 'green'},
          },
          { type: 'bar', x: this.state.dates, y: this.state.temps },
        ]}
        layout={ {width: 620, height: 440, title: 'Weatherman'} }
      />
      </div>
      </div>
    );
  }
}

export default App;
