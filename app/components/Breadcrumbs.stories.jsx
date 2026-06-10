import Breadcrumbs from '@/components/Breadcrumbs'

const storyConfig = {
  title: 'Breadcrumbs',
  component: Breadcrumbs
}

export default storyConfig

export const Default = {
  args: {
    items: [
      { name: 'Home', href: '/' },
      { name: 'Library', href: '/library' },
      { name: 'Data' }
    ]
  }
}
