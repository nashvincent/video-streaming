import React, { useState, useEffect } from 'react'
import { v1 as uuid } from 'uuid'
import axios from 'axios'

const baseUrl = 'http://localhost:8000/api/login'
let token = null

export default function Home(props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [userType, setUserType] = useState('student')
  const [username, setUsername] = useState('')
  const [userSubjects, setUserSubjects] = useState([])

  const createP2PRoom = () => {
    const id = uuid()
    props.history.push(`/room/${id}`)
  }

  const setToken = newToken => {
    token = `bearer ${newToken}`
  }
  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedStreamer')
    console.log(loggedUserJSON)
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      const type = user.data.type
      setUserType(type)
      setUsername(user.data.username)
      setUserSubjects(user.data.subjects)
      setToken(user.data.token)
      console.log('type: ', userType)
      console.log('user: ', username)
      console.log('subjects:', userSubjects)
      console.log('token: ', token)
    }
  }, [])
  const create = ({ title, subjectCode }) => {
    console.log(title, subjectCode)
    const id = `subject/${subjectCode}`
    props.history.push({
      pathname: id,
      data: { username },
      state: { detail: username },
    })
  }
  const NavBar = ({ contents, roomtype, uname }) => {
    return (
      <nav className="navbar navbar-dark bg-dark" style={{ color: 'white' }}>
        <div>
          {contents} {roomtype}'s portal {uname}!
        </div>
        <div>
          <button className="btn btn-secondary" onClick={logOut}>
            Log Out
          </button>
        </div>
      </nav>
    )
  }
  const logOut = () => {
    window.localStorage.removeItem('loggedStreamer')
    setUser(null)
    setUsername('')
    setToken(null)
    setUserSubjects([])
  }
  const NavBarLogin = ({ contents }) => {
    return (
      <nav
        className="navbar navbar-dark bg-dark"
        style={{ justifyContent: 'center', color: 'white' }}
      >
        {contents}
      </nav>
    )
  }
  const loginForm = () => (
    <div style={{ backgroundColor: 'lightblue' }}>
      <NavBarLogin contents="Join Classroom" />
      <div
        style={{
          width: '100%',
          height: '92vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <div className="card" style={{ width: '18rem', padding: '25px' }}>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label for="email">Email</label>
              <input
                className="form-control"
                type="email"
                value={email}
                name="Email"
                onChange={({ target }) => setEmail(target.value)}
              />
            </div>
            <div className="form-group">
              <label for="password">Password</label>
              <input
                type="password"
                className="form-control"
                value={password}
                name="Password"
                onChange={({ target }) => setPassword(target.value)}
              />
            </div>
            <button className="btn btn-primary" type="submit">
              login
            </button>
          </form>
        </div>
      </div>
    </div>
  )

  const studentLandingPage = () => (
    <div style={{ backgroundColor: 'lightblue' }}>
      <NavBar contents="Welcome to " uname={username} roomtype={userType} />
      <div
        style={{
          width: '100%',
          height: '92vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <table className="table table-dark" style={{ width: '20rem' }}>
          <thead>
            <tr>
              <th scope="col">Subject</th>
              <th scope="col">Subject Code</th>
              <th scope="col">Teacher</th>
              <th scope="col">Classroom</th>
            </tr>
          </thead>
          <tbody>
            {userSubjects.map(subject => (
              <tr>
                <th scope="row">{subject.title}</th>
                <td>{subject.subjectCode}</td>
                <td>{subject.teacher}</td>
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      create({
                        title: subject.title,
                        subjectCode: subject.subjectCode,
                        uname: username,
                      })
                    }}
                  >
                    Join
                  </button>
                </td>
              </tr>
            ))}
            <tr>
              <th scope="row">Private Channel</th>
              <td>-</td>
              <td>-</td>
              <td>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    createP2PRoom()
                  }}
                >
                  Join
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
  const teacherLandingPage = () => (
    <div style={{ backgroundColor: 'lightblue' }}>
      <NavBar contents="Welcome to " uname={username} roomtype={userType} />
      <div
        style={{
          width: '100%',
          height: '92vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <table className="table table-dark" style={{ width: '20rem' }}>
          <thead>
            <tr>
              <th scope="col">Subjects</th>
              <th scope="col">Classrooms</th>
            </tr>
          </thead>
          <tbody>
            {/* <tr>
          <th scope="row">Subject 1</th>
          <td><button className="btn btn-primary" onClick={create}>Create Class</button></td> 
        </tr>
         <tr>
          <th scope="row">Subject 2</th>
          <td><button className="btn btn-primary" onClick={create}>Create Class</button></td> 
        </tr>
        <tr>
          <th scope="row">Subject 3</th>
          <td><button className="btn btn-primary" onClick={create}>Create Class</button></td> 
        </tr> */}
            {userSubjects.map(subject => (
              <tr>
                <th scope="row">{subject.title}</th>
                <td>{subject.subjectCode}</td>
                {/* <td>{subject.teacher}</td> */}
                <td>
                  <button
                    className="btn btn-primary"
                    onClick={() => {
                      create({ title: subject.title, subjectCode: subject.subjectCode })
                    }}
                  >
                    Create Class
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
  const handleLogin = async event => {
    event.preventDefault()
    try {
      const user = await axios.post(baseUrl, { email, password })
      setUser(user)
      setEmail('')
      setPassword('')
      const type = user.data.type
      setUserType(type)
      setUsername(user.data.username)
      setUserSubjects(user.data.subjects)
      window.localStorage.setItem('loggedStreamer', JSON.stringify(user))
      setToken(user.token)
      console.log(user)
    } catch (exception) {
      console.log(exception)
      console.log('wrong credentials')
    }
  }
  return (
    <div>
      {user === null && loginForm()}
      {user !== null &&
        (userType === 'student' ? studentLandingPage() : teacherLandingPage())}
    </div>
  )
}
