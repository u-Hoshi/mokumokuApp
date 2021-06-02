import RoomTable from 'components/pages/Room'
import HeaderLayout from 'components/themplates/HeaderLayout'
import React, { VFC } from 'react'

const App: VFC = () => {
  return (
    <>
      <HeaderLayout />
      <RoomTable />
    </>
  )
}

export default App
