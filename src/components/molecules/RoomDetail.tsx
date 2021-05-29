import { useState, VFC } from 'react'
import { DatePicker, Form, Input, Radio, RadioChangeEvent } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import TextArea from 'antd/lib/input/TextArea'
// import moment from 'moment'
import { db } from '../../firebase/index'

const { RangePicker } = DatePicker

const RoomDetail: VFC = () => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [meetType, setMeetType] = useState({})
  const [message, setMessage] = useState<string>('')
  const [form] = Form.useForm()

  // 送信後のフォームのリセット
  const onReset = () => {
    form.resetFields()
  }

  // ルームの追加処理
  const onFinish = () => {
    db.collection('Group1').add({
      starttime: startTime,
      endtime: endTime,
      meettype: meetType,
      message: message,
    })
    onReset()
    setMessage('')
  }

  // TODO:anyを取り除く
  const onChangeTime = (dates: any, dateStrings: [string, string]) => {
    // TODO datesかdateStringsで渡すか検討
    setStartTime(dateStrings[0])
    setEndTime(dateStrings[1])
    console.log('Selected Time: ', dates)
    console.log('Formatted Selected Time: ', dateStrings)
  }

  const onChangeType = (e: RadioChangeEvent) => {
    // TODO target.valueで渡すかオブジェクトで渡すか検討
    setMeetType(e.target.value)
  }

  return (
    <>
      <Form onFinish={onFinish} style={{ textAlign: 'center' }} form={form}>
        <Form.Item name="date-picker" label="DatePicker">
          <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onChangeTime} />
        </Form.Item>
        <Form.Item name="radio-group" label="雰囲気">
          <Radio.Group onChange={onChangeType}>
            <Radio value={'quiet'}>もくもく</Radio>
            <Radio value={'busy'}>わいわい</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item>
          <TextArea rows={4} placeholder="今日やること" value={message} onChange={(e) => setMessage(e.target.value)} />
        </Form.Item>
        <PrimaryButton />
      </Form>
    </>
  )
}

export default RoomDetail
