import GeneralLink from '@/components/GeneralLink'

export default function Breadcrumbs ({ items = [] }) {
  if (items.length === 1) {
    return null
  }
  const getLink = (item) => {
    if (item.href) {
      return <GeneralLink className='text-primary-500' href={item.href}>{item.name}</GeneralLink>
    }
    return <span className='text-stone-400 cursor-auto'>{item.name}</span>
  }
  return (
    <div className='flex pb-4 hidden sm:block'>
      {items.map((item, index) => (
        <span key={index}>
          {getLink(item)}
          {index < items.length - 1 && <span className='text-stone-400 mx-4'>/</span>}
        </span>
      ))}
    </div>
  )
}
