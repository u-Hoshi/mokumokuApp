import { useContext, useState, VFC, ChangeEventHandler } from 'react'
import { useHistory } from 'react-router'
import { auth, db } from '../../firebase/index'
import { Form, Input, Button, Row, Typography, Col } from 'antd'
import PrimaryButton from 'components/atoms/PrimaryButton'
import LoginHeader from 'components/orgnisms/LoginHeader'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import styles from '../styles/Login.module.css'
import { EventHandler } from 'react-router/node_modules/@types/react'

const { Title } = Typography

const Login: VFC = () => {
  const history = useHistory()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }
  const onSubmit = () => {
    auth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/')
      })
      .catch((err) => {
        console.log('err' + err)
        alert('ログイン失敗です')
      })
  }
  const onSignup = () => {
    history.push('/signup')
  }

  return (
    <>
      <LoginHeader />
      <Title level={2} style={{ textAlign: 'center' }}>
        ログイン
      </Title>
      <Row justify="center">
        <Col className={styles.loginForm}>
          <Form onFinish={onSubmit} style={{ textAlign: 'center' }}>
            <Form.Item
              label="email"
              name="email"
              rules={[{ required: true, message: 'Please input your email!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input onChange={onChangeEmail} />
            </Form.Item>
            <Form.Item
              label="password"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input.Password onChange={onChangePassword} />
            </Form.Item>
            <PrimaryButton style={{ width: '100%' }}>ログイン</PrimaryButton>
          </Form>
          <Button type="link" onClick={onSignup} style={{ display: 'block', margin: '0 auto' }}>
            サインアップページに飛ぶ
          </Button>
          <Col style={{ display: 'block', margin: '50px auto 0' }}>
            デモアカウント
            <br />
            email : sample@sample.com <br />
            password : sample
          </Col>
        </Col>
      </Row>
    </>
  )
}

export default Login
