import React, { useEffect, useState } from "react"
import { Card, Container } from "react-bootstrap"
import Stack from 'react-bootstrap/Stack'
import { useNavigate } from "react-router-dom"
import Carousel from 'react-bootstrap/Carousel'
import { useSelector } from "react-redux"
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Dashboard() {
    const [postList, setPostList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])

    var monthAbbreviation = ''
    var day, year

    const posts = useSelector(state => state.posts.postsList)
    const categories = useSelector(state => state.categories.categoriesList)
    const navigate = useNavigate()

    useEffect(() => {
        const data = posts.filter(p => p.status === 'approved')
        setPostList(data)
        setCategoriesList(categories)
    }, [posts, categories])

    const excerpt = (str, count) => {
        if (str.length > count) {
            str = str.substring(0, count) + "..."
        }
        return str
    }

    return (
        <>
            <ToastContainer />
            <div style={{ backgroundColor: '#f5f5f5' }} className="pb-5">
                <div fluid='true' className="d-flex align-items-center justify-content-center">
                    <Carousel fade className="d-block w-100 p-0">
                        {
                            categoriesList && categoriesList.map((category) => {
                                return (
                                    <Carousel.Item style={{ cursor: 'pointer' }} key={category.id} onClick={() => navigate(`/category-wise-posts/${category.categoryName}`)}>
                                        <img className="d-block w-100" src={category.image} alt="First slide" style={{ maxHeight: '700px', objectFit: 'cover' }} />
                                        <Carousel.Caption>
                                            <h3 className='app-title-font'>{category.categoryName}</h3>
                                            <p className="app-text-font">{category.categoryDescription}</p>
                                        </Carousel.Caption>
                                    </Carousel.Item>
                                )
                            })
                        }
                    </Carousel>
                </div>

                <Container fluid className="d-flex align-items-center justify-content-center mt-5 app-title-font">
                    <h2>All Blogs</h2>
                </Container>

                <Container className="d-flex align-items-center justify-content-center mt-5">
                    <div className="w-100">
                        <Stack direction="horizontal" gap={3} className="flex-wrap">
                            {
                                postList && postList.map((post) => {
                                    const postDate = new Date(post?.lastEdited)
                                    monthAbbreviation = postDate?.toLocaleDateString('en-US', { month: 'short' });
                                    day = postDate?.getDate();
                                    year = postDate?.getFullYear();
                                    return (
                                        <Card style={{ height: '550px', width: '420px' }} key={post.id}>
                                            <Card.Img variant="top" src={post.image} height='230px' width='420px' />
                                            <Card.Body style={{ cursor: 'pointer' }} onClick={() => navigate(`/postdetails/${post.id}`)}>
                                                <Card.Title className="app-title-font text-left fs-4">{post.postTitle}</Card.Title>
                                                <Card.Text className="mt-3 app-text-font">{excerpt(post.postText, 130)}
                                                </Card.Text>
                                            </Card.Body>
                                            <Card.Footer className="p-3">
                                                <small className="text-muted app-text-font">{`${monthAbbreviation} ${day}, ${year}`}</small>
                                            </Card.Footer>
                                        </Card>
                                    )
                                })
                            }
                        </Stack>
                    </div>
                </Container>
            </div>
        </>
    )
}

export default Dashboard
