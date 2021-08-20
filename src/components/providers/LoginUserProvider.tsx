import { auth, db } from '../../firebase/index'
import { Children, createContext, ReactNode, useEffect, useState } from 'react'
import { useHistory } from 'react-router'

type LoginUserContextType = {
  loginUser: any
}

export const LoginUserContext = createContext<any>({} as LoginUserContextType)

export const LoginUserProvider = (props: { children: ReactNode }) => {
  const { children } = props
  const [loginUser, setLoginUser] = useState<any>(null)
  const history = useHistory()
  // TODO anyを取り除く
  useEffect(() => {
    auth.onAuthStateChanged((user: any) => {
      if (user) {
        //
        const uid = user.uid
        //
        const fetchUser = async (uid: string) => {
          const user = await db
            .collection(`Users`)
            .doc(uid)
            .get()
            .then((d) => {
              const data: any = d.data()
              setLoginUser({
                uid: uid,
                email: data.email,
                password: data.password,
                displayname: data.displayname,
                imgurl: data.photoURL,
              })
            })
        }
        fetchUser(uid)
        console.log(loginUser)
      } else {
        history.push('/login')
      }
    })
  }, [])
  console.log(loginUser)
  // 別のProviderで保持するのもアリ
  return <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>{children}</LoginUserContext.Provider>
}
