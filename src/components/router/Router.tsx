import Login from 'components/pages/Login'
import Room from 'components/pages/Room'
import Signup from 'components/pages/Signup'
import UserSetting from 'components/pages/UserSetting'
import { LoginUserProvider } from 'components/providers/LoginUserProvider'
import { VFC } from 'react'
import { Route, Switch } from 'react-router'

export const Router: VFC = () => {
  return (
    <Switch>
      <Route path="/login">
        <Login />
      </Route>
      <Route path="/signup">
        <Signup />
      </Route>
      <LoginUserProvider>
        <Route exact path="/">
          <Room />
        </Route>
        <Route path="/usersetting">
          <UserSetting />
        </Route>
      </LoginUserProvider>
    </Switch>
  )
}
