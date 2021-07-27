import RoomCard from 'components/molecules/RoomCard'
import JoinedRoomCard from 'components/molecules/JoinedRoomCard'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC, useContext } from 'react'
import Room from 'components/pages/Room'
import { Col, Row } from 'antd'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

type room = {
  id: string
  AuthorId: string
  isJoin: string[]
  hoge: string[]
  endtimeDT: []
  meettype: string
  message: string
  starttimeDT: []
}
const RoomTable: VFC = () => {
  const { loginUser } = useContext<any>(LoginUserContext)
  // TODO anyを取り除く
  const [allrooms, setRooms] = useState<any>([])
  console.log(loginUser)
  // 全ルームの情報を取得取得
  useEffect(() => {
    db.collection('Group1').onSnapshot((snapshot) => {
      const rooms = snapshot.docs.map((doc) => {
        // ここで参加するかしないか判断する
        const participant: string[] = []
        const join = async () => {
          await db.collection(`Group1/${doc.id}/guests`).onSnapshot((ref) => {
            ref.docs.map((doc) => {
              // TODO (1)loginUserに情報が入ってからRoomTableがレンダリングされるようにしたい,useEffectの第二引数も空にしたい
              // if (loginUser !== null && doc.id === loginUser.uid) {
              //   return (isJoin = true)
              // } else {
              //   return (isJoin = false)
              // }
              // console.log(doc.id)

              // console.log('1')
              participant.push(doc.id)
              // console.log(participant)
              // const bar = {
              //   hoge: 'foo',
              //   bon: participant,
              // }
              // console.log(bar)
            })
          })
        }
        join()

        // console.log(participant)
        return {
          id: doc.id,
          hoge: ['hoeg', 'hoge'],
          isJoin: participant,
          ...doc.data(),
        }
      })
      // console.log('1' + rooms)
      // ↑では[{}]だが↓では[object object]の形で代入される
      setRooms(rooms)
      // console.log('2' + rooms)
    })
    // TODO (1)と一緒に変更する
  }, [loginUser])
  return (
    <>
      <Row gutter={[8, 40]}>
        {allrooms ? (
          allrooms.map((room: room) => (
            <Col span={8} key={room.id}>
              {/* {console.log(loginUser.uid in room.isJoin ? console.log('hoge') : console.log(room.isJoin))} */}
              {/* {console.log(room.isJoin)} */}
              {console.log(loginUser.uid)}
              {/* {console.log(room.isJoin.includes('2oy4j0TVUFgNoeDTVutRny48VT42'))} */}
              {/* {room.isJoin.includes('2oy4j0TVUFgNoeDTVutRny48VT42') ? (
                <JoinedRoomCard
                  key={room.id}
                  AuthorId={room.AuthorId}
                  startTimeDT={room.starttimeDT}
                  endTimeDT={room.endtimeDT}
                  meettype={room.meettype}
                  message={room.message}
                  roomId={room.id}
                />
              ) : (
                <RoomCard
                  key={room.id}
                  AuthorId={room.AuthorId}
                  startTimeDT={room.starttimeDT}
                  endTimeDT={room.endtimeDT}
                  meettype={room.meettype}
                  message={room.message}
                  roomId={room.id}
                />
              )} */}
              <RoomCard
                key={room.id}
                AuthorId={room.AuthorId}
                startTimeDT={room.starttimeDT}
                endTimeDT={room.endtimeDT}
                meettype={room.meettype}
                message={room.message}
                roomId={room.id}
              />
            </Col>
          ))
        ) : (
          <p>...loading</p>
        )}
      </Row>
    </>
  )
}

export default RoomTable
