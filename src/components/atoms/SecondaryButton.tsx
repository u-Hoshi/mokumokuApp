import { Button } from 'antd'
import { VFC } from 'react'
import { MouseEventHandler } from 'react-router/node_modules/@types/react'

const SecondaryButton: VFC<{
  children: string
  style?: { [key: string]: string }
  onClick: () => void
}> = (props) => {
  const { children, style, onClick } = props
  return (
    <>
      <Button type="primary" danger htmlType="submit" style={style} onClick={() => onClick()}>
        {children}
      </Button>
    </>
  )
}

export default SecondaryButton
