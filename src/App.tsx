import RoomTable from 'components/pages/Room'
import HeaderLayout from 'components/themplates/HeaderLayout'
import { BrowserRouter } from 'react-router-dom'

import React, { VFC } from 'react'
import { Router } from 'components/router/Router'

const App: VFC = () => {
  return (
    <>
      <BrowserRouter>
        <Router></Router>
      </BrowserRouter>
      {/* <HeaderLayout />
      <RoomTable /> */}
    </>
  )
}

export default App
