import { Form, Input, Row, Col, message, Tabs, Upload } from 'antd'
import { useCallback, useContext, useEffect, useState, VFC } from 'react'
import { useParams } from 'react-router-dom'
import PrimaryButton from 'components/atoms/PrimaryButton'
import { auth, db, storage } from '../../firebase/index'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import { useHistory } from 'react-router'
import firebase from 'firebase'
import HeaderLayout from 'components/themplates/HeaderLayout'
import ImgCrop from 'antd-img-crop'
import { UploadFile } from 'antd/lib/upload/interface'
import SecondaryButton from 'components/atoms/SecondaryButton'
import styles from '../styles/UserSetting.module.css'

const { TabPane } = Tabs

const UserSetting: VFC = () => {
  const history = useHistory()
  const { loginUser, setLoginUser } = useContext(LoginUserContext)
  const { id } = useParams<{ id: string }>()

  const [userInfo, setUserInfo] = useState<any>()
  const [userName, setUserName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [userMemo, setUserMemo] = useState<string>('')
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
            message.error('????????????????????????????????????????????????????????????????????????????????????')
            history.push('/')
          })
          message.success('???????????????????????????')
          history.push('/')
        })
        .catch((error) => {
          message.error('????????????????????????????????????????????????????????????????????????????????????')
          history.push('/')
        })
    },
    [email, userName, userMemo]
  )

  function callback(key: string) {
    // console.log(key)
  }

  const changeIcon = useCallback(async () => {
    console.log('debug.changeIcon.start')

    // Firestorage ???????????????
    // Firebase User collection ????????? URL ??????
    // await ???????????????????????????????????????????????????????????????????????????????????????
    if (fileList[0]) {
      await saveImg(loginUser)
    } else {
      await db.collection('Users').doc(loginUser.uid).set(
        {
          imgurl: '',
        },
        { merge: true }
      )
    }

    // await ??????????????????????????????????????????????????????????????????
    // ???????????? global context ????????????, ?????????????????????????????????
    await db
      .collection('Users')
      .doc(loginUser.uid)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) {
          console.log('documentSnapshot.not.exist')
        } else {
          const data = snapshot.data()
          if (data !== undefined) {
            setLoginUser({
              imgurl: data.imgurl,
            })
          }
        }
      })
      .catch((err: Error) => {
        console.log(err)
      })

    console.log('debug.changeIcon.finish')
    history.push('/')
  }, [fileList])

  const saveImg = useCallback(
    async (loginUser) => {
      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('')

      const imageObj = fileList[0]
      await storage
        .ref(`images/${fileName}`)
        // TODO ts-ignore???????????????
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        .put(imageObj.originFileObj)
        .then((shapshot) => {
          console.log('debug.firestorage.put.image.status: ' + shapshot.state)
        })
        .catch((err: Error) => {
          console.log(err)
        })

      let imgURL = ''
      await storage
        .ref('images')
        .child(fileName)
        .getDownloadURL()
        .then((firebaseURL: string) => {
          console.log('debug.firestorage.getDownloadURL: ' + firebaseURL)
          imgURL = firebaseURL
        })
        /*
        ??????????????????????????????
        then ???????????? async ?????????????????? Users.uid.imgurl ???????????? await ??????????????????
        
        .then(async(firebaseURL: string) => {
          await db.collection('Users').doc(loginUser.uid).set({...})
        })
        ????????????????????? let imgURL ??? firebaseURL ??????????????????????????????
        */
        .catch((err: Error) => {
          console.log(err)
        })

      await db
        .collection('Users')
        .doc(loginUser.uid)
        .set({ imgurl: imgURL }, { merge: true })
        .then(() => {
          console.log('debug.firebase.set.imgurl')
        })
        .catch((err: Error) => {
          console.log(err)
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

    db.collection(`Users`)
      .doc(loginUser.uid)
      .get()
      .then((d) => {
        const data: any = d.data()
        if (d.data !== undefined) {
          setLoginUser({
            imgurl: data.imgurl,
          })
        }
        message.success('???????????????????????????')
        history.push('/')
      })
      .catch((error) => {
        message.error('????????????????????????????????????????????????????????????????????????????????????')
        history.push('/')
      })
  }

  const onSubmitForm = (values: string) => {
    handleSubmit(email, userName, userMemo)
  }

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }
  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const onChangeUserMemo = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setUserMemo(e.target.value)
  }

  return (
    <>
      <HeaderLayout />
      <Row justify="center">
        <Tabs defaultActiveKey="1" onChange={callback} className={styles.userSettingForm}>
          <TabPane tab="????????????????????????" key="1">
            <Col>
              <Form onFinish={onSubmitForm}>
                <Form.Item
                  label="Username"
                  name="username"
                  rules={[{ required: true, message: 'Please input your username!' }]}
                  style={{ flexDirection: 'column' }}
                  labelAlign={'left'}
                >
                  <Input onChange={onChangeUserName} />
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
                  <Input onChange={onChangeEmail} />
                </Form.Item>
                <Form.Item label="????????????" name="????????????" style={{ flexDirection: 'column' }} labelAlign={'left'}>
                  <Input.TextArea onChange={onChangeUserMemo} />
                </Form.Item>
                <PrimaryButton>??????</PrimaryButton>
              </Form>
            </Col>
          </TabPane>
          <TabPane tab="????????????????????????" key="2">
            <Form onFinish={changeIcon}>
              <Form.Item label="icon(jpg??????)" name="file" style={{ flexDirection: 'column' }} labelAlign={'left'}>
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
              <PrimaryButton>??????</PrimaryButton>
            </Form>
            <SecondaryButton onClick={onClickDelete} style={{ marginTop: '10px' }}>
              ????????????????????????
            </SecondaryButton>
          </TabPane>
        </Tabs>
      </Row>
    </>
  )
}

export default UserSetting
