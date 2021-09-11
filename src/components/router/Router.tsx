import Login from 'components/pages/Login'
import Ranking from 'components/pages/Ranking'
import Room from 'components/pages/Room'
import Signup from 'components/pages/Signup'
import UserSetting from 'components/pages/UserSetting'
import { LoginUserProvider } from 'components/providers/LoginUserProvider'
import { VFC } from 'react'
import { Route, Switch } from 'react-router-dom'

export const Router: VFC = () => {
  return (
    <Switch>
      <LoginUserProvider>
        <Route path="/login">
          <Login />
        </Route>
        <Route path="/signup">
          <Signup />
        </Route>
        <Route exact path="/">
          <Room />
        </Route>
        <Route path="/usersetting/:id">
          <UserSetting />
        </Route>
        <Route path="/ranking">
          <Ranking />
        </Route>
      </LoginUserProvider>
    </Switch>
  )
}
