import classNames from "classnames";

const buttonClassNames = [
  'rounded px-3 py-2 font-bold capitalize transition-colors focus:outline-2 focus:outline-offset-2 border flex items-center justify-center'
]

export const linkStyles = [
  'text-primary-500',
  'border-b',
  'border-b-primary-500',
  'focus:outline-none',
  'focus:ring-2',
  'focus:ring-stone-500',
]

export const allHomeButtonStyles = [
  'text-stone-500 border border-stone-400 px-2 py-1 rounded hover:border-stone-600 hover:text-stone-600 focus:outline-2 focus:outline-offset-2 focus:outline-stone-500 active:border-stone-700 active:bg-stone-200'
]

export const buttonPrimaryClassNames = classNames(
  buttonClassNames,
  'bg-primary-500 text-white hover:bg-secondary-500 focus:outline-stone-500 active:border-stone-700 border-primary-500'
)

export const buttonSecondaryClassNames = classNames(
  buttonClassNames,
  'text-stone-500 border-stone-400 rounded hover:border-stone-600 hover:text-stone-600 focus:outline-stone-500 active:border-stone-700 active:bg-stone-200'
)

export const buttonPrimaryStyles = [buttonPrimaryClassNames]
