import { UseChatHelpers } from 'ai/react'

export function EmptyScreen({ setInput }: Pick<UseChatHelpers, 'setInput'>) {
  return (
    <div className="mx-auto max-w-2xl px-4">
      <div className="rounded-lg border bg-background p-8">
        <h1 className="mb-2 text-lg font-semibold text-center">
          Welcome to AI Chatbot!
        </h1>
        <p className="leading-normal text-muted-foreground text-center">
          You can start a conversation here by interacting with it:
        </p>
      </div>
    </div>
  )
}
