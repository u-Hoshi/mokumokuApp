import { Avatar, Button, Col, Tooltip } from 'antd'
import { db } from '../../firebase/index'
import { useState, useEffect, VFC } from 'react'
import { useHistory } from 'react-router-dom'
import { GuestType } from 'types/guest'

const GuestMember: VFC<any> = ({ guest }) => {
  console.log(guest)
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
  }, [])

  const onClickGuest = () => {
    history.push(`/userprofile/${guest.guestId}`)
  }

  return (
    <>
      <Tooltip key={guest.guestId} title={guestName} placement="top">
        <Button shape="circle" ghost onClick={onClickGuest} style={{ height: '42px', padding: '0' }}>
          <Avatar src={guestImg} key={guest.guestId} />
        </Button>
      </Tooltip>
    </>
  )
}

export default GuestMember
