import React from "react";
import firebase from "firebase";
import { useState } from "react";
import {Button, Input} from '@material-ui/core';
import db, { storage } from "../firebase";
import './imageupload.css';



const ImageUpload = ({username}) => {
    const [image, setImage] = useState(null);
    const [url, setUrl] = useState("");
    const [progress, setProgress] = useState(0);
    const [caption, setCaption] = useState('');


    const handleChange = e => {
        if(e.target.files[0]){
            setImage(e.target.files[0])
        }
    }


    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                )
                setProgress(progress)
            },
            (error) => {
                console.log('myerror', error);
            },
            () => {
                storage
                      .ref("images")
                      .child(image.name)
                      .getDownloadURL()
                      .then((url) => {
                          setUrl(url);
                        
                       db.collection("posts").add({
                           imageUrl: url,
                           caption: caption,
                           username: username,
                           timestamp: firebase.firestore.FieldValue.serverTimestamp()
                       });
                       setProgress(0);
                       setCaption('');
                       setImage(null);   
                      })
            }
        )
    }
    return (
        <div className="image_upload">
            <progress value={progress} max='100' className="imageupload-progress" />
            <Input  
            placeholder="Enter a caption"  
            value={caption}
            onChange={(e)=> setCaption(e.target.value)}
            />
            <div>
                <Input type='file' onChange={handleChange} />
                <Button className="imageUpload_btn"
                 onClick = {handleUpload}
                >
                    Upload
                </Button>
            </div>
        </div>
    )
}


export default ImageUpload;