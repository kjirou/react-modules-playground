import React, { Component } from 'react';
import Select from 'react-select';

import filterChangeEventDuringComposition from './lib/filterChangeEventDuringComposition';

import 'react-select/dist/react-select.css'
import './App.css';


class App extends Component {
  constructor() {
    super();

    this.state = {
      selectedValue: 'one',
    };
  }

  render() {
    const FilteredInput = filterChangeEventDuringComposition('input');


    return (
      <div className="App">

        <h2>react-select</h2>

        <h3>Basic</h3>
        <div style={{width: 200}}>
          <Select
            name="rs-foo"
            value={this.state.selectedValue}
            options={
              [
                { value: 'one', label: 'One' },
                { value: 'two', label: 'Two', disabled: true },
                { value: 'three', label: 'Three' },
                { value: 'four', label: 'よん' },
                { value: 'five', label: 'ご' },
                { value: 'six', label: 'ろく' },
              ]
            }
            onChange={
              (selectedValueOrValues) => {
                console.log("onChange: " + JSON.stringify(selectedValueOrValues));

                this.setState({
                  selectedValue: selectedValueOrValues.value,
                });
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


        <h2>HoC test</h2>
        <div>
          <FilteredInput
            onChange={
              (event) => {
                console.log('Wrapper:', event.target.value);
              }
            }
          />
        </div>

      </div>
    );
  }
}

export default App;
