import * as React from 'react'
import { Button } from '@/components/ui/button'
import extractTextFromPDF from '../util/pdfUtil'
const mammoth = require('mammoth')
import { styled } from '@mui/material/styles'
import { Box } from '@mui/material'
import axios from 'axios'
import CircularProgress from '@mui/material/CircularProgress'

interface FileUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onFileContentExtracted: (content: string) => void
}

const ModalContent = styled(Box)(({ theme }) => ({
  border: `2px solid ${theme.palette.divider}`,
  borderRadius: theme.shape.borderRadius,
  padding: theme.spacing(2),
  width: '900px',
  maxWidth: '650px',
  height: `30rem`
}))

export const FileUploadModal: React.FC<FileUploadModalProps> = ({
  isOpen,
  onClose,
  onFileContentExtracted
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const [document_type, setDocumentType] = React.useState<string>('')
  const [isLoading, setIsLoading] = React.useState<boolean>(false)
  const [content, setContent] = React.useState<string>('')
  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true)
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = e => {
        if (document_type === 'pdf') {
          const fileContentPromise = extractTextFromPDF(file)
          fileContentPromise
            .then(fileContent => {
              setContent(fileContent)
              setIsLoading(false)
              onFileContentExtracted(fileContent)
            })
            .catch(error => {
              console.error('Error handling PDF file:', error)
            })
        } else {
          const fileContentPromise = mammoth.extractRawText({
            arrayBuffer: e.target?.result
          })
          fileContentPromise
            .then((fContent: any) => {
              setContent(fContent.value)
              setIsLoading(false)
              onFileContentExtracted(fContent.value)
              onClose()
            })
            .catch((error: any) => {
              console.error('Error handling PDF file:', error)
            })
        }
      }

      reader.readAsArrayBuffer(file) // Read as ArrayBuffer for pdfjs
    }
  }

  const handleSave = () => {
    axios
      .post('/api/document/saveDocument', { document_type, content })
      .then(response => {
        console.log('Document saved:', response.data)
        onClose()
      })
      .catch(error => {
        console.error('Error saving document:', error)
      })
  }

  return (
    <div className={`modal ${isOpen ? 'modal-open' : ''}`}>
      <ModalContent>
        <div className="mb-4">
          <label
            htmlFor="documentType"
            className="block font-medium text-ml p-3"
          >
            Select knowledge Type:
          </label>
          <select
            id="documentType"
            value={document_type}
            onChange={e => setDocumentType(e.target.value)}
            className="w-full px-4 py-3 border rounded"
          >
            <option value="pdf">pdf</option>
            <option value="doc">doc</option>
            <option value="txt">txt</option>
          </select>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileUpload}
        />
        <div className="flex justify-end">
          <Button
            className="font-medium text-ml"
            variant="outline"
            size="lg"
            onClick={() => fileInputRef.current?.click()}
          >
            Upload knowledge
            <span className="sr-only">Upload File</span>
          </Button>

          <Button
            className="font-medium text-ml"
            variant="outline"
            size="lg"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
        {isLoading ? (
          <div className="flex justify-center items-center h-full">
            <CircularProgress color="primary" size={40} />
          </div>
        ) : (
          ''
        )}
      </ModalContent>
    </div>
  )
}
