import { VFC } from 'react'
import { Button } from 'antd'

const PrimaryButton: VFC = () => {
  return (
    <>
      <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
        Primary Button
      </Button>
    </>
  )
}

export default PrimaryButton
