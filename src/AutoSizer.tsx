import * as React from 'react'

interface AutoSizerProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.FunctionComponent<{ width: number, height: number }>
}

interface AutoSizerState {
  width: number,
  height: number,
}

export default class AutoSizer extends React.PureComponent<AutoSizerProps, AutoSizerState> {
  ref: React.RefObject<HTMLDivElement> = React.createRef()
  timeoutId: number = null

  constructor (props: AutoSizerProps) {
    super(props)
    this.state = { width: 0, height: 0 }
  }

  componentDidMount () {
    this.getDivMeasures()
  }

  getDivMeasures = () => {
    this.timeoutId = setTimeout(() => {
      const { offsetHeight: height, offsetWidth: width } = this.ref.current
      if (this.state.height !== height || this.state.width !== width) {
        this.setState({ width, height }, () => this.getDivMeasures())
      } else {
        this.getDivMeasures()
      }
    }, 1000 / 60)
  }

  componentWillUnmount () {
    if (this.timeoutId !== null) {
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