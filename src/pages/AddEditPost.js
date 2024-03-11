import React, { useEffect, useRef, useState } from 'react'
import { Container, Card, Form, Alert, Button, Dropdown } from 'react-bootstrap'
import { addDoc, collection, doc, serverTimestamp, snapshotEqual, updateDoc, getDocs } from 'firebase/firestore'
import { db, auth, storage } from '../common/firebase'
import { getDownloadURL, ref, uploadBytes, uploadBytesResumable } from 'firebase/storage'
import { useLocation, useNavigate } from 'react-router-dom'
import { v4 } from 'uuid'
import Image from 'react-bootstrap/Image'
import Constants from '../common/constants'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useAuth } from '../hooks/useAuth'
import NavDropdown from 'react-bootstrap/NavDropdown';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
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
  const [imageUrl, setImageUrl] = useState('')
  const [categoriesList, setCategoriesList] = useState(null)
  const fileInputRef = useRef(null);
  const { loggedInAs } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [validated, setValidated] = useState(false);
  const [addBlog] = useAddBlogMutation()
  const [updateBlog] = useUpdateBlogMutation()

  const categoriesStoreData = useSelector(state => state.categories.categoriesList);
  // console.log("categoriesStoreData", categoriesStoreData);

  useEffect(() => {
    if (IsEdit) {
      // console.log('loaction data ', location.state)
      setPostTitle(location.state.postTitle)
      setPostText(location.state.postText)
      setPostSubTitle(location.state.postSubTitle)
      setOldImageUrl(location.state.image)
      setCategoryName(location.state.categoryName)
      fileInputRef.current = location.state.image
      // setImage(location.state.image)
    }

    setCategoriesList(categoriesStoreData)

    const fetchCategories = async () => {
      const categoriesCollectionRef = collection(db, "categories")
      const categoriesSnapshot = await getDocs(categoriesCollectionRef);
      const categoriesData = categoriesSnapshot.docs.map((doc) => ({ ...doc.data(), id: doc.id }));

      setCategoriesList(categoriesData);
    }

    // fetchCategories()

  }, [IsEdit, categoriesStoreData])

  const handleImageChange = (e) => {
    const selectedImage = e.target.files[0]
    setImage(selectedImage)

    // Display image preview
    const imageURL = URL.createObjectURL(selectedImage)
    setImagePreview(imageURL)
  };

  // Add a document to the specified collection (this will create the collection if it doesn't exist)
  const postsCollectionRef = collection(db, "posts")

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

  const handleChceck = (event) => {
    // console.log('validated before ', validated)
    event.preventDefault();
    const form = event.currentTarget;
    if (form.checkValidity() === false || categoryName === '') {
      event.stopPropagation();
    } else {
      setValidated(true);
      console.log('form validatity: ', form.checkValidity())
      console.log('validate: ', validated)
      console.log('catgoryName ', categoryName)
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
        // console.log('old ==> ', oldImageUrl)
        // console.log('current Image Url: ', currentImageUrl)
        // console.log('New Image: ', image)

        // console.log('post Title : ', postTitle)
        // console.log('post Sub title: ', postSubTitle)
        // console.log('post text: ', postText)
        // console.log('category: ', categoryName)
        // console.log('last edited: ', serverTimestamp())
        // console.log('id ', location.state.id)

        // Step 2: Upload the new image to Cloud Storage with the same path as the current image
        if (image || currentImageUrl) {
          const imageRef = ref(storage, currentImageUrl);
          const snpshot = await uploadBytes(imageRef, image)

          // const uploadTask = uploadBytesResumable(imageRef, image)
          // uploadTask.on()
          // const editUrl = await getDownloadURL(snpshot.ref)

          // console.log('Url : ', await getDownloadURL(snpshot.ref))
          await getDownloadURL(snpshot.ref).then(async (res) => {
            // Assuming postId is the ID of the document you want to update
            console.log("res----", res);
            // const res = 'https://firebasestorage.googleapis.com/v0/b/blogs-management.appspot.com/o/postImages%2Fredux_toolkit.png_bd1a480f-639f-48a0-bcd7-203d1e20ea10?alt=media&token=0717a208-9ef7-4903-b463-e905b82bb624'
            const postDocRef = doc(db, "posts", location.state.id)
            const response = await updateBlog([location.state.id, {
              postTitle: postTitle,
              postSubTitle: postSubTitle,
              postText: postText,
              image: res ? res : '',
              categoryName: categoryName,
              lastEdited: serverTimestamp()
            }])
            toast.success("Blog updated successfully...", { autoClose: 3000 })
            // console.log('response ==> ', response)
            // await updateDoc(postDocRef, {
            //   postTitle: postTitle,
            //   postSubTitle: postSubTitle,
            //   postText: postText,
            //   image: res ? res : '',
            //   categoryName: categoryName,
            //   lastEdited: serverTimestamp()
            // })
            //   }).catch((e) => {
            //     console.log("e", e);
          })
        }

        // Assuming postId is the ID of the document you want to update
        // const postDocRef = doc(db, "posts", location.state.id);
        // await updateDoc(postDocRef, {
        //   postTitle: postTitle,
        //   postText: postText,
        //   image: imageUrl ? imageUrl : ''
        // })
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
            // const imageRef = ref(storage, `postImages/${image.name + '_' + v4()}`)
            // const snapshot = await uploadBytes(imageRef, image)
            const postStatus = loggedInAs.includes(Constants.User) ? 'pending' : 'approved'
            // console.log('loggedInAs : ', loggedInAs)
            // console.log('Post Status : ', postStatus)
            // const url = await getDownloadURL(snapshot.ref)

            // await getDownloadURL(snapshot.ref).then(async (res) => {
            // Assuming postId is the ID of the document you want to update
            // console.log("res----", res);
            var res = ''
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
            // const response = await addDoc(postsCollectionRef, {
            //   postTitle: postTitle,
            //   postSubTitle: postSubTitle,
            //   postText: contentWithParagraph,
            //   image: res ? res : '',
            //   status: postStatus,
            //   lastEdited: serverTimestamp(),
            //   categoryName: categoryName,
            //   author: { name: auth.currentUser.email, id: auth.currentUser.uid }
            // })
            // }).catch((e) => {
            //   console.log("Error while adding post(Download URL not found) ==> ", e);
            // })
          }
        } catch (error) {
          toast.error("Error: ", error.message, { autoClose: 3000 })
          console.error('Error uploading image and adding document:', error);
        }
      }

      setTimeout(() => {
        navigate('/')
      }, 3000)
      // navigate('/')
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
              {/* {error && <Alert variant="danger">{error}</Alert>} */}
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
                      {/* <NavDropdown className='custom-link' title="Categories" id={`offcanvasNavbarDropdown-expand-md`}>
                        <NavDropdown.Item href="#action4">Sql Server</NavDropdown.Item>
                      </NavDropdown> */}
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