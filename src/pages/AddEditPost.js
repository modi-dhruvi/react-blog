import React, { useEffect, useRef, useState } from 'react'
import { Container, Card, Form, Alert, Button, Dropdown } from 'react-bootstrap'
import { serverTimestamp } from 'firebase/firestore'
import { auth, storage } from '../common/firebase'
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import Image from 'react-bootstrap/Image'
import Constants from '../common/constants'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAuth } from '../hooks/useAuth'
import { useSelector } from 'react-redux'
import { useAddBlogMutation, useUpdateBlogMutation } from '../services/blogsApi'
import { ToastContainer, toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

function AddEditPost({ IsEdit }) {
  const [postTitle, setPostTitle] = useState('')
  const [postSubTitle, setPostSubTitle] = useState('')
  const [categoryName, setCategoryName] = useState('')
  const [postText, setPostText] = useState('')
  const [image, setImage] = useState('')
  const [imagePreview, setImagePreview] = useState(null)
  const [oldImageUrl, setOldImageUrl] = useState('')
  const [categoriesList, setCategoriesList] = useState(null)
  const fileInputRef = useRef(null);
  const { loggedInAs } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [validated, setValidated] = useState(false);
  const [addBlog] = useAddBlogMutation()
  const [updateBlog] = useUpdateBlogMutation()

  const categoriesStoreData = useSelector(state => state.categories.categoriesList);

  useEffect(() => {
    if (IsEdit) {
      setPostTitle(location.state.postTitle)
      setPostText(location.state.postText)
      setPostSubTitle(location.state.postSubTitle)
      setOldImageUrl(location.state.image)
      setCategoryName(location.state.categoryName)
      fileInputRef.current = location.state.image
    }

    setCategoriesList(categoriesStoreData)

  }, [IsEdit, categoriesStoreData])

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]
    setImage(selectedImage)

    // Display image preview
    const imageURL = URL.createObjectURL(selectedImage)
    setImagePreview(imageURL)
  };

  const handleClearForm = () => {
    setPostTitle('')
    setPostSubTitle('')
    setCategoryName('')
    setImagePreview(null)
    setPostText('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleSubmitPost = async (e) => {
    e.preventDefault()

    const form = e.currentTarget;
    if (form.checkValidity() === false || categoryName === '') {
      e.stopPropagation();
    } else {
      setValidated(true);
      console.log('form validatity: ', form.checkValidity())

      if (IsEdit) {
        const currentImageUrl = !oldImageUrl ? `postImages/${image.name + '_' + v4()}` : oldImageUrl

        // Step 2: Upload the new image to Cloud Storage with the same path as the current image
        if (image || currentImageUrl) {
          const imageRef = ref(storage, currentImageUrl);
          const snpshot = await uploadBytes(imageRef, image)

          await getDownloadURL(snpshot.ref).then(async (res) => {
            // Assuming postId is the ID of the document you want to update
            const response = await updateBlog([location.state.id, {
              postTitle: postTitle,
              postSubTitle: postSubTitle,
              postText: postText,
              image: res ? res : '',
              categoryName: categoryName,
              lastEdited: serverTimestamp()
            }])
            toast.success("Blog updated successfully...", { autoClose: 3000 })
          })
        }
      }
      else {
        // Split the content into paragraphs
        const paragraphs = postText.split('\n\n')

        var contentWithParagraph = ''
        paragraphs.forEach((paragraph, index) => {
          contentWithParagraph += paragraph;
          if (index !== paragraphs.length - 1) {
            contentWithParagraph += '\n\n';
          }
        })

        try {

          if (image) {
            const imageRef = ref(storage, `postImages/${image.name + '_' + v4()}`)
            const snapshot = await uploadBytes(imageRef, image)
            const postStatus = loggedInAs.includes(Constants.User) ? 'pending' : 'approved'

            await getDownloadURL(snapshot.ref).then(async (res) => {
              await addBlog({
                postTitle: postTitle,
                postSubTitle: postSubTitle,
                postText: contentWithParagraph,
                image: res ? res : '',
                status: postStatus,
                lastEdited: serverTimestamp(),
                categoryName: categoryName,
                author: { name: auth.currentUser.email, id: auth.currentUser.uid }
              })
              toast.success("Blog added successfully and sended to admin for approval..", { autoClose: 3000 })
            })
          }
        } catch (error) {
          toast.error("Error: ", error.message, { autoClose: 3000 })
          console.error('Error uploading image and adding document:', error);
        }
      }

      setTimeout(() => {
        navigate('/')
      }, 3000)
    }
  }

  return (
    <>
      <ToastContainer />
      <Container className="d-flex align-items-center justify-content-center">
        <div className="w-100">
          <Card>
            <Card.Body>
              <h2 className="text-center mb-4 app-title-font"> {IsEdit ? 'Edit' : 'Create'} Post</h2>
              <Form noValidate validated={validated} onSubmit={handleSubmitPost}>
                <Form.Group className="mb-3 d-flex align-items-center justify-content-center" controlId="exampleForm.ControlInputimagefile">
                  {(imagePreview || oldImageUrl) && <Image width='300px' height='50px' src={imagePreview || oldImageUrl} alt='' thumbnail />}
                </Form.Group>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInputimage">
                  <Form.Label className='app-title-font'>Post Image</Form.Label>
                  <Form.Control className='app-text-font' type='file' ref={fileInputRef} onChange={handleImageChange} required></Form.Control>
                </Form.Group>

                <Row className='mb-3'>
                  <Col xs={8}>
                    <Form.Group controlId="exampleForm.ControlInput1">
                      <Form.Label className='app-title-font'>Title</Form.Label>
                      <Form.Control className='app-text-font' type="text" placeholder="post title" value={postTitle} onChange={(e) => setPostTitle(e.target.value)} required />
                    </Form.Group>
                  </Col>
                  <Col>
                    <Form.Group controlId="exampleForm.ControlSelect1">
                      <Form.Label className='app-title-font'>Select an Category:</Form.Label>
                      <Dropdown>
                        <Dropdown.Toggle variant="dark">Categories</Dropdown.Toggle>
                        <Dropdown.Menu>
                          {
                            categoriesList && categoriesList?.map((category) => {
                              return <Dropdown.Item key={category.id} onClick={() => setCategoryName(category.categoryName)}>{category.categoryName}</Dropdown.Item>
                            })
                          }
                        </Dropdown.Menu>
                      </Dropdown>
                    </Form.Group>
                  </Col>
                  <Col>
                    {categoryName}
                  </Col>
                </Row>
                <Form.Group className="mb-3" controlId="exampleForm.ControlInputSubTitle">
                  <Form.Label className='app-title-font'>Sub Title</Form.Label>
                  <Form.Control className='app-text-font' required type="text" placeholder="post sub title" value={postSubTitle} onChange={(e) => setPostSubTitle(e.target.value)} />
                </Form.Group>

                <Form.Group className="mb-3" controlId="exampleForm.ControlTextarea1">
                  <Form.Label className='app-title-font'>Post</Form.Label>
                  <Form.Control className='app-text-font' as="textarea" rows={8} value={postText} onChange={(e) => setPostText(e.target.value)} required />
                </Form.Group>
                <div className="d-flex align-items-center justify-content-center app-title-font">
                  <Button variant="outline-secondary" size='lg' className='mx-3' onClick={handleClearForm}>Clear</Button>
                  <Button type='submit' variant="outline-dark" size='lg' className='mx-3'>Submit Post</Button>
                </div>
              </Form>
            </Card.Body>
          </Card>
        </div>
      </Container>
    </>
  )
}

export default AddEditPost