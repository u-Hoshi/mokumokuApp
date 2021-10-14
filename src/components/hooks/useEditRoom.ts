import { RangeValue } from 'rc-picker/lib/interface.d'
import { LoginUserContext } from 'components/providers/LoginUserProvider'
import { db } from '../../firebase/index'
import { useContext, useEffect, useState } from 'react'
import { Form, FormInstance, message } from 'antd'
import moment, { Moment } from 'moment'
import { GuestType } from 'types/guest'
import firebase from 'firebase'
import { UserType } from 'types/user'

const alert = message
const WEBHOOK_KEY = process.env.REACT_APP_WEBHOOK

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
  guestName?: string
  guestImg?: string
}

export const useEditRoom = (
  roomAuthorId: string,
  roomHostDay: number[],
  roomEndTime: number[],
  roomMeetTitle: string,
  roomMeetType: string,
  roomMeetMessage: string,
  roomStartTime: number[],
  roomId: string
): {
  joinMeeting: () => void
  cancelJoinMeeting: () => void
  showModal: () => void
  handleChange: () => void
  handleDelete: () => void
  handleCancel: () => void
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDay: (day: Moment | null, dateString: string) => void
  disabledDate: (current: Moment) => boolean
  onChangeTime: (times: RangeValue<Moment>, dateStrings: [string, string]) => void
  onChangeType: (value: string) => void
  onChangeMessage: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  loginUser: string
  meetTitle: string
  isModalVisible: boolean
  form: FormInstance<string>
  isJoin: boolean
  isAuthor: boolean
  guests: { guestId: string }[]
  authorIcon: string | undefined
  authorName: string | undefined
  cardColor: string
} => {
  const { loginUser } = useContext(LoginUserContext)
  // 一旦保留
  const [authorName, setAuthorName] = useState<string>()
  const [authorIcon, setAuthorIcon] = useState<string>()
  const [meetTitle, setMeetTitle] = useState<string>(roomMeetTitle)
  const [hostDay, setHostDay] = useState<number[]>(roomHostDay)
  const [startTime, setStartTime] = useState<number[]>(roomStartTime)
  const [endTime, setEndTime] = useState<number[]>(roomEndTime)
  const [meetType, setMeetType] = useState<string>(roomMeetType)
  const [meetMessage, setMeetMessage] = useState<string>(roomMeetMessage)

  const [isModalVisible, setIsModalVisible] = useState(false)
  const [guests, setGuests] = useState<Array<{ guestId: string }>>([])
  const [form] = Form.useForm()

  // 参加判定
  const [participant, setParticipant] = useState<Array<string>>([])
  const [isJoin, setIsJoin] = useState(false)
  const joinMeeting = () => {
    if (loginUser.uid !== roomAuthorId) {
      db.collection('Group1').doc(roomId).collection('guests').doc(loginUser.uid).set({
        guestId: loginUser.uid,
      })
      db.collection('Users').doc(loginUser.uid).update('JoinNum', firebase.firestore.FieldValue.increment(1))
      alert.success('参加表明が完了しました')
    } else {
      message.error('開催者のため参加表明ができません')
    }
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
        db.collection('Users').doc(loginUser.uid).update('JoinNum', firebase.firestore.FieldValue.increment(-1))
        alert.success('参加取り消しが完了しました')
      })
      .catch(() => {
        alert.error('参加取り消しが失敗しました')
      })
  }

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
    .catch((error: string) => {
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
  hostDayInt =
    roomHostDay[0] * 100000000 +
    roomHostDay[1] * 1000000 +
    roomHostDay[2] * 10000 +
    roomStartTime[3] * 100 +
    roomStartTime[4]
  nowInt =
    moment().toArray()[0] * 100000000 +
    moment().toArray()[1] * 1000000 +
    moment().toArray()[2] * 10000 +
    moment().toArray()[3] * 100 +
    moment().toArray()[4]

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
      const payload = {
        text: `${loginUser.displayname}が${meetTitle}を編集しました。\n
        開催日：${hostDay[1] + 1}月${hostDay[2]}日\n
        開催時間：${startTime[3]}時${startTime[4]}分から${endTime[3]}時${endTime[4]}分まで\n
        カテゴリ：${meetType}\n
        コメント：${meetMessage}`,
      }
      slackNotice(payload)
    } catch (err) {
      alert.error('ルームの編集に失敗しました')
    }
  }

  const handleDelete = async () => {
    setIsModalVisible(false)

    const joinsSnapshot = await db.collection(`Group1/${roomId}/guests`).get()
    joinsSnapshot.docs.map(async (joinDoc) => {
      await db.collection(`Users`).doc(`${joinDoc.id}`).update('JoinNum', firebase.firestore.FieldValue.increment(-1))
    }),
      db
        .collection('Group1')
        .doc(roomId)
        .delete()
        .then(() => {
          alert.success('ルームの削除が完了しました')
          db.collection('Users').doc(loginUser.uid).update('HostNum', firebase.firestore.FieldValue.increment(-1))
          const payload = {
            text: `${loginUser.displayname}が${meetTitle}を削除しました。\n
           `,
          }
          slackNotice(payload)
        })
        .catch(() => {
          alert.error('ルームの削除に失敗しました')
        })
  }
  const slackNotice = (payload: { text: string }) => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    fetch(WEBHOOK_KEY, {
      method: 'POST',
      body: JSON.stringify(payload),
    })
      .then((responce) => {
        if (!responce.ok) {
          console.log(responce)
        }
      })
      .catch((error) => {
        console.log(error.message)
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

  const disabledDate = (current: Moment) => {
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

  let isAuthor = false
  if (loginUser !== null) {
    isAuthor = roomAuthorId === loginUser.uid ? true : false
  }

  return {
    joinMeeting,
    cancelJoinMeeting,
    showModal,
    handleChange,
    handleDelete,
    handleCancel,
    onChangeTitle,
    onChangeDay,
    disabledDate,
    onChangeTime,
    onChangeType,
    onChangeMessage,
    loginUser,
    meetTitle,
    isModalVisible,
    form,
    isJoin,
    isAuthor,
    guests,
    authorIcon,
    authorName,
    cardColor,
  }
}
