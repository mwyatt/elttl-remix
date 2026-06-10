'use client'

import { useState } from 'react'

export default function CookieBanner ({ isCookieBannerDismissed }) {
  const [isDisabled, setIsDisabled] = useState(false)

  const disabledClasses = isDisabled ? 'opacity-50 cursor-not-allowed' : ''

  if (isCookieBannerDismissed === true) {
    return null
  }

  const handleDecision = async (decision) => {
    setIsDisabled(true)

    try {
      const response = await fetch('/api/cookie-consent-banner', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ decision })
      })

      if (response.ok) {
        window.location.reload()
      } else {
        console.error('Error while setting cookie consent decision.')
      }
    } catch {
      console.error('Error while setting cookie consent decision.')
      setIsDisabled(false)
    }
  }

  return (
    <div className={`p-6 bg-stone-100 border border-stone-300 fixed bottom-0 right-0 max-w-md sm:rounded-tl drop-shadow ${disabledClasses}`}>
      <h3 className='text-lg font-semibold mb-3'>Cookies</h3>
      <p className='my-3 mb-4'>Your privacy matters to us, we only use cookies to track your use of this website so that we can improve your experience.</p>
      <div className='flex gap-4 justify-end'>
        <button
          disabled={isDisabled}
          className='bg-primary-500 px-4 py-2 rounded font-bold text-white' onClick={() => handleDecision(true)}
        >Accept
        </button>
        <div className='flex items-center'>
          <button
            disabled={isDisabled}
            className='text-stone-500 border-b border-b-stone-500 ml-2 leading-6'
            onClick={() => handleDecision(false)}
          >Reject
          </button>
        </div>
      </div>
    </div>
  )
}
