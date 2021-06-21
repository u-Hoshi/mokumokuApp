import { auth } from '../../firebase/index'
import { Children, createContext, ReactNode, useEffect, useState } from 'react'
import { useHistory } from 'react-router'

type LoginUserContextType = {
  loginUser: any
}

const LoginUserContext = createContext<any>({} as LoginUserContextType)

export const LoginUserProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const [loginUser, setLoginUser] = useState<any>(null)
  const history = useHistory()
  // TODO anyを取り除く
  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        setLoginUser(user)
        console.log(user)
      } else {
        alert('ログインして下さい！')
        history.push('/login')
      }
    })
  }, [])

  // 別のProviderで保持するのもアリ
  return <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>{children}</LoginUserContext.Provider>
}
