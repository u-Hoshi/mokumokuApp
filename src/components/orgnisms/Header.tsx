import { Row, Anchor, Col, Button } from 'antd'
import { Typography } from 'antd'
const { Title, Text } = Typography
import { VFC, useContext } from 'react'
import { useHistory } from 'react-router'
import { auth } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

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

  return (
    <>
      <Row
        align="middle"
        style={{
          backgroundColor: '#000224',
          color: 'white',
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
        <Button
          ghost
          onClick={onClickRanking}
          style={{
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ランキング
        </Button>
        <Button
          ghost
          onClick={onClickUserSetting}
          style={{
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ユーザ設定
        </Button>
        <Button
          ghost
          onClick={() => auth.signOut()}
          style={{
            border: 'none',
            cursor: 'pointer',
          }}
        >
          ログアウト
        </Button>
        {/* </Col> */}
      </Row>
    </>
  )
}

export default Header
