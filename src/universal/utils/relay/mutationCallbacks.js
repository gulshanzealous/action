export function clearError() {
  if (this.state.error) {
    this.setState({
      error: null
    });
  }
}

export function setError({_error}) {
  this.setState({
    error: _error
  });
}
