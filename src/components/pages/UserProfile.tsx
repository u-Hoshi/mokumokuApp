import { Avatar, Col, Descriptions, Typography } from 'antd'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { useEffect, useState, VFC } from 'react'
import { useParams } from 'react-router-dom'
import { db } from '../../firebase/index'
import styles from '../styles/UserProfile.module.css'
const { Title } = Typography

const UserProfile: VFC = () => {
  const [userInfo, setUserInfo] = useState<any>()
  const { id } = useParams<{ id: string }>()
  const fetchUser = async (id: string) => {
    const document = await db.doc(`Users/${id}`).get()
    return document.data()
  }
  useEffect(() => {
    fetchUser(id).then((user) => {
      setUserInfo(user)
    })
  }, [])

  return (
    <>
      <HeaderLayout />
      <Col className={styles.userProfile}>
        <Title level={3}>
          <Avatar size={50} src={userInfo?.imgurl} style={{ marginRight: '10px' }} />
          {userInfo?.displayname}
        </Title>

        <Descriptions title="基本情報" colon={false} bordered column={{ xxl: 4, xl: 3, lg: 3, md: 3, sm: 2, xs: 1 }}>
          <Descriptions.Item label="ユーザー名">{userInfo?.displayname}</Descriptions.Item>
          <Descriptions.Item label="メールアドレス" span={1}>
            {userInfo?.email}
          </Descriptions.Item>
          <Descriptions.Item label="プログラミング歴">
            {userInfo?.periodYear}年{userInfo?.periodMonth}ヶ月
          </Descriptions.Item>
          <Descriptions.Item label="一言">
            {userInfo?.usermemo ? userInfo?.usermemo : 'よろしくお願いします！'}
          </Descriptions.Item>
        </Descriptions>
      </Col>
    </>
  )
}

export default UserProfile
