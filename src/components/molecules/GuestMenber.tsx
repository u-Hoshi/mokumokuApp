import { Avatar, Button, Col, Tooltip } from 'antd'
import { db } from '../../firebase/index'
import { useState, useEffect, VFC } from 'react'
import { useHistory } from 'react-router-dom'

const GuestMember: VFC<any> = ({ guest }) => {
  const history = useHistory()
  const [guestName, setGuestName] = useState('')
  const [guestImg, setGuestImg] = useState('')

  useEffect(() => {
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

  const onClickGuest = () => {
    history.push(`/userprofile/${guest.guestId}`)
  }

  return (
    <>
      <Tooltip key={guest.guestId} title={guestName} placement="top">
        <Button shape="circle" ghost onClick={onClickGuest}>
          <Avatar src={guestImg} key={guest.guestId} />
        </Button>
      </Tooltip>
    </>
  )
}

export default GuestMember
