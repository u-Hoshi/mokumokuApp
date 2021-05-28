import { ChangeEvent, useState, VFC } from 'react'
import { Col, DatePicker, Form, Radio, RadioChangeEvent, Row } from 'antd'
import 'antd/dist/antd.css'
import PrimaryButton from 'components/atoms/PrimaryButton'
import TextArea from 'antd/lib/input/TextArea'
import { Dayjs } from 'dayjs'
import dayjsGenerateConfig from 'rc-picker/lib/generate/dayjs'
import generatePicker from 'antd/es/date-picker/generatePicker'
import moment from 'moment'

const { RangePicker } = DatePicker

//

//

const RoomDetail: VFC = () => {
  const [startTime, setStartTime] = useState('')
  const [endTime, setEndTime] = useState('')
  const [typeMeet, setTypeMeet] = useState({})
  const [message, setMessage] = useState<string>('')

  const onFinish = () => alert(message)

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
    setTypeMeet(e.target.value)
  }

  return (
    <>
      <Form onFinish={onFinish} style={{ textAlign: 'center' }}>
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
          <TextArea rows={4} placeholder="今日やること" onChange={(e) => setMessage(e.target.value)} />
        </Form.Item>
        <PrimaryButton />
      </Form>
    </>
  )
}

export default RoomDetail
