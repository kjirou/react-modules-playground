import React, { Component } from 'react';
import Select from 'react-select';

import 'react-select/dist/react-select.css'
import './App.css';


class App extends Component {
  render() {
    return (
      <div className="App">

        <h2>react-select</h2>

        <h3>Basic</h3>
        <div style={{width: 200}}>
          <Select
            name="rs-foo"
            value="one"
            options={
              [
                { value: 'one', label: 'One' },
                { value: 'two', label: 'Two', disabled: true },
                { value: 'three', label: 'Three' },
              ]
            }
            onChange={
              (val) => {
                console.log("onChange: " + JSON.stringify(val));
              }
            }
            // 絞り込みフォームの "One" をクリックしたときのイベントハンドラ
            onValueClick={
              (val) => {
                console.log("onValueClick: " + JSON.stringify(val));
              }
            }
          />
        </div>

      </div>
    );
  }
}

export default App;
