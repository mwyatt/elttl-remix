import parse from 'html-react-parser'

export default function StyledContent ({ html }) {
  const transform = (node) => {
    if (node.type === 'tag') {
      if (node.name === 'p') {
        node.attribs = {
          ...node.attribs,
          class: 'mb-4 leading-relaxed'
        }
      }

      if (node.name === 'h3' || node.name === 'h1') {
        node.attribs = {
          ...node.attribs,
          class: 'text-2xl mb-3'
        }
      }

      if (node.name === 'h4' || node.name === 'h2') {
        node.attribs = {
          ...node.attribs,
          class: 'text-xl mb-2'
        }
      }

      if (node.name === 'table') {
        node.attribs = {
          ...node.attribs,
          class: 'table-auto border-collapse border border-gray-300 w-full my-4'
        }
      }

      if (node.name === 'td' || node.name === 'th') {
        node.attribs = {
          ...node.attribs,
          class: 'border border-gray-300 p-2'
        }
      }

      if (node.name === 'a') {
        node.attribs = {
          ...node.attribs,
          class: 'text-blue-600 underline hover:text-blue-800'
        }
      }
    }
  }

  return <div>{parse(html, { replace: transform })}</div>
}
