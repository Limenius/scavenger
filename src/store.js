const createStore = reducer => {
  class Store {
    state = undefined;

    constructor(reducer) {
      this.reducer = reducer;
      this.dispatch = this.dispatch.bind(this);
      this.dispatch({ type: null });
    }

    dispatch(action) {
      if (typeof action === 'function') {
        return action(this.dispatch, this.state);
      } else {
        this.state = this.reducer(this.state, action);
        return this;
      }
    }

    getState = () => this.state;
  }

  return new Store(reducer);
};

export { createStore };
