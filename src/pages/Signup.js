import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from "react-router-dom";
import heart from '../heart.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Signup() {
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmRef = useRef();
  const { signUp } = useAuth()
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [validated, setValidated] = useState(false)
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()

    const form = e.currentTarget;
    if (form.checkValidity() === false) {
      return setError('Enter valid user email and password')
    }
    else if (passwordRef.current.value !== passwordConfirmRef.current.value) {
      return setError('Passwords do not match')
    }
    else {
      try {
        setError('')
        setLoading(true)
        console.log("email", emailRef.current.value)
        console.log("password", passwordRef.current.value)
        await signUp(emailRef.current.value, passwordRef.current.value)
        toast.success("You are successfully sign in", { autoClose: 3000 })
        setTimeout(() => {
          navigate('/')
        }, 3000)
      } catch (error) {
        setLoading(false)
        setError(`Failed to create an account ${error.message}`)
        console.log(error)
      }
      setLoading(false)
    }
  }

  return (
    <>
      <ToastContainer />
      <Container className="d-flex align-items-center justify-content-center mb-2 pb-5">
        <div className="w-100" style={{ maxWidth: "400px" }}>
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4 app-title-font">Sign Up</h2>
              {error && <Alert variant="danger">{error}</Alert>}
              <Form noValidate validated={validated} onSubmit={handleSubmit}>
                <Form.Group className="mb-3" id="email">
                  <Form.Label className="app-title-font">Email</Form.Label>
                  <Form.Control className="app-text-font" type="email" ref={emailRef} required />
                </Form.Group>
                <Form.Group className="mb-3" id="password">
                  <Form.Label className="app-title-font">Password</Form.Label>
                  <Form.Control type="password" ref={passwordRef} required />
                </Form.Group>
                <Form.Group className="mb-3" id="password-confirm">
                  <Form.Label className="app-title-font">Password Confirmation</Form.Label>
                  <Form.Control type="password" ref={passwordConfirmRef} required />
                </Form.Group>
                <Button variant="outline-dark" disabled={loading} className="w-100 app-title-font" type="submit">
                  Sign Up
                </Button>
              </Form>
            </Card.Body>
          </Card>
          <div className="w-100 text-center mt-2">
            Already have an account? <Link to='/login' className="text-dark">Log In</Link>
          </div>
        </div>
      </Container>
      <footer className='footer' style={{ overflowY: 'auto', backgroundColor: 'white', position: 'fixed', bottom: '0', width: '100%' }}>
        <Container>
          <div className="w-100 py-3 app-title-font" style={{ textAlign: 'center', fontSize: '15px' }}>
            Designed with <img src={heart} alt="Heart icon" /> by Dhruvi
          </div>
        </Container>
      </footer>
    </>
  );
}

export default Signup;
