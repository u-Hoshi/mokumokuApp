import { ReactNode, VFC } from 'react'
import { Button } from 'antd'

const PrimaryButton: VFC<{ children: string }> = (props) => {
  const { children } = props
  return (
    <>
      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
        {children}
      </Button>
    </>
  )
}

export default PrimaryButton
