import { VFC } from 'react'
import { DatePicker, Form, Input, TimePicker, Select } from 'antd'
import 'antd/dist/antd.css'
import TextArea from 'antd/lib/input/TextArea'
const { Option } = Select

const SetRoomDetail: VFC<any> = (props) => {
  const { onChangeTitle, onChangeDay, disabledDate, onChangeTime, onChangeType, onChangeMessage } = props
  return (
    <>
      <Form.Item
        name="title"
        label="タイトル"
        initialValue={'もくもく会'}
        rules={[{ required: true, message: 'タイトルを記入して下さい' }]}
      >
        <Input defaultValue="もくもく会" onChange={onChangeTitle} style={{ width: 150 }} placeholder={'もくもく会'} />
      </Form.Item>
      <Form.Item name="date-picker" label="開催日" rules={[{ required: true, message: '日付を記入して下さい' }]}>
        <DatePicker format="YYYY-MM-DD" style={{ width: 150 }} onChange={onChangeDay} disabledDate={disabledDate} />
      </Form.Item>
      <Form.Item name="time-picker" label="開催時間" rules={[{ required: true, message: '時間を記入して下さい' }]}>
        <TimePicker.RangePicker format="HH:mm" onChange={onChangeTime} />
      </Form.Item>
      <Form.Item name="radio-group" label="カテゴリ" rules={[{ required: true, message: 'Please input type!' }]}>
        <Select style={{ width: 150 }} onChange={onChangeType}>
          <Option value="フロントエンド">フロントエンド</Option>
          <Option value="バックエンド">バックエンド</Option>
          <Option value="インフラ">インフラ</Option>
        </Select>
      </Form.Item>
      <Form.Item name="note" label="コメント" rules={[{ required: true, message: 'コメントを記入して下さい' }]}>
        <TextArea rows={4} placeholder={'今日やること'} onChange={onChangeMessage} />
      </Form.Item>
    </>
  )
}

export default SetRoomDetail
