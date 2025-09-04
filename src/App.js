import {Routes, Route} from 'react-router-dom'
import SignIn from './SignIn'
import Dashboard from './dashboard/Dashboard'

export default function App()
{
    return(
        <Routes>
            <Route path="/" element={<SignIn/>}></Route>
            <Route path="/dashboard" element={<Dashboard/>}></Route>

        </Routes>
    )
}