import PageLayout from "@/components/page-layout"
import { Button } from "@/components/ui/button"
import Image from "next/image"

const Integrations = () => {
  return (
    <PageLayout className="flex flex-col gap-4">

      <div className="flex flex-col gap-4">
        Integrations go here
        <Button variant='outline'>Discord <Image alt='Discord icon' src={'/discord.png'} width={20} height={20} /></Button>
        <Button variant='outline'>Telegram <Image alt='Telegram icon' src={'/telegram.png'} width={20} height={20} /></Button>
      </div>
    </PageLayout>
  )
}

export default Integrations 
