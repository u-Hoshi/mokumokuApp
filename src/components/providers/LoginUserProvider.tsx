import { auth, db } from '../../firebase/index'
import { Children, createContext, ReactNode, useEffect, useState } from 'react'
import { useHistory } from 'react-router'

type LoginUserContextType = {
  loginUser: any
}

export const LoginUserContext = createContext<any>({} as LoginUserContextType)

export const LoginUserProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const [loginUser, setLoginUser] = useState<any>()
  const [hoge, setHoge] = useState<any>('')
  const history = useHistory()
  // TODO anyを取り除く
  useEffect(() => {
    console.log('0')
    auth.onAuthStateChanged(async (user: any) => {
      console.log('1')
      console.log(user)
      setLoginUser(user)
      setHoge('hoge')
      console.log(loginUser)
      console.log(hoge)
      if (user) {
        const uid = user.uid
        console.log('2')
        const fetchUser = async (uid: string) => {
          console.log('3')
          await db
            .collection(`Users`)
            .doc(uid)
            .get()
            .then(async (d) => {
              console.log(d.data())
              const data: any = d.data()
              await setLoginUser({
                uid: uid,
                password: data.password,
                displayname: data.displayname,
                imgurl: data.photoURL,
              })
              console.log(loginUser)
            })
          console.log('5')
        }
        fetchUser(uid)
        console.log(hoge)
        console.log(loginUser)
        console.log('6')
      } else {
        console.log('null' + loginUser)
        history.push('/login')
      }
    })
  }, [])

  // 別のProviderで保持するのもアリ
  return <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>{children}</LoginUserContext.Provider>
}
