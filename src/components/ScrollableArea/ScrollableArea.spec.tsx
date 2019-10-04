import * as React from 'react'
import { shallow } from 'enzyme'

import ScrollableArea from './ScrollableArea'

describe('ScrollableArea', () => {
  it('Rendering', () => {
    let scrollLeft: number = 0
    let scrollTop: number = 0
    const onScroll: (props: { scrollLeft: number, scrollTop: number }, event: React.SyntheticEvent) => void = (props, event) => {
      scrollLeft = props.scrollLeft
      scrollTop = props.scrollTop
    }
    const content = shallow(
      <ScrollableArea
        width={100}
        height={100}
        fullWidth={200}
        fullHeight={200}
        scrollLeft={scrollLeft}
        scrollTop={scrollTop}
        onScroll={onScroll}
      >
        <h1>Test</h1>
      </ScrollableArea>
    )
    const scrollArea = content.find('[role="scroll-area"]')
    scrollArea.simulate('scroll', { currentTarget: { scrollTop: 50, scrollLeft } })
    scrollArea.simulate('scroll', { currentTarget: { scrollLeft: 50, scrollTop } })
    expect(scrollTop).toEqual(50)
    expect(scrollLeft).toEqual(50)
    expect(content.contains(<h1>Test</h1>)).toBeTruthy()
  })
})
