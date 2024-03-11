import React, { useRef, useState } from "react";
import { Form, Button, Card, Alert, Container } from "react-bootstrap";
import { useAuth } from "../hooks/useAuth";
import { Link } from 'react-router-dom'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function ForgotPassword() {
    const emailRef = useRef();
    const { resetPassword } = useAuth()
    const [messge, setMessage] = useState('')
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e) {
        e.preventDefault()

        try {
            setMessage('')
            setError('')
            setLoading(true)
            await resetPassword(emailRef.current.value)
            toast.success("Password reset successfully", { autoClose: 3000 })
            setMessage('Check your inbox for further instructions')
        } catch (error) {
            setLoading(false)
            setError(`Failed to reset password ${error.message}`)
            console.log(error)
        }
        setLoading(false)
    }

    return (
        <>
            <ToastContainer />
            <Container className="d-flex align-items-center justify-content-center mb-2 pb-5">
                <div className="w-100" style={{ maxWidth: "400px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4">Password Reset</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            {messge && <Alert variant="success">{messge}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group id="email">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required />
                                </Form.Group>
                                <Button disabled={loading} className="w-100" type="submit">
                                    Reset Password
                                </Button>
                            </Form>
                            <div className="w-100 text-center mt-3">
                                <Link to='/login'>Login?</Link>
                            </div>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2">
                        Need an account? <Link to='/signup'>Sign Up</Link>
                    </div>

                </div>
            </Container>
        </>
    );
}

export default ForgotPassword;