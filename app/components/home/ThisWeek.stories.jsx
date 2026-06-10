import ThisWeek from './ThisWeek'

const storyConfig = {
  title: 'Home/ThisWeek',
  component: ThisWeek
}

export default storyConfig

const Template = (args) => <ThisWeek {...args} />

export const Default = Template.bind({})
Default.args = {
  yearName: '2024',
  week: { id: 1 },
  fixtures: [
    { id: 1, name: 'Fixture 1' },
    { id: 2, name: 'Fixture 2' }
  ]
}

export const NoWeek = Template.bind({})
NoWeek.args = {
  yearName: '2024',
  fixtures: []
}
