import { ReactNode, VFC } from 'react'
import { Button } from 'antd'

const PrimaryButton: VFC<{ children: string; style?: { [key: string]: string } }> = (props) => {
  const { children, style } = props
  return (
    <>
      <Button type="primary" htmlType="submit" style={style}>
        {children}
      </Button>
    </>
  )
}

export default PrimaryButton
