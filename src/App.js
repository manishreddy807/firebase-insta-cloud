import React, { useEffect, useState } from 'react';
import {Button, Modal, Input, makeStyles} from '@material-ui/core'
import './App.css';
import FlipMove from 'react-flip-move';
// import InstagramEmbed from 'react-instagram-embed';
import Post from './components/post';
import ImageUpload from './components/ImageUpload';
import Confetti from 'react-confetti';
import db, {auth} from './firebase';
import toast, {Toaster} from 'react-hot-toast';
import useWindowSize from 'react-use/lib/useWindowSize';
import { Avatar } from '@material-ui/core';
// import HomePage from './components/HomePage';
// import Basic from './components/Form';
// import OddOrEven from './components/OddOrEven';


function getModalStyle (){
  const top = 50;
  const left = 50;
  return {
    height: '600px',
    top : `${top}`,
    left: `${left}`,
    // transform: `translate(-${top}%, -${left}%)`
  }
}
 
const useStyles = makeStyles((theme) => ({
  paper: {
    position:'absolute',
    width:400,
    height:200,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2,4,3)

  }
}))


function App() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState([]);
  const [registerOpen, setRegisterOpen] = useState(false)
  const [modalStyle] = useState(getModalStyle);

useEffect(() => {
  const unSubscribe = auth.onAuthStateChanged((authUser) => {
    if(authUser){
      console.log(authUser);
      setUser(authUser);
      if(authUser.displayName){

      }else{
        return authUser.updateProfile({
          displayName:username,
        });
      }
    }else{
      setUser(null)
    }
  });
  return () => {
    unSubscribe();
  }
}, [user, username])

useEffect(() => {
  db.collection("posts")
  .orderBy("timestamp", "desc")
  .onSnapshot((snapshot) =>
   setPosts(snapshot.docs.map((doc) => ({id: doc.id, post: doc.data()}))) 
   )
}, [])

const handleLogin = (event) => {
    event.preventDefault();
    auth
        .signInWithEmailAndPassword(email, password)
        .catch((error) => alert(error.message));
        setOpen(false)
}

const handleRegister = e => {
  e.preventDefault();
  auth
      .createUserWithEmailAndPassword(email,password)
      .catch((error) => alert(error.message));
      
      setRegisterOpen(false)
}

  return (
    
     <div className='app'>
      
       <Modal open={open} onClose={() => setOpen(false)}>
         <div style={modalStyle} className={classes.paper}>
           <form className='app_login'>
             <center>
               <img 
               src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
               alt="insta"
               className='app_headerimage'
               />
             </center>
             <Input 
             placeholder='email' 
             value={email} 
             type="text"
             onChange={(e) => setEmail(e.target.value)}  
             
             />
             <Input 
             placeholder='password' 
             value={password} 
             type="password"
             onChange={(e) => setPassword(e.target.value)} 
             />
             <Button onClick={handleLogin}>login</Button>
           </form>
         </div>
       </Modal>
       <Modal open={registerOpen} onClose= {() =>setRegisterOpen(false)}>
         <div style={modalStyle} className={classes.paper}>
           <form className='app_login'>
             <center>
             <img 
               src='https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png'
               alt=""
               className='app_headerimage'
               />
             </center>
             <Input 
              type='text'
              placeholder='username'
              value={username}
              onChange={(e) => setUsername(e.target.value)}
             />
             <Input 
              type='text'
              placeholder='email'
              value={email}
              onChange={(e) => setEmail(e.target.value)}
             />
             <Input 
              type='password'
              placeholder='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
             />
             <Button onClick={handleRegister}>Register</Button>
           </form>
         </div>
       </Modal>
       <div className="app-header">
            <img alt="logo" src="https://www.instagram.com/static/images/web/mobile_nav_type_logo.png/735145cfe0a4.png" className="app_headerimage" />
            {user ?.displayName ? (
              <div className='app_headerRight'>
                <Button onClick={() => auth.signOut()}>Logout</Button>
                <Avatar
                  className="app_header_avatar"
                  alt={user.displayName}
                  src=""
                />
              </div>
            ): <form className='app_loginHome'>
               <Button onClick={() => setOpen(true)}>Login</Button>
               <Button onClick={() => setRegisterOpen(true)}>Sign Up</Button>
              </form>}
       </div>
       <div className="app_posts">
         <div className="app_postLeft">
           <FlipMove>
             {posts.map((post, id)=>{
               <Post 
                user={user}
                key={id}
                postId = {id}
                username = {post.username}
                caption = {post.caption}
                imageUrl = {post.imageUrl}
               />
             })}
           </FlipMove>
         </div>
         {/* <div className = 'app_postsRight'>
           <InstagramEmbed 
            url='https://www.instagram.com/p/B_uf9dmAGPw/'
            maxWidth={320}
            hideCaption={false}
            containerTagName='div'
            protocol=''
            injectScript
            onLoading={() => {}}
            onSuccess={() => {}}
            onAfterRender ={() => {}}
            onFailure = {() => {}}
           
           />
         </div> */}
       </div>
       {user ?.displayName ? 
       <div className='app_upload'>
         <ImageUpload username={user.displayName} />
       </div>
       : (
         <center>
           <h3>Login to upload</h3>
         </center>
       )}
     </div>
  );
}

export default App;
