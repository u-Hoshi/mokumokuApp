import { ChangeEventHandler, VFC } from 'react'
import { DatePicker, Form, Input, TimePicker, Select } from 'antd'
import 'antd/dist/antd.css'
import TextArea from 'antd/lib/input/TextArea'
import moment, { Moment } from 'moment'
import { RangeValue } from 'rc-picker/lib/interface.d'

const { Option } = Select

type CardSetRoomDetailType = {
  onChangeTitle: (event: React.ChangeEvent<HTMLInputElement>) => void
  onChangeDay: (value: Moment | null, dateString: string) => void
  disabledDate: (date: Moment) => boolean
  onChangeTime: (values: RangeValue<Moment>, formatString: [string, string]) => void
  onChangeType: (value: string) => void
  onChangeMessage: (event: React.ChangeEvent<HTMLTextAreaElement>) => void
  // id: string
  // AuthorId: string
  isAuthor: boolean
  hostDay: number[]
  endTime: number[]
  meetTitle: string
  meetType: string
  meetMessage: string
  startTime: number[]
}

const CardSetRoomDetail: VFC<CardSetRoomDetailType> = (props) => {
  const {
    onChangeTitle,
    onChangeDay,
    disabledDate,
    onChangeTime,
    onChangeType,
    onChangeMessage,
    isAuthor,
    meetTitle,
    hostDay,
    startTime,
    endTime,
    meetType,
    meetMessage,
  } = props

  return (
    <>
      <Form.Item
        name="title"
        label="タイトル"
        initialValue={meetTitle}
        rules={[{ required: true, message: 'タイトルを記入して下さい' }]}
      >
        <Input
          defaultValue={meetTitle}
          onChange={onChangeTitle}
          style={{ width: 150 }}
          placeholder={'もくもく会'}
          disabled={!isAuthor}
        />
      </Form.Item>
      <Form.Item name="date-picker" label="開催日" rules={[{ required: true, message: '日付を記入して下さい' }]}>
        <DatePicker
          defaultValue={moment(`${hostDay[0]}-${hostDay[1] + 1}-${hostDay[2]}`, 'YYYY-MM-DD')}
          format="YYYY-MM-DD"
          style={{ width: 150 }}
          onChange={onChangeDay}
          disabledDate={disabledDate}
          disabled={!isAuthor}
        />
      </Form.Item>
      <Form.Item name="time-picker" label="開催時間" rules={[{ required: true, message: '時間を記入して下さい' }]}>
        <TimePicker.RangePicker
          defaultValue={[
            moment(`${startTime[3]}:${startTime[4]}`, 'HH:mm'),
            moment(`${endTime[3]}:${endTime[4]}`, 'HH:mmD'),
          ]}
          format="HH:mm"
          onChange={onChangeTime}
          disabled={!isAuthor}
        />
      </Form.Item>
      <Form.Item name="radio-group" label="カテゴリ" rules={[{ required: true, message: 'Please input type!' }]}>
        <Select defaultValue={meetType} style={{ width: 150 }} onChange={onChangeType} disabled={!isAuthor}>
          <Option value="フロントエンド">フロントエンド</Option>
          <Option value="バックエンド">バックエンド</Option>
          <Option value="インフラ">インフラ</Option>
        </Select>
      </Form.Item>
      <Form.Item name="note" label="コメント" rules={[{ required: true, message: 'コメントを記入して下さい' }]}>
        <TextArea
          defaultValue={meetMessage}
          rows={4}
          placeholder={'今日やること'}
          onChange={onChangeMessage}
          disabled={!isAuthor}
        />
      </Form.Item>
    </>
  )
}

export default CardSetRoomDetail
