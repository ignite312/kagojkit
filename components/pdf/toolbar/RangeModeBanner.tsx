type RangeModeBannerProps = {
  rangeStart: number | null
}

export default function RangeModeBanner({ rangeStart }: RangeModeBannerProps) {
  return (
    <p className="range-hint">
      {rangeStart === null
        ? 'Range mode: click the first page, then the last.'
        : `Range started at page ${rangeStart} — click the end page.`}
    </p>
  )
}
