import { Button } from '@/components/ui/button'
import { BoxIcon } from 'lucide-react'

const AssistantTrigger = () => {
    return (
        <>
            <Button variant={'outline'} size='icon' className='shadow-none'>
                <BoxIcon className="w-5 h-5 rotate-180" />
            </Button>
        </>
    )
}

export default AssistantTrigger