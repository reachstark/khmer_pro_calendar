export interface MonthTheme {
  monthIndex: number // 0-11
  khmerName: string
  englishName: string
  lunarSpanKh: string
  themeTitleKh: string
  themeTitleEn: string
  culturalNoteKh: string
  culturalNoteEn: string
  primaryColor: string
  gradientHeader: string
  gradientCard: string
  accentBorder: string
  badgeClass: string
  accentText: string
  glowShadow: string
  svgIcon?: string // SVG illustration markup (legacy fallback)
  imageUrl: string // High-resolution month representation image
}

export const MONTH_THEMES: MonthTheme[] = [
  // 1. January (មករា)
  {
    monthIndex: 0,
    imageUrl: '/images/months/month_01.jpg',
    khmerName: 'មករា',
    englishName: 'January',
    lunarSpanKh: 'បុស្ស - មាឃ',
    themeTitleKh: 'រស្មីព្រលឹមអង្គរវត្ត & ជ័យជម្នះ ៧ មករា',
    themeTitleEn: 'Angkor Wat Sunrise & January Victory',
    culturalNoteKh: 'រដូវរំហើយត្រជាក់ស្រួល ព្រះអាទិត្យរះចំកណ្តាលកំពូលប្រាសាទអង្គរវត្ត និងទិវាជ័យជម្នះ ៧ មករា',
    culturalNoteEn: 'Cool pleasant breeze season, mesmerizing sunrise behind Angkor Wat spires and Victory Day',
    primaryColor: '#059669',
    gradientHeader: 'from-emerald-600 via-teal-600 to-cyan-700',
    gradientCard: 'from-emerald-500/10 via-teal-500/5 to-cyan-500/10',
    accentBorder: 'border-emerald-500/30',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    accentText: 'text-emerald-600 dark:text-emerald-400',
    glowShadow: 'shadow-emerald-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f766e" />
          <stop offset="50%" stop-color="#14b8a6" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
        <linearGradient id="sun0" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#fef08a" />
          <stop offset="100%" stop-color="#f97316" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky0)" />
      <!-- Golden Sun behind Angkor -->
      <circle cx="200" cy="115" r="48" fill="url(#sun0)" opacity="0.9" />
      <circle cx="200" cy="115" r="75" fill="#fef08a" opacity="0.25" />
      <!-- Angkor Wat silhouette -->
      <!-- Center Main Tower -->
      <path d="M195 45 Q200 35 205 45 L208 75 L215 95 L220 145 L180 145 L185 95 L192 75 Z" fill="#042f2e" />
      <path d="M197 32 L200 22 L203 32 Z" fill="#042f2e" />
      <!-- Left Inner Tower -->
      <path d="M155 70 Q160 60 165 70 L168 95 L173 115 L176 145 L144 145 L147 115 L152 95 Z" fill="#042f2e" />
      <!-- Right Inner Tower -->
      <path d="M235 70 Q240 60 245 70 L248 95 L253 115 L256 145 L224 145 L227 115 L232 95 Z" fill="#042f2e" />
      <!-- Left Outer Tower -->
      <path d="M115 95 Q120 85 125 95 L128 115 L132 145 L108 145 L112 115 Z" fill="#042f2e" />
      <!-- Right Outer Tower -->
      <path d="M275 95 Q280 85 285 95 L288 115 L292 145 L268 145 L272 115 Z" fill="#042f2e" />
      <!-- Gallery Wall Base -->
      <rect x="70" y="145" width="260" height="25" fill="#042f2e" />
      <rect x="50" y="165" width="300" height="15" fill="#022c22" />
      <!-- Water Reflection Lake -->
      <rect x="0" y="180" width="400" height="60" fill="#115e59" />
      <ellipse cx="200" cy="195" rx="55" ry="10" fill="#fef08a" opacity="0.4" />
      <ellipse cx="200" cy="210" rx="90" ry="12" fill="#14b8a6" opacity="0.3" />
      <!-- Water Lily Pads -->
      <ellipse cx="70" cy="205" rx="18" ry="6" fill="#064e3b" />
      <circle cx="72" cy="202" r="3" fill="#f43f5e" />
      <ellipse cx="320" cy="215" rx="22" ry="7" fill="#064e3b" />
      <circle cx="322" cy="212" r="4" fill="#f43f5e" />
    </svg>`,
  },

  // 2. February (កុម្ភៈ)
  {
    monthIndex: 1,
    imageUrl: '/images/months/month_02.jpg',
    khmerName: 'កុម្ភៈ',
    englishName: 'February',
    lunarSpanKh: 'មាឃ - ផល្គុន',
    themeTitleKh: 'បុណ្យមាឃបូជា & ប្រាសាទបន្ទាយស្រី',
    themeTitleEn: 'Meak Bochea & Banteay Srei Citadel',
    culturalNoteKh: 'ប្រារព្ធពិធីបុណ្យមាឃបូជា ពេញបូណ៌មីខែមាឃ និងភាពល្អឯកនៃចម្លាក់ថ្មភក់ពណ៌ផ្កាឈូកបន្ទាយស្រី',
    culturalNoteEn: 'Sacred Meak Bochea full moon celebration & delicate pink sandstone carvings of Banteay Srei',
    primaryColor: '#7c3aed',
    gradientHeader: 'from-purple-600 via-indigo-600 to-violet-800',
    gradientCard: 'from-purple-500/10 via-indigo-500/5 to-violet-500/10',
    accentBorder: 'border-purple-500/30',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-300 border-purple-500/30',
    accentText: 'text-purple-600 dark:text-purple-400',
    glowShadow: 'shadow-purple-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#312e81" />
          <stop offset="60%" stop-color="#6d28d9" />
          <stop offset="100%" stop-color="#c084fc" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky1)" />
      <!-- Full Moon of Meak Bochea -->
      <circle cx="200" cy="70" r="38" fill="#fef3c7" />
      <circle cx="200" cy="70" r="55" fill="#fef3c7" opacity="0.2" />
      <!-- Banteay Srei Gabled Gate / Pediment Outline -->
      <path d="M150 160 L180 110 Q200 90 220 110 L250 160 Z" fill="#831843" opacity="0.9" />
      <path d="M165 160 L185 125 Q200 112 215 125 L235 160 Z" fill="#9d174d" />
      <!-- Doorway -->
      <rect x="185" y="145" width="30" height="55" rx="15" fill="#1e1b4b" />
      <!-- Intricate Makara arches -->
      <path d="M140 165 C160 135 175 110 200 100 C225 110 240 135 260 165" stroke="#f472b6" stroke-width="4" fill="none" />
      <!-- Ground and candles -->
      <rect x="0" y="185" width="400" height="55" fill="#1e1b4b" />
      <!-- Candles for Meak Bochea -->
      <rect x="80" y="175" width="6" height="15" fill="#fef08a" />
      <circle cx="83" cy="170" r="4" fill="#fb923c" />
      <rect x="120" y="177" width="5" height="12" fill="#fef08a" />
      <circle cx="122.5" cy="172" r="3.5" fill="#fb923c" />
      <rect x="280" y="175" width="6" height="15" fill="#fef08a" />
      <circle cx="283" cy="170" r="4" fill="#fb923c" />
      <rect x="320" y="177" width="5" height="12" fill="#fef08a" />
      <circle cx="322.5" cy="172" r="3.5" fill="#fb923c" />
      <!-- Lotus Flower in Foreground -->
      <path d="M200 185 C190 170 195 155 200 150 C205 155 210 170 200 185 Z" fill="#f472b6" />
      <path d="M190 185 C178 175 180 162 188 158 C195 168 195 180 190 185 Z" fill="#ec4899" />
      <path d="M210 185 C222 175 220 162 212 158 C205 168 205 180 210 185 Z" fill="#ec4899" />
    </svg>`,
  },

  // 3. March (មីនា)
  {
    monthIndex: 2,
    imageUrl: '/images/months/month_03.jpg',
    khmerName: 'មីនា',
    englishName: 'March',
    lunarSpanKh: 'ផល្គុន - ចេត្រ',
    themeTitleKh: 'ផ្ការំដួលជាតិខ្មែរ & ទិវាអន្តរជាតិនារី',
    themeTitleEn: 'National Rumduol Flower & Women’s Rights',
    culturalNoteKh: 'ផ្ការំដួលរីកក្លិនក្រអូបសាយភាយ តំណាងឱ្យភាពទន់ភ្លន់ ថ្លៃថ្នូរ និងអបអរសាទរទិវាអន្តរជាតិនារី ៨ មីនា',
    culturalNoteEn: 'Delicate fragrance of blooming Rumduol blossoms representing elegance and Women’s Day',
    primaryColor: '#e11d48',
    gradientHeader: 'from-rose-500 via-pink-600 to-red-600',
    gradientCard: 'from-rose-500/10 via-pink-500/5 to-red-500/10',
    accentBorder: 'border-rose-500/30',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-300 border-rose-500/30',
    accentText: 'text-rose-600 dark:text-rose-400',
    glowShadow: 'shadow-rose-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky2" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#9f1239" />
          <stop offset="50%" stop-color="#db2777" />
          <stop offset="100%" stop-color="#fda4af" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky2)" />
      <!-- Gentle Lake backdrop -->
      <ellipse cx="200" cy="180" rx="220" ry="60" fill="#881337" opacity="0.6" />
      <!-- Rumduol Stems & Leaves -->
      <path d="M120 240 Q160 170 195 125" stroke="#14532d" stroke-width="8" stroke-linecap="round" fill="none" />
      <path d="M195 125 Q240 90 280 60" stroke="#14532d" stroke-width="6" stroke-linecap="round" fill="none" />
      <ellipse cx="140" cy="170" rx="35" ry="12" fill="#15803d" transform="rotate(-30 140 170)" />
      <ellipse cx="250" cy="100" rx="32" ry="11" fill="#15803d" transform="rotate(25 250 100)" />
      <!-- Beautiful Rumduol Flower (3 outer thick petals, 3 inner petals) -->
      <!-- Outer Petal Top -->
      <path d="M195 125 C185 85 205 60 200 50 C215 65 215 95 195 125 Z" fill="#fef08a" />
      <!-- Outer Petal Left -->
      <path d="M195 125 C155 125 130 145 120 150 C140 160 170 145 195 125 Z" fill="#fde047" />
      <!-- Outer Petal Right -->
      <path d="M195 125 C225 140 255 155 270 155 C260 140 230 120 195 125 Z" fill="#fde047" />
      <!-- Inner Petals -->
      <path d="M195 125 C188 105 198 90 202 85 C208 95 205 110 195 125 Z" fill="#eab308" />
      <circle cx="198" cy="115" r="9" fill="#ca8a04" />
      <!-- Floating golden scent sparkles -->
      <circle cx="230" cy="65" r="3" fill="#fef08a" opacity="0.8" />
      <circle cx="150" cy="80" r="2.5" fill="#fef08a" opacity="0.8" />
      <circle cx="270" cy="110" r="4" fill="#fef08a" opacity="0.6" />
      <!-- Small secondary blossom -->
      <circle cx="280" cy="60" r="14" fill="#fef08a" />
      <circle cx="280" cy="60" r="5" fill="#ca8a04" />
    </svg>`,
  },

  // 4. April (មេសា)
  {
    monthIndex: 3,
    imageUrl: '/images/months/month_04.jpg',
    khmerName: 'មេសា',
    englishName: 'April',
    lunarSpanKh: 'ចេត្រ - ពិសាខ',
    themeTitleKh: 'បុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិ & មហាសង្ក្រាន្ត',
    themeTitleEn: 'Khmer New Year & Moha Songkran',
    culturalNoteKh: 'អបអរសាទរបុណ្យចូលឆ្នាំថ្មីប្រពៃណីជាតិខ្មែរ ទទួលទេវតាឆ្នាំថ្មី ពូនភ្នំខ្សាច់ និងល្បែងប្រជាប្រិយខ្មែរ',
    culturalNoteEn: 'Grand Khmer New Year celebrations, welcoming the New Year Devada, sand stupas & folk games',
    primaryColor: '#f59e0b',
    gradientHeader: 'from-amber-500 via-orange-500 to-red-500',
    gradientCard: 'from-amber-500/10 via-orange-500/5 to-red-500/10',
    accentBorder: 'border-amber-500/30',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-300 border-amber-500/30',
    accentText: 'text-amber-600 dark:text-amber-400',
    glowShadow: 'shadow-amber-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky3" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#7c2d12" />
          <stop offset="45%" stop-color="#ea580c" />
          <stop offset="85%" stop-color="#f59e0b" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky3)" />
      <!-- Golden Sunlight Rays -->
      <polygon points="200,80 160,0 180,0" fill="#fef08a" opacity="0.25" />
      <polygon points="200,80 220,0 240,0" fill="#fef08a" opacity="0.25" />
      <polygon points="200,80 80,40 100,20" fill="#fef08a" opacity="0.2" />
      <polygon points="200,80 300,20 320,40" fill="#fef08a" opacity="0.2" />
      <!-- Sacred Sand Mounds / Veuka Chedei (ពូនភ្នំខ្សាច់) -->
      <!-- Center Main Stupa -->
      <path d="M198 45 L202 45 L204 70 L212 95 L225 130 L245 175 L155 175 L175 130 L188 95 L196 70 Z" fill="#d97706" />
      <polygon points="200,32 197,45 203,45" fill="#fef08a" />
      <!-- Tier bands on Stupa -->
      <ellipse cx="200" cy="100" rx="16" ry="4" fill="#fef3c7" opacity="0.7" />
      <ellipse cx="200" cy="135" rx="30" ry="6" fill="#fef3c7" opacity="0.7" />
      <ellipse cx="200" cy="175" rx="50" ry="9" fill="#b45309" />
      <!-- Small side stupas -->
      <path d="M115 130 L125 130 L135 180 L95 180 Z" fill="#b45309" />
      <polygon points="120,120 117,130 123,130" fill="#fef08a" />
      <path d="M285 130 L275 130 L265 180 L305 180 Z" fill="#b45309" />
      <polygon points="280,120 277,130 283,130" fill="#fef08a" />
      <!-- Festive flags (Tung) -->
      <line x1="80" y1="80" x2="80" y2="185" stroke="#78350f" stroke-width="3" />
      <polygon points="80,90 45,100 80,110" fill="#ef4444" />
      <line x1="320" y1="80" x2="320" y2="185" stroke="#78350f" stroke-width="3" />
      <polygon points="320,90 355,100 320,110" fill="#3b82f6" />
      <!-- Traditional Chhoung (ឈូង) in mid-air -->
      <circle cx="280" cy="70" r="14" fill="#ec4899" />
      <path d="M275 80 L260 110 L270 110 Z" fill="#f43f5e" />
      <!-- Ground base -->
      <rect x="0" y="180" width="400" height="60" fill="#78350f" />
    </svg>`,
  },

  // 5. May (ឧសភា)
  {
    monthIndex: 4,
    imageUrl: '/images/months/month_05.jpg',
    khmerName: 'ឧសភា',
    englishName: 'May',
    lunarSpanKh: 'ពិសាខ - ជេស្ឋ',
    themeTitleKh: 'វិសាខបូជា & ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល',
    themeTitleEn: 'Visak Bochea & Royal Ploughing',
    culturalNoteKh: 'ទិវាដ៏ពិសិដ្ឋវិសាខបូជា និងព្រះរាជពិធីច្រត់ព្រះនង្គ័លទស្សន៍ទាយភោគផលកសិកម្មជាតិ',
    culturalNoteEn: 'Sacred Visak Bochea & Royal Ploughing ceremony forecasting agricultural prosperity',
    primaryColor: '#eab308',
    gradientHeader: 'from-yellow-500 via-amber-600 to-orange-700',
    gradientCard: 'from-yellow-500/10 via-amber-500/5 to-orange-500/10',
    accentBorder: 'border-yellow-500/30',
    badgeClass: 'bg-yellow-500/15 text-yellow-700 dark:text-yellow-300 border-yellow-500/30',
    accentText: 'text-yellow-600 dark:text-yellow-400',
    glowShadow: 'shadow-yellow-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky4" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#854d0e" />
          <stop offset="60%" stop-color="#ca8a04" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky4)" />
      <!-- Royal Palace Golden Spire Silhouette -->
      <path d="M198 15 L202 15 L204 40 L210 65 L218 95 L224 135 L176 135 L182 95 L190 65 L196 40 Z" fill="#713f12" />
      <polygon points="200,5 197,15 203,15" fill="#fef08a" />
      <!-- Tiered palace roof wings -->
      <path d="M160 135 C175 125 190 120 200 120 C210 120 225 125 240 135 L260 148 C240 145 220 145 200 145 C180 145 160 145 140 148 Z" fill="#a16207" />
      <!-- Field & Royal Oxen representation (គោឧសភរាជ) -->
      <rect x="0" y="165" width="400" height="75" fill="#3f6212" />
      <!-- Sacred Royal Ox silhouette -->
      <ellipse cx="140" cy="180" rx="35" ry="20" fill="#fef3c7" />
      <circle cx="110" cy="168" r="14" fill="#fef3c7" />
      <!-- Horns -->
      <path d="M106 160 Q100 145 110 140" stroke="#ca8a04" stroke-width="4" fill="none" />
      <path d="M112 160 Q118 145 124 140" stroke="#ca8a04" stroke-width="4" fill="none" />
      <!-- Ceremonial red saddle cloth -->
      <path d="M125 168 Q140 162 155 168 L152 188 Q140 184 128 188 Z" fill="#dc2626" />
      <!-- Golden ears of rice in background -->
      <path d="M300 200 Q320 150 340 140" stroke="#eab308" stroke-width="4" fill="none" />
      <circle cx="340" cy="140" r="4" fill="#fef08a" />
      <circle cx="330" cy="150" r="4" fill="#fef08a" />
      <circle cx="320" cy="165" r="4" fill="#fef08a" />
    </svg>`,
  },

  // 6. June (មិថុនា)
  {
    monthIndex: 5,
    imageUrl: '/images/months/month_06.jpg',
    khmerName: 'មិថុនា',
    englishName: 'June',
    lunarSpanKh: 'ជេស្ឋ - អាសាឍ',
    themeTitleKh: 'រដូវវស្សាធ្លាក់ភ្លៀង & ទឹកធ្លាក់ភ្នំគូលែន',
    themeTitleEn: 'Monsoon Greenery & Phnom Kulen Waterfall',
    culturalNoteKh: 'ដំណក់ទឹកភ្លៀងរដូវវស្សាផ្តល់ជីវិតដល់ព្រៃឈើ និងទឹកធ្លាក់ភ្នំគូលែនដ៏ត្រជាក់ស្រស់បំព្រង',
    culturalNoteEn: 'Monsoon rains breathing life into lush tropical rainforests & sacred Phnom Kulen waterfalls',
    primaryColor: '#0d9488',
    gradientHeader: 'from-emerald-600 via-green-600 to-teal-800',
    gradientCard: 'from-emerald-500/10 via-green-500/5 to-teal-500/10',
    accentBorder: 'border-teal-500/30',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-300 border-teal-500/30',
    accentText: 'text-teal-600 dark:text-teal-400',
    glowShadow: 'shadow-teal-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky5" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#064e3b" />
          <stop offset="60%" stop-color="#047857" />
          <stop offset="100%" stop-color="#34d399" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky5)" />
      <!-- Forest Canopy & Mountain Cliffs -->
      <path d="M0 80 Q100 40 180 90 L180 240 L0 240 Z" fill="#022c22" />
      <path d="M220 90 Q300 30 400 70 L400 240 L220 240 Z" fill="#022c22" />
      <!-- Waterfall cascading between cliffs -->
      <path d="M180 85 L220 85 L225 180 L175 180 Z" fill="#a7f3d0" />
      <line x1="190" y1="85" x2="190" y2="180" stroke="#ffffff" stroke-width="2" opacity="0.8" />
      <line x1="200" y1="85" x2="200" y2="180" stroke="#ffffff" stroke-width="3" opacity="0.9" />
      <line x1="210" y1="85" x2="210" y2="180" stroke="#ffffff" stroke-width="2" opacity="0.8" />
      <!-- Waterfall pool with mist -->
      <ellipse cx="200" cy="185" rx="55" ry="14" fill="#ffffff" opacity="0.6" />
      <rect x="0" y="185" width="400" height="55" fill="#065f46" />
      <!-- Jungle Ferns and Tropical Leaves -->
      <ellipse cx="70" cy="160" rx="45" ry="16" fill="#10b981" transform="rotate(-20 70 160)" />
      <ellipse cx="330" cy="160" rx="45" ry="16" fill="#10b981" transform="rotate(20 330 160)" />
    </svg>`,
  },

  // 7. July (កក្កដា)
  {
    monthIndex: 6,
    imageUrl: '/images/months/month_07.jpg',
    khmerName: 'កក្កដា',
    englishName: 'July',
    lunarSpanKh: 'អាសាឍ - ស្រាពណ៍',
    themeTitleKh: 'ប្រាសាទព្រះវិហារលើខ្នងភ្នំដងរែក',
    themeTitleEn: 'Preah Vihear Mountain Sanctuary',
    culturalNoteKh: 'ប្រាសាទព្រះវិហារ បេតិកភណ្ឌពិភពលោក ឈរយ៉ាងស្កឹមស្កៃលើកំពូលភ្នំដងរែកហ៊ុមព័ទ្ធដោយពពកអ័ព្ទ',
    culturalNoteEn: 'Preah Vihear UNESCO World Heritage temple standing majestically atop Dângrêk cliff in the clouds',
    primaryColor: '#0284c7',
    gradientHeader: 'from-cyan-600 via-sky-600 to-blue-800',
    gradientCard: 'from-cyan-500/10 via-sky-500/5 to-blue-500/10',
    accentBorder: 'border-sky-500/30',
    badgeClass: 'bg-sky-500/15 text-sky-700 dark:text-sky-300 border-sky-500/30',
    accentText: 'text-sky-600 dark:text-sky-400',
    glowShadow: 'shadow-sky-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky6" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#075985" />
          <stop offset="60%" stop-color="#38bdf8" />
          <stop offset="100%" stop-color="#e0f2fe" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky6)" />
      <!-- Dângrêk Mountain Ridge Cliff -->
      <path d="M0 160 L120 140 L240 120 L400 135 L400 240 L0 240 Z" fill="#0f172a" />
      <path d="M0 175 L150 155 L260 140 L400 155 L400 240 L0 240 Z" fill="#1e293b" />
      <!-- Preah Vihear Gopura Silhouette on Cliff Ridge -->
      <!-- Center sanctuary -->
      <path d="M190 85 L200 65 L210 85 L225 120 L175 120 Z" fill="#334155" />
      <path d="M180 120 L185 100 L215 100 L220 120 Z" fill="#475569" />
      <!-- Wings of Gopura -->
      <rect x="150" y="105" width="100" height="15" fill="#334155" />
      <!-- Clouds below cliff -->
      <ellipse cx="80" cy="190" rx="70" ry="25" fill="#ffffff" opacity="0.6" />
      <ellipse cx="200" cy="205" rx="90" ry="30" fill="#ffffff" opacity="0.7" />
      <ellipse cx="320" cy="195" rx="80" ry="25" fill="#ffffff" opacity="0.6" />
    </svg>`,
  },

  // 8. August (សីហា)
  {
    monthIndex: 7,
    imageUrl: '/images/months/month_08.jpg',
    khmerName: 'សីហា',
    englishName: 'August',
    lunarSpanKh: 'ស្រាពណ៍ - ភទ្របទ',
    themeTitleKh: 'វាលស្រែខៀវស្រងាត់ & ដើមត្នោតខ្មែរ',
    themeTitleEn: 'Emerald Rice Paddies & Sugar Palms',
    culturalNoteKh: 'វាលស្រែខៀវស្រងាត់ពាសពេញផ្ទៃប្រទេស អមដោយជួរដើមត្នោតខ្មែរជានិមិត្តរូបនៃមាតុភូមិ',
    culturalNoteEn: 'Verdant green rice carpets across Cambodia flanked by iconic towering sugar palm trees',
    primaryColor: '#65a30d',
    gradientHeader: 'from-lime-600 via-emerald-600 to-teal-700',
    gradientCard: 'from-lime-500/10 via-emerald-500/5 to-teal-500/10',
    accentBorder: 'border-lime-500/30',
    badgeClass: 'bg-lime-500/15 text-lime-700 dark:text-lime-300 border-lime-500/30',
    accentText: 'text-lime-600 dark:text-lime-400',
    glowShadow: 'shadow-lime-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky7" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#15803d" />
          <stop offset="60%" stop-color="#84cc16" />
          <stop offset="100%" stop-color="#fef08a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky7)" />
      <!-- Rice Terraces / Paddies -->
      <path d="M0 140 Q150 120 400 150 L400 240 L0 240 Z" fill="#4d7c0f" />
      <path d="M0 170 Q200 150 400 180 L400 240 L0 240 Z" fill="#3f6212" />
      <path d="M0 205 Q220 190 400 210 L400 240 L0 240 Z" fill="#14532d" />
      <!-- Iconic Sugar Palm Tree 1 (Left) -->
      <path d="M90 220 Q92 140 95 65" stroke="#1c1917" stroke-width="6" fill="none" />
      <circle cx="95" cy="65" r="28" fill="#1c1917" />
      <circle cx="95" cy="65" r="22" fill="#166534" />
      <!-- Sugar Palm Tree 2 (Right) -->
      <path d="M310 220 Q305 150 300 80" stroke="#1c1917" stroke-width="5" fill="none" />
      <circle cx="300" cy="80" r="24" fill="#1c1917" />
      <circle cx="300" cy="80" r="18" fill="#166534" />
      <!-- Traditional Khmer Wooden Stilt House Silhouette -->
      <polygon points="200,140 175,160 225,160" fill="#1c1917" />
      <rect x="180" y="160" width="40" height="20" fill="#292524" />
      <line x1="184" y1="180" x2="184" y2="195" stroke="#1c1917" stroke-width="3" />
      <line x1="216" y1="180" x2="216" y2="195" stroke="#1c1917" stroke-width="3" />
    </svg>`,
  },

  // 9. September (កញ្ញា)
  {
    monthIndex: 8,
    imageUrl: '/images/months/month_09.jpg',
    khmerName: 'កញ្ញា',
    englishName: 'September',
    lunarSpanKh: 'ភទ្របទ - អស្សុជ',
    themeTitleKh: 'រដូវកាន់បិណ្ឌ & បុណ្យភ្ជុំបិណ្ឌ',
    themeTitleEn: 'Sacred Kan Ben & Pchum Ben Ancestral Festival',
    culturalNoteKh: 'ពុទ្ធសាសនិកជនទៅវត្តកាន់បិណ្ឌ បោះបាយបិណ្ឌនៅទៀបភ្លឺ ឧទ្ទិសកុសលជូនបុព្វការីជន និងទិវារដ្ឋធម្មនុញ្ញ',
    culturalNoteEn: 'Ancestral veneration during Kan Ben, Bay Ben offerings at dawn, and Constitutional Day',
    primaryColor: '#7e22ce',
    gradientHeader: 'from-violet-700 via-purple-700 to-indigo-900',
    gradientCard: 'from-violet-500/10 via-purple-500/5 to-indigo-500/10',
    accentBorder: 'border-violet-500/30',
    badgeClass: 'bg-violet-500/15 text-violet-700 dark:text-violet-300 border-violet-500/30',
    accentText: 'text-violet-600 dark:text-violet-400',
    glowShadow: 'shadow-violet-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky8" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0f172a" />
          <stop offset="50%" stop-color="#3b0764" />
          <stop offset="100%" stop-color="#6b21a8" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky8)" />
      <!-- Night Stars & Waning Crescent Moon -->
      <circle cx="60" cy="50" r="1.5" fill="#ffffff" />
      <circle cx="120" cy="30" r="2" fill="#ffffff" />
      <circle cx="340" cy="40" r="1.5" fill="#ffffff" />
      <path d="M300 45 C308 45 315 52 315 60 C315 68 308 75 300 75 C296 75 292 73 290 70 C295 68 298 64 298 60 C298 56 295 52 290 50 C292 47 296 45 300 45 Z" fill="#fef08a" />
      <!-- Pagoda Sanctuary (វិហារវត្ត) Silhouette at Night -->
      <polygon points="200,60 150,110 250,110" fill="#1e1b4b" />
      <polygon points="200,40 195,60 205,60" fill="#fef08a" />
      <rect x="160" y="110" width="80" height="50" fill="#1e1b4b" />
      <rect x="185" y="125" width="30" height="35" rx="15" fill="#f59e0b" opacity="0.8" />
      <!-- Pagoda Ground -->
      <rect x="0" y="160" width="400" height="80" fill="#09090b" />
      <!-- Glowing Candles & Incense Smoke for Pchum Ben -->
      <!-- Candle 1 -->
      <rect x="100" y="180" width="8" height="25" fill="#ea580c" />
      <circle cx="104" cy="175" r="5" fill="#fef08a" />
      <path d="M104 175 Q95 150 110 130" stroke="#a855f7" stroke-width="2" opacity="0.6" fill="none" />
      <!-- Candle 2 -->
      <rect x="290" y="180" width="8" height="25" fill="#ea580c" />
      <circle cx="294" cy="175" r="5" fill="#fef08a" />
      <path d="M294 175 Q305 150 290 130" stroke="#a855f7" stroke-width="2" opacity="0.6" fill="none" />
      <!-- Rice offerings in bowl (បាយបិណ្ឌ) -->
      <ellipse cx="200" cy="205" rx="35" ry="12" fill="#78350f" />
      <ellipse cx="200" cy="200" rx="30" ry="8" fill="#f8fafc" />
    </svg>`,
  },

  // 10. October (តុលា)
  {
    monthIndex: 9,
    imageUrl: '/images/months/month_10.jpg',
    khmerName: 'តុលា',
    englishName: 'October',
    lunarSpanKh: 'អស្សុជ - កត្តិក',
    themeTitleKh: 'ទិវាគ្រងរាជ្យ & វិមានឯករាជ្យ',
    themeTitleEn: 'King’s Coronation & Independence Monument',
    culturalNoteKh: 'រំលឹកខួបនៃការឡើងគ្រងរាជសម្បត្តិរបស់ព្រះមហាក្សត្រ និងការប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ',
    culturalNoteEn: 'Royal coronation anniversary celebrations & honoring the legacy of King Father Norodom Sihanouk',
    primaryColor: '#c2410c',
    gradientHeader: 'from-orange-600 via-amber-700 to-stone-800',
    gradientCard: 'from-orange-500/10 via-amber-500/5 to-stone-500/10',
    accentBorder: 'border-orange-500/30',
    badgeClass: 'bg-orange-500/15 text-orange-700 dark:text-orange-300 border-orange-500/30',
    accentText: 'text-orange-600 dark:text-orange-400',
    glowShadow: 'shadow-orange-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky9" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#1c1917" />
          <stop offset="60%" stop-color="#7c2d12" />
          <stop offset="100%" stop-color="#ea580c" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky9)" />
      <!-- Independence Monument (វិមានឯករាជ្យ) Silhouette & Golden Glow -->
      <!-- Lotus Bud tiers of Independence Monument -->
      <!-- Top spire -->
      <polygon points="200,20 197,35 203,35" fill="#fef08a" />
      <path d="M194 35 L206 35 L208 55 L192 55 Z" fill="#451a03" />
      <!-- Tier 1 -->
      <ellipse cx="200" cy="58" rx="20" ry="7" fill="#fef08a" opacity="0.8" />
      <path d="M188 58 L212 58 L216 80 L184 80 Z" fill="#451a03" />
      <!-- Tier 2 -->
      <ellipse cx="200" cy="83" rx="30" ry="9" fill="#fef08a" opacity="0.8" />
      <path d="M180 83 L220 83 L226 115 L174 115 Z" fill="#451a03" />
      <!-- Tier 3 -->
      <ellipse cx="200" cy="118" rx="42" ry="11" fill="#fef08a" opacity="0.8" />
      <!-- Base pillars -->
      <rect x="175" y="118" width="50" height="45" fill="#451a03" />
      <rect x="188" y="130" width="24" height="33" rx="12" fill="#ea580c" />
      <!-- Foundation steps -->
      <rect x="145" y="163" width="110" height="12" fill="#78350f" />
      <rect x="125" y="175" width="150" height="12" fill="#451a03" />
      <rect x="0" y="187" width="400" height="53" fill="#1c1917" />
      <!-- Spotlights -->
      <polygon points="120,240 180,140 185,140 130,240" fill="#fef08a" opacity="0.2" />
      <polygon points="280,240 220,140 215,140 270,240" fill="#fef08a" opacity="0.2" />
    </svg>`,
  },

  // 11. November (វិច្ឆិកា)
  {
    monthIndex: 10,
    imageUrl: '/images/months/month_11.jpg',
    khmerName: 'វិច្ឆិកា',
    englishName: 'November',
    lunarSpanKh: 'កត្តិក - មិគសិរ',
    themeTitleKh: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប សំពះព្រះខែ & ឯករាជ្យជាតិ',
    themeTitleEn: 'Bon Om Touk, Water Festival & Independence',
    culturalNoteKh: 'ការប្រណាំងទូកងដ៏កក្រើកទន្លេចតុមុខ ការបណ្តែតប្រទីប សំពះព្រះខែ អកអំបុក និងទិវាបុណ្យឯករាជ្យជាតិ ៩ វិច្ឆិកា',
    culturalNoteEn: 'Thrilling dragon boat races, glowing floating lanterns, moon salutation & National Independence Day',
    primaryColor: '#0891b2',
    gradientHeader: 'from-teal-500 via-cyan-600 to-blue-900',
    gradientCard: 'from-teal-500/10 via-cyan-500/5 to-blue-500/10',
    accentBorder: 'border-cyan-500/30',
    badgeClass: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    accentText: 'text-cyan-600 dark:text-cyan-400',
    glowShadow: 'shadow-cyan-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky10" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#0c4a6e" />
          <stop offset="50%" stop-color="#0369a1" />
          <stop offset="100%" stop-color="#0284c7" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky10)" />
      <!-- Giant Full Moon of Kattik (Sampeas Preah Khe) -->
      <circle cx="200" cy="65" r="42" fill="#fef08a" />
      <circle cx="200" cy="65" r="65" fill="#fef08a" opacity="0.2" />
      <!-- Fireworks in festive night sky -->
      <path d="M80 40 L70 30 M80 40 L90 30 M80 40 L95 45 M80 40 L75 50" stroke="#f43f5e" stroke-width="2.5" />
      <path d="M320 40 L310 30 M320 40 L330 30 M320 40 L335 45 M320 40 L315 50" stroke="#eab308" stroke-width="2.5" />
      <!-- Chaktomuk River Waters -->
      <rect x="0" y="145" width="400" height="95" fill="#082f49" />
      <!-- Water Waves -->
      <path d="M0 160 Q100 150 200 160 Q300 170 400 160" stroke="#38bdf8" stroke-width="2" fill="none" />
      <path d="M0 190 Q100 180 200 190 Q300 200 400 190" stroke="#0284c7" stroke-width="2" fill="none" />
      <!-- Traditional Cambodian Dragon Boat (ទូកង) -->
      <path d="M40 172 Q150 178 330 165 C345 160 365 150 370 142 C362 154 345 168 325 174 Q150 186 35 180 C28 178 30 174 40 172 Z" fill="#b91c1c" />
      <!-- Dragon Boat Head (Naga/Kbach) -->
      <path d="M370 142 Q378 135 385 140 Q382 148 375 152 Z" fill="#eab308" />
      <!-- Rowers silhouettes and golden paddles -->
      <circle cx="100" cy="165" r="4" fill="#fef3c7" />
      <line x1="100" y1="168" x2="108" y2="182" stroke="#eab308" stroke-width="2" />
      <circle cx="140" cy="165" r="4" fill="#fef3c7" />
      <line x1="140" y1="168" x2="148" y2="182" stroke="#eab308" stroke-width="2" />
      <circle cx="180" cy="165" r="4" fill="#fef3c7" />
      <line x1="180" y1="168" x2="188" y2="182" stroke="#eab308" stroke-width="2" />
      <circle cx="220" cy="165" r="4" fill="#fef3c7" />
      <line x1="220" y1="168" x2="228" y2="182" stroke="#eab308" stroke-width="2" />
      <circle cx="260" cy="165" r="4" fill="#fef3c7" />
      <line x1="260" y1="168" x2="268" y2="182" stroke="#eab308" stroke-width="2" />
      <!-- Floating Lantern (ប្រទីប) -->
      <rect x="70" y="200" width="30" height="15" fill="#f59e0b" />
      <polygon points="85,190 75,200 95,200" fill="#fef08a" />
      <ellipse cx="85" cy="216" rx="18" ry="4" fill="#fef08a" opacity="0.4" />
    </svg>`,
  },

  // 12. December (ធ្នូ)
  {
    monthIndex: 11,
    imageUrl: '/images/months/month_12.jpg',
    khmerName: 'ធ្នូ',
    englishName: 'December',
    lunarSpanKh: 'មិគសិរ - បុស្ស',
    themeTitleKh: 'រដូវត្រជាក់ & ទិវាសន្តិភាពនៅកម្ពុជា',
    themeTitleEn: 'Cool Season & Peace Day in Cambodia',
    culturalNoteKh: 'ខែត្រជាក់បំផុតនៃឆ្នាំ ផ្ទៃមេឃស្រឡះស្រឡូន និងការប្រារព្ធទិវាសន្តិភាពនៅកម្ពុជា ២៩ ធ្នូ (នយោបាយឈ្នះ-ឈ្នះ)',
    culturalNoteEn: 'Coolest month of the year and commemoration of Peace Day in Cambodia on December 29 (Win-Win Policy)',
    primaryColor: '#3b82f6',
    gradientHeader: 'from-blue-600 via-indigo-700 to-slate-900',
    gradientCard: 'from-blue-500/10 via-indigo-500/5 to-slate-500/10',
    accentBorder: 'border-blue-500/30',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-300 border-blue-500/30',
    accentText: 'text-blue-600 dark:text-blue-400',
    glowShadow: 'shadow-blue-500/20',
    svgIcon: `<svg viewBox="0 0 400 240" preserveAspectRatio="none" fill="none" xmlns="http://www.w3.org/2000/svg" class="w-full h-full">
      <defs>
        <linearGradient id="sky11" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stop-color="#020617" />
          <stop offset="60%" stop-color="#1e1b4b" />
          <stop offset="100%" stop-color="#1e3a8a" />
        </linearGradient>
      </defs>
      <rect width="400" height="240" fill="url(#sky11)" />
      <!-- Starry Sky -->
      <circle cx="50" cy="40" r="1.5" fill="#ffffff" />
      <circle cx="95" cy="25" r="2" fill="#ffffff" />
      <circle cx="160" cy="50" r="1.5" fill="#ffffff" />
      <circle cx="280" cy="30" r="2" fill="#ffffff" />
      <circle cx="350" cy="60" r="1.5" fill="#ffffff" />
      <!-- Bayon Stone Face Tower Silhouette -->
      <path d="M160 50 Q200 35 240 50 L255 120 L270 190 L130 190 L145 120 Z" fill="#1e293b" />
      <!-- Smiling Eyes of Bayon Face -->
      <path d="M175 90 Q185 85 195 90" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />
      <path d="M205 90 Q215 85 225 90" stroke="#fef08a" stroke-width="3" stroke-linecap="round" fill="none" opacity="0.9" />
      <!-- Broad peaceful nose -->
      <path d="M200 90 L198 115 L204 115" stroke="#fef08a" stroke-width="2.5" stroke-linecap="round" fill="none" opacity="0.8" />
      <!-- Serene smiling lips -->
      <path d="M185 128 Q200 138 215 128" stroke="#fef08a" stroke-width="3.5" stroke-linecap="round" fill="none" opacity="0.9" />
      <!-- Tower diadem / crown -->
      <rect x="165" y="45" width="70" height="10" fill="#334155" />
      <polygon points="175,45 200,30 225,45" fill="#fef08a" opacity="0.7" />
      <!-- Ancient Stone Ground Base -->
      <rect x="0" y="190" width="400" height="50" fill="#0f172a" />
      <ellipse cx="200" cy="205" rx="160" ry="20" fill="#1e293b" />
    </svg>`,
  },
]

export function getMonthTheme(monthIndex: number): MonthTheme {
  const normalizedIndex = ((monthIndex % 12) + 12) % 12
  return MONTH_THEMES[normalizedIndex] ?? MONTH_THEMES[0]!
}
