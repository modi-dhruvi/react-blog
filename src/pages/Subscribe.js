import React, { useState } from 'react'
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Row from 'react-bootstrap/Row';
import { Container, Button } from 'react-bootstrap'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function Subscribe() {
    const [email, setEmail] = useState('')
    const [validated, setValidated] = useState(false)
    const handleSubscribe = (event) => {
        event.preventDefault()
        const form = event.currentTarget
        if (form.checkValidity() === false) {
            return toast.error('Please Enter email')
        }
        else {
            setEmail('')
            toast.success('Subscribe successfully..')
        }
    }
    return (
        <>
            <ToastContainer />
            <div style={{ backgroundColor: 'black', color: 'white', minHeight: '370px' }}>
                <Container>
                    <Row className="justify-content-center align-items-center" style={{ height: '370px' }}>
                        <Col xs={12} md={8}>
                            <h2 className="text-left mb-4 text-white app-title-font">Subscribe here to get my latest posts</h2>
                            <h6 className="text-left mb-4 text-white app-text-font">Enter your email here</h6>
                            <Form onSubmit={handleSubscribe} validated={validated} className="d-flex app-text-font">
                                <Form.Control type="email" placeholder="example@gmail.com" value={email} pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" onChange={(e) => setEmail(e.target.value)} size="lg" className="mr-2" required />
                                <Button className='app-title-font' type='submit' style={{ marginLeft: '10px' }} size="lg" variant="light">Subscribe</Button>
                            </Form>
                        </Col>
                    </Row>
                </Container>

            </div>
        </>
    )
}
