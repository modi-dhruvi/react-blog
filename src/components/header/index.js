import React, { useEffect, useState } from 'react'
import { useAuth } from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from 'react-bootstrap';
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Constants from '../../common/constants';
import gifImg from '../../open-book.gif'
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../../common/firebase'
import img from '../../openBook.png'
import { useSelector } from 'react-redux';

export default function Header() {
    const { currentUser, logout, loggedInAs } = useAuth()
    const [categoriesList, setCategoriesList] = useState([])
    const navigate = useNavigate()

    const categoriesStoreData = useSelector(state => state.categories.categoriesList)

    useEffect(() => {
        setCategoriesList(categoriesStoreData)
        const categoriesCollectionRef = collection(db, "categories")
        const getCategories = async () => {
            const data = await getDocs(categoriesCollectionRef)
            // console.log('data: ', data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
            setCategoriesList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
        }
        // getCategories()
    }, [categoriesStoreData])

    const handleCategoryClick = (category) => {
        navigate(`/category-wise-posts/${category.categoryName}`)
    }

    const handleLogout = async (e) => {
        try {
            await logout()
            navigate('/')
        } catch (error) {
            // setError('Failed to log out')
        }
    }
    return (
        <>
            <Navbar className='app-title-font' expand='lg' fixed='top' sticky="top" style={{ zIndex: '1000', backgroundColor: 'white' }}>
                <Container style={{ paddingTop: '10px', paddingBottom: '10px' }}>
                    <Navbar.Brand className='fs-3 text-center' to="/"><img alt="" src={gifImg} width="40" height="40" className="d-inline-block align-top header-gif-image" />{' '} Blogs</Navbar.Brand>
                    <Nav className="justify-content-center align-items-center">
                        <Link className='custom-link mx-3' to="/">Home</Link>
                        <NavDropdown className='custom-link mx-3' title="Categories" id={`offcanvasNavbarDropdown-expand-md`}>
                            {
                                categoriesList && categoriesList.map(category => {
                                    return (
                                        <NavDropdown.Item className='app-text-font' onClick={() => handleCategoryClick(category)} key={category.id}>{category.categoryName}</NavDropdown.Item>
                                    )
                                })
                            }

                            {/* <NavDropdown.Item to="#action4">Sql Server</NavDropdown.Item> */}
                        </NavDropdown>

                        {!loggedInAs?.includes(Constants.Guest) && <Link className='custom-link mx-3' to="/createpost">Post</Link>}
                        {loggedInAs?.includes(Constants.Admin) && <Link className='custom-link mx-3' to='/pending-posts'>Pending Posts</Link>}
                        {
                            !loggedInAs?.includes(Constants.Guest) && (currentUser && currentUser.email) && <>
                                <Link className='custom-link mx-3' to='/update-profile'>Update Profile</Link>
                                <Button className='ml-5' variant="outline-dark" onClick={handleLogout}>LogOut</Button></>
                        }
                        {
                            loggedInAs?.includes(Constants.Guest) && <Button className='pl-3' variant="outline-dark" onClick={() => navigate('/login')}>Login</Button>
                        }
                    </Nav>
                </Container>
            </Navbar>
        </>
    )
}