import { VFC } from 'react'
import { Form, Card, Avatar, Tooltip, Col, Row, Button, message } from 'antd'
import { PlusOutlined, SettingOutlined, MinusOutlined } from '@ant-design/icons'
import Modal from 'antd/lib/modal/Modal'
import CardSetRoomDetail from 'components/molecules/CardSetRoomDetail'
import { useEditRoom } from 'components/hooks/useEditRoom'
import { GuestType } from 'types/guest'
import { EditRoomType } from 'types/editroom'
import GuestMember from 'components/molecules/GuestMenber'
import { useHistory } from 'react-router-dom'
const { Meta } = Card

const RoomCard: VFC<EditRoomType> = (props) => {
  const {
    cardSort,
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

  const history = useHistory()

  const onClickHost = () => {
    history.push(`/userprofile/${roomAuthorId}`)
  }

  return (
    <>
      <Col
        // span={8}
        // sm={12}
        // md={12}
        // lg={8}
        // xl={8}
        // xxl={6}
        style={{ width: '330px' }}
      >
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
                  cardSort ? cancelJoinMeeting() : message.error('開催済みのため参加キャンセルが出来ません')
                }}
              />,
            ]}
          >
            <Meta
              avatar={
                <Button shape="circle" ghost onClick={onClickHost}>
                  <Avatar src={authorIcon} />
                </Button>
              }
              title={roomMeetTitle}
              description={authorName}
            />
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
                  <Button shape="circle" ghost onClick={onClickHost} style={{ height: '42px', padding: '0' }}>
                    <Avatar src={authorIcon} />
                  </Button>
                  {guests ? guests.map((guest: GuestType) => <GuestMember guest={guest} />) : <p>...loading</p>}
                </Avatar.Group>
              </Col>
            </Row>
          </Card>
        ) : (
          <Card
            style={{ backgroundColor: `${cardColor}`, boxShadow: '3px 3px 5px rgb(221, 221, 221)' }}
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
                  cardSort ? joinMeeting() : message.error('開催済みのため参加出来ません')
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
                  <Button shape="circle" ghost onClick={onClickHost} style={{ height: '42px', padding: '0' }}>
                    <Avatar src={authorIcon} />
                  </Button>
                  {guests ? guests.map((guest: GuestType) => <GuestMember guest={guest} />) : <p>...loading</p>}
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
              <Button key="back" onClick={() => handleCancel()}>
                キャンセル
              </Button>,
              <Button
                type="primary"
                danger
                onClick={() => (cardSort ? handleDelete() : message.error('開催済みのため削除出来ません'))}
              >
                削除
              </Button>,
              <Button key="submit" type="primary" onClick={() => handleChange()}>
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
