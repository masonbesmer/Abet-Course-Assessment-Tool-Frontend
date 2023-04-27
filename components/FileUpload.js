import React from 'react';
import API from '../api/api';

const FileUpload = ({extension = ".accdb"}) => {
    const uploadfunction = () => {
        const formData = new FormData();
        const fileInput = document.getElementById('file-input');

        formData.append("file", fileInput.files[0]);
        new API().uploadAccessDb(formData);
    }

    return(
        <div>
            <input type="file" 
            id="file-input" 
            accept={extension} />

            <button onClick={uploadfunction}>Upload_File</button>
        </div>
    );
    
}
export default FileUpload;