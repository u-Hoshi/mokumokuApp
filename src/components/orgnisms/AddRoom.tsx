import { useState, VFC } from 'react'
import { Form, message } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import dayjs from 'dayjs'
import { db } from '../../firebase/index'
import firebase from 'firebase'
import { RangeValue } from 'rc-picker/lib/interface.d'
import { Moment } from 'moment'
import SetRoomDetail from 'components/molecules/SetRoomDetail'

const alert = message

const AddRoom: VFC<any> = (props) => {
  const { user } = props
  const [meetTile, setMeetTitle] = useState<string>('もくもく会')
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
        meetTitle: meetTile,
        Author: user.displayname,
        AuthorId: user.uid,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        hostDay: hostDay,
        startDayTimeInt: startDayTimeInt,
        startTime: startTime,
        endTime: endTime,
        meetType: meetType,
        meetMessage: meetMessage,
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
      <Form onFinish={onFinish} style={{ textAlign: 'center' }} form={form}>
        <SetRoomDetail
          onChangeTitle={onChangeTitle}
          onChangeDay={onChangeDay}
          disabledDate={disabledDate}
          onChangeTime={onChangeTime}
          onChangeType={onChangeType}
          onChangeMessage={onChangeMessage}
        />
        <PrimaryButton style={{ marginLeft: '8' }}>会を追加する</PrimaryButton>
      </Form>
    </>
  )
}

export default AddRoom
