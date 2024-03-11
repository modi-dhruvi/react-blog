import React, { useRef, useState } from "react"
import { Form, Button, Card, Alert, Container } from "react-bootstrap"
import { useAuth } from "../hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import heart from '../heart.png'

export default function UpdateProfile() {
    const emailRef = useRef();
    const passwordRef = useRef();
    const passwordConfirmRef = useRef();
    const { currentUser, updateEmail, updatePassword } = useAuth()
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)
    const navigate = useNavigate()

    function handleSubmit(e) {
        e.preventDefault()

        if (passwordRef.current.value !== passwordConfirmRef.current.value) {
            return setError('Passwords do not match')
        }

        const promises = []
        setError('')
        setLoading(true)
        if (emailRef.current.value !== currentUser.email) {
            promises.push(updateEmail(emailRef.current.value))
        }
        if (passwordRef.current.value) {
            promises.push(updatePassword(passwordRef.current.value))
        }

        Promise.all(promises).then(() => {
            navigate('/')
        }).catch((error) => {
            setError(`Failed to update account : ${error.message}`)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center mb-2 pb-5">
                <div className="w-100" style={{ maxWidth: "500px" }}>
                    <Card>
                        <Card.Body>
                            <h2 className="text-center mb-4 app-title-font">Update Profile</h2>
                            {error && <Alert variant="danger">{error}</Alert>}
                            <Form onSubmit={handleSubmit}>
                                <Form.Group className="mb-3" id="email">
                                    <Form.Label className='app-title-font'>Email</Form.Label>
                                    <Form.Control type="email" ref={emailRef} required defaultValue={currentUser.email} />
                                </Form.Group>
                                <Form.Group className="mb-3" id="password">
                                    <Form.Label className='app-title-font'>Password</Form.Label>
                                    <Form.Control type="password" ref={passwordRef} placeholder="Leave blank to keep the same" />
                                </Form.Group>
                                <Form.Group className="mb-3" id="password-confirm">
                                    <Form.Label className='app-title-font'>Password Confirmation</Form.Label>
                                    <Form.Control type="password" ref={passwordConfirmRef} placeholder="Leave blank to keep the same" />
                                </Form.Group>
                                <div className="d-flex justify-content-center app-title-font">
                                    <Button disabled={loading} variant="outline-dark" type="submit">
                                        Update
                                    </Button>
                                </div>
                            </Form>
                        </Card.Body>
                    </Card>
                    <div className="w-100 text-center mt-2 app-title-font">
                        Already have an account? <Link to='/' className='text-dark'>Cancel</Link>
                    </div>
                </div>
            </Container>
            <footer className='footer' style={{ overflowY: 'auto', backgroundColor: 'white', position: 'fixed', bottom: '0', width: '100%' }}>
                <Container>
                    <div className="w-100 py-2 app-title-font" style={{ textAlign: 'center', fontSize: '15px' }}>
                        Designed with <img src={heart} alt="Heart icon" /> by Dhruvi
                    </div>
                </Container>
            </footer>
        </>
    );
}