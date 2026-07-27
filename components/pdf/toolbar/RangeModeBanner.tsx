type RangeModeBannerProps = {
  rangeStart: number | null
}

export default function RangeModeBanner({ rangeStart }: RangeModeBannerProps) {
  return (
    <div className="card p-4 mb-4 bg-yellow-50 border-yellow-200">
      <div className="flex items-center gap-3">
        <div>
          <strong className="text-yellow-800 text-sm">Range Selection Mode Active</strong>
          <p className="text-yellow-700 text-xs mt-1">
            {rangeStart === null
              ? 'Click the first page to start the range.'
              : `First selected: ${rangeStart}. Click the second page to select range.`}
          </p>
        </div>
      </div>
    </div>
  )
}
