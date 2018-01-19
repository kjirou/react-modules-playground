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
    showBottomLine = false,
    showTopLine = false,
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
          // DropTarget::spec::drop で返している値がとれる、なお drop だと null
          'monitor.getDropResult()': monitor.getDropResult(),
          // beginDrag でフィルタされたプロパティ群を返す
          'monitor.getItem()': monitor.getItem(),
        });

        // 他の FoodRow の上でないところにドロップしたら一番下に入るようにする
        const toFoodName = monitor.didDrop() ? monitor.getDropResult().foodName : null;
        props.onEndDrag(props.foodName, toFoodName);
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
      // DragSource::spec::endDrag より先に発火し、そこで使うための monitor.getDropResult() を設定できる
      // 他にも仕事があるのかもだけどわからない
      drop(props, monitor, component) {
        console.log('DropTarget::spec::drop(props, monitor, component)', props, monitor, component, {
          // null になってる、なお endDrag だと値がある
          'monitor.getDropResult()': monitor.getDropResult(),
          'monitor.getItem()': monitor.getItem(),
        });

        return {
          _dropComment: 'dropを通った',
          foodName: props.foodName,
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

  // destinationFoodName = moverFoodName がその位置に入り、もともとの foodName は一つ下がる
  //                       null の場合は末尾に入る
  _sortFoods(moverFoodName, destinationFoodName) {
    const moverFoodNameIndex = this.state.foodNames.indexOf(moverFoodName);
    let destinationFoodNameIndex = this.state.foodNames.indexOf(destinationFoodName);
    if (destinationFoodNameIndex === -1) {
      destinationFoodNameIndex = this.state.foodNames.length;
    }

    const newFoodNames = this.state.foodNames.slice();
    if (destinationFoodNameIndex < moverFoodNameIndex) {
      newFoodNames.splice(moverFoodNameIndex, 1);
      newFoodNames.splice(destinationFoodNameIndex, 0, moverFoodName);
    } else if (destinationFoodNameIndex > moverFoodNameIndex) {
      newFoodNames.splice(destinationFoodNameIndex, 0, moverFoodName);
      newFoodNames.splice(moverFoodNameIndex, 1);
    }

    this.setState({
      foodNames: newFoodNames,
    });
  }

  render() {
    const onEndDrag = (fromFoodName, toFoodName) => {
      this._sortFoods(fromFoodName, toFoodName);
    };

    return (
      <ul>
      {
        this.state.foodNames.map((foodName, index) => {
          return <DndableFoodRow key={index} foodName={foodName} onEndDrag={onEndDrag} />;
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
