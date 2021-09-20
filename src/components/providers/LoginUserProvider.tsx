import { auth, db } from '../../firebase/index'
import { Children, createContext, ReactNode, useEffect, useState } from 'react'
import { useHistory } from 'react-router'
import { UserType } from 'types/user'

// export const LoginUserContext = createContext<UserType>({ uid: '', email: '', password: '', displayname: '' })
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
          await db
            .collection(`Users`)
            .doc(uid)
            .get()
            .then((d) => {
              const data: any = d.data()
              if (d.data !== undefined) {
                setLoginUser({
                  uid: uid,
                  email: data.email,
                  password: data.password,
                  displayname: data.displayname,
                  imgurl: data.imgurl,
                })
              }
            })
        }
        fetchUser(uid)
      } else {
        history.push('/login')
      }
    })
  }, [])
  history

  // 別のProviderで保持するのもアリ
  return <LoginUserContext.Provider value={{ loginUser, setLoginUser }}>{children}</LoginUserContext.Provider>
}
