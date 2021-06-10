import { useState, VFC } from 'react'
import { useHistory } from 'react-router'
import { auth } from '../../firebase/index'
import { Form, Input, Button } from 'antd'

const Login: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const history = useHistory()
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
      <h1>Login</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item label="email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
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
        >
          <Input
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </Form.Item>
        <button type="submit">Sign Up</button>
      </Form>
    </>
  )
}

export default Login
