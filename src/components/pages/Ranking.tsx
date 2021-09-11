import { Button, Col, Table, Tabs, Typography } from 'antd'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { db } from '../../firebase/index'
import { useEffect, useState, VFC } from 'react'
import { useHistory } from 'react-router-dom'

const { TabPane } = Tabs

const { Title } = Typography

const Ranking: VFC = () => {
  const history = useHistory()
  const joinColumns: any = [
    {
      title: '順位',
      dataIndex: 'ranking',
      width: 100,
      align: 'center',
      key: 'ranking',
    },
    // {
    //   title: '名前',
    //   dataIndex: 'name',
    //   width: 100,
    //   key: 'name',
    //   render: ({ userId, name }: { userId: string; name: string }) => {
    //     console.log(name)
    //     return <a>{name}</a>
    //   },
    // },
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
      align: 'center',
      key: 'comment',
    },
  ]

  const hostColumns: any = [
    {
      title: '順位',
      dataIndex: 'ranking',
      width: 100,
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

  const defaultCurrent = 1
  return (
    <>
      <HeaderLayout />
      <Col span={20} offset={2} style={{ backgroundColor: 'white', padding: '20px' }}>
        <Title level={3}>ランキング</Title>

        <Tabs defaultActiveKey="1">
          <TabPane tab="参加数ランキング" key="1">
            <Table columns={joinColumns} pagination={false} dataSource={joinNumDatas} />
          </TabPane>
          <TabPane tab="開催数ランキング" key="2">
            <Table columns={hostColumns} pagination={false} dataSource={hostNumDatas} />
          </TabPane>
        </Tabs>
      </Col>
    </>
  )
}

export default Ranking
