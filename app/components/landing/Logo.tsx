import Image from 'next/image'

export function Logo(props: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <div {...props}>
      <Image
        src="/logo.png"
        alt="Skilled Trades Marketplace"
        width={40}
        height={40}
        className="h-10 w-10 rounded"
        priority
      />
    </div>
  )
}
