import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Container, Image, Row } from "react-bootstrap"
import Stack from 'react-bootstrap/Stack'
import { useSelector } from 'react-redux'

function CategoryWisePosts() {
    const { categoryName } = useParams()
    const [categoryWisePosts, setCategoryWisePosts] = useState([])
    const [categoryImage, setCategoryImage] = useState('')
    const location = useLocation()
    const navigate = useNavigate()

    const postsStoreData = useSelector(state => state.posts.postsList)
    const categoriesStoreData = useSelector(state => state.categories.categoriesList)
    useEffect(() => {
        window.scrollTo(0, 0)

        const postsData = postsStoreData.filter(post => post.categoryName === categoryName)
        setCategoryWisePosts(postsData)

        const categoryDetail = categoriesStoreData.find(category => category.categoryName == categoryName)
        setCategoryImage(categoryDetail.image)

    }, [postsStoreData, categoriesStoreData, categoryName])

    const excerpt = (str, count) => {
        if (str.length > count) {
            str = str.substring(0, count) + "..."
        }
        return str
    }

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center mt-3 pb-5">
                <div className="w-100">
                    <Image src={categoryImage} height='600px' width='100%' rounded />
                    <h2 className='text-center mt-5 app-title-font'>{categoryName} Blogs</h2>
                    <Stack direction="horizontal" gap={3} className="flex-wrap mt-5">
                        {
                            categoryWisePosts && categoryWisePosts.map((post) => {
                                return (
                                    <Card key={post.id} style={{ height: '550px', width: '420px' }}>
                                        <Card.Img variant="top" src={post.image} height='230px' width='420px' />
                                        <Card.Body style={{ cursor: 'pointer' }} onClick={() => navigate(`/postdetails/${post.id}`)}>
                                            <Card.Title className="text-left app-title-font fs-4">{post.postTitle}</Card.Title>
                                            <Card.Text className="mt-3 app-text-font">
                                                {excerpt(post.postText, 130)}
                                            </Card.Text>
                                        </Card.Body>
                                        <Card.Footer className="p-3">
                                            <small className="text-muted app-text-font">Last updated 3 mins ago</small>
                                        </Card.Footer>
                                    </Card>
                                )
                            })
                        }
                    </Stack>
                </div>
            </Container>
        </>
    )
}

export default CategoryWisePosts
