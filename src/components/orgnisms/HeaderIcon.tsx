import { useContext, VFC } from 'react'
import { Menu, Dropdown, Button, Space, Avatar } from 'antd'
import { LoginUserContext } from 'components/providers/LoginUserProvider'

const HeaderIcon: VFC = () => {
  const { loginUser } = useContext(LoginUserContext)
  return (
    <>
      <Menu>
        <Menu.Item>
          <Avatar src={loginUser?.imgurl} />▼
        </Menu.Item>
      </Menu>
    </>
  )
}

export default HeaderIcon
