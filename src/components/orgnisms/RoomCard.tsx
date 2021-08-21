import { db } from '../../firebase/index'
import { useContext, useState, useEffect, VFC } from 'react'
import { Skeleton, Card, Avatar, Tooltip, Col, Row } from 'antd'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
const { Meta } = Card
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import moment from 'moment'
import Modal from 'antd/lib/modal/Modal'
import RoomDetail from 'components/molecules/RoomDetail'

type room = {
  AuthorId: string
  hostDay: number[]
  endTime: number[]
  meetType: string
  message?: string
  startTime: number[]
  roomId: string
}

type guest = {
  id: string
  guestName: string
  guestImg: string
}

const RoomCard: VFC<room> = (props) => {
  const { AuthorId, hostDay, endTime, meetType, message, startTime, roomId } = props
  const { loginUser } = useContext(LoginUserContext)

  const [authorName, setAuthorName] = useState<string>()
  const [authorIcon, setAuthorIcon] = useState<string>()
  const [isModalVisible, setIsModalVisible] = useState(false)

  const joinMeeting = () => {
    console.log(loginUser)
    db.collection('Group1').doc(roomId).collection('guests').add({
      guestId: loginUser.uid,
      guestName: loginUser.displayname,
      guestImg: loginUser?.imgurl,
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

  let isPastHostDay = false
  let hostDayInt = 0
  let nowInt = 0

  hostDayInt = hostDay[0] * 10000 + hostDay[1] * 100 + hostDay[2]
  nowInt = moment().toArray()[0] * 10000 + moment().toArray()[1] * 100 + moment().toArray()[2]

  if (hostDayInt >= nowInt) {
    isPastHostDay = true
  }
  const cardColor = isPastHostDay ? 'white' : 'gray'

  const showModal = () => {
    setIsModalVisible(true)
  }
  return (
    <>
      <Col span={8}>
        <Card
          style={{ backgroundColor: `${cardColor}` }}
          actions={[
            <SettingOutlined
              key="setting"
              onClick={() => {
                showModal()
              }}
            />,
            // TODO 申し込み済みの時は違うアイコンを表示させ、参加取り消しができるようにする
            <PlusOutlined
              key="attendance"
              onClick={() => {
                joinMeeting()
              }}
            />,
          ]}
        >
          <Meta avatar={<Avatar src={authorIcon} />} title="もくもく会" description={authorName} />
          <h3>{`${hostDay[1] + 1}月${hostDay[2]}日`}</h3>
          <h3>{`${startTime[3]}時${startTime[4]}分から${endTime[3]}時${endTime[4]}分まで`}</h3>
          <h4>{meetType}</h4>
          <h4>{message}</h4>
          <Row>
            <Col offset={18}>
              <p>参加者</p>
              <Avatar.Group maxCount={1} size="large" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                <Avatar src={authorIcon} />
                {allGuests ? (
                  allGuests.map((guest: guest) => (
                    <Tooltip key={guest.id} title={guest.guestName} placement="top">
                      <Avatar src={guest.guestImg} key={guest.id} />
                    </Tooltip>
                  ))
                ) : (
                  <p>...loading</p>
                )}
              </Avatar.Group>
            </Col>
          </Row>
        </Card>
        <Modal title="Basic Modal" visible={isModalVisible}>
          <RoomDetail></RoomDetail>
        </Modal>
      </Col>
    </>
  )
}

export default RoomCard
