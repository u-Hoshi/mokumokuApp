import { Form, Input, Row, Col, message } from 'antd'
import { useCallback, useContext, useEffect, useState, VFC } from 'react'
import { useParams } from 'react-router-dom'
import PrimaryButton from 'components/atoms/PrimaryButton'
import { auth, db } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import { useHistory } from 'react-router'
import firebase from 'firebase'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { UserType } from 'types/user'

const UserSetting: VFC = () => {
  const { loginUser } = useContext(LoginUserContext)
  const { id } = useParams<{ id: string }>()
  const [userInfo, setUserInfo] = useState<any>()
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [userMemo, setUserMemo] = useState<string>('')
  const history = useHistory()

  const fetchUser = async (id: string) => {
    const document = await db.doc(`Users/${id}`).get()
    console.log(document.data()?.email)

    return document.data()
  }
  useEffect(() => {
    console.log(id)
    fetchUser(id).then((user) => {
      setUserInfo(user)
    })
  }, [])

  const handleSubmit = useCallback(
    (email: string, userName: string, userMemo: string) => {
      const user: firebase.User | null = auth.currentUser
      const credential = firebase.auth.EmailAuthProvider.credential(loginUser.email, loginUser.password)
      user
        ?.reauthenticateWithCredential(credential)
        .then(() => {
          if (userName !== '' || email !== '') {
            db.collection('Users').doc(loginUser.uid).update({
              displayname: userName,
              email: email,
              usermemo: userMemo,
            })
          }

          user?.updateEmail(`${email}`).catch((error: string) => {
            message.error('変更に失敗しました。時間を空けてから再変更してください。')
            history.push('/')
          })
          message.success('変更に成功しました')
          history.push('/')
        })
        .catch((error) => {
          message.error('変更に失敗しました。時間を空けてから再変更してください。')
          history.push('/')
        })
    },
    [email, userName, userMemo]
  )

  return (
    <>
      <HeaderLayout />
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
            <PrimaryButton>更新</PrimaryButton>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default UserSetting
