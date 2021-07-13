import { useState, VFC, useCallback } from 'react'
import { auth, db, storage } from '../../firebase/index'
import { Form, Input, Row, Col, Upload, Modal, Button } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { useHistory } from 'react-router'
import LoginHeader from 'components/orgnisms/LoginHeader'
import Title from 'antd/lib/typography/Title'
import PrimaryButton from 'components/atoms/PrimaryButton'
import ImgCrop from 'antd-img-crop'

const Signup: VFC = () => {
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])
  console.log(email)
  const history = useHistory()
  const handleSubmit = useCallback(async () => {
    await auth
      .createUserWithEmailAndPassword(email, password)
      .then((result) => {
        const user = result.user
        history.push('/')
        if (user) {
          const uid = user.uid

          const userInfo = {
            uid: uid,
            password: password,
            displayname: userName,
            email: email,
          }

          db.collection('Users').doc(uid).set(userInfo)
          // アイコンの保存
          // useCallback(async () => {
          const imageName = fileList[0]
          // TODO ts-ignoreを取り除く
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          storage.ref(`/images/${imageName.name}`).put(imageName.originFileObj)

          storage
            .ref(`/images/${imageName.name}`)
            .getDownloadURL()
            .then((fireBaseUrl) => {
              db.collection('Users').doc(uid).set(
                {
                  photoURL: fireBaseUrl,
                },
                { merge: true }
              )
              // message.success('保存しました')
            })
          // }, [user])
        }
      })
      .catch((err) => {
        if (err.toString() == '[firebase_auth/invalid-email] The email address is badly formatted.') {
          return 'error:email'
        }
        console.log('err' + err)
        console.log('サインアップ失敗です')
      })
  }, [email, password, userName, fileList])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const onFileChange = useCallback(({ fileList: newFileList }) => {
    setFileList(newFileList)
  }, [])
  console.log(fileList)

  const previewImg = async (file: any) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }

    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    if (imgWindow !== null) {
      imgWindow.document.write(image.outerHTML)
    }
  }

  const goLogin = () => {
    history.push('/login')
  }

  return (
    <>
      {/* ログイン・サインアップ共通のヘッダーをorgnismsから呼び出す */}
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
            <Form.Item label="icon" name="icon" style={{ flexDirection: 'column' }} labelAlign={'left'}>
              <ImgCrop rotate>
                <Upload
                  action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                  listType="picture-card"
                  fileList={fileList}
                  onChange={onFileChange}
                  onPreview={previewImg}
                >
                  {fileList.length < 1 && 'Upload'}
                </Upload>
              </ImgCrop>
            </Form.Item>
            <PrimaryButton style={{ width: '100%' }}>サインアップ</PrimaryButton>
          </Form>
          <Button type="link" onClick={goLogin} style={{ display: 'block', margin: '0 auto' }}>
            ログインページに飛ぶ
          </Button>
        </Col>
      </Row>
    </>
  )
}

export default Signup
