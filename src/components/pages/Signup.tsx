import React, { useState, VFC } from 'react'
import { auth } from '../../firebase/index'
import { Form, Input, Button } from 'antd'

const Signup: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const handleSubmit = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      // 後ほどユーザ名を設定
      .catch(() => {
        console.log(email)
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
        {/* <label htmlFor="name">Name</label>
          <input
            name="name"
            type="name"
            id="name"
            placeholder="Name"
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          /> */}
        {/* <label htmlFor="email">E-mail</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value)
              console.log(e.target.value)
            }}
          /> */}
        <Form.Item label="email" name="email" rules={[{ required: true, message: 'Please input your email!' }]}>
          <Input
            onChange={(e) => {
              setEmail(e.target.value)
            }}
          />
        </Form.Item>
        {/* <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          /> */}
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
