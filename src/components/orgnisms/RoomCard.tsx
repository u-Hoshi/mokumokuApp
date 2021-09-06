import { VFC } from 'react'
import { Form, Card, Avatar, Tooltip, Col, Row, Button, message } from 'antd'
import { PlusOutlined, SettingOutlined, MinusOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'
import CardSetRoomDetail from 'components/molecules/CardSetRoomDetail'
import { useEditRoom } from 'components/hooks/useEditRoom'
import { GuestType } from 'types/guest'
import { EditRoomType } from 'types/editroom'
const { Meta } = Card

const RoomCard: VFC<EditRoomType> = (props) => {
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
    isModalVisible,
    form,
    isJoin,
    isAuthor,
    guests,
    authorIcon,
    authorName,
    cardColor,
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
      <Col span={8} md={10} lg={10} xl={8} xxl={6}>
        {isJoin ? (
          <Card
            style={{ backgroundColor: `${cardColor}` }}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  showModal()
                }}
              />,
              <MinusOutlined
                key="attendance"
                onClick={() => {
                  cancelJoinMeeting()
                }}
              />,
            ]}
          >
            <Meta avatar={<Avatar src={authorIcon} />} title={roomMeetTitle} description={authorName} />
            <h3>{`${roomHostDay[1] + 1}月${roomHostDay[2]}日`}</h3>
            <h3>{`${roomStartTime[3]}時${roomStartTime[4]}分から${roomEndTime[3]}時${roomEndTime[4]}分まで`}</h3>
            <h4>{roomMeetType}</h4>
            <Row>
              <Col flex="1 1" style={{ overflow: 'hidden', wordWrap: 'break-word', height: '82px' }}>
                {roomMeetMessage}
              </Col>
              <Col flex="50px">
                <p>参加者</p>
                <Avatar.Group maxCount={1} size="large" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                  <Avatar src={authorIcon} />
                  {guests ? (
                    guests.map((guest: GuestType) => (
                      <Tooltip key={guest.guestId} title={guest.guestName} placement="top">
                        <Avatar src={guest.guestImg} key={guest.guestId} />
                      </Tooltip>
                    ))
                  ) : (
                    <p>...loading</p>
                  )}
                </Avatar.Group>
              </Col>
            </Row>
          </Card>
        ) : (
          <Card
            style={{ backgroundColor: `${cardColor}` }}
            actions={[
              <SettingOutlined
                key="setting"
                onClick={() => {
                  showModal()
                }}
              />,
              <PlusOutlined
                key="attendance"
                onClick={() => {
                  joinMeeting()
                }}
              />,
            ]}
          >
            <Meta avatar={<Avatar src={authorIcon} />} title={roomMeetTitle} description={authorName} />
            <h3>{`${roomHostDay[1] + 1}月${roomHostDay[2]}日`}</h3>
            <h3>{`${roomStartTime[3]}時${roomStartTime[4]}分から${roomEndTime[3]}時${roomEndTime[4]}分まで`}</h3>
            <h4>{roomMeetType}</h4>
            <Row>
              <Col flex="1 1" style={{ overflow: 'hidden', wordWrap: 'break-word', height: '82px' }}>
                {roomMeetMessage}
              </Col>
              <Col flex="50px">
                <p>参加者</p>
                <Avatar.Group maxCount={1} size="large" maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}>
                  <Avatar src={authorIcon} />
                  {guests ? (
                    guests.map((guest: GuestType) => (
                      <Tooltip key={guest.guestId} title={guest.guestName} placement="top">
                        <Avatar src={guest.guestImg} key={guest.guestId} />
                      </Tooltip>
                    ))
                  ) : (
                    <p>...loading</p>
                  )}
                </Avatar.Group>
              </Col>
            </Row>
          </Card>
        )}
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
        ) : (
          <Modal
            title="再設定"
            visible={isModalVisible}
            style={{ textAlign: 'center' }}
            onCancel={handleCancel}
            footer={[
              <Button key="back" onClick={handleCancel}>
                閉じる
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
      </Col>
    </>
  )
}

export default RoomCard
