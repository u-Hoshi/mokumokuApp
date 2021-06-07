import React, { useState, VFC } from 'react'
import { auth } from '../../firebase/index'

const Signup: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
  const handleSubmit = () => {
    auth
      .createUserWithEmailAndPassword(email, password)
      // 後ほどユーザ名を設定
      .catch(() => {
        console.log('error:')
        alert('サインアップ失敗です')
      })
  }

  return (
    <>
      signup
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name</label>
          <input
            name="name"
            type="name"
            id="name"
            placeholder="Name"
            onChange={(e) => {
              setUserName(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="email">E-mail</label>
          <input
            name="email"
            type="email"
            id="email"
            placeholder="Email"
            onChange={(e) => {
              setEmail(e.target.value)
              console.log(e.target.value)
            }}
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            name="password"
            type="password"
            id="password"
            placeholder="Password"
            onChange={(e) => {
              setPassword(e.target.value)
            }}
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
    </>
  )
}

export default Signup
