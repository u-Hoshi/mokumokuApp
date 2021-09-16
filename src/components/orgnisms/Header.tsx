import { Row, Anchor, Menu, Button, Avatar, Dropdown, Col } from 'antd'
import { Typography } from 'antd'
const { Title, Text } = Typography
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

  const onClickRanking = () => {
    history.push(`/ranking`)
  }

  const onClickTitle = () => {
    history.push('/')
  }

  const menu = (
    <Menu style={{ padding: '0' }}>
      <Menu.Item>
        <Button
          ghost
          onClick={onClickRanking}
          style={{
            border: 'none',
            cursor: 'pointer',
            color: 'black',
          }}
        >
          ランキング
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          ghost
          onClick={onClickUserSetting}
          style={{
            border: 'none',
            cursor: 'pointer',
            color: 'black',
          }}
        >
          ユーザ設定
        </Button>
      </Menu.Item>
      <Menu.Item>
        <Button
          ghost
          onClick={() => auth.signOut()}
          style={{
            border: 'none',
            cursor: 'pointer',
            color: 'black',
          }}
        >
          ログアウト
        </Button>
      </Menu.Item>
    </Menu>
  )

  return (
    <>
      <Row
        align="middle"
        style={{
          backgroundColor: '#000224',
          // color: 'white',
          display: 'flex',
          justifyContent: 'space-between',
          padding: '20px 15px',
          marginBottom: '15px',
          cursor: 'pointer',
        }}
      >
        <Title
          level={3}
          onClick={onClickTitle}
          style={{ color: 'white', textAlign: 'center', marginBottom: '0', paddingRight: '10px' }}
        >
          もくもく会アプリ
        </Title>

        {/* </Col> */}
        {/* <Menu style={{ backgroundColor: '#000224', border: 'none' }}>
          <Menu.Item style={{ backgroundColor: '#000224' }}>
            <Avatar src={loginUser?.imgurl} />
          </Menu.Item>
        </Menu> */}

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
