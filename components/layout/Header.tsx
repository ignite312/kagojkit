type HeaderProps = {
  title?: string
  subtitle?: string
}

export default function Header({
  title = 'PageExtracto',
  subtitle = 'Select and extract specific pages from your PDF documents',
}: HeaderProps) {
  return (
    <header className="py-8 border-b border-gray-300 mb-8">
      <h1 className="text-3xl font-semibold text-gray-900 mb-1">{title}</h1>
      <p className="text-gray-600 text-base">{subtitle}</p>
    </header>
  )
}
