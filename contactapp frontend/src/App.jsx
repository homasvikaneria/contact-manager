import "react-toastify/ReactToastify.css"
import { useEffect, useState, useRef } from 'react'
import { deleteContact, getContacts, saveContact, updatePhoto } from './api/ContactService';
import { useNavigate } from 'react-router-dom';
import { Route, Routes, Navigate } from 'react-router-dom';
import { toastSuccess, toastError } from './api/ToastService';
import { ToastContainer } from 'react-toastify';
import Header from './components/Header';
import ContactList from './components/ContactList';
import ContactDetails from './components/ContactDetails';
import Login from './components/Login';
import Register from './components/Register';
import ProtectedRoute from './components/ProtectedRoute';
import { logout } from './api/AuthService';

function App() {

  const modalRef = useRef();
  const fileRef = useRef();
  const navigate = useNavigate();
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(0);
  const [file, setFile] = useState(undefined);
  const [values, setValues] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    title: '',
    status: '',
  });

  const [isAuthenticatedState, setIsAuthenticatedState] = useState(!!localStorage.getItem("token"));

  const getAllContacts = async (page = 0, size = 10) => {
    try {
      setCurrentPage(page);
      const { data } = await getContacts(page, size);
      setData(data);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    if (isAuthenticatedState) {
      getAllContacts(currentPage);
    }
  }, [currentPage, isAuthenticatedState]);

  const handleLoginSuccess = () => {
    setIsAuthenticatedState(true);
  };

  const handleLogout = () => {
    logout();
    setIsAuthenticatedState(false);
    setData({});
    navigate('/login');
  };

  const handleNewContact = async (event) => {
    event.preventDefault();
    try {
      const { data } = await saveContact(values);
      const formData = new FormData();
      formData.append("file", file, file.name);
      formData.append("id", data.id);
      await updatePhoto(formData);
      toggleModal(false);
      setFile(undefined);
      fileRef.current.value = null;
      setValues({
        name: '',
        email: '',
        phone: '',
        address: '',
        title: '',
        status: '',
      });
      getAllContacts(currentPage);

      toastSuccess("Contact Created Successfully!");
    } catch (error) {      
      console.error(error);
      toastError(error.message || "Failed to create contact");
    }
  }

  const updateContact = async (contact) => {
    await saveContact(contact);
    getAllContacts(currentPage);
  }

  const updateImage = async (formData) => {
    try {
      await updatePhoto(formData);
      getAllContacts(currentPage);
    } catch (error) { 
      console.error(error); 
      toastError(error.message || "Failed to update image");
    }
  }

  const deleteContactCallback = async (id) =>{
    try {
      await deleteContact(id);
      getAllContacts(currentPage);
      navigate('/');
      toastSuccess("Contact Deleted Successfully!");
    } catch (error) {
      console.error(error);
      toastError(error.message || "Failed to delete contact");
    }
  }

  const onChange = (event) => {
    setValues((v) => ({ ...values, [event.target.name]: event.target.value }));
  }

  const toggleModal = (show) => {
    if (modalRef.current) {
      show ? modalRef.current.showModal() : modalRef.current.close();
    }
  }

  return (
    <>
      {isAuthenticatedState && (
        <Header toggleModal={toggleModal} nbOfContacts={data.totalElements} onLogout={handleLogout} />
      )}

      <main className="main">
        <div className="container">
          <Routes>
            <Route path="/login" element={<Login onLogin={handleLoginSuccess} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Navigate to="/contacts" />} />
            <Route path="/contacts" element={
              <ProtectedRoute>
                <ContactList data={data} currentPage={currentPage} getAllContacts={getAllContacts} />
              </ProtectedRoute>
            } />
            <Route path="/contacts/:id" element={
              <ProtectedRoute>
                <ContactDetails updateContact={updateContact} deleteContactCallback={deleteContactCallback} updateImage={updateImage} />
              </ProtectedRoute>
            } />
          </Routes>

          {/* Modal */}
          {isAuthenticatedState && (
            <dialog ref={modalRef} className="modal" id="modal">
              <div className="modal__header">
                <h3>New Contact</h3>
                <i onClick={() => toggleModal(false)} className="bi bi-x-lg"></i>
              </div>
              <div className="divider"></div>
              <div className="modal__body">
                <form onSubmit={handleNewContact}>
                  <div className="user-details">
                    <div className="input-box">
                      <span className="details">Name</span>
                      <input type="text" value={values.name} onChange={onChange} name="name" required />
                    </div>
                    <div className="input-box">
                      <span className="details">Email</span>
                      <input type="text" value={values.email} onChange={onChange} name="email" required />
                    </div>
                    <div className="input-box">
                      <span className="details">Title</span>
                      <input type="text" value={values.title} onChange={onChange} name="title" required />
                    </div>
                    <div className="input-box">
                      <span className="details">Phone Number</span>
                      <input type="text" value={values.phone} onChange={onChange} name="phone" required />
                    </div>
                    <div className="input-box">
                      <span className="details">Address</span>
                      <input type="text" value={values.address} onChange={onChange} name="address" required />
                    </div>
                    <div className="input-box">
                      <span className="details">Account Status</span>
                      <input type="text" value={values.status} onChange={onChange} name="status" required />
                    </div>
                    <div className="file-input">
                      <span className="details">Profile Photo</span>
                      <input type="file" ref={fileRef} onChange={(event) => setFile(event.target.files[0])} name="photo" required />
                    </div>
                  </div>
                  <div className="form_footer">
                    <button onClick={() => toggleModal(false)} type="button" className="btn btn-danger">Cancel</button>
                    <button type="submit" className="btn">Save</button>
                  </div>
                </form>
              </div>
            </dialog>
          )}

        </div>
      </main>
      <ToastContainer/>
    </>
  )
}

export default App
