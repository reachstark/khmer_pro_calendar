import { getNewYear } from '@thyrith/momentkh'
import { getKhmerDayDetail, toKhmerNumber } from '@/utils/khmerCalendar'

export interface KhmerZodiacInfo {
  index: number // 0-11 matching @thyrith/momentkh animalYear
  nameKh: string
  nameEn: string
  emoji: string
  imageUrl: string
  elementKh: string
  elementEn: string
  traitKh: string
  traitEn: string
  blessingKh: string
  accentGradient: string
  badgeClasses: string
}

export const KHMER_ZODIAC_LIST: KhmerZodiacInfo[] = [
  {
    index: 0,
    nameKh: 'ជូត',
    nameEn: 'Rat',
    emoji: '🐀',
    imageUrl: '/images/zodiac/zodiac_0_rat.jpg',
    elementKh: 'ធាតុទឹក',
    elementEn: 'Water',
    traitKh: 'ឆ្លាតវៃ រហ័សរហួន និងពូកែសម្របខ្លួន',
    traitEn: 'Clever, resourceful & adaptable',
    blessingKh: 'សូមឱ្យមានបញ្ញាភ្លឺថ្លា ជោគជ័យ និងសម្បូរសប្បាយ!',
    accentGradient: 'from-sky-500/20 via-indigo-500/15 to-amber-500/20',
    badgeClasses: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-400/40',
  },
  {
    index: 1,
    nameKh: 'ឆ្លូវ',
    nameEn: 'Ox',
    emoji: '🐂',
    imageUrl: '/images/zodiac/zodiac_1_ox.jpg',
    elementKh: 'ធាតុដី',
    elementEn: 'Earth',
    traitKh: 'អត់ធ្មត់ ស្មោះត្រង់ និងព្យាយាមមោះមុត',
    traitEn: 'Diligent, steadfast & trustworthy',
    blessingKh: 'សូមឱ្យមានកម្លាំងមាំមួន ជីវិតរឹងមាំ និងរីកចម្រើន!',
    accentGradient: 'from-amber-500/20 via-stone-500/15 to-yellow-500/20',
    badgeClasses: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-400/40',
  },
  {
    index: 2,
    nameKh: 'ខាល',
    nameEn: 'Tiger',
    emoji: '🐅',
    imageUrl: '/images/zodiac/zodiac_2_tiger.jpg',
    elementKh: 'ធាតុឈើ',
    elementEn: 'Wood',
    traitKh: 'ក្លាហាន មានឥទ្ធិពល និងពោរពេញដោយថាមពល',
    traitEn: 'Courageous, confident & energetic',
    blessingKh: 'សូមឱ្យមានសេចក្តីក្លាហាន ឈ្នះអស់ឧបសគ្គ និងមានជ័យជម្នះ!',
    accentGradient: 'from-orange-500/20 via-amber-500/15 to-red-500/20',
    badgeClasses: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-400/40',
  },
  {
    index: 3,
    nameKh: 'ថោះ',
    nameEn: 'Rabbit',
    emoji: '🐇',
    imageUrl: '/images/zodiac/zodiac_3_rabbit.jpg',
    elementKh: 'ធាតុឈើ',
    elementEn: 'Wood',
    traitKh: 'ទន់ភ្លន់ សុភាពរាបសារ និងប្រកបដោយមេត្តា',
    traitEn: 'Gentle, compassionate & graceful',
    blessingKh: 'សូមឱ្យមានសន្តិភាពផ្លូវចិត្ត សុភមង្គល និងសេចក្តីសុខ!',
    accentGradient: 'from-emerald-500/20 via-teal-500/15 to-amber-400/20',
    badgeClasses: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-400/40',
  },
  {
    index: 4,
    nameKh: 'រោង',
    nameEn: 'Dragon',
    emoji: '🐉',
    imageUrl: '/images/zodiac/zodiac_4_dragon.jpg',
    elementKh: 'ធាតុមាស',
    elementEn: 'Gold',
    traitKh: 'ឧត្តុង្គឧត្តម មានបារមី និងចក្ខុវិស័យវែងឆ្ងាយ',
    traitEn: 'Noble, charismatic & visionary',
    blessingKh: 'សូមឱ្យមានបារមីរុងរឿង លាភសក្ការៈ និងជោគជ័យត្រចះត្រចង់!',
    accentGradient: 'from-amber-500/25 via-yellow-500/20 to-red-500/20',
    badgeClasses: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/50',
  },
  {
    index: 5,
    nameKh: 'ម្សាញ់',
    nameEn: 'Snake',
    emoji: '🐍',
    imageUrl: '/images/zodiac/zodiac_5_snake.jpg',
    elementKh: 'ធាតុភ្លើង',
    elementEn: 'Fire',
    traitKh: 'ឈ្លាសវៃ ស្ងប់ស្ងាត់ និងមានប្រាជ្ញាជ្រាលជ្រៅ',
    traitEn: 'Wise, intuitive & composed',
    blessingKh: 'សូមឱ្យមានប្រាជ្ញាឈ្លាសវៃ សេចក្តីចម្រើន និងសុខសាន្ត!',
    accentGradient: 'from-emerald-600/20 via-amber-500/15 to-indigo-500/20',
    badgeClasses: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-400/40',
  },
  {
    index: 6,
    nameKh: 'មមី',
    nameEn: 'Horse',
    emoji: '🐎',
    imageUrl: '/images/zodiac/zodiac_6_horse.jpg',
    elementKh: 'ធាតុភ្លើង',
    elementEn: 'Fire',
    traitKh: 'ស្វាហាប់ រួសរាយ សេរីភាព និងឈានទៅមុខជានិច្ច',
    traitEn: 'Spirited, lively & unstoppable',
    blessingKh: 'សូមឱ្យការងាររលូន រហ័សទាន់ចិត្ត និងសម្រេចគ្រប់បំណងប្រាថ្នា!',
    accentGradient: 'from-amber-500/25 via-orange-500/18 to-rose-500/20',
    badgeClasses: 'bg-amber-500/20 text-amber-800 dark:text-amber-300 border-amber-400/50',
  },
  {
    index: 7,
    nameKh: 'មមែ',
    nameEn: 'Goat',
    emoji: '🐐',
    imageUrl: '/images/zodiac/zodiac_7_goat.jpg',
    elementKh: 'ធាតុមាស',
    elementEn: 'Gold',
    traitKh: 'ស្លូតបូត មានសិល្បៈ និងស្រឡាញ់សន្តិភាព',
    traitEn: 'Kind-hearted, creative & harmonious',
    blessingKh: 'សូមឱ្យមានភាពសុខដុមរមនា ទ្រព្យសម្បត្តិ និងសំណាងល្អ!',
    accentGradient: 'from-yellow-500/20 via-amber-400/15 to-emerald-500/20',
    badgeClasses: 'bg-yellow-500/15 text-yellow-800 dark:text-yellow-300 border-yellow-400/40',
  },
  {
    index: 8,
    nameKh: 'វក',
    nameEn: 'Monkey',
    emoji: '🐒',
    imageUrl: '/images/zodiac/zodiac_8_monkey.jpg',
    elementKh: 'ធាតុដែក',
    elementEn: 'Iron',
    traitKh: 'វៃឆ្លាត ច្នៃប្រឌិត និងរីករាយស្វាហាប់',
    traitEn: 'Witty, inventive & spirited',
    blessingKh: 'សូមឱ្យមានគំនិតច្នៃប្រឌិត រីករាយ និងជោគជ័យគ្រប់ទីកន្លែង!',
    accentGradient: 'from-amber-500/20 via-indigo-500/15 to-violet-500/20',
    badgeClasses: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-300 border-indigo-400/40',
  },
  {
    index: 9,
    nameKh: 'រកា',
    nameEn: 'Rooster',
    emoji: '🐓',
    imageUrl: '/images/zodiac/zodiac_9_rooster.jpg',
    elementKh: 'ធាតុដែក',
    elementEn: 'Iron',
    traitKh: 'ឧស្សាហ៍ព្យាយាម ម៉ឺងម៉ាត់ និងភ្លឺស្វាងដូចអរុណរះ',
    traitEn: 'Observant, punctual & radiant',
    blessingKh: 'សូមឱ្យមានរស្មីភ្លឺត្រចះ ជោគជ័យ និងសិរីសួស្តីជានិច្ច!',
    accentGradient: 'from-rose-500/20 via-amber-500/20 to-orange-500/20',
    badgeClasses: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-400/40',
  },
  {
    index: 10,
    nameKh: 'ច',
    nameEn: 'Dog',
    emoji: '🐕',
    imageUrl: '/images/zodiac/zodiac_10_dog.jpg',
    elementKh: 'ធាតុដី',
    elementEn: 'Earth',
    traitKh: 'ស្មោះត្រង់ យុត្តិធម៌ និងតែងតែការពារមិត្តភក្តិ',
    traitEn: 'Loyal, honest & protective',
    blessingKh: 'សូមឱ្យមានមិត្តល្អ សុវត្ថិភាព និងសេចក្តីសុខគ្រប់ពេលវេលា!',
    accentGradient: 'from-amber-600/20 via-orange-500/15 to-sky-500/15',
    badgeClasses: 'bg-amber-500/15 text-amber-800 dark:text-amber-300 border-amber-400/40',
  },
  {
    index: 11,
    nameKh: 'កុរ',
    nameEn: 'Pig',
    emoji: '🐖',
    imageUrl: '/images/zodiac/zodiac_11_pig.jpg',
    elementKh: 'ធាតុទឹក',
    elementEn: 'Water',
    traitKh: 'សប្បុរស សម្បូរទ្រព្យ និងមានចិត្តទូលាយ',
    traitEn: 'Generous, prosperous & warm-hearted',
    blessingKh: 'សូមឱ្យមានភោគទ្រព្យបរិបូរណ៍ សុខភាពល្អ និងសំណាងល្អ!',
    accentGradient: 'from-pink-500/20 via-amber-500/15 to-rose-500/20',
    badgeClasses: 'bg-pink-500/15 text-pink-700 dark:text-pink-300 border-pink-400/40',
  },
]

export function getKhmerZodiacByIndex(index: number): KhmerZodiacInfo {
  const normalized = ((index % 12) + 12) % 12
  return KHMER_ZODIAC_LIST[normalized] ?? KHMER_ZODIAC_LIST[0]!
}

export interface YearZodiacSummary {
  zodiac: KhmerZodiacInfo
  sakName: string
  beYear: number
  beYearKh: string
  jsYear: number
  jsYearKh: string
  gregorianYear: number
  gregorianYearKh: string
  knyStartDay: number
  knyEndDay: number
  knyHour: number
  knyMinute: number
  knyDateRangeKh: string
  knyTimeKh: string
}

/**
 * Returns the Khmer Zodiac Year summary for a given viewed Gregorian year & month.
 * Note: For months Jan–Mar before Khmer New Year, reflects the active Khmer lunar year on the 15th;
 * for April (Khmer New Year month) and May–Dec, highlights the new Khmer Zodiac year & Sak!
 */
export function getViewedYearZodiacSummary(
  year: number,
  monthIndex: number, // 0-11
): YearZodiacSummary {
  const ny = getNewYear(year)
  const knyStartDay = ny?.day ?? 14
  const knyEndDay = knyStartDay + 2
  const knyHour = ny?.hour ?? 0
  const knyMinute = ny?.minute ?? 0

  // On April (month 3), showcase the incoming Khmer New Year's zodiac & Sak (after Loeng Sak)
  const sampleDate = monthIndex === 3 ? new Date(year, 4, 1) : new Date(year, monthIndex, 15)
  const detail = getKhmerDayDetail(sampleDate)
  const zodiac = getKhmerZodiacByIndex(detail.khmer.animalYear)

  return {
    zodiac,
    sakName: detail.khmer.sakName,
    beYear: detail.khmer.beYear,
    beYearKh: detail.khmer.beYearKhmerNum,
    jsYear: detail.khmer.jsYear,
    jsYearKh: detail.khmer.jsYearKhmerNum,
    gregorianYear: year,
    gregorianYearKh: toKhmerNumber(year),
    knyStartDay,
    knyEndDay,
    knyHour,
    knyMinute,
    knyDateRangeKh: `${toKhmerNumber(knyStartDay)}–${toKhmerNumber(knyEndDay)} មេសា`,
    knyTimeKh: `${toKhmerNumber(String(knyHour).padStart(2, '0'))}:${toKhmerNumber(String(knyMinute).padStart(2, '0'))}`,
  }
}

/**
 * Check if a Gregorian date falls within Khmer New Year (3 official days: Moha Songkran, Virak Vanabat, Virak Loeng Sak)
 */
export function isDateInKhmerNewYear(date: Date): boolean {
  const year = date.getFullYear()
  const ny = getNewYear(year)
  if (!ny) return false
  return (
    date.getMonth() + 1 === ny.month && date.getDate() >= ny.day && date.getDate() <= ny.day + 2
  )
}
