import { VFC } from 'react'
import { Form, Button } from 'antd'
import Modal from 'antd/lib/modal/Modal'
import CardSetRoomDetail from 'components/molecules/CardSetRoomDetail'
import { useEditRoom } from 'components/hooks/useEditRoom'
import { EditRoomType } from 'types/editroom'

const RoomCalendarSquare: VFC<EditRoomType> = (props) => {
  const {
    roomAuthorId,
    roomHostDay,
    roomEndTime,
    roomMeetTitle,
    roomMeetType,
    roomMeetMessage,
    roomStartTime,
    roomId,
  } = props

  const {
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
    meetTitle,
    isModalVisible,
    form,
    isJoin,
    isAuthor,
  } = useEditRoom(
    roomAuthorId,
    roomHostDay,
    roomEndTime,
    roomMeetTitle,
    roomMeetType,
    roomMeetMessage,
    roomStartTime,
    roomId
  )

  return (
    <>
      <Button
        block
        size="small"
        style={{
          borderColor: '#1890FF',
          overflow: 'hidden',
          // width: '100px',
        }}
        onClick={() => {
          showModal()
        }}
      >
        {/* TODO タイトルも決めれるようにする */}
        {meetTitle}
      </Button>
      {isAuthor ? (
        <Modal
          title="再設定"
          visible={isModalVisible}
          style={{ textAlign: 'center' }}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              キャンセル
            </Button>,
            <Button type="primary" danger onClick={handleDelete}>
              削除
            </Button>,
            <Button key="submit" type="primary" onClick={handleChange}>
              変更
            </Button>,
          ]}
        >
          <Form style={{ textAlign: 'center' }} form={form}>
            <CardSetRoomDetail
              isAuthor={isAuthor}
              meetTitle={roomMeetTitle}
              hostDay={roomHostDay}
              startTime={roomStartTime}
              endTime={roomEndTime}
              meetType={roomMeetType}
              meetMessage={roomMeetMessage}
              onChangeTitle={onChangeTitle}
              onChangeDay={onChangeDay}
              disabledDate={disabledDate}
              onChangeTime={onChangeTime}
              onChangeType={onChangeType}
              onChangeMessage={onChangeMessage}
            />
          </Form>
        </Modal>
      ) : isJoin ? (
        <Modal
          title="再設定"
          visible={isModalVisible}
          style={{ textAlign: 'center' }}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              キャンセル
            </Button>,
            <Button type="primary" danger onClick={() => cancelJoinMeeting()}>
              参加をやめる
            </Button>,
          ]}
        >
          <Form style={{ textAlign: 'center' }} form={form}>
            <CardSetRoomDetail
              isAuthor={isAuthor}
              meetTitle={roomMeetTitle}
              hostDay={roomHostDay}
              startTime={roomStartTime}
              endTime={roomEndTime}
              meetType={roomMeetType}
              meetMessage={roomMeetMessage}
              onChangeTitle={onChangeTitle}
              onChangeDay={onChangeDay}
              disabledDate={disabledDate}
              onChangeTime={onChangeTime}
              onChangeType={onChangeType}
              onChangeMessage={onChangeMessage}
            />
          </Form>
        </Modal>
      ) : (
        <Modal
          title="再設定"
          visible={isModalVisible}
          style={{ textAlign: 'center' }}
          onCancel={handleCancel}
          footer={[
            <Button key="back" onClick={handleCancel}>
              キャンセル
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={() => {
                joinMeeting()
              }}
            >
              参加をする
            </Button>,
          ]}
        >
          <Form style={{ textAlign: 'center' }} form={form}>
            <CardSetRoomDetail
              isAuthor={isAuthor}
              meetTitle={roomMeetTitle}
              hostDay={roomHostDay}
              startTime={roomStartTime}
              endTime={roomEndTime}
              meetType={roomMeetType}
              meetMessage={roomMeetMessage}
              onChangeTitle={onChangeTitle}
              onChangeDay={onChangeDay}
              disabledDate={disabledDate}
              onChangeTime={onChangeTime}
              onChangeType={onChangeType}
              onChangeMessage={onChangeMessage}
            />
          </Form>
        </Modal>
      )}
    </>
  )
}

export default RoomCalendarSquare
