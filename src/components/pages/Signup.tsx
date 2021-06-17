import { useState, VFC } from 'react'
import { auth } from '../../firebase/index'
import { Form, Input, Button, Row, Col } from 'antd'
import { useHistory } from 'react-router'
import LoginHeader from 'components/orgnisms/LoginHeader'
import Title from 'antd/lib/typography/Title'
import PrimaryButton from 'components/atoms/PrimaryButton'

const Signup: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const history = useHistory()
  const handleSubmit = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(() => {
        history.push('/')
      })
      // 後ほどユーザ名を設定
      .catch((err) => {
        console.log('err' + err)
        alert('サインアップ失敗です')
      })
  }

  return (
    <>
      <LoginHeader />
      <Title level={2} style={{ textAlign: 'center' }}>
        サインアップ
      </Title>
      <Row justify="center">
        <Col span={10}>
          <Form onFinish={handleSubmit}>
            <Form.Item
              label="Username"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input
                onChange={(e) => {
                  setUserName(e.target.value)
                }}
              />
            </Form.Item>
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

export default Signup
