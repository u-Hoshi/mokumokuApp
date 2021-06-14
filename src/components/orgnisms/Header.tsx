import { Row, Anchor } from 'antd'
import { Typography } from 'antd'
const { Title, Text } = Typography
import { VFC } from 'react'
import { useHistory } from 'react-router'

const Header: VFC = () => {
  const history = useHistory()

  const onClickUserSetting = () => {
    history.push('/usersetting')
  }

  return (
    <>
      <Row
        align="middle"
        style={{ backgroundColor: '#000224', color: 'white', padding: '20px 15px', marginBottom: '15px' }}
      >
        <Title level={3} style={{ color: 'white', textAlign: 'center', marginBottom: '0', paddingRight: '10px' }}>
          もくもく会アプリ
        </Title>
        <Text onClick={onClickUserSetting} style={{ color: 'white', textAlign: 'center', cursor: 'pointer' }}>
          ユーザ設定
        </Text>
      </Row>
    </>
  )
}

export default Header