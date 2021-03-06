import { useState, VFC, useCallback, useContext } from 'react'
import { auth, db, storage } from '../../firebase/index'
import { Form, Input, Row, Col, Upload, message, Button, InputNumber } from 'antd'
import { UploadFile } from 'antd/lib/upload/interface'
import { useHistory } from 'react-router'
import LoginHeader from 'components/orgnisms/LoginHeader'
import Title from 'antd/lib/typography/Title'
import PrimaryButton from 'components/atoms/PrimaryButton'
import ImgCrop from 'antd-img-crop'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import styles from '../styles/Signup.module.css'

const alert = message

const Signup: VFC = () => {
  const { loginUser, setLoginUser } = useContext<any>(LoginUserContext)
  const history = useHistory()
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const [userName, setUserName] = useState<string>('')
  const [fileList, setFileList] = useState<UploadFile<any>[]>([])
  const [periodYear, setPeriodYear] = useState<number>()
  const [periodMonth, setPeriodMonth] = useState<number>()

  const onChangeEmail = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value)
  }

  const onChangePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const onChangeUserName = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserName(e.target.value)
  }

  const onChangeYear = (e: number) => {
    setPeriodYear(e)
  }
  const onChangeMonth = (e: number) => {
    setPeriodMonth(e)
  }

  const handleSubmit = useCallback(() => {
    auth
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        const user = result.user
        history.push('/')
        if (user) {
          const uid = user.uid

          const userInfo = {
            uid: uid,
            password: password,
            displayname: userName,
            email: email,
            periodYear: periodYear,
            periodMonth: periodMonth,
          }
          await db.collection('Users').doc(uid).set(userInfo)
          // アイコンの保存
          if (fileList[0]) {
            saveImg(user)
          } else {
            db.collection('Users').doc(uid).set(
              {
                imgurl: '',
              },
              { merge: true }
            )
          }

          await db
            .collection(`Users`)
            .doc(uid)
            .get()
            .then((d) => {
              const data: any = d.data()
              if (d.data !== undefined) {
                setLoginUser({
                  uid: uid,
                  email: data.email,
                  password: data.password,
                  displayname: data.displayname,
                  imgurl: data.imgurl,
                  periodYear: data.periodYera,
                  periodMonth: data.periodMonth,
                })
              }
            })
        }
      })
      .catch((err) => {
        if (err.toString() == '[firebase_auth/invalid-email] The email address is badly formatted.') {
          return 'error:email'
        }
        console.log('err' + err)
      })
  }, [email, password, loginUser, userName, fileList])

  const saveImg = useCallback(
    async (user) => {
      const imageName = fileList[0]

      const S = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
      const N = 16
      const fileName = Array.from(crypto.getRandomValues(new Uint32Array(N)))
        .map((n) => S[n % S.length])
        .join('')
      // TODO ts-ignoreを取り除く
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      await storage.ref(`/images/${fileName}`).put(imageName.originFileObj)

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
    },
    [fileList[0]]
  )

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

    if (imgWindow !== null) {
      imgWindow.document.write(image.outerHTML)
    }
  }

  const goLogin = () => {
    history.push('/login')
  }

  return (
    <>
      <LoginHeader />
      <Title level={2} style={{ textAlign: 'center' }}>
        サインアップ
      </Title>
      <Row justify="center">
        <Col className={styles.signupForm}>
          <Form onFinish={handleSubmit}>
            <Form.Item
              label="ユーザー名"
              name="username"
              rules={[{ required: true, message: 'Please input your username!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input onChange={onChangeUserName} />
            </Form.Item>
            <Form.Item
              label="メールアドレス"
              name="email"
              rules={[
                {
                  type: 'email',
                  message: '有効ではないメールアドレスです。',
                },
                { required: true, message: 'メールアドレスを入力して下さい' },
              ]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input onChange={onChangeEmail} />
            </Form.Item>

            <Form.Item
              label="パスワード"
              name="password"
              rules={[{ required: true, message: 'Please input your password!' }]}
              style={{ flexDirection: 'column' }}
              labelAlign={'left'}
            >
              <Input.Password onChange={onChangePassword} />
            </Form.Item>
            <Form.Item label="プログラミング歴" style={{ flexDirection: 'column' }} labelAlign={'left'}>
              <InputNumber onChange={onChangeYear} />
              年
              <InputNumber onChange={onChangeMonth} />
              ヶ月
            </Form.Item>
            <Form.Item label="アイコン(jpgのみ)" name="file" style={{ flexDirection: 'column' }} labelAlign={'left'}>
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
