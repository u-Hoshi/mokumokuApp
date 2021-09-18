import { useState, useContext, VFC } from 'react'
import { Form, message } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import dayjs from 'dayjs'
import { db } from '../../firebase/index'
import firebase from 'firebase'
import { RangeValue } from 'rc-picker/lib/interface.d'
import { Moment } from 'moment'
import SetRoomDetail from 'components/molecules/SetRoomDetail'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const alert = message
const WEBHOOK_KEY = process.env.REACT_APP_WEBHOOK

const AddRoom: VFC<any> = () => {
  const { loginUser } = useContext(LoginUserContext)
  const [meetTitle, setMeetTitle] = useState<string>('もくもく会')
  const [hostDay, setHostDay] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number[]>([])
  const [endTime, setEndTime] = useState<number[]>([])
  const [meetType, setMeetType] = useState<string>('')
  const [meetMessage, setMeetMessage] = useState<string>('')
  const [form] = Form.useForm()

  const onFinish = () => {
    const startDayTimeInt =
      hostDay[0] * 100000000 + hostDay[1] * 1000000 + hostDay[2] * 10000 + startTime[3] * 100 + startTime[4]
    try {
      db.collection('Group1').add({
        meetTitle: meetTitle,
        Author: loginUser.displayname,
        AuthorId: loginUser.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        hostDay: hostDay,
        startDayTimeInt: startDayTimeInt,
        startTime: startTime,
        endTime: endTime,
        meetType: meetType,
        meetMessage: meetMessage,
      })
      db.collection('Users').doc(loginUser.uid).update('HostNum', firebase.firestore.FieldValue.increment(1))

      const payload = {
        text: `${loginUser.displayname}が${meetTitle}を作成しました。\n
        開催日：${hostDay[1] + 1}月${hostDay[2]}日\n
        開催時間：${startTime[3]}時${startTime[4]}分から${endTime[3]}時${endTime[4]}分まで\n
        カテゴリ：${meetType}\n
        コメント：${meetMessage}`,
      }

      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      fetch(WEBHOOK_KEY, {
        method: 'POST',
        body: JSON.stringify(payload),
      })
        .then((responce) => {
          console.log(responce)
          if (!responce.ok) {
            console.log(responce)
          }
        })
        .catch((error) => {
          console.log(error.message)
        })

      onReset()
      setMeetMessage('')
      alert.success('ルーム追加成功')
    } catch (err) {
      alert.error('ルーム追加失敗')
      console.log(err)
    }
  }

  const onReset = () => {
    form.resetFields()
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

  const disabledDate = (current: Moment) => {
    return current && current < dayjs().subtract(1, 'day')
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
      <Form onFinish={onFinish} form={form} style={{ marginLeft: '15px' }}>
        <SetRoomDetail
          onChangeTitle={onChangeTitle}
          onChangeDay={onChangeDay}
          disabledDate={disabledDate}
          onChangeTime={onChangeTime}
          onChangeType={onChangeType}
          onChangeMessage={onChangeMessage}
        />
        <PrimaryButton style={{ display: 'block', margin: '0 auto' }}>会を追加する</PrimaryButton>
      </Form>
    </>
  )
}

export default AddRoom
