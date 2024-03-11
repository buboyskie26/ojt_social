'use client';
import React, { useState } from 'react';
import axios from 'axios';

const TestFile = () => {
  const [selectedFiles, setSelectedFiles] = useState<any[]>([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  //   const handleFileChange = (event: any) => {
  //     setSelectedFile(event.target.files[0]);
  //   };

  const handleFileChange = (event: any) => {
    setSelectedFiles([...selectedFiles, ...event.target.files]);
  };
  const handleTitleChange = (event: any) => {
    setTitle(event.target.value);
  };

  const handleContentChange = (event: any) => {
    setContent(event.target.value);
  };

  const handleUpload = async () => {
    const formData = new FormData();

    selectedFiles.forEach((file, index) => {
      formData.append(`images[${index}]`, file);

      console.log(`images[${index}]`);
    });

    formData.append('title', title);
    formData.append('content', content);

    console.log(selectedFiles);

    // try {
    //   const response = await axios.post('/api/upload', formData, {
    //     headers: {
    //       'Content-Type': 'multipart/form-data',
    //     },
    //   });
    //   console.log('Image uploaded successfully:', response.data);
    // } catch (error) {
    //   console.error('Error uploading image:', error);
    // }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        accept="image/*"
        multiple
        name="image"
      />
      <input
        type="text"
        placeholder="Title"
        name="title"
        value={title}
        onChange={handleTitleChange}
      />
      <textarea
        placeholder="Content"
        name="content"
        value={content}
        onChange={handleContentChange}
      />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
};

export default TestFile;
