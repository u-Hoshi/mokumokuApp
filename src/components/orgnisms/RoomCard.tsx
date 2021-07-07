import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { Skeleton, Card, Avatar, Row, Col } from 'antd'
import { EllipsisOutlined, SettingOutlined } from '@ant-design/icons'
const { Meta } = Card

type room = {
  Author: string
  AuthorId: string
  endTimeDT: number[]
  meettype: string
  message?: string
  startTimeDT: number[]
}

const RoomCard: VFC<room> = (props) => {
  const { Author, AuthorId, endTimeDT, meettype, message, startTimeDT } = props
  const [authorIcon, setAuthorIcon] = useState<string>()

  db.collection(`Users`)
    .doc(`${AuthorId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        console.log('Document data:', doc.data()?.photoURL)
        setAuthorIcon(doc.data()?.photoURL)
      } else {
        // doc.data() will be undefined in this case
        console.log('No such document!')
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error)
    })
  return (
    <>
      <Col span={8}>
        <Card
          // style={{ width: 300, marginTop: 16 }}
          actions={[<SettingOutlined key="setting" />, <EllipsisOutlined key="ellipsis" />]}
        >
          {/* TODO 後々ユーザがプロフィール画像を設定できるようにしたら使用する */}
          <Meta avatar={<Avatar src={authorIcon} />} title="もくもく会" description={Author} />
          {console.log(endTimeDT[1])}
          <h3>{`${startTimeDT[1] + 1}月${startTimeDT[2]}日${startTimeDT[3]}時${startTimeDT[4]}分から`}</h3>
          <h3>{`${endTimeDT[1] + 1}月${endTimeDT[2]}日${endTimeDT[3]}時${endTimeDT[4]}分まで`}</h3>
          <h4>{meettype}</h4>
          <h4>{message}</h4>
        </Card>
      </Col>
    </>
  )
}

export default RoomCard
