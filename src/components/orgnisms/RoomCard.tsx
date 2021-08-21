import { db } from '../../firebase/index'
import { useContext, useState, useEffect, VFC } from 'react'
import { Form, Card, Avatar, Tooltip, Col, Row, Button, message } from 'antd'
import { PlusOutlined, SettingOutlined } from '@ant-design/icons'
const { Meta } = Card
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import moment from 'moment'
import Modal from 'antd/lib/modal/Modal'
import CardSetRoomDetail from 'components/molecules/CardSetRoomDetail'
import { RangeValue } from 'rc-picker/lib/interface.d'
import { Moment } from 'moment'

const alert = message

type room = {
  roomAuthorId: string
  roomHostDay: number[]
  roomEndTime: number[]
  roomMeetTitle: string
  roomMeetType: string
  roomMeetMessage: string
  roomStartTime: number[]
  roomId: string
}

type guest = {
  id: string
  guestName: string
  guestImg: string
}

const RoomCard: VFC<room> = (props) => {
  const {
    roomAuthorId,
    roomHostDay,
    roomEndTime,
    roomMeetTitle,
    roomMeetType,
    roomMeetMessage,
    roomStartTime,
    roomId,
  } = props
  const { loginUser } = useContext(LoginUserContext)
  const [authorName, setAuthorName] = useState<string>()
  const [authorIcon, setAuthorIcon] = useState<string>()
  const [isModalVisible, setIsModalVisible] = useState(false)

  //
  const [meetTile, setMeetTitle] = useState<string>(roomMeetTitle)
  const [hostDay, setHostDay] = useState<number[]>(roomHostDay)
  const [startTime, setStartTime] = useState<number[]>(roomStartTime)
  const [endTime, setEndTime] = useState<number[]>(roomEndTime)
  const [meetType, setMeetType] = useState<string>(roomMeetType)
  const [meetMessage, setMeetMessage] = useState<string>(roomMeetMessage)

  //

  const [form] = Form.useForm()

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
    .doc(`${roomAuthorId}`)
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

  hostDayInt = roomHostDay[0] * 10000 + roomHostDay[1] * 100 + roomHostDay[2]
  nowInt = moment().toArray()[0] * 10000 + moment().toArray()[1] * 100 + moment().toArray()[2]

  if (hostDayInt >= nowInt) {
    isPastHostDay = true
  }
  const cardColor = isPastHostDay ? 'white' : 'gray'

  const showModal = () => {
    setIsModalVisible(true)
  }

  const handleChange = () => {
    setIsModalVisible(false)
    const startDayTimeInt =
      hostDay[0] * 100000000 + hostDay[1] * 1000000 + hostDay[2] * 10000 + startTime[3] * 100 + startTime[4]
    try {
      db.collection('Group1').doc(roomId).update({
        meetTitle: meetTile,
        hostDay: hostDay,
        startDayTimeInt: startDayTimeInt,
        startTime: startTime,
        endTime: endTime,
        meetType: meetType,
        meetMessage: meetMessage,
      })
      alert.success('ルームの編集に成功しました')
    } catch (err) {
      alert.error('ルームの編集に失敗しました')
    }
  }

  const handleDelete = () => {
    setIsModalVisible(false)
    db.collection('Group1')
      .doc(roomId)
      .delete()
      .then(() => {
        alert.success('ルームの削除が完了しました')
      })
      .catch((error) => {
        alert.error('ルームの削除に失敗しました')
      })
  }

  const handleCancel = () => {
    setIsModalVisible(false)
  }

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetTitle(event.target.value)
  }

  const onChangeDay = (day: Moment | null, dateString: string) => {
    console.log(dateString)
    if (day !== null) {
      setHostDay(day.toArray())
    }
  }

  function disabledDate(current: any) {
    return current && current < moment().subtract(1, 'day')
  }

  const onChangeTime = (times: RangeValue<Moment>, dateStrings: [string, string]) => {
    if (times !== null) {
      setStartTime(times![0]!.toArray())
      setEndTime(times![1]!.toArray())
    }
  }

  const onChangeType = (value: string) => {
    setMeetType(value)
  }

  const onChangeMessage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetMessage(event.target.value)
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
          <Meta avatar={<Avatar src={authorIcon} />} title={roomMeetTitle} description={authorName} />
          <h3>{`${roomHostDay[1] + 1}月${roomHostDay[2]}日`}</h3>
          <h3>{`${roomStartTime[3]}時${roomStartTime[4]}分から${roomEndTime[3]}時${roomEndTime[4]}分まで`}</h3>
          <h4>{roomMeetType}</h4>
          <h4>{roomMeetMessage}</h4>
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
        <Modal
          title="再設定"
          visible={isModalVisible}
          style={{ textAlign: 'center' }}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              キャンセル
            </Button>,
            <Button type="primary" danger onClick={handleDelete}>
              削除
            </Button>,
            <Button key="submit" type="primary" onClick={handleChange}>
              変更
            </Button>,
          ]}
        >
          <Form style={{ textAlign: 'center' }} form={form}>
            <CardSetRoomDetail
              meetTitle={roomMeetTitle}
              hostDay={roomHostDay}
              startTime={roomStartTime}
              endTime={roomEndTime}
              meetType={roomMeetType}
              meetMessage={roomMeetMessage}
              onChangeTitle={onChangeTitle}
              onChangeDay={onChangeDay}
              disabledDate={disabledDate}
              onChangeTime={onChangeTime}
              onChangeType={onChangeType}
              onChangeMessage={onChangeMessage}
            />
          </Form>
        </Modal>
      </Col>
    </>
  )
}

export default RoomCard
