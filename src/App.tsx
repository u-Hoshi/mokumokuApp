import RoomTable from 'components/pages/Room'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { BrowserRouter } from 'react-router-dom'

import React, { VFC } from 'react'
import { Router } from 'components/router/Router'

const App: VFC = () => {
  return (
    <>
      <BrowserRouter>
        <div style={{ backgroundColor: '#EFF2F5', height: '100vh' }}>
          <Router />
        </div>
      </BrowserRouter>
      {/* <HeaderLayout />
      <RoomTable /> */}
    </>
  )
}

export default App
