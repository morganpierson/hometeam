'use client'
import { FilePond } from 'react-filepond'
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation'
import FilePondPluginImagePreview from 'filepond-plugin-image-preview'
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css'
import { useState } from 'react'

const FileUpload = ({ name }) => {
  const [file, setFile] = useState([])
  return (
    <div>
      <FilePond
        name={name}
        allowMultiple={false}
        files={file}
        onupdatefiles={setFile}
        labelIdle='Drag & Drop your files or <span class="filepond--label-action">Browse</span>'
      />
    </div>
  )
}

export default FileUpload
