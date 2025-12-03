

  import config from 'virtual:config'

const dateFormat = new Intl.DateTimeFormat(
  config.locale.dateLocale,
  config.locale.dateOptions as Intl.DateTimeFormatOptions
)

export function getFormattedDate(
  date: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  const d = new Date(date)

  // ✅ 不管是否传 options，都用 DateTimeFormat.format（能输出时间）
  const fmt = new Intl.DateTimeFormat(
    config.locale.dateLocale,
    {
      ...(config.locale.dateOptions as Intl.DateTimeFormatOptions),
      ...(options ?? {})
    }
  )

  return fmt.format(d)
}
