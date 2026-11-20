<script setup lang="ts">
import { useId } from 'vue'

withDefaults(
  defineProps<{
    rounded?: boolean
  }>(),
  {
    rounded: true,
  },
)

// Unique prefix per instance so multiple AppLogo components on screen never collide SVG gradient IDs
const uid = useId()
</script>

<template>
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 512 512"
    fill="none"
    role="img"
    aria-label="ប្រតិទិនខ្មែរ - Khmer Lunar Calendar Logo"
  >
    <defs>
      <linearGradient
        :id="`${uid}-bg`"
        x1="40"
        y1="20"
        x2="472"
        y2="492"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#1E1B4B" />
        <stop offset="52%" stop-color="#0F172A" />
        <stop offset="100%" stop-color="#1C1024" />
      </linearGradient>

      <radialGradient :id="`${uid}-horizon`" cx="50%" cy="76%" r="58%">
        <stop offset="0%" stop-color="#F59E0B" stop-opacity="0.52" />
        <stop offset="48%" stop-color="#EA580C" stop-opacity="0.22" />
        <stop offset="100%" stop-color="#0F172A" stop-opacity="0" />
      </radialGradient>

      <radialGradient :id="`${uid}-aura`" cx="50%" cy="42%" r="30%">
        <stop offset="0%" stop-color="#FDE68A" stop-opacity="0.28" />
        <stop offset="100%" stop-color="#F59E0B" stop-opacity="0" />
      </radialGradient>

      <linearGradient
        :id="`${uid}-gold`"
        x1="150"
        y1="90"
        x2="370"
        y2="430"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#FEF3C7" />
        <stop offset="38%" stop-color="#FBBF24" />
        <stop offset="75%" stop-color="#F59E0B" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>

      <linearGradient
        :id="`${uid}-bar`"
        x1="96"
        y1="112"
        x2="416"
        y2="176"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#F59E0B" />
        <stop offset="55%" stop-color="#EA580C" />
        <stop offset="100%" stop-color="#DC2626" />
      </linearGradient>

      <linearGradient
        :id="`${uid}-temple`"
        x1="256"
        y1="258"
        x2="256"
        y2="412"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#FEF3C7" />
        <stop offset="45%" stop-color="#FBBF24" />
        <stop offset="100%" stop-color="#D97706" />
      </linearGradient>

      <linearGradient
        :id="`${uid}-card`"
        x1="256"
        y1="108"
        x2="256"
        y2="424"
        gradientUnits="userSpaceOnUse"
      >
        <stop offset="0%" stop-color="#FFFFFF" stop-opacity="0.11" />
        <stop offset="100%" stop-color="#FFFFFF" stop-opacity="0.03" />
      </linearGradient>

      <clipPath :id="`${uid}-clip`">
        <rect x="88" y="108" width="336" height="316" rx="56" />
      </clipPath>
    </defs>

    <!-- Background -->
    <rect width="512" height="512" :rx="rounded ? 116 : 0" :fill="`url(#${uid}-bg)`" />
    <rect width="512" height="512" :rx="rounded ? 116 : 0" :fill="`url(#${uid}-horizon)`" />
    <rect width="512" height="512" :rx="rounded ? 116 : 0" :fill="`url(#${uid}-aura)`" />

    <!-- Subtle Gold Rim -->
    <rect
      x="8"
      y="8"
      width="496"
      height="496"
      :rx="rounded ? 110 : 0"
      :stroke="`url(#${uid}-gold)`"
      stroke-opacity="0.28"
      stroke-width="4"
    />

    <!-- Calendar Card Shell -->
    <g :clip-path="`url(#${uid}-clip)`">
      <rect x="88" y="108" width="336" height="316" rx="56" :fill="`url(#${uid}-card)`" />
      <rect x="88" y="108" width="336" height="62" :fill="`url(#${uid}-bar)`" />
      <line
        x1="88"
        y1="170"
        x2="424"
        y2="170"
        stroke="#FDE68A"
        stroke-opacity="0.45"
        stroke-width="2.5"
      />
    </g>

    <rect
      x="88"
      y="108"
      width="336"
      height="316"
      rx="56"
      :stroke="`url(#${uid}-gold)`"
      stroke-opacity="0.65"
      stroke-width="6"
    />

    <!-- Top Calendar Binding Rings -->
    <rect x="166" y="76" width="28" height="62" rx="14" :fill="`url(#${uid}-gold)`" />
    <rect x="172" y="82" width="16" height="50" rx="8" fill="#FEF3C7" fill-opacity="0.55" />
    <rect x="318" y="76" width="28" height="62" rx="14" :fill="`url(#${uid}-gold)`" />
    <rect x="324" y="82" width="16" height="50" rx="8" fill="#FEF3C7" fill-opacity="0.55" />

    <!-- Golden Crescent Moon & 4-Point Celestial Star -->
    <g transform="translate(256 218) scale(0.84) translate(-266 -248)">
      <path
        d="M274 190C241.5 191.5 215.5 218.2 215.5 251C215.5 284.7 242.8 312 276.5 312C290.6 312 303.6 307.2 314 299.1C306.9 301.2 299.4 302.3 291.6 302.3C257.9 302.3 230.6 275 230.6 241.3C230.6 218.8 242.8 199.1 261 188.6C265.2 189.1 269.6 189.6 274 190Z"
        :fill="`url(#${uid}-gold)`"
      />
      <path
        d="M294 212L300.5 229.5L318 236L300.5 242.5L294 260L287.5 242.5L270 236L287.5 229.5L294 212Z"
        fill="#FFFBEB"
      />
    </g>
    <circle cx="152" cy="216" r="5" fill="#FDE68A" fill-opacity="0.85" />
    <circle cx="358" cy="210" r="4.5" fill="#FDE68A" fill-opacity="0.75" />
    <circle cx="176" cy="256" r="3" fill="#FEF3C7" fill-opacity="0.65" />

    <!-- Angkor Wat Three-Tower Silhouette -->
    <g :fill="`url(#${uid}-temple)`">
      <path d="M256 266L264 282H248L256 266Z" />
      <path d="M244 285H268L272 304H240L244 285Z" />
      <path d="M236 307H276L282 332H230L236 307Z" />
      <rect x="228" y="334" width="56" height="44" rx="3" />

      <path d="M180 298L187 312H173L180 298Z" />
      <path d="M168 315H192L196 334H164L168 315Z" />
      <rect x="160" y="336" width="40" height="42" rx="3" />

      <path d="M332 298L339 312H325L332 298Z" />
      <path d="M320 315H344L348 334H316L320 315Z" />
      <rect x="312" y="336" width="40" height="42" rx="3" />

      <rect x="196" y="352" width="36" height="26" />
      <rect x="280" y="352" width="36" height="26" />

      <rect x="134" y="376" width="244" height="12" rx="5" />
      <rect x="118" y="392" width="276" height="12" rx="6" opacity="0.88" />
    </g>

    <path
      d="M248 378V354C248 349.6 251.6 346 256 346C260.4 346 264 349.6 264 354V378H248Z"
      fill="#1E1B4B"
      fill-opacity="0.72"
    />
  </svg>
</template>
