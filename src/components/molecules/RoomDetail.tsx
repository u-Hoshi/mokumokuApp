import { useState, VFC } from 'react'
import { DatePicker, Form, message, Input, TimePicker, Select } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import TextArea from 'antd/lib/input/TextArea'
import dayjs from 'dayjs'
import { db } from '../../firebase/index'
import firebase from 'firebase'
import { RangeValue } from 'rc-picker/lib/interface.d'
import { Moment } from 'moment'

const alert = message
const { Option } = Select

const RoomDetail: VFC<any> = (props) => {
  const { user } = props
  // 第一引数のmomentの形でデータをセット
  const [meetTile, setMeetTitle] = useState<string>('')
  const [hostDay, setHostDay] = useState<number[]>([])
  const [startTime, setStartTime] = useState<number[]>([])
  const [endTime, setEndTime] = useState<number[]>([])
  const [meetType, setMeetType] = useState<string>('')
  const [message, setMessage] = useState<string>('')
  const [form] = Form.useForm()

  const onReset = () => {
    form.resetFields()
  }

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
        message: message,
      })
      onReset()
      setMessage('')
      alert.success('ルーム追加成功')
    } catch (err) {
      alert.error('ルーム追加失敗')
    }
  }

  const onChangeTitle = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMeetTitle(event.target.value)
  }

  console.log(meetTile)

  const onChangeDay = (day: Moment | null, dateString: string) => {
    console.log(dateString)
    if (day !== null) {
      setHostDay(day.toArray())
    }
  }

  function disabledDate(current: any) {
    return current && current < dayjs().subtract(1, 'day')
  }

  const onChangeTime = (times: RangeValue<Moment>, dateStrings: [string, string]) => {
    if (times !== null) {
      setStartTime(times![0]!.toArray())
      setEndTime(times![1]!.toArray())
    }
  }

  const onChangeType = (value: string) => {
    //momentという形で渡す
    setMeetType(value)
  }

  return (
    <>
      <Form onFinish={onFinish} style={{ textAlign: 'center' }} form={form}>
        <Form.Item name="title" label="タイトル" rules={[{ required: true, message: 'タイトルを記入して下さい' }]}>
          <Input defaultValue="もくもく会" onChange={onChangeTitle} style={{ width: 150 }} />
        </Form.Item>
        <Form.Item name="date-picker" label="開催日" rules={[{ required: true, message: '日付を記入して下さい' }]}>
          <DatePicker format="YYYY-MM-DD" style={{ width: 150 }} onChange={onChangeDay} disabledDate={disabledDate} />
        </Form.Item>
        <Form.Item name="time-picker" label="開催時間" rules={[{ required: true, message: '時間を記入して下さい' }]}>
          <TimePicker.RangePicker format="HH:mm" onChange={onChangeTime} />
        </Form.Item>
        <Form.Item name="radio-group" label="カテゴリ" rules={[{ required: true, message: 'Please input type!' }]}>
          <Select defaultValue="フロントエンド" style={{ width: 150 }} onChange={onChangeType}>
            <Option value="フロントエンド">フロントエンド</Option>
            <Option value="バックエンド">バックエンド</Option>
            <Option value="インフラ">インフラ</Option>
          </Select>
        </Form.Item>
        <Form.Item name="note" label="コメント" rules={[{ required: true, message: 'コメントを記入して下さい' }]}>
          <TextArea rows={4} placeholder="今日やること" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Item>
        <PrimaryButton style={{ marginLeft: '8' }}>会を追加する</PrimaryButton>
      </Form>
    </>
  )
}

export default RoomDetail
