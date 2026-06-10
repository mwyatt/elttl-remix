import PropTypes from 'prop-types'

const component = function FullLoader ({ isLoading }) {
  if (!isLoading) {
    return null
  }

  return (
    <div
      className='flex justify-center items-center absolute top-0 bottom-0 left-0 right-0 bg-[#00000033] z-50'
    >
      <p>Loading...</p>
    </div>
  )
}

component.propTypes = {
  isLoading: PropTypes.bool.isRequired
}

export default component
