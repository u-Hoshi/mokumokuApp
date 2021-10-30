import { Col, Table, Tabs, Typography } from 'antd'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { ColumnGroupType, ColumnType } from 'antd/lib/table'

const { TabPane } = Tabs

const { Title } = Typography

type joinColumnsProps = {
  title: string
  dataIndex: string
  width: number
  align: string
  key: string
}

const joinColumns: (ColumnGroupType<joinColumnsProps> | ColumnType<joinColumnsProps>)[] = [
  {
    title: '順位',
    dataIndex: 'ranking',
    width: 80,
    align: 'center',
    key: 'ranking',
  },
  {
    title: '名前',
    dataIndex: 'name',
    width: 100,
    align: 'center',
    key: 'name',
  },
  {
    title: '参加回数',
    dataIndex: 'joinNum',
    width: 100,
    align: 'center',
    key: 'joinNum',
  },
  {
    title: '自己紹介',
    dataIndex: 'comment',
    width: 100,
    align: 'center',
    key: 'comment',
  },
]

const hostColumns: (ColumnGroupType<joinColumnsProps> | ColumnType<joinColumnsProps>)[] = [
  {
    title: '順位',
    dataIndex: 'ranking',
    width: 80,
    align: 'center',
    key: 'ranking',
  },
  {
    title: '名前',
    dataIndex: 'name',
    width: 100,
    align: 'center',
    key: 'name',
  },
  {
    title: '開催回数',
    dataIndex: 'hostNum',
    width: 100,
    align: 'center',
    key: 'hostNum',
  },
  {
    title: '自己紹介',
    dataIndex: 'comment',
    align: 'center',
    key: 'comment',
  },
]
const Ranking: VFC = () => {
  const [joinNumDatas, setJoinNumDatas] = useState<any>([])
  const [hostNumDatas, setHostNumDatas] = useState<any>([])

  useEffect(() => {
    let count = 1
    let tmp = 0
    db.collection('Users')
      .orderBy('JoinNum', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc, index) => {
          // ○位タイの表示
          if (doc.data().JoinNum !== tmp) {
            count = index + 1
            tmp = doc.data().JoinNum
          }
          return {
            ranking: count,
            userId: doc.id,
            name: doc.data().displayname,
            joinNum: doc.data().JoinNum,
            comment: doc.data().message,
          }
        })
        setJoinNumDatas(users)
      })
  }, [])

  useEffect(() => {
    let count = 1
    let tmp = 0
    db.collection('Users')
      .orderBy('HostNum', 'desc')
      .limit(10)
      .onSnapshot((snapshot) => {
        const users = snapshot.docs.map((doc, index) => {
          // ○位タイの表示
          if (doc.data().HostNum !== tmp) {
            count = index + 1
            tmp = doc.data().HostNum
          }
          return {
            ranking: count,
            userId: doc.id,
            name: doc.data().displayname,
            hostNum: doc.data().HostNum,
            comment: doc.data().message,
          }
        })
        setHostNumDatas(users)
      })
  }, [])
  return (
    <>
      <HeaderLayout />
      <Col
        span={20}
        style={{ backgroundColor: 'white', padding: '15px', maxWidth: '1200px', width: '90%', margin: '0 auto' }}
      >
        <Title level={3}>ランキングTOP5</Title>

        <Tabs defaultActiveKey="1">
          <TabPane tab="参加数ランキング" key="1">
            <Table columns={joinColumns} pagination={false} dataSource={joinNumDatas} scroll={{ x: 1160 }} />
          </TabPane>
          <TabPane tab="開催数ランキング" key="2">
            <Table columns={hostColumns} pagination={false} dataSource={hostNumDatas} scroll={{ x: 1160 }} />
          </TabPane>
        </Tabs>
      </Col>
    </>
  )
}

export default Ranking
