// import React, {Fragment, useEffect, useState} from "react";
// import {Navbar, Nav} from "react-bootstrap";
// import {useHistory} from "react-router";
// import {logout, deleteUser, userInfo} from "../../utils/requests";
// import { useToasts } from 'react-toast-notifications'
// import EditProfile from "../EditProfile";
//
// export default function Profile() {
//     const history = useHistory();
//     const [user, setUser] =useState(null);
//     const {addToast} = useToasts();
//     const goHome = () => history.push('/');
//     const signOut = () => logout(goHome);
//     const deleteSuccess = () => addToast('Delete user successfully', { appearance: 'success', autoDismiss: true});
//     const deleteFailed = () => addToast('Failed to delete user', { appearance: 'error', autoDismiss: true});
//     const deleteAcount = () => deleteUser(deleteSuccess, deleteFailed, signOut);
//     useEffect(() => {
//         userInfo(setUser)
//     }, []);
//     return(
//         <Fragment>
//         <Navbar bg="light" expand="lg" className="justify-content-between">
//             <Navbar.Brand href="#home">Netway Task</Navbar.Brand>
//             <Navbar.Toggle aria-controls="basic-navbar-nav" />
//             <Navbar.Collapse id="basic-navbar-nav">
//                 <Nav className="ml-auto">
//                     <Nav.Link href="#link" onClick={signOut}>Logout</Nav.Link>
//                     <Nav.Link href="#link" className="text-danger" onClick={deleteAcount}>Delete Account</Nav.Link>
//                 </Nav>
//             </Navbar.Collapse>
//         </Navbar>
//             {!user ? <p>loading...</p> : <EditProfile user={user?.data}/>}
//         </Fragment>
//
//     )
// }