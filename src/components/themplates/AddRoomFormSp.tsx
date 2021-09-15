import AddRoom from 'components/orgnisms/AddRoom'
import Header from 'components/orgnisms/Header'
import { VFC } from 'react'
import { Collapse } from 'antd'

const { Panel } = Collapse

const AddRoomFormSp: VFC = () => {
  return (
    <>
      <Collapse ghost style={{ margin: '0 auto', display: '100%' }}>
        <Panel header="会を登録する" key="1" style={{ padding: '0', margin: '0 auto', display: '100%' }}>
          <AddRoom />
        </Panel>
      </Collapse>
    </>
  )
}

export default AddRoomFormSp
