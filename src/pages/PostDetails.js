import React, { useEffect, useState } from 'react'
import { Card, Container } from "react-bootstrap"
import { useNavigate, useParams } from 'react-router-dom'
import Stack from 'react-bootstrap/Stack'
import { deleteDoc, doc } from 'firebase/firestore'
import { db } from '../common/firebase'
import { useAuth } from '../hooks/useAuth'
import Constants from '../common/constants'
import parse from 'html-react-parser'
import Row from 'react-bootstrap/Row'
import Col from 'react-bootstrap/Col'
import userGif from '../presentation.gif'
import editGifIcon from '../edit.gif'
import deleteGifIcon from '../bin.gif'
import approveGif from '../verified.gif'
import { useSelector } from 'react-redux'
import { useUpdateBlogMutation } from '../services/blogsApi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

export default function PostDetails() {
    const [postDetail, setPostDetail] = useState({})
    const [recentPosts, setRecentPosts] = useState([])
    const navigate = useNavigate()
    const { id } = useParams()
    const { loggedInAs } = useAuth()
    var monthAbbreviation = ''
    var day, year, stringWithBreaks;
    const postsData = useSelector(state => state.posts.postsList)
    const [updateBlog] = useUpdateBlogMutation()

    useEffect(() => {
        window.scrollTo(0, 0)
        const fetchPost = async () => {
            const singlePostDetail = postsData.find(post => post.id == id)
            const top3Posts = postsData.filter(post => post.id != id).sort((a, b) => b.lastEdited - a.lastEdited).slice(0, 3);
            setRecentPosts(top3Posts)
            setPostDetail(singlePostDetail)
        }

        fetchPost()
    }, [id])

    if (postDetail) {
        const postDate = new Date(postDetail?.lastEdited)
        monthAbbreviation = postDate?.toLocaleDateString('en-US', { month: 'short' });
        day = postDate?.getDate();
        year = postDate?.getFullYear();

        // Split content into paragraphs every two lines
        stringWithBreaks = postDetail?.postText?.replace(/\n/g, '<br/>');
    }

    const handleDeletePost = async () => {
        console.log(postDetail.id)
        const postDocRef = doc(db, "posts", postDetail.id);
        await deleteDoc(postDocRef)

        toast.success("Post deleted successfully", { autoClose: 3000 })
        setTimeout(() => {
            navigate('/')
        }, 3000)
    }

    const handleApprovePost = async () => {
        const postDocRef = doc(db, "posts", postDetail.id)
        await updateBlog([postDetail.id, {
            status: 'approved'
        }])

        toast.success("Post approved successfully", { autoClose: 3000 })
        setTimeout(() => {
            navigate('/pending-posts')
        }, 3000)
    }

    return (
        <>
            <ToastContainer />
            <Container className="d-flex align-items-center justify-content-center">
                <div className="w-80 mt-5" style={{ maxWidth: '800px' }}>
                    {loggedInAs.includes(Constants.Admin) && postDetail &&
                        <Row>
                            <Col className="text-end">
                                <img className='header-gif-image' onClick={() => navigate('/editpost', { state: postDetail })} style={{ cursor: 'pointer' }} src={editGifIcon} height='50px' width='50px' />
                                <img className='header-gif-image' onClick={handleDeletePost} style={{ marginLeft: '8px', cursor: 'pointer' }} src={deleteGifIcon} height='50px' width='50px' />
                                {postDetail.status !== 'approved' && <img className='header-gif-image' onClick={handleApprovePost} style={{ marginLeft: '6px', cursor: 'pointer' }} src={approveGif} height='50px' width='50px' />}
                            </Col>
                        </Row>
                    }
                    <Row>
                        <Col className="d-flex align-items-center"><img className='header-gif-image' height='50px' width='50px' src={userGif} style={{ marginRight: '12px' }} />
                            {`${postDetail?.author?.name} - ${monthAbbreviation} ${day} ${year} - 1 min read`}
                        </Col>
                    </Row>

                    <h2 className='mt-4 app-title-font'>{postDetail.postTitle}</h2>
                    <p className='app-text-font'>{postDetail.postSubTitle}</p>
                    <img src={postDetail.image} style={{ width: '800px', height: '430px' }} className='mt-4' />

                    <Row className='mt-5'>
                        <Col style={{ textAlign: 'justify' }}>{stringWithBreaks && parse(stringWithBreaks)}</Col>
                    </Row>
                    <hr />
                    <Row>
                        <Col>10 view <span className='mx-4'> 0 comments</span></Col>
                    </Row>
                    <hr />
                </div>
            </Container>
            <Container className="d-flex align-items-center justify-content-center app-title-font">
                <div className='w-80 mt-5'>
                    <Row>
                        <Col className='fs-5'>Recent Posts</Col>
                        <Col className='text-end fs-5'>See All</Col>
                    </Row>
                    <Stack direction='horizontal' className='mt-4' gap={5}>
                        {
                            recentPosts && recentPosts.map((post) => {
                                return (
                                    <Card key={post.id} className='border-0' style={{ height: '350px', width: '350px' }}>
                                        <Card.Img variant="top" src={post.image} height='210px' width='420px' />
                                        <Card.Body style={{ cursor: 'pointer' }} onClick={() => navigate(`/postdetails/${post.id}`)}>
                                            <Card.Title className="text-center fs-5">{post.postTitle}</Card.Title>
                                        </Card.Body>
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
