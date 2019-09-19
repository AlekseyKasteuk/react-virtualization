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
  timeoutId?: number

  constructor (props: IAutoSizerProps) {
    super(props)
    this.state = { width: 0, height: 0 }
  }

  componentDidMount () {
    this.getDivMeasures()
  }

  getDivMeasures = () => {
    this.timeoutId = window.setTimeout(() => {
      const { offsetHeight: height = 0, offsetWidth: width = 0 } = this.ref.current || {}
      if (this.state.height !== height || this.state.width !== width) {
        this.setState({ width, height }, () => this.getDivMeasures())
      } else {
        this.getDivMeasures()
      }
    }, 1000 / 60)
  }

  componentWillUnmount () {
    if (this.timeoutId !== undefined) {
      clearTimeout(this.timeoutId)
    }
  }

  render () {
    const { width, height } = this.state
    return (
      <div {...this.props} ref={this.ref} style={{ width: '100%', height: '100%', padding: 0, margin: 0, border: 'none' }}>
        {!!width && !!height && this.props.children({ width, height })}
      </div>
    )
  }
}