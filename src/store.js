const createStore = reducer => {
  class Store {
    state = undefined;

    constructor(reducer) {
      this.reducer = reducer;
      this.dispatch({ type: null });
    }

    dispatch = action => {
      this.state = this.reducer(this.state, action);
      return this;
    };

    getState = () => this.state;
  }

  return new Store(reducer);
};

export { createStore };
