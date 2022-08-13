import { useState } from 'react'
import SignOutBtn from 'src/components/SignOutBtn'
import axiosi from 'src/helpers/axios/instance'
import useAuth from 'src/hooks/useAuth'

type Rides = {
  Count: number
  Items: Ride[]
}

type Ride = {
  RideId: string
  UnicornName: string
  User: string
  Unicorn: Unicorn
}

type Unicorn = {
  Name: string
  Color: string
  Gender: string
}

function Dashboard() {
  const localAuth = useAuth()
  const [loading, setLoading] = useState(false)
  const [rides, setRides] = useState<Rides>({ Count: 0, Items: [] })

  const handleClick = async () => {
    console.log('handling click')
    setLoading(true)
    try {
      const res = await axiosi.get('/ride', {
        headers: {
          Authorization: localAuth.accessToken,
        },
      })
      setRides(res.data)
      console.log('response ', res.data)
    } catch (error: any) {
      console.warn(error.message || 'Error')
    }
    setLoading(false)
  }

  return (
    <>
      <SignOutBtn />
      <h1>Dashboard</h1>
      <button type="button" disabled={loading} onClick={handleClick}>
        Get Rides
      </button>
      {/* <button type="button">New Ride</button> */}
      <ul>
        {rides.Count > 0 &&
          rides.Items.map((ride) => (
            <li key={ride.RideId}>
              {ride.UnicornName}
              {/* <button type="button">Edit</button> */}
              {/* <button type="button">Delete</button> */}
            </li>
          ))}
      </ul>
    </>
  )
}

export default Dashboard
