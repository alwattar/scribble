'use client'

import { useEffect } from 'react'
import { useParams } from 'next/navigation'

import { socket } from '@/lib/socket'
import { Button } from '@/components/ui/Button'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/Tooltip'
import { Kbd } from '@/components/ui/Kbd'

interface ClearButtonProps {
  canvasRef: React.RefObject<HTMLCanvasElement>
  clear: () => void
}

export default function ClearButton({ canvasRef, clear }: ClearButtonProps) {
  const { roomId } = useParams()

  useEffect(() => {
    socket.on('clear-canvas', clear)

    return () => {
      socket.off('clear-canvas')
    }
  }, [clear])

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant='outline'
            className='rounded-none rounded-tr-md border-0 border-b border-l'
            onClick={() => {
              const canvasElement = canvasRef.current
              if (!canvasElement) return

              socket.emit('add-undo-point', {
                roomId,
                undoPoint: canvasElement.toDataURL(),
              })
              clear()
              socket.emit('clear-canvas', roomId)
            }}
          >
            Clear
          </Button>
        </TooltipTrigger>

        <TooltipContent>
          <Kbd>C</Kbd>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}