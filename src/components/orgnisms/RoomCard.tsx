import { db } from '../../firebase/index'
import { useContext, useState, useEffect, VFC } from 'react'
import { Skeleton, Card, Avatar, Tooltip, Col, Row } from 'antd'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
const { Meta } = Card
import { LoginUserContext } from 'components/providers/LoginUserProvider'

type room = {
  AuthorId: string
  endTimeDT: number[]
  meettype: string
  message?: string
  startTimeDT: number[]
  roomId: string
}

type guest = {
  guestId: string
  guestName: string
  guestImg: string
}

const RoomCard: VFC<room> = (props) => {
  const { AuthorId, endTimeDT, meettype, message, startTimeDT, roomId } = props
  const { loginUser } = useContext(LoginUserContext)

  const [authorName, setAuthorName] = useState<string>()
  const [authorIcon, setAuthorIcon] = useState<string>()

  const joinMeeting = () => {
    db.collection('Group1').doc(roomId).collection('guests').add({
      guestId: loginUser.uid,
      guestName: loginUser.displayname,
      guestImg: loginUser.imgurl,
    })
  }

  // 開催者のidを受け取り、名前と写真を呼ぶ
  db.collection(`Users`)
    .doc(`${AuthorId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        setAuthorName(doc.data()?.displayname)
        setAuthorIcon(doc.data()?.photoURL)
      } else {
        console.log('No such document!')
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error)
    })

  // TODO anyを取り除く
  const [allGuests, setGuests] = useState<any>([])

  useEffect(() => {
    db.collection('Group1')
      .doc(roomId)
      .collection('guests')
      .onSnapshot((snapshot) => {
        const Guests = snapshot.docs.map((doc) => {
          return {
            id: doc.id,
            ...doc.data(),
          }
        })
        setGuests(Guests)
      })
  }, [])
  return (
    <>
      <Col span={8}>
        <Card
          // style={{ width: 300, marginTop: 16 }}
          actions={[
            <SettingOutlined
              key="setting"
              onClick={() => {
                alert('まだ未実装です')
              }}
            />,
            // TODO 申し込み済みの時は違うアイコンを表示させ、参加取り消しができるようにする
            <PlusOutlined key="attendance" onClick={() => joinMeeting()} />,
          ]}
        >
          <Meta avatar={<Avatar src={authorIcon} />} title="もくもく会" description={authorName} />
          <h3>{`${startTimeDT[1] + 1}月${startTimeDT[2]}日${startTimeDT[3]}時${startTimeDT[4]}分から`}</h3>
          <h3>{`${endTimeDT[1] + 1}月${endTimeDT[2]}日${endTimeDT[3]}時${endTimeDT[4]}分まで`}</h3>
          <h4>{meettype}</h4>
          <h4>{message}</h4>
          <Row>
            <Col offset={18}>
              <p>参加者</p>
              <Avatar.Group maxCount={1} size="large" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                <Avatar src={authorIcon} />
                {allGuests ? (
                  allGuests.map((guest: guest) => <Avatar src={guest.guestImg} key={guest.guestId} />)
                ) : (
                  <p>...loading</p>
                )}
              </Avatar.Group>
            </Col>
          </Row>
        </Card>
      </Col>
    </>
  )
}

export default RoomCard
