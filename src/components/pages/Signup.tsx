import { useState, VFC, useCallback } from 'react'
import { auth, db, storage } from '../../firebase/index'
import { Form, Input, Row, Col, Upload, Modal } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { useHistory } from 'react-router'
import LoginHeader from 'components/orgnisms/LoginHeader'
import Title from 'antd/lib/typography/Title'
import PrimaryButton from 'components/atoms/PrimaryButton'
import ImgCrop from 'antd-img-crop'

const Signup: VFC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [userName, setUserName] = useState('')
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
            dispalyname: userName,
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
        console.log('err' + err)
        console.log('サインアップ失敗です')
      })
  }, [])
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  const [fileList, setFileList] = useState<UploadFile<any>[]>([
    {
      uid: '-1',
      name: 'image.png',
      status: 'done',
      url: 'https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png',
      // TODO: size, type ともに仮データの数値を設定したが明らかに最適な初期値ではない。そのうち調べる。
      size: 213022,
      type: 'image/png',
    },
  ])
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
            <PrimaryButton style={{ width: '100%' }}>ログイン</PrimaryButton>
          </Form>
        </Col>
      </Row>
    </>
  )
}

export default Signup
