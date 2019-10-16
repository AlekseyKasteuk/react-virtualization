import * as React from 'react'

interface IAutoSizerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.FunctionComponent<{ width: number, height: number }>
}

interface IAutoSizerState {
  width: number,
  height: number,
}

export default class AutoSizer extends React.PureComponent<IAutoSizerProps, IAutoSizerState> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()
  private _timeout: number = null
  state = { width: 0, height: 0 }

  componentDidMount () {
    this._getSize()
  }

  private _timeoutHandler = () => {
    this._timeout = window.setTimeout(() => this._getSize(), 1000 / 60)
  }

  private _getSize = () => {
    const { offsetHeight: height = 0, offsetWidth: width = 0 } = this.ref.current
    if (this.state.height !== height || this.state.width !== width) {
      this.setState({ width, height }, () => this._timeoutHandler())
    } else {
      this._timeoutHandler()
    }
    
  }

  componentWillUnmount () {
    if (this._timeout !== null) {
      clearTimeout(this._timeout)
    }
  }

  render () {
    const { width, height } = this.state
    return (
      <div
        {...this.props}
        ref={this.ref}
        style={{ width: '100%', height: '100%', padding: 0, margin: 0, border: 'none' }}
      >
        {!!width && !!height && this.props.children({ width, height })}
      </div>
    )
  }
}