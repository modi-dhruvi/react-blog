import React, { useEffect, useState } from "react"
import { Card, Container } from "react-bootstrap"
import { collection, getDocs } from 'firebase/firestore'
import { db, auth } from '../common/firebase'
import Stack from 'react-bootstrap/Stack'
import { useNavigate } from "react-router-dom"
import { useAuth } from "../hooks/useAuth"
import Carousel from 'react-bootstrap/Carousel';
import ExampleCarouselImage from '../dashboard.png';
import cardImage from '../category-net-core-2.jpg'
import CardGroup from 'react-bootstrap/CardGroup';
import { useGetBlogsQuery, useGetCategoriesQuery } from "../services/blogsApi"
import { useDispatch } from "react-redux"
import { getAllPosts } from "../features/posts/postsSlice"
import { useSelector } from "react-redux"
import { getAllCategories } from "../features/category/categorySlice"
import Spinner from "../components/Spinner"
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function Dashboard() {
    const [postList, setPostList] = useState([])
    const [categoriesList, setCategoriesList] = useState([])

    const dispatch = useDispatch()
    var monthAbbreviation = ''
    var day, year
    const { logout } = useAuth()

    // const { data: postsQueryData, isLoading: postsLoading } = useGetBlogsQuery()
    // const { data: categoriesQueryData, isLoading: categoriesLoading } = useGetCategoriesQuery()

    const posts = useSelector(state => state.posts.postsList)
    const categories = useSelector(state => state.categories.categoriesList)
    const navigate = useNavigate()

    useEffect(() => {
        const data = posts.filter(p => p.status === 'approved')
        // console.log(data)
        setPostList(data)
        setCategoriesList(categories)
        // const notify = () => {
        //     console.log('notify called..')
        //     toast.success("Success", { position: "bottom-right", autoClose: 3000 })
        //     toast.error("Error")
        //     toast.info("Information")
        // }
        // notify()
    }, [posts, categories])

    // console.log('posts ', postList)
    // useEffect(() => {

    //     setTimeout(() => {

    //         if (postsLoading) {
    //             console.log('posts loading')
    //         } else if (postsQueryData) {
    //             // console.log('IsLoading : ', blogsLoading)
    //             // console.log('Post query data: ', postsQueryData)
    //             setPostList(postsQueryData)
    //             dispatch(getAllPosts(postsQueryData))
    //         }

    //         if (categoriesQueryData) {
    //             setCategoriesList(categoriesQueryData)
    //             // console.log('cat data ', categoriesQueryData)
    //             dispatch(getAllCategories(categoriesQueryData))
    //         }

    //         const fetchPostsAndCategories = async () => {
    //             const postsCollectionRef = collection(db, "posts")
    //             const categoriesCollectionRef = collection(db, "categories")

    //             const postsSnapshot = await getDocs(postsCollectionRef);
    //             const categoriesSnapshot = await getDocs(categoriesCollectionRef);

    //             const postsData = postsSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));
    //             const categoriesData = categoriesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

    //             setPostList(postsData);
    //             setCategoriesList(categoriesData);

    //             // console.log('Post List: ', postsData);
    //             // console.log('Categories List: ', categoriesData);
    //         };

    //         // fetchPostsAndCategories();

    //         // logout()
    //         // const postsCollectionRef = collection(db, "posts")
    //         // const getPosts = async () => {
    //         //     console.log('Post collection Ref: ', postsCollectionRef)
    //         //     const data = await getDocs(postsCollectionRef)
    //         //     // console.log('data: ', data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //         //     setPostList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //         // }
    //         // getPosts()

    //         // const categoriesCollectionRef = collection(db, "categories")
    //         // const getCategories = async () => {
    //         //     const data = await getDocs(categoriesCollectionRef)
    //         //     // console.log('data: ', data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //         //     setCategoriesList(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })))
    //         // }
    //         // getCategories()
    //         // console.log('getPosts: ', postList)
    //         // console.log('getCategories: ', categoriesList)
    //     }, 3000)
    // }, [postsLoading, postsQueryData, categoriesLoading, categoriesQueryData])

    const excerpt = (str, count) => {
        if (str.length > count) {
            str = str.substring(0, count) + "..."
        }
        return str
    }

    return (
        <>
            <ToastContainer />
            {/* categoryDescription categoryName image */}
            <div style={{ backgroundColor: '#f5f5f5' }} className="pb-5">
                {/* {(postsLoading || categoriesLoading) && (!postsQueryData || !categoriesQueryData) ? (<Spinner />) : (<> */}
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
                        {/* <Carousel.Item>
                            <img className="d-block w-100" src={ExampleCarouselImage} alt="First slide" style={{ maxHeight: '650px' }} />
                            <Carousel.Caption>
                                <h3>First slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={ExampleCarouselImage} alt="Second slide" style={{ maxHeight: '650px' }} />
                            <Carousel.Caption>
                                <h3>Second slide label</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={ExampleCarouselImage} alt="Third slide" style={{ maxHeight: '650px' }} />
                            <Carousel.Caption>
                                <h3>Third slide label</h3>
                                <p>
                                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item> */}
                        {/* <Carousel.Item>
                            <img className="d-block w-100" src={ExampleCarouselImage} alt="First slide" style={{ maxHeight: '650px' }} />
                            <Carousel.Caption>
                                <h3>First slide label</h3>
                                <p>Nulla vitae elit libero, a pharetra augue mollis interdum.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={ExampleCarouselImage} alt="Second slide" style={{ maxHeight: '650px' }} />
                            <Carousel.Caption>
                                <h3>Second slide label</h3>
                                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                            </Carousel.Caption>
                        </Carousel.Item>
                        <Carousel.Item>
                            <img className="d-block w-100" src={ExampleCarouselImage} alt="Third slide" style={{ maxHeight: '650px' }} />
                            <Carousel.Caption>
                                <h3>Third slide label</h3>
                                <p>
                                    Praesent commodo cursus magna, vel scelerisque nisl consectetur.
                                </p>
                            </Carousel.Caption>
                        </Carousel.Item> */}
                    </Carousel>
                </div>

                <Container fluid className="d-flex align-items-center justify-content-center mt-5 app-title-font">
                    <h2>All Blogs</h2>
                </Container>

                <Container className="d-flex align-items-center justify-content-center mt-5">
                    {/* <CardGroup>
                    <Card className="mr-2">
                        <Card.Img variant="top" src={cardImage} />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>
                                This is a wider card with supporting text below as a natural lead-in
                                to additional content. This content is a little bit longer.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                    <Card className="mx-2">
                        <Card.Img variant="top" src={cardImage} />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>
                                This card has supporting text below as a natural lead-in to
                                additional content.{' '}
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                    <Card className="ml-2">
                        <Card.Img variant="top" src={cardImage} />
                        <Card.Body>
                            <Card.Title>Card title</Card.Title>
                            <Card.Text>
                                This is a wider card with supporting text below as a natural lead-in
                                to additional content. This card has even longer content than the
                                first to show that equal height action.
                            </Card.Text>
                        </Card.Body>
                        <Card.Footer>
                            <small className="text-muted">Last updated 3 mins ago</small>
                        </Card.Footer>
                    </Card>
                </CardGroup> */}

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
                            {/* <Card style={{ height: '550px', width: '420px' }}>
                                <Card.Img variant="top" src={cardImage} />
                                <Card.Body style={{ cursor: 'pointer' }} onClick={() => navigate('/postdetails')}>
                                    <Card.Title className="text-center fs-4">Card title</Card.Title>
                                    <Card.Text className="mt-3 app-text-font">
                                        This is a wider card with supporting text below as a natural lead-in
                                        to additional content. This card has even longer content than the
                                        first to show that equal height action.
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer className="p-3">
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ height: '550px', width: '420px' }}>
                                <Card.Img variant="top" src={cardImage} />
                                <Card.Body>
                                    <Card.Title>Card title</Card.Title>
                                    <Card.Text className='app-text-font'>
                                        This is a wider card with supporting text below as a natural lead-in
                                        to additional content. This card has even longer content than the
                                        first to show that equal height action.
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ height: '550px', width: '420px' }}>
                                <Card.Img variant="top" src={cardImage} />
                                <Card.Body>
                                    <Card.Title>Card title</Card.Title>
                                    <Card.Text className='app-text-font'>
                                        This is a wider card with supporting text below as a natural lead-in
                                        to additional content. This card has even longer content than the
                                        first to show that equal height action.
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Footer>
                            </Card>

                            <Card style={{ height: '550px', width: '420px' }}>
                                <Card.Img variant="top" src={cardImage} />
                                <Card.Body>
                                    <Card.Title>Card title</Card.Title>
                                    <Card.Text className='app-text-font'>
                                        This is a wider card with supporting text below as a natural lead-in
                                        to additional content. This card has even longer content than the
                                        first to show that equal height action.
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Footer>
                            </Card>
                            <Card style={{ height: '550px', width: '420px' }}>
                                <Card.Img variant="top" src={cardImage} />
                                <Card.Body>
                                    <Card.Title>Card title</Card.Title>
                                    <Card.Text>
                                        This is a wider card with supporting text below as a natural lead-in
                                        to additional content. This card has even longer content than the
                                        first to show that equal height action.
                                    </Card.Text>
                                </Card.Body>
                                <Card.Footer>
                                    <small className="text-muted">Last updated 3 mins ago</small>
                                </Card.Footer>
                            </Card> */}
                        </Stack>
                    </div>

                    {/* <div className="w-100"> */}
                    {/* <Stack direction="horizontal" gap={5} className="flex-wrap"> */}
                    {/* {
                            postList && postList.map((post) => {
                                return <Card border="secondary" className="mb-2 shadow" style={{ height: '20rem', width: '18rem' }} key={post.id} onClick={() => navigate('/postdetails', { state: post })}>
                                    <Card.Header as='h5' className="text-center">{post.postTitle}</Card.Header>
                                    <Card.Body style={{ maxHeight: '16rem', overflow: 'hidden', textOverflow: 'ellipsis' }}> */}
                    {/* <Card.Title className="text-center mb-4">{post.postTitle}</Card.Title> */}
                    {/* <Card.Text style={{ textAlign: 'justify' }}>{post.postText}</Card.Text>
                                    </Card.Body>
                                </Card>
                            })
                        }
                    </Stack> */}
                    {/* </div> */}
                </Container>
                {/* </>)} */}
            </div>

        </>
    )
}

export default Dashboard
