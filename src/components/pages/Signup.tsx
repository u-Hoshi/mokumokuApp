import { useState, VFC, useCallback, useContext } from 'react'
import { auth, db, storage } from '../../firebase/index'
import { Form, Input, Row, Col, Upload, message, Button } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { useHistory } from 'react-router'
import LoginHeader from 'components/orgnisms/LoginHeader'
import Title from 'antd/lib/typography/Title'
import PrimaryButton from 'components/atoms/PrimaryButton'
import ImgCrop from 'antd-img-crop'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const alert = message

const Signup: VFC = () => {
  const { loginUser } = useContext<any>(LoginUserContext)
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [fileList, setFileList] = useState<UploadFile<any>[]>([
    {
      uid: '-5',
      name: 'image.png',
      status: 'success',
    },
  ])
  const history = useHistory()
  const handleSubmit = useCallback(() => {
    console.log('email' + email)
    console.log('password' + password)
    auth
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
          saveImg(user)
        }
      })
      .catch((err) => {
        if (err.toString() == '[firebase_auth/invalid-email] The email address is badly formatted.') {
          return 'error:email'
        }
        console.log('err' + err)
        console.log('サインアップ失敗です')
      })
    console.log('last')
  }, [email, password, loginUser, userName, fileList])

  const saveImg = useCallback(
    async (user) => {
      const imageName = fileList[0]
      console.log(imageName)

      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('')
      // TODO ts-ignoreを取り除く
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await storage.ref(`/images/${fileName}`).put(imageName.originFileObj)
      console.log(imageName)
      storage
        .ref(`images`)
        .child(fileName)
        .getDownloadURL()
        .then((fireBaseUrl) => {
          db.collection('Users').doc(user.uid).set(
            {
              imgurl: fireBaseUrl,
            },
            { merge: true }
          )
        })
    },
    [fileList[0]]
  )
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore

  const onFileChange = useCallback(
    async ({ fileList: newFileList }) => {
      await setFileList(newFileList)
      console.log(fileList[0]?.status)
      if (fileList[0]?.status === 'error') {
        console.log('done')
      }
      // if (newFileList.file.status === 'done') {
      //   message.success(`${newFileList.file.name} file uploaded successfully`)
      // } else if (newFileList.file.status === 'error') {
      //   message.error(`${newFileList.file.name} file upload failed.`)
      // }
    },
    [fileList[0]]
  )
  console.log(fileList)

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const previewImg = async (file) => {
    let src = file.url
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader()
        reader.readAsDataURL(file.originFileObj)
        reader.onload = () => resolve(reader.result)
      })
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const image = new Image()
    image.src = src
    const imgWindow = window.open(src)
    console.log(src)
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
              <Input.Password
                onChange={(e) => {
                  setPassword(e.target.value)
                }}
              />
            </Form.Item>
            <Form.Item
              label="icon"
              name="file"
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
              // rules={[
              //   {
              //     required: true,
              //     message: 'Please input your icon!',
              //   },
              // ]}
            >
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
