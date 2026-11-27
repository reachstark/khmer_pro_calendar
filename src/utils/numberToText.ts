export type NumberLocale = 'km' | 'en'

export type EnglishCapitalization =
  | 'none' // all lowercase
  | 'capitalizeEach' // First letter of each word uppercase
  | 'uppercase' // ALL UPPERCASE

export interface NumberToTextOptions {
  locale?: NumberLocale
  useRiel?: boolean
  capitalization?: EnglishCapitalization
}

const KHMER_DIGITS = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'] as const
const EN_DIGITS = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'] as const
const MAX_INT64_STR = '9223372036854775807'

const KHMER_NUMBERS = [
  '',
  'មួយ',
  'ពីរ',
  'បី',
  'បួន',
  'ប្រាំ',
  'ប្រាំមួយ',
  'ប្រាំពីរ',
  'ប្រាំបី',
  'ប្រាំបួន',
] as const

const KHMER_TENS = [
  '',
  'ដប់',
  'ម្ភៃ',
  'សាមសិប',
  'សែសិប',
  'ហាសិប',
  'ហុកសិប',
  'ចិតសិប',
  'ប៉ែតសិប',
  'កៅសិប',
] as const

const KHMER_UNIT_LABELS = [
  '',
  'ពាន់',
  'លាន',
  'ប៊ីលាន',
  'ទ្រីលាន',
  'ក្វាទ្រីលាន',
  'ខ្វីនទ្រីលាន',
] as const

const EN_BELOW_TWENTY = [
  '',
  'one',
  'two',
  'three',
  'four',
  'five',
  'six',
  'seven',
  'eight',
  'nine',
  'ten',
  'eleven',
  'twelve',
  'thirteen',
  'fourteen',
  'fifteen',
  'sixteen',
  'seventeen',
  'eighteen',
  'nineteen',
] as const

const EN_TENS = [
  '',
  '',
  'twenty',
  'thirty',
  'forty',
  'fifty',
  'sixty',
  'seventy',
  'eighty',
  'ninety',
] as const

const EN_UNIT_LABELS = [
  '',
  'thousand',
  'million',
  'billion',
  'trillion',
  'quadrillion',
  'quintillion',
] as const

function exceedsMaxInt64(digits: string): boolean {
  const trimmed = digits.replace(/^0+(?=\d)/, '')
  return trimmed.length > 19 || (trimmed.length === 19 && trimmed.localeCompare(MAX_INT64_STR) > 0)
}

function convertToKhmer(number: bigint, useRiel = false): string {
  function processThreeDigits(rawChunk: number): string {
    const chunk = rawChunk % 1000
    if (chunk === 0) return ''
    const chunkParts: string[] = []

    const hundred = Math.floor(chunk / 100)
    const tenUnit = chunk % 100
    const ten = Math.floor(tenUnit / 10)
    const unit = tenUnit % 10

    if (hundred > 0) {
      chunkParts.push(`${KHMER_NUMBERS[hundred] ?? ''}រយ`)
    }

    if (ten > 1) {
      chunkParts.push(KHMER_TENS[ten] ?? '')
      if (unit > 0) chunkParts.push(KHMER_NUMBERS[unit] ?? '')
    } else if (ten === 1) {
      chunkParts.push('ដប់')
      if (unit > 0) chunkParts.push(KHMER_NUMBERS[unit] ?? '')
    } else if (unit > 0 || hundred === 0) {
      chunkParts.push(KHMER_NUMBERS[unit] ?? '')
    }

    return chunkParts.join('')
  }

  const parts: string[] = []
  let remaining = number
  let chunkIndex = 0

  if (remaining === 0n) {
    parts.push('សូន្យ')
  } else {
    while (remaining > 0n) {
      const chunk = Number(remaining % 1000n)
      if (chunk > 0) {
        let chunkText = processThreeDigits(chunk)
        if (KHMER_UNIT_LABELS.length > chunkIndex) {
          chunkText += KHMER_UNIT_LABELS[chunkIndex] ?? ''
        }
        parts.unshift(chunkText)
      }
      remaining /= 1000n
      chunkIndex++
    }
  }

  const baseText = parts.join(' ').replace(/\s+/g, ' ').trim()

  if (useRiel) {
    return `${baseText}រៀលគត់`
  }

  return baseText
}

function convertToEnglish(
  number: bigint,
  options: {
    decimalNumber?: bigint
    useRiel?: boolean
    capitalization?: EnglishCapitalization
  } = {},
): string {
  const { decimalNumber, useRiel = false, capitalization = 'capitalizeEach' } = options

  function convertChunk(num: number): string {
    if (num === 0) return ''
    if (num < 20) return EN_BELOW_TWENTY[num] ?? ''
    if (num < 100) {
      const ten = Math.floor(num / 10)
      const unit = num % 10
      return `${EN_TENS[ten] ?? ''}${unit > 0 ? ` ${EN_BELOW_TWENTY[unit] ?? ''}` : ''}`
    }
    const hundred = Math.floor(num / 100)
    const rest = num % 100
    return `${EN_BELOW_TWENTY[hundred] ?? ''} hundred${rest > 0 ? ` ${convertChunk(rest)}` : ''}`
  }

  function convertIntegerPart(num: bigint): string {
    if (num === 0n) return ''
    const parts: string[] = []
    let remaining = num
    let chunkIndex = 0

    while (remaining > 0n) {
      const chunk = Number(remaining % 1000n)
      if (chunk > 0) {
        let chunkText = convertChunk(chunk)
        const label = EN_UNIT_LABELS[chunkIndex] ?? ''
        if (EN_UNIT_LABELS.length > chunkIndex && label.length > 0) {
          chunkText += ` ${label}`
        }
        parts.unshift(chunkText)
      }
      remaining /= 1000n
      chunkIndex++
    }

    return parts.join(' ').replace(/\s+/g, ' ').trim()
  }

  let result = convertIntegerPart(number)

  if (
    result.length === 0 &&
    number === 0n &&
    (decimalNumber === undefined || decimalNumber === 0n)
  ) {
    result = 'zero'
  }

  if (decimalNumber !== undefined && decimalNumber > 0n) {
    const decimalText = convertIntegerPart(decimalNumber)
    if (result.length === 0) {
      result = decimalText
    } else {
      result = `${result} and ${decimalText}`
    }
  }

  if (useRiel) {
    result = result.length > 0 ? `${result} riel` : 'riel'
  }

  switch (capitalization) {
    case 'none':
      result = result.toLowerCase()
      break
    case 'capitalizeEach':
      result = result
        .split(' ')
        .map((w) =>
          w.length === 0 ? w : (w[0] ?? '').toUpperCase() + w.substring(1).toLowerCase(),
        )
        .join(' ')
      break
    case 'uppercase':
      result = result.toUpperCase()
      break
  }

  return result
}

export function numberToText(input: string, options: NumberToTextOptions = {}): string {
  const { locale = 'km', useRiel = false, capitalization = 'capitalizeEach' } = options

  let textToProcess = input

  // Handle currency sign cutoff ('៛' or '$')
  const currencyIdx = textToProcess.search(/[៛$]/)
  if (currencyIdx !== -1) {
    textToProcess = textToProcess.substring(0, currencyIdx)
  }

  // Convert Khmer digits to English digits early on
  let normalized = Array.from(textToProcess)
    .map((ch) => {
      const khIdx = KHMER_DIGITS.indexOf(ch as (typeof KHMER_DIGITS)[number])
      return khIdx !== -1 ? (EN_DIGITS[khIdx] ?? ch) : ch
    })
    .join('')

  // 1. Detect decimal separator (last '.' or ',')
  const lastDot = normalized.lastIndexOf('.')
  const lastComma = normalized.lastIndexOf(',')
  const lastSeparatorIndex = lastDot > lastComma ? lastDot : lastComma

  if (lastSeparatorIndex !== -1) {
    const separatorChar = normalized[lastSeparatorIndex] ?? '.'
    const separatorCount = normalized.split(separatorChar).length - 1
    const afterSeparator = normalized.substring(lastSeparatorIndex + 1).replace(/[^\d]/g, '')

    const hasBothSeparators = lastDot !== -1 && lastComma !== -1
    const isDecimal = hasBothSeparators || (separatorCount === 1 && afterSeparator.length !== 3)

    if (isDecimal) {
      normalized = `${normalized.substring(0, lastSeparatorIndex)}D${normalized.substring(lastSeparatorIndex + 1)}`
    }
  }

  // 2. Clean up string: keep only digits and 'D' decimal marker
  normalized = normalized.replace(/[^\dD]/g, '')

  if (normalized.length === 0 || (!normalized.includes('D') && !/^[0-9]+$/.test(normalized))) {
    return ''
  }

  // 3. Split into Integer and Decimal portions
  const parts = normalized.split('D')
  const intPartStr = (parts[0] ?? '').length === 0 ? '0' : (parts[0] ?? '0')
  let decPartStr = parts.length > 1 ? (parts[1] ?? '') : ''

  // Check bounds for max 64-bit signed integer (9223372036854775807)
  if (exceedsMaxInt64(intPartStr)) {
    return 'ERROR'
  }

  const integerNumber = BigInt(intPartStr)

  let decimalNumber: bigint | undefined
  if (decPartStr.length > 0) {
    if (decPartStr.length > 19) {
      decPartStr = decPartStr.substring(0, 19)
    }
    if (!exceedsMaxInt64(decPartStr)) {
      decimalNumber = BigInt(decPartStr)
    }
  }

  if (locale === 'km') {
    return convertToKhmer(integerNumber, useRiel)
  }

  return convertToEnglish(integerNumber, {
    decimalNumber,
    useRiel,
    capitalization,
  })
}

export function hasDecimalPartDetected(input: string): boolean {
  let textToProcess = input
  const currencyIdx = textToProcess.search(/[៛$]/)
  if (currencyIdx !== -1) {
    textToProcess = textToProcess.substring(0, currencyIdx)
  }
  const normalized = Array.from(textToProcess)
    .map((ch) => {
      const khIdx = KHMER_DIGITS.indexOf(ch as (typeof KHMER_DIGITS)[number])
      return khIdx !== -1 ? (EN_DIGITS[khIdx] ?? ch) : ch
    })
    .join('')

  const lastDot = normalized.lastIndexOf('.')
  const lastComma = normalized.lastIndexOf(',')
  const lastSeparatorIndex = lastDot > lastComma ? lastDot : lastComma
  if (lastSeparatorIndex === -1) return false

  const separatorChar = normalized[lastSeparatorIndex] ?? '.'
  const separatorCount = normalized.split(separatorChar).length - 1
  const afterSeparator = normalized.substring(lastSeparatorIndex + 1).replace(/[^\d]/g, '')
  if (afterSeparator.length === 0 || /^0+$/.test(afterSeparator)) return false

  const hasBothSeparators = lastDot !== -1 && lastComma !== -1
  return hasBothSeparators || (separatorCount === 1 && afterSeparator.length !== 3)
}
