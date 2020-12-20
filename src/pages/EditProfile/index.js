// import React, {useReducer, useState} from "react";
// import PropTypes from 'prop-types'
// import styled from 'styled-components'
// import {handleChange} from "../../helper/handleControlChange";
// import {textReg, passwordReg, nicknameReg, addressReg, moneyReg} from "../../helper/regex";
// import FormItem from "../../components/FormItem";
// import BackendError from "../../components/BackendError";
// import DatePickerField from "../../components/DataPickerField";
// import Status from "../../components/Status";
// import {updateProfile} from "../../utils/requests";
// import CountrySelect from "../../components/CountrySelect";
// import Avatar from "../../components/Avatar";
// import PreviewAvatar from "../../components/Avatar/previewAvatar";
// import {getFromLocalStorage} from "../../helper/storage";
// const LoginContainer = styled(Container)`
//   padding: 4em;
//   overflow-x: hidden;
// `;
// export default function EditProfile({user}) {
//     const [isLoading, setLoading] = useState(false);
//     const [backendError, setBackendError] = useState(null);
//     const [avatarPrev, setAvatarPrev] = useState(null);
//     const [loginInput, setLoginInput] = useReducer(
//         (state, newState) => ({ ...state, ...newState }),
//         {
//             name: user.loginName,
//             displayName: user.displayName ? user.displayName : '',
//             password: '',
//             birthDate: user.birthDate ? new Date(user.birthDate) : '',
//             active: user.active,
//             country: user.country ? user.country : '',
//             address: user.address ? user.address : '',
//             salary: user.salary ? user.salary : '',
//             avatar: user.avatar
//         },
//     );
//     const [loginInputError, setLoginInputError] = useReducer(
//         (state, newState) => ({ ...state, ...newState }),
//         {
//             name: false,
//             password: false,
//             displayName: false,
//             country: false,
//             address: false,
//         },
//     );
//     const validateForm = () => {
//         return (
//             loginInput.name.length > 0 &&
//             !loginInputError.name &&
//             loginInput.password.length > 0 &&
//             !loginInputError.password&&
//             !loginInputError.displayName&&
//             !loginInputError.country&&
//             !loginInputError.address&&
//             !loginInputError.salary
//         )
//     };
//     const handleSubmit = e => {
//         e.preventDefault();
//         if(validateForm()){
//             setLoading(true);
//             const user = new FormData();
//             user.append('loginName', loginInput.name.trim());
//             user.append('password', loginInput.password);
//             user.append('displayName', loginInput.displayName.trim());
//             user.append('birthDate', loginInput.birthDate ? new Date(loginInput.birthDate).toDateString(): '');
//             user.append('active', loginInput.active);
//             user.append('country', loginInput.country._id);
//             user.append('address', loginInput.address.trim());
//             user.append('salary', loginInput.salary);
//             if(!loginInput.avatar && getFromLocalStorage('userData')?.avatar){
//                 user.append('deleteAvatar', true)
//             }else{
//                 user.append('avatar', loginInput.avatar);
//             }
//             updateProfile(user, setLoading, setBackendError);
//         }else{
//             setBackendError( 'Some fields are incorrect');
//         }
//
//     };
//     return(
//         <LoginContainer>
//             <Row>
//                 <Col sm={12}>
//                     <h3 className="text-center">User Info</h3>
//                     <Form>
//                         <Row>
//                             <Col md={6} sm={12}>
//                                 <FormItem title="Login Name*" id="name"
//                                           type="text"
//                                           input={loginInput.name}
//                                           inputError={loginInputError.name}
//                                           error="at least 2 characters without any special characters"
//                                           onChange={e => handleChange(e, textReg, setLoginInput, setLoginInputError)
//                                           }/>
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 <FormItem title="Display Name" id="displayName"
//                                           type="text"
//                                           input={loginInput.displayName}
//                                           inputError={loginInputError.displayName}
//                                           error="only accept characters and numbers and _"
//                                           onChange={e => handleChange(e, nicknameReg, setLoginInput, setLoginInputError)
//                                           }/>
//                             </Col>
//                         </Row>
//                         <FormItem title="Password*" id="password"
//                                   type="password"
//                                   input={loginInput.password}
//                                   inputError={loginInputError.password}
//                                   error="at least 8 characters"
//                                   onChange={e => handleChange(e, passwordReg, setLoginInput, setLoginInputError)
//                                   }/>
//                         <Form.Group>
//                             <Form.Label className="d-block">BirthDate</Form.Label>
//                             <DatePickerField
//                                 selected={loginInput.birthDate}
//                                 onChange={e => {
//                                     setLoginInput({ birthDate: e })
//                                 }}
//                             />
//                         </Form.Group>
//                         <Status active={loginInput.active} setInput={setLoginInput}/>
//                         <Row>
//                             <Col md={6} sm={12}>
//                                 <CountrySelect value={loginInput.country} setValue={setLoginInput}/>
//                             </Col>
//                             <Col md={6} sm={12}>
//                                 <FormItem title="Address" id="address"
//                                           type="text"
//                                           input={loginInput.address}
//                                           inputError={loginInputError.address}
//                                           error="must be valid address text"
//                                           onChange={e => handleChange(e, addressReg, setLoginInput, setLoginInputError)
//                                           }/>
//                             </Col>
//                         </Row>
//                         <FormItem title="Salary" id="salary"
//                                   type="text"
//                                   input={loginInput.salary}
//                                   inputError={loginInputError.salary}
//                                   error="must be valid number"
//                                   onChange={e => handleChange(e, moneyReg, setLoginInput, setLoginInputError)
//                                   }/>
//                         <Row>
//                             <Col sm={12}>
//                                 <Form.Label>Avatar</Form.Label>
//                                 <Avatar
//                                     setPhoto={setLoginInput}
//                                     setAvatarPrev={setAvatarPrev}
//                                 />
//                                 {(avatarPrev || loginInput.avatar) && (
//                                     <PreviewAvatar
//                                         setAvatarPrev={setAvatarPrev}
//                                         image={avatarPrev ? avatarPrev : loginInput.avatar}
//                                         setAvatar={setLoginInput}
//                                     />
//                                 )}
//                             </Col>
//
//                         </Row>
//                         {backendError && <BackendError error={backendError}/> }
//                         <Button variant="primary" disabled={isLoading} className="btn-block" onClick={!isLoading ? handleSubmit : null} type="submit">
//                             {isLoading ? 'Processing…' : 'Edit'}
//                         </Button>
//                     </Form>
//                 </Col>
//             </Row>
//         </LoginContainer>
//     )
// }
// EditProfile.propTypes = {
//     user: PropTypes.object,
// }