import MainHeading from '@/components/MainHeading'

const storyConfig = {
  title: 'MainHeading',
  component: MainHeading,
  parameters: {
    name: 'Example Main Heading'
  }
}

export default storyConfig

export const Primary = {
  args: {
    name: 'Hello, Main Heading!'
  }
}
