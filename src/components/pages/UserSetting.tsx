import { Form, Input, Row, Col, message, Tabs, Upload } from 'antd'
import { useCallback, useContext, useEffect, useState, VFC } from 'react'
import { useParams } from 'react-router-dom'
import PrimaryButton from 'components/atoms/PrimaryButton'
import { auth, db, storage } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import { useHistory } from 'react-router'
import firebase from 'firebase'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { UserType } from 'types/user'
import ImgCrop from 'antd-img-crop'
import { UploadFile } from 'antd/lib/upload/interface'
import SecondaryButton from 'components/atoms/SecondaryButton'

const { TabPane } = Tabs

const UserSetting: VFC = () => {
  const { loginUser, setLoginUser } = useContext(LoginUserContext)
  const { id } = useParams<{ id: string }>()
  const [userInfo, setUserInfo] = useState<any>()
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [userMemo, setUserMemo] = useState<string>('')
  const history = useHistory()
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])

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

  function callback(key: string) {
    // console.log(key)
  }

  const changeIcon = useCallback(() => {
    console.log('foo')

    history.push('/')

    // アイコンの保存
    if (fileList[0]) {
      saveImg(loginUser)
    } else {
      db.collection('Users').doc(loginUser.uid).set(
        {
          imgurl: '',
        },
        { merge: true }
      )
    }
    console.log('bar')
    db.collection(`Users`)
      .doc(loginUser.uid)
      .get()
      .then((d) => {
        console.log(d)
        console.log(d.data)
        const data: any = d.data()
        if (d.data !== undefined) {
          setLoginUser({
            imgurl: data.imgurl,
          })
        }
        console.log('num')

        console.log('hoge')
      })
      .catch((err) => {
        console.log('err' + err)
      })
  }, [fileList])

  const saveImg = useCallback(
    async (loginUser) => {
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
          db.collection('Users').doc(loginUser.uid).set(
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

  const onClickDelete = () => {
    db.collection('Users').doc(loginUser.uid).set(
      {
        imgurl: '',
      },
      { merge: true }
    )

    console.log('bar')
    db.collection(`Users`)
      .doc(loginUser.uid)
      .get()
      .then((d) => {
        console.log(d)
        console.log(d.data)
        const data: any = d.data()
        if (d.data !== undefined) {
          setLoginUser({
            imgurl: data.imgurl,
          })
        }
        message.success('削除に成功しました')
        history.push('/')
      })
      .catch((error) => {
        message.error('削除に失敗しました。時間を空けてから再削除してください。')
        history.push('/')
      })
  }

  return (
    <>
      <HeaderLayout />
      <h1>ユーザ設定</h1>
      <Row justify="center">
        <Tabs defaultActiveKey="1" onChange={callback} style={{ width: '50%' }}>
          <TabPane tab="プロフィール設定" key="1">
            <Col>
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
          </TabPane>
          <TabPane tab="プロフィール画像" key="2">
            <Form onFinish={changeIcon}>
              <Form.Item label="icon(jpgのみ)" name="file" style={{ flexDirection: 'column' }} labelAlign={'left'}>
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
              <PrimaryButton>更新</PrimaryButton>
            </Form>
            <SecondaryButton onClick={() => onClickDelete()} style={{ marginTop: '10px' }}>
              現在の画像を削除
            </SecondaryButton>
          </TabPane>
        </Tabs>
      </Row>
    </>
  )
}

export default UserSetting
