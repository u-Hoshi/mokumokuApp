import { useState, VFC } from 'react'
import { DatePicker, Form, message, Radio, RadioChangeEvent, TimePicker } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import TextArea from 'antd/lib/input/TextArea'
import dayjs from 'dayjs'
import { db } from '../../firebase/index'
import { RangeValue } from 'rc-picker/lib/interface.d'
import moment, { Moment } from 'moment'

const alert = message

// const { RangePicker } = DatePicker

const RoomDetail: VFC<any> = (props) => {
  const { user } = props
  // 第一引数のmomentの形でデータをセット
  const [hostDay, setHostDay] = useState({})
  const [startTime, setStartTime] = useState({})
  const [endTime, setEndTime] = useState({})
  const [meetType, setMeetType] = useState({})
  const [message, setMessage] = useState<string>('')
  const [form] = Form.useForm()

  // 送信後のフォームのリセット
  const onReset = () => {
    form.resetFields()
  }

  // ルームの追加処理
  const onFinish = () => {
    try {
      db.collection('Group1').add({
        hostDay: hostDay,
        startTime: startTime,
        endTime: endTime,
        meetType: meetType,
        message: message,
        Author: user.displayname,
        AuthorId: user.uid,
      })
      onReset()
      setMessage('')
      alert.success('ルーム追加成功')
    } catch (err) {
      alert.error('ルーム追加失敗')
      console.log(err)
    }
  }
  const onChangeDay = (day: Moment | null, dateString: string) => {
    console.log(dateString)
    if (day !== null) {
      setHostDay(day.toArray())
    }
  }

  function disabledDate(current: any) {
    // Can not select days before today and today
    return current && current < dayjs().subtract(1, 'day')
  }

  // TODO:anyを取り除く RangeValue<Moment>
  const onChangeTime = (times: RangeValue<Moment>, dateStrings: [string, string]) => {
    // const onChangeTime = (times: any, formatString: [string, string]) => {
    // momentの形で取得できるdatesで受け取ることにする
    console.log(dateStrings)
    console.log(typeof times)
    if (times !== null) {
      setStartTime(times![0]!.toArray())
      setEndTime(times![1]!.toArray())
    }
  }

  const onChangeType = (e: RadioChangeEvent) => {
    //momentという形で渡す
    setMeetType(e.target.value)
  }

  return (
    <>
      <Form onFinish={onFinish} style={{ textAlign: 'center' }} form={form}>
        <Form.Item name="date-picker" label="開催日" rules={[{ required: true, message: 'Please input time!' }]}>
          <DatePicker format="YYYY-MM-DD" onChange={onChangeDay} disabledDate={disabledDate} />
          {/* <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onChangeTime} /> */}
        </Form.Item>
        <Form.Item name="time-picker" label="開催時間" rules={[{ required: true, message: 'Please input time!' }]}>
          <TimePicker.RangePicker format="HH:mm" onChange={onChangeTime} />
          {/* <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onChangeTime} /> */}
        </Form.Item>
        <Form.Item name="radio-group" label="雰囲気" rules={[{ required: true, message: 'Please input type!' }]}>
          <Radio.Group onChange={onChangeType}>
            <Radio value={'もくもく'}>もくもく</Radio>
            <Radio value={'わいわい'}>わいわい</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <TextArea rows={4} placeholder="今日やること" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Item>
        <PrimaryButton style={{ marginLeft: '8' }}>会を追加する</PrimaryButton>
      </Form>
    </>
  )
}

export default RoomDetail
