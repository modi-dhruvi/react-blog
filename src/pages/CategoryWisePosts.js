import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import { Card, Col, Container, Image, Row } from "react-bootstrap"
import cardImage from '../category-net-core-2.jpg'
import Stack from 'react-bootstrap/Stack'
import { db } from '../common/firebase'
import { collection, getDoc, getDocs } from 'firebase/firestore'
import { useSelector } from 'react-redux'

function CategoryWisePosts() {
    const { categoryName } = useParams()
    const [categoryWisePosts, setCategoryWisePosts] = useState([])
    const [categoryImage, setCategoryImage] = useState('')
    const location = useLocation()
    const navigate = useNavigate()

    // const categories = useSelector(state => state.categories.categoriesList)

    // console.log('categories list from store: ', categories)
    const postsStoreData = useSelector(state => state.posts.postsList)
    const categoriesStoreData = useSelector(state => state.categories.categoriesList)
    useEffect(() => {
        window.scrollTo(0, 0)
        // setCategoryWisePosts(categories)

        const postsData = postsStoreData.filter(post => post.categoryName === categoryName)
        setCategoryWisePosts(postsData)

        const categoryDetail = categoriesStoreData.find(category => category.categoryName == categoryName)
        setCategoryImage(categoryDetail.image)
        // console.log('category detail: ', categoryDetail)

        const fetchCategoryWisePosts = async () => {
            const postsCollectionRef = collection(db, "posts")
            const postsSnapshot = await getDocs(postsCollectionRef);

            // const postsData = postsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id })).filter(post => post.categoryName === categoryName);

            setCategoryWisePosts(postsData)
            // console.log('category wise posts: ', categoryWisePosts)
        }
        // fetchCategoryWisePosts()
    }, [postsStoreData, categoriesStoreData, categoryName])

    const excerpt = (str, count) => {
        if (str.length > count) {
            str = str.substring(0, count) + "..."
        }
        return str
    }

    // console.log('location : ', location.state)

    return (
        <>
            <Container className="d-flex align-items-center justify-content-center mt-3">
                <div className="w-100">

                    {/* <Row className='text-center'>
                        <Col className='text-center'><Image style={{ objectFit: 'cover' }} src={location.state.image} height='200px' width='200px' roundedCircle />
                        </Col>
                        <Col className='text-start'><h2 className='text-center mt-5'>{categoryName} Blogs</h2></Col>
                    </Row> */}

                    {/* <div className='d-flex justify-content-center'>

</div> */}
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
