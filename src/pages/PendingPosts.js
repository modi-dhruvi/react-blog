import React, { useEffect, useState } from "react"
import { Card, Container } from "react-bootstrap"
import Stack from 'react-bootstrap/Stack'
import { useNavigate } from "react-router-dom"
import { useSelector } from "react-redux"

export default function PendingPosts() {
    const [postList, setPostList] = useState([])
    const navigate = useNavigate()
    const posts = useSelector(state => state.posts.postsList)
    
    useEffect(() => {
        const getPosts = async () => {
            const data = posts
            setPostList(data.filter(doc => doc.status === 'pending'))
        }
        getPosts()
    }, [posts])

    const excerpt = (str, count) => {
        if (str.length > count) {
            str = str.substring(0, count) + "..."
        }
        return str
    }
    
    return (
        <>
            <Container className="d-flex align-items-center justify-content-center pb-5">
                <div className="w-100">

                    <h2 className='text-center mt-3 app-title-font'>Pending Blogs</h2>
                    <Stack direction="horizontal" gap={3} className="flex-wrap mt-5">
                        {
                            postList && postList.map((post) => {
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
