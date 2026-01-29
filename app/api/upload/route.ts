import { NextRequest, NextResponse } from 'next/server'
import { v4 as uuidv4 } from 'uuid'
import pdfParse from 'pdf-parse'

export async function POST(req: NextRequest) {
  const formData: FormData = await req.formData()
  const uploadedFiles = formData.getAll('filepond')
  let fileName = ''
  let parsedText = ''

  if (uploadedFiles && uploadedFiles.length > 0) {
    const uploadedFile = uploadedFiles[1]
    console.log('Uploaded file:', uploadedFile)

    if (uploadedFile instanceof File) {
      fileName = uuidv4()
      const fileBuffer = Buffer.from(await uploadedFile.arrayBuffer())

      try {
        const data = await pdfParse(fileBuffer)
        parsedText = data.text
      } catch (error) {
        console.error('Error parsing PDF:', error)
      }
    } else {
      console.log('Uploaded file is not in the expected format.')
    }
  } else {
    console.log('No files found.')
  }

  const response = new NextResponse(parsedText)
  response.headers.set('FileName', fileName)
  return response
}
