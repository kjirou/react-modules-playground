import React, {Component} from 'react';

export default function filterChangeEventDuringComposition(BaseComponent) {

  return class FilterChangeEventDuringComposition extends Component {
    constructor(props) {
      super(props);
      this.state = {value: props.value};
      this._isComposing = false;
    }

    handleChange = (e, ...args) => {
      if (this._isComposing) {
        this.setState({value: e.target.value});
        return;
      }

      if (this.props.onChange) {
        this.props.onChange(e, ...args);
      }
    };

    handleCompositionStart = (...args) => {
      this._isComposing = true;

      if (this.props.onCompositionStart) {
        this.props.onCompositionStart(...args);
      }
    };

    handleCompositionEnd = (e, ...args) => {
      this._isComposing = false;

      if (this.props.onChange) {
        this.props.onChange(e, ...args);
      }

      if (this.props.onCompositionEnd) {
        this.props.onCompositionEnd(e, ...args);
      }

      this.forceUpdate();
    };

    render() {
      const props = {
        ...this.props,
        value: this._isComposing ? this.state.value : this.props.value,
        onChange: this.handleChange,
        onCompositionStart: this.handleCompositionStart,
        onCompositionEnd: this.handleCompositionEnd,
      };
      return <BaseComponent {...props} />;
    }
  };
}
