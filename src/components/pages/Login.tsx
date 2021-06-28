import { useContext, useState, VFC } from 'react'
import { useHistory } from 'react-router'
import { auth, db } from '../../firebase/index'
import { Form, Input, Button, Row, Typography, Col } from 'antd'
import PrimaryButton from 'components/atoms/PrimaryButton'
import LoginHeader from 'components/orgnisms/LoginHeader'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const { Title } = Typography

const Login: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
  const { loginUser, setLoginUser } = useContext(LoginUserContext)
  const handleSubmit = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/')
      })
      // 後ほどユーザ名を設定
      .catch((err) => {
        console.log('err' + err)
        alert('ログイン失敗です')
      })
  }

  return (
    <>
      {/* ログイン・サインアップ共通のヘッダーをorgnismsから呼び出す */}
      <LoginHeader />
      <Title level={2} style={{ textAlign: 'center' }}>
        ログイン
      </Title>
      <Row justify="center">
        <Col span={10}>
          <Form onFinish={handleSubmit} style={{ textAlign: 'center' }}>
            <Form.Item
              label="email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item
              label="password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </Form.Item>
            <PrimaryButton style={{ width: '100%' }}>ログイン</PrimaryButton>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Login
