import * as React from 'react'
import axios from 'axios'
import Link from 'next/link'
import Textarea from 'react-textarea-autosize'
import { UseChatHelpers } from 'ai/react'
import Backdrop from '@mui/material/Backdrop'
import { useEnterSubmit } from '@/lib/hooks/use-enter-submit'
import { cn } from '@/lib/utils'
import { Button, buttonVariants } from '@/components/ui/button'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger
} from '@/components/ui/tooltip'
import { IconArrowElbow, IconPlus } from '@/components/ui/icons'
import { FileUploadModal } from './uploadModal'

export interface PromptProps
  extends Pick<UseChatHelpers, 'input' | 'setInput'> {
  onSubmit: (value: string) => Promise<void>
  isLoading: boolean
}

export function PromptForm({
  onSubmit,
  input,
  setInput,
  isLoading
}: PromptProps) {
  const { formRef, onKeyDown } = useEnterSubmit()
  const inputRef = React.useRef<HTMLTextAreaElement>(null)
  const [isModalOpen, setModalOpen] = React.useState(false)
  const [uploadedContent, setUploadedContent] = React.useState<string>('')

  async function retrieveDocuments() {
    try {
      const response = await axios.get('/api/document/getDocument')
      return response.data
    } catch (error) {
      console.error('Error retrieving documents:', error)
      throw error
    }
  }

  React.useEffect(() => {
    async function fetchData() {
      const documents = await retrieveDocuments()
      console.log(documents)
    }
    if (inputRef.current) {
      inputRef.current.focus()
    }
    fetchData()
  }, [])

  const handleFileContentExtracted = (content: string) => {
    setUploadedContent(content)
  }

  return (
    <div>
      <form
        onSubmit={async e => {
          e.preventDefault()
          if ((input || '').trim() || (uploadedContent || '').trim()) {
            // Determine the content to send based on priority (uploadedContent > input)
            const contentToSend = uploadedContent || input

            // Clear both input and uploadedContent
            setInput('')
            setUploadedContent('')

            // Send the content
            await onSubmit(contentToSend)
          }
        }}
        ref={formRef}
      >
        <div className="relative flex max-h-60 w-full grow flex-col overflow-hidden bg-background px-8 sm:rounded-md sm:border sm:px-12">
          <Tooltip>
            <TooltipTrigger asChild>
              <Link
                href="/"
                className={cn(
                  buttonVariants({ size: 'sm', variant: 'outline' }),
                  'absolute left-0 top-4 h-8 w-8 rounded-full bg-background p-0 sm:left-4'
                )}
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setModalOpen(true)}
                >
                  <IconPlus />
                  <span className="sr-only">New Chat</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent>New Chat</TooltipContent>
          </Tooltip>
          <Textarea
            ref={inputRef}
            tabIndex={0}
            onKeyDown={onKeyDown}
            rows={1}
            value={uploadedContent || input}
            onChange={e => setInput(e.target.value)}
            placeholder="Send a message."
            spellCheck={false}
            className="min-h-[60px] w-full resize-none bg-transparent px-4 py-[1.3rem] focus-within:outline-none sm:text-sm"
          />
          <div className="absolute right-0 top-4 sm:right-4">
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="submit"
                  size="icon"
                  disabled={isLoading || (!uploadedContent && !input)}
                >
                  <IconArrowElbow />
                  <span className="sr-only">Send message</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent>Send message</TooltipContent>
            </Tooltip>
          </div>
        </div>
      </form>
      {isModalOpen && (
        <>
          <Backdrop open={isModalOpen} sx={{ zIndex: 1300 }}>
            <FileUploadModal
              isOpen={isModalOpen}
              onClose={() => setModalOpen(false)}
              onFileContentExtracted={handleFileContentExtracted}
            />
          </Backdrop>
        </>
      )}
    </div>
  )
}
