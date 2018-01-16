import React, {Component} from 'react';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Select from 'react-select';

import filterChangeEventDuringComposition from './lib/filterChangeEventDuringComposition';

import 'react-select/dist/react-select.css'
import './App.css';


const Food = ({connectDragSource, foodName}) => {
  return connectDragSource(
    <li>{foodName}</li>
  );
};
const DraggableFood = DragSource(
  'Food',
  {
   beginDrag: (props) => {
    return {
      foodName: props.foodName,
    };
   },
   endDrag: (props, monitor, component) => {
    if (!monitor.didDrop()) {
      return;
    }
    // TODO: 落としたところにドラッグした要素を挿入したいんだけどできてない
    //       「ドラッグした要素の情報」はわかるけど、「どこに落としたのか」がわからない
    console.log(monitor.getDropResult(), monitor.getItem());
   }
  },
  (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
    };
  }
)(Food);
const FoodList = ({connectDropTarget, foodNames}) => {
  return connectDropTarget(
    <ul>
    {
      foodNames.map((foodName, index) => {
        return <DraggableFood key={index} foodName={foodName} />;
      })
    }
    </ul>
  );
};
const DroppableFoodList = DropTarget(
  ['Food'],
  {
    drop(props, monitor, component) {
      return {
        targetProps: props,
      };
    },
  },
  (connect, monitor) => {
    return {
      connectDropTarget: connect.dropTarget(),
    };
  }
)(FoodList);

class DndSection extends Component {
  render() {
    return <div>
      <DroppableFoodList foodNames={['Apple', 'Orange', 'Grape']} />
    </div>;
  }
}
const DndSection2 = DragDropContext(HTML5Backend)(DndSection);


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
        <h2>react-dnd</h2>

        <h2>react-select</h2>
        <DndSection2 />

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
