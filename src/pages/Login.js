import React, { useEffect, useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Link, useNavigate } from 'react-router-dom'
import googleIcon from '../google_1.png'
import heart from '../heart.png'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Login() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const { login, logInWithGoogle } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    useEffect(() => {
        emailRef.current.focus()
    }, [])

    const handleSigninWithGoogle = async e => {
        try {
            setError('')
            setLoading(true)
            await logInWithGoogle()
            toast.success("You are successfully logged in", { autoClose: 3000 })
            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            setLoading(false)
            setError(`Failed to sign in ${error.message}`)
            console.log(error)
        }
        setLoading(false)
    }

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setError('')
            setLoading(true)
            await login(emailRef.current.value, passwordRef.current.value)
            toast.success("You are successfully logged in", { autoClose: 3000 })
            setTimeout(() => {
                navigate('/')
            }, 3000)
        } catch (error) {
            setLoading(false)
            setError(`Failed to sign in ${error.message}`)
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <>
            <ToastContainer />
            <Container className="d-flex align-items-center justify-content-center py-5">
                <div className="w-100 py-3" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4 app-title-font">Log In</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" id="email">
                                    <Form.Label className='app-title-font'>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Form.Group className='mb-3' id="password">
                                    <Form.Label className='app-title-font'>Password</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} required />
                                </Form.Group>
                                <div className="d-flex justify-content-center mt-2 app-title-font">
                                    <Button disabled={loading} variant="outline-dark" type="submit">
                                        Log In
                                    </Button>
                                </div>
                            </Form>
                            <div className="w-100 text-center mt-3 app-title-font">
                                <Link variant='dark' to='/forgot-password' className='text-dark'>Forgot Password?</Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2 app-title-font">
                        <Button className="p-2 mb-2" onClick={handleSigninWithGoogle} variant="outline-dark">
                            <img src={googleIcon} alt="img" className="mx-1" /> Sign in with Google
                        </Button><br />
                        Need an account? <Link to='/signup' className='text-dark'>Sign Up</Link>
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

export default Login;
