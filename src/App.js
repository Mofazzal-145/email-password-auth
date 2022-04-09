import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import Form from 'react-bootstrap/Form'
import Button from 'react-bootstrap/Button';
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification, sendPasswordResetEmail, signInWithEmailAndPassword } from "firebase/auth";
import app from './firebase.init';
import { useState } from 'react';


const auth = getAuth(app);

function App() {

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [validated, setValidated] = useState(false);
  const [register, setRegister] = useState(false);


  const handleEmailBlur = (event) => {
    setEmail(event.target.value);
  }

  const handlePasswordBlur = (event) => {
    setPassword(event.target.value);
  }

  const handleRegisterChange = (event) => {
    setRegister(event.target.checked);
  }
  const handleFormSubmit = (event) => {

    const form = event.currentTarget;
    event.preventDefault();
    if(form.checkValidity() === false) {
      event.stopPropagation();
      return;
    }
    if(!/(?=.*?[#?!@$%^&*-])/.test(password)){
      setError('Password Should contain one special character');
      return;
    }

    setValidated(true);
    setError('');

    if(register) {
      signInWithEmailAndPassword(auth, email, password)
      .then(result => {
        const user = result.user;
        console.log(user);
      })
      .catch(error =>{
        console.error(error);
        setError(error.message);
      })
    }
    else{
      createUserWithEmailAndPassword(auth, email, password)
    .then(result => {
      const user = result.user;
      console.log(user);
      setEmail('');
      setPassword('');
      verifyEmail('');
    })
    .catch(error => {
      console.error(error);
      setError(error.message);
    })
    }
    event.preventDefault();
  }

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
  .then(() => {
    console.log('email sent')
  })
  }

  const verifyEmail = () => {
    sendEmailVerification(auth.currentUser)
    .then(() =>{
      console.log('Email verification sent');                  
    })
  }

  return (
    <div>
        <div className="registration w-50 mx-auto mt-5">
          <h2 className='text-primary'>Please {register ? 'Login' : 'Register'}</h2>
            <Form noValidate validated={validated} onSubmit={handleFormSubmit}>
                <Form.Group className="mb-3" controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control  onBlur={handleEmailBlur}  type="email"placeholder="Enter email" required />
                <Form.Text className="text-muted">
                    We'll never share your email with anyone else.
                </Form.Text>
                <Form.Control.Feedback type='invalid'>
                    please provide a valid email.
                  </Form.Control.Feedback>
              </Form.Group>

              <Form.Group className="mb-3" controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control onBlur={handlePasswordBlur} type="password"  placeholder="Password" required />
                  <Form.Control.Feedback type='invalid'>
                    please provide a valid password.
                  </Form.Control.Feedback>
              </Form.Group>
               <Form.Group className="mb-3" controlId="formBasicCheckbox">
                <Form.Check onChange={handleRegisterChange} type="checkbox" label="Already Registered?" />
              </Form.Group> 
              <p className='text-danger'>{error}</p>
               <Button onClick={handlePasswordReset} variant="link">Forget password</Button>
                <br />
                <Button variant="primary" type="submit">
                   {register ?  'Login' : 'Register'}
                </Button>
          </Form>
        </div>
    </div>
  );
}

export default App;
