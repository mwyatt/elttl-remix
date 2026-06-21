export default function StyledContent ({ html }) {
  return (
          <div
      className="
        styled-content
        [&_p]:mb-4 [&_p]:leading-relaxed
        [&_h1]:text-2xl [&_h1]:mb-3
        [&_h2]:text-xl [&_h2]:mb-2
        [&_h3]:text-2xl [&_h3]:mb-3
        [&_h4]:text-xl [&_h4]:mb-2
        [&_table]:table-auto [&_table]:border-collapse [&_table]:border [&_table]:border-gray-300 [&_table]:w-full [&_table]:my-4
        [&_th]:border [&_th]:border-gray-300 [&_th]:p-2
        [&_td]:border [&_td]:border-gray-300 [&_td]:p-2s
        [&_a]:text-blue-600 [&_a]:underline hover:[&_a]:text-blue-800
      "
      dangerouslySetInnerHTML={{ __html: html }}
    />
  )
}
