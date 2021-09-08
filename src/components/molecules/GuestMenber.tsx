import { Avatar, Tooltip } from 'antd'
import { db } from '../../firebase/index'
import { useState, useEffect, VFC } from 'react'

const GuestMember: VFC<any> = ({ guest }) => {
  const [guestName, setGuestName] = useState('')
  const [guestImg, setGuestImg] = useState('')

  useEffect(() => {
    console.log(guest.uid)
    db.collection('Users')
      .doc(guest.guestId)
      .get()
      .then((doc) => {
        if (doc.exists) {
          setGuestName(doc.data()?.displayname)
          setGuestImg(doc.data()?.imgurl)
        } else {
          console.log('not documentdata')
        }
      })
    console.log(guestImg)
  }, [])

  console.log(guestImg)

  return (
    <>
      <Tooltip key={guest.guestId} title={guestName} placement="top">
        <Avatar src={guestImg} key={guest.guestId} />
      </Tooltip>
    </>
  )
}

export default GuestMember
