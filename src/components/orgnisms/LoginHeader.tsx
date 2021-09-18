import { Row } from 'antd'
import { Typography } from 'antd'
const { Title } = Typography
import { VFC } from 'react'

const LoginHeader: VFC = () => {
  return (
    <>
      <Row
        align="middle"
        justify="center"
        style={{ backgroundColor: '#000224', color: 'white', padding: '4px 3px', marginBottom: '15px' }}
      >
        <Title
          level={3}
          style={{
            color: 'white',
            textAlign: 'center',
            marginBottom: '0',
            paddingRight: '10px',
          }}
        >
          もくもく会アプリ
        </Title>
      </Row>
    </>
  )
}

export default LoginHeader
