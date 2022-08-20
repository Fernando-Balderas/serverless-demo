import { BrowserRouter } from 'react-router-dom'
import { Amplify } from 'aws-amplify'
import { cognito } from 'src/utils/secrets'
import Routes from './routes/Routes'
import Card from '@mui/material/Card'
import './App.css'

Amplify.configure(cognito)

function App() {
  return (
    <BrowserRouter>
      <main>
        <Card sx={{ minWidth: 275, width: '600px' }}>
          <Routes />
        </Card>
      </main>
    </BrowserRouter>
  )
}

export default App
