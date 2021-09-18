import { Row, Menu, Avatar, Dropdown, Col } from 'antd'
import { Typography } from 'antd'
const { Title } = Typography
import { VFC, useContext } from 'react'
import { useHistory } from 'react-router-dom'
import { auth } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import { DownOutlined, CaretDownOutlined } from '@ant-design/icons'

const Header: VFC = () => {
  const { loginUser } = useContext(LoginUserContext)
  const history = useHistory()

  const onClickUserSetting = () => {
    history.push(`/usersetting/${loginUser.uid}`)
  }

  const onClickUserProfile = () => {
    history.push(`/userprofile/${loginUser.uid}`)
  }

  const onClickRanking = () => {
    history.push(`/ranking`)
  }

  const onClickTitle = () => {
    history.push('/')
  }

  const menu = (
    <Menu style={{ padding: '0' }}>
      <Menu.Item key="ranking" onClick={onClickRanking} style={{ padding: '12px', width: '150px' }}>
        ランキング
      </Menu.Item>
      <Menu.Item onClick={onClickUserProfile} style={{ padding: '12px', width: '150px' }}>
        プロフィールを確認
      </Menu.Item>
      <Menu.Item onClick={onClickUserSetting} style={{ padding: '12px', width: '150px' }}>
        ユーザ設定
      </Menu.Item>
      <Menu.Item onClick={() => auth.signOut()} style={{ padding: '12px', width: '150px' }}>
        ログアウト
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Row
        align="middle"
        style={{
          backgroundColor: '#000224',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px 15px',
          marginBottom: '15px',
        }}
      >
        <Title
          level={3}
          onClick={onClickTitle}
          style={{ color: 'white', cursor: 'pointer', textAlign: 'center', marginBottom: '0', paddingRight: '10px' }}
        >
          モクスケ
        </Title>
        <Dropdown overlay={menu} placement="bottomLeft">
          <Col>
            <Avatar src={loginUser?.imgurl} />
            <CaretDownOutlined style={{ color: 'white', paddingLeft: '6px' }} />
          </Col>
        </Dropdown>
      </Row>
    </>
  )
}

export default Header
