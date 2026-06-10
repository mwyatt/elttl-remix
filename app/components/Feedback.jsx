'use client'

export default function Feedback ({ message }) {
  if (!message) return null

  return (
    <div className='p-4 border border-stone-300 bg-stone-100 rounded mb-4'>
      <p>{message}</p>
    </div>
  )
}
