import { db } from '../../firebase/index'
import { useContext, useState, useEffect, VFC } from 'react'
import { Form, Card, Avatar, Tooltip, Col, Row, Button, message } from 'antd'
import { PlusOutlined, SettingOutlined, MinusOutlined } from '@ant-design/icons'
const { Meta } = Card
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import moment from 'moment'
import Modal from 'antd/lib/modal/Modal'
import CardSetRoomDetail from 'components/molecules/CardSetRoomDetail'
import { RangeValue } from 'rc-picker/lib/interface.d'
import { Moment } from 'moment'

const alert = message

type Room = {
  roomAuthorId: string
  roomHostDay: number[]
  roomEndTime: number[]
  roomMeetTitle: string
  roomMeetType: string
  roomMeetMessage: string
  roomStartTime: number[]
  roomId: string
}

type Guest = {
  guestId: string
  guestName: string
  guestImg: string
}

const RoomCard: VFC<Room> = (props) => {
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
  const { loginUser } = useContext<any>(LoginUserContext)
  // モーダルのカード情報を保持
  const [authorName, setAuthorName] = useState<string>()
  const [authorIcon, setAuthorIcon] = useState<string>()
  const [meetTitle, setMeetTitle] = useState<string>(roomMeetTitle)
  const [hostDay, setHostDay] = useState<number[]>(roomHostDay)
  const [startTime, setStartTime] = useState<number[]>(roomStartTime)
  const [endTime, setEndTime] = useState<number[]>(roomEndTime)
  const [meetType, setMeetType] = useState<string>(roomMeetType)
  const [meetMessage, setMeetMessage] = useState<string>(roomMeetMessage)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [guests, setGuests] = useState<Array<Guest>>([])
  const [form] = Form.useForm()

  // 参加判定
  const [participant, setParticipant] = useState<Array<string>>([])
  const [isJoin, setIsJoin] = useState(false)
  const joinMeeting = () => {
    db.collection('Group1').doc(roomId).collection('guests').doc(loginUser.uid).set({
      guestId: loginUser.uid,
      guestName: loginUser.displayname,
      guestImg: loginUser?.imgurl,
    })
  }

  const cancelJoinMeeting = () => {
    db.collection('Group1')
      .doc(roomId)
      .collection('guests')
      .doc(loginUser.uid)
      .delete()
      .then(() => {
        const leftParticipant = participant.filter((v) => {
          return !loginUser.uid.includes(v)
        })
        setParticipant(leftParticipant)
        alert.success('参加取り消しが完了しました')
      })
      .catch((error) => {
        alert.error('参加取り消しが失敗しました')
      })
  }
  console.debug(participant)

  useEffect(() => {
    if (loginUser !== null) {
      let defaultIsJoin = false
      defaultIsJoin = participant.includes(loginUser.uid) ? true : false
      setIsJoin(defaultIsJoin)
    }
  }, [participant])

  db.collection(`Users`)
    .doc(`${roomAuthorId}`)
    .get()
    .then((doc) => {
      if (doc.exists) {
        setAuthorName(doc.data()?.displayname)
        setAuthorIcon(doc.data()?.imgurl)
      } else {
        console.log('No such document!')
      }
    })
    .catch((error) => {
      console.log('Error getting document:', error)
    })
  useEffect(() => {
    const arrParticipant: string[] = []
    db.collection('Group1')
      .doc(roomId)
      .collection('guests')
      .onSnapshot((snapshot) => {
        const Guests = snapshot.docs.map((doc) => {
          arrParticipant.push(doc.id)
          setParticipant(arrParticipant)
          return {
            guestId: doc.id,
            guestName: doc.data().guestName,
            guestImg: doc.data().guestImg,
          }
        })
        setGuests(Guests)
      })
  }, [])

  const showModal = () => {
    setIsModalVisible(true)
  }

  // 開催前か開催後を判断する
  let isPastHostDay = false
  let hostDayInt = 0
  let nowInt = 0

  // 時間を数字で変換して判断する
  hostDayInt = roomHostDay[0] * 10000 + roomHostDay[1] * 100 + roomHostDay[2]
  nowInt = moment().toArray()[0] * 10000 + moment().toArray()[1] * 100 + moment().toArray()[2]

  if (hostDayInt >= nowInt) {
    isPastHostDay = true
  }
  const cardColor = isPastHostDay ? 'white' : 'gray'

  const handleChange = () => {
    setIsModalVisible(false)
    const startDayTimeInt =
      hostDay[0] * 100000000 + hostDay[1] * 1000000 + hostDay[2] * 10000 + startTime[3] * 100 + startTime[4]
    try {
      db.collection('Group1').doc(roomId).update({
        meetTitle: meetTitle,
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
    if (day !== null) {
      setHostDay(day.toArray())
    }
  }

  function disabledDate(current: Moment) {
    return current && current < moment().subtract(1, 'day')
  }

  const onChangeTime = (times: RangeValue<Moment>, dateStrings: [string, string]) => {
    if (times !== null) {
      setStartTime(times[0]!.toArray())
      setEndTime(times[1]!.toArray())
    }
  }

  const onChangeType = (value: string) => {
    setMeetType(value)
  }

  const onChangeMessage = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setMeetMessage(event.target.value)
  }

  return (
    <>
      <Col span={8}>
        {isJoin ? (
          <Card
            style={{ backgroundColor: `${cardColor}` }}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  showModal()
                }}
              />,
              <MinusOutlined
                key="attendance"
                onClick={() => {
                  cancelJoinMeeting()
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
                  {guests ? (
                    guests.map((guest: Guest) => (
                      <Tooltip key={guest.guestId} title={guest.guestName} placement="top">
                        <Avatar src={guest.guestImg} key={guest.guestId} />
                      </Tooltip>
                    ))
                  ) : (
                    <p>...loading</p>
                  )}
                </Avatar.Group>
              </Col>
            </Row>
          </Card>
        ) : (
          <Card
            style={{ backgroundColor: `${cardColor}` }}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  showModal()
                }}
              />,
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
                  {guests ? (
                    guests.map((guest: Guest) => (
                      <Tooltip key={guest.guestId} title={guest.guestName} placement="top">
                        <Avatar src={guest.guestImg} key={guest.guestId} />
                      </Tooltip>
                    ))
                  ) : (
                    <p>...loading</p>
                  )}
                </Avatar.Group>
              </Col>
            </Row>
          </Card>
        )}

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
