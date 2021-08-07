import { Form, Input, Button, Row, Typography, Col, Upload } from 'antd'
import { useCallback, useContext, useEffect, useLayoutEffect, useState, VFC } from 'react'
import { useParams } from 'react-router-dom'
import PrimaryButton from 'components/atoms/PrimaryButton'
import { auth, db } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

type User = {
  email: string
  displayname: string
  password: string
  photoURL: string
  uid: string
}

const UserSetting: VFC = () => {
  const { loginUser, setLoginUser } = useContext(LoginUserContext)
  const { id } = useParams<{ id: string }>()
  const [userInfo, setUserInfo] = useState<any>()
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [userMemo, setUserMemo] = useState<string>('')

  const fetchUser = async (id: string) => {
    const document = await db.doc(`Users/${id}`).get()
    console.log(document.data()?.email)
    console.log('35')

    return document.data()
  }
  useEffect(() => {
    console.log(id)
    fetchUser(id).then((user) => {
      setUserInfo(user)
    })
    console.log('4')
  }, [])

  const handleSubmit = useCallback(
    (email: string, userName: string, userMemo: string) => {
      if (userName !== '' || email !== '') {
        db.collection('Users').doc(loginUser.uid).update({
          displayName: userName,
          email: email,
        })
      }
      db.collection('Users').doc(loginUser.uid).update({
        usermemo: userMemo,
      })
      const user = auth.currentUser

      loginUser
        .updateEmail(`${email}`)
        .then(() => {
          // Update successful
          // ...
        })
        .catch((error: any) => {
          console.log(error)
        })
    },
    [email, userName, userMemo]
  )

  return (
    <>
      <h1>usersetting</h1>
      <p>現在開発中です。もうしばらくお待ちください</p>
      <p>{id}</p>
      {/* ログイン・サインアップ共通のヘッダーをorgnismsから呼び出す */}
      <Row justify="center">
        <Col span={10}>
          <Form onFinish={() => handleSubmit(email, userName, userMemo)}>
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
            <p>{userInfo?.email}</p>
            <Form.Item
              label="email"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: 'The input is not valid E-mail!',
                },
                { required: true, message: 'Please input your email!' },
              ]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input
                onChange={(e) => {
                  setEmail(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item label="自己紹介" name="自己紹介" style={{ flexDirection: 'column' }} labelAlign={'left'}>
              <Input.TextArea
                onChange={(e) => {
                  setUserMemo(e.target.value)
                }}
              />
            </Form.Item>
          </Form>
          <PrimaryButton>更新</PrimaryButton>
        </Col>
      </Row>
    </>
  )
}

export default UserSetting
