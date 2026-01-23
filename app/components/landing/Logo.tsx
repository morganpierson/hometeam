import Image from 'next/image'
import logoImage from '@/app/images/logos/frame13.svg'

export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props}>
      <Image
        src={logoImage}
        alt="Skilled Trades Marketplace"
        width={120}
        height={40}
        className="h-10 w-auto"
        priority
      />
    </div>
  )
}
