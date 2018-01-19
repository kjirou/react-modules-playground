import React, {Component} from 'react';
import {DragDropContext, DragSource, DropTarget} from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import Select from 'react-select';
import {compose} from 'recompose';

import filterChangeEventDuringComposition from './lib/filterChangeEventDuringComposition';

import 'react-select/dist/react-select.css'
import './App.css';


const Food = ({foodName}) => {
  return <span>{foodName}</span>
};

const FoodRow = (props) => {
  const {
    connectDragSource,
    connectDropTarget,
    foodName,
    isDragging,
    showTopLine = false,
    showBottomLine = false,
  } = props;

  const styles = {
    marginTop: 3,
    width: 200,
    backgroundColor: isDragging ? 'green' : 'lime',
  };
  if (showTopLine) {
    styles.borderTop = '5px solid blue';
  }
  if (showBottomLine) {
    styles.borderBottom = '5px solid blue';
  }

  return connectDropTarget(
    connectDragSource(
      <li style={styles}><Food foodName={foodName} /></li>
    )
  );
};

const DndableFoodRow = compose(
  DragSource(
    'Food',
    // spec 引数
    // Drag Source Specification
    // http://react-dnd.github.io/react-dnd/docs-drag-source.html#drag-source-specification
    {
      // ドラッグ直後に実行される
      //
      // 描画時の props から、「ドラッグ中のこの要素の props」を定義する。
      // 例えば、monitor.getItem() などで取得できる値である。
      //
      // この前に DropTarget でコンポーネントをフィルタしている場合は、
      // props にそのプロパティも含まれている。
      beginDrag: (props) => {
        console.log('DragSource::spec::beginDrag(props)', props);

        return {
          _beginDragComment: 'beginDragを通った',
          foodName: props.foodName,
        };
      },
      // ドラッグ終了直後に実行される
      //
      // 第一引数の props は beginDrag と同じっぽい、つまり描画時の props 。
      endDrag: (props, monitor, component) => {
        console.log('DragSource::spec::endDrag(props, monitor, component)', props, monitor, component, {
          // Droppable な場所にドロップされたら true、それ以外は false
          'monitor.didDrop()': monitor.didDrop(),
          // beginDrag でフィルタされたプロパティ群を返す
          'monitor.getItem()': monitor.getItem(),
        });
      }
    },
    // collect 引数
    (connect, monitor) => {
      return {
        connectDragSource: connect.dragSource(),
        isDragging: monitor.isDragging(),
      };
    }
  ),
  DropTarget(
    'Food',
    // spec 引数
    {
      drop(props, monitor, component) {
        console.log('DropTarget::spec::drop(props, monitor, component)', props, monitor, component);

        return {
          targetProps: props,
          _dropComment: 'dropを通った',
        };
      },
      hover(props, monitor, component) {
        console.log('DropTarget::spec::hover(props, monitor, component)', props, monitor, component);
      },
    },
    // collect 引数
    (connect, monitor) => {
      return {
        connectDropTarget: connect.dropTarget(),
      };
    }
  )
)(FoodRow);

class DndSection_ extends Component {
  constructor() {
    super();
    this.state = {
      foodNames: ['Apple', 'Orange', 'Grape'],
    };
  }

  render() {
    return (
      <ul>
      {
        this.state.foodNames.map((foodName, index) => {
          return <DndableFoodRow key={index} foodName={foodName} />;
        })
      }
      </ul>
    );
  }
}
const DndSection = DragDropContext(HTML5Backend)(DndSection_);


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
        <DndSection />

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
