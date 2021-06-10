import { useState, VFC } from 'react'
import { auth } from '../../firebase/index'
import { Form, Input, Button } from 'antd'
import { useHistory } from 'react-router'

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
      signup
      <h1>Sign Up</h1>
      <Form onFinish={handleSubmit}>
        <Form.Item
          label="Username"
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
        </Form.Item>
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

export default Signup
