import { VFC } from 'react'
import { useParams } from 'react-router-dom'

const UserSetting: VFC = () => {
  const { id } = useParams<{ id: string }>()
  console.log(id)
  return (
    <>
      <h1>usersetting</h1>
      <p>現在開発中です。もうしばらくお待ちください</p>
      <p>{id}</p>
    </>
  )
}

export default UserSetting
