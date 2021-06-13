import { useState, VFC } from 'react'
import { DatePicker, Form, Input, Radio, RadioChangeEvent } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import TextArea from 'antd/lib/input/TextArea'
// import moment from 'moment'
import { db } from '../../firebase/index'

const { RangePicker } = DatePicker

const RoomDetail: VFC = () => {
  // 第一引数のmomentの形でデータをセット
  const [startTimeDT, setStartTimeDT] = useState({})
  const [endTimeDT, setEndTimeDT] = useState({})
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
      starttimeDT: startTimeDT,
      endtimeDT: endTimeDT,
      meettype: meetType,
      message: message,
    })
    onReset()
    setMessage('')
  }

  // TODO:anyを取り除く
  const onChangeTime = (dates: any, dateStrings: [string, string]) => {
    // momentの形で取得できるdatesで受け取ることにする
    setStartTimeDT(dates[0].toArray())
    setEndTimeDT(dates[1].toArray())
    console.log('Selected Time: ', dates[0].toArray())
    console.log('Formatted Selected Time: ', endTimeDT)
  }

  const onChangeType = (e: RadioChangeEvent) => {
    //momentという形で渡す
    setMeetType(e.target.value)
  }

  return (
    <>
      <Form onFinish={onFinish} style={{ textAlign: 'center' }} form={form}>
        <Form.Item name="date-picker" label="DatePicker" rules={[{ required: true, message: 'Please input time!' }]}>
          <RangePicker showTime={{ format: 'HH:mm' }} format="YYYY-MM-DD HH:mm" onChange={onChangeTime} />
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
        <PrimaryButton>会を追加する</PrimaryButton>
      </Form>
    </>
  )
}

export default RoomDetail
