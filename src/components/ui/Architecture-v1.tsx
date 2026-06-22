<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 640" fill="none" role="img" aria-label="Isometric ParadeDB architecture: Postgres base, Table heap and ParadeDB index, with full-text, vector, and aggregate workload squares sitting on the back of the index.">
  <defs>
    <pattern id="dotgrid" x="0" y="0" width="22" height="22" patternUnits="userSpaceOnUse">
      <circle cx="1" cy="1" r="1" fill="#94a3b8" opacity="0.18"/>
    </pattern>
    <linearGradient id="plate-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f1f5f9"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="slate-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="100%" stop-color="#e2e8f0"/>
    </linearGradient>
    <linearGradient id="indigo-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#eef2ff"/>
      <stop offset="100%" stop-color="#c7d2fe"/>
    </linearGradient>
    <linearGradient id="tile-top" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#ffffff"/>
      <stop offset="100%" stop-color="#eef2ff"/>
    </linearGradient>
    <filter id="indigo-glow" x="-20%" y="-30%" width="140%" height="160%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feFlood flood-color="#4f46e5" flood-opacity="0.35"/>
      <feComposite in2="blur" operator="in" result="g"/>
      <feMerge>
        <feMergeNode in="g"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
    <marker id="ah-s" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="6" markerHeight="6" orient="auto" markerUnits="strokeWidth">
      <path d="M0,1.5 L9,5 L0,8.5 z" fill="#64748b"/>
    </marker>
    <marker id="ah-s-rev" viewBox="0 0 10 10" refX="1" refY="5" markerWidth="6" markerHeight="6" orient="auto" markerUnits="strokeWidth">
      <path d="M9,1.5 L0,5 L9,8.5 z" fill="#64748b"/>
    </marker>
  </defs>
<!--Background-->
  <rect width="1200" height="640" fill="url(#dotgrid)"/>
<!--================== POSTGRES PLATE ==================-->
  <g>
    <polygon points="357.5,220 842.5,500 842.5,484 357.5,204" fill="#cbd5e1" stroke="#94a3b8" stroke-width="1"/>
    <polygon points="1085,360 842.5,500 842.5,484 1085,344" fill="#e2e8f0" stroke="#94a3b8" stroke-width="1"/>
    <polygon points="600,64 1085,344 842.5,484 357.5,204" fill="url(#plate-top)" stroke="#64748b" stroke-width="1.5"/>
    <g stroke="#94a3b8" stroke-width="0.5" opacity="0.45">
      <line x1="478.75" y1="134" x2="963.75" y2="414"/>
      <line x1="357.5" y1="204" x2="842.5" y2="484"/>
      <line x1="781.25" y1="155" x2="538.75" y2="295"/>
      <line x1="600" y1="64" x2="357.5" y2="204"/>
    </g>
  </g>
<!--================== TABLE (HEAP) PRISM ==================-->
  <g>
    <polygon points="478.76,194 582.68,254 582.68,202 478.76,142" fill="#94a3b8" stroke="#64748b" stroke-width="1.5"/>
    <polygon points="686.6,194 582.68,254 582.68,202 686.6,142" fill="#cbd5e1" stroke="#64748b" stroke-width="1.5"/>
    <polygon points="582.68,82 686.6,142 582.68,202 478.76,142" fill="url(#slate-top)" stroke="#64748b" stroke-width="1.75"/>
    <text x="582.68" y="138" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="15" fill="#0f172a" text-anchor="middle" font-weight="700">Table</text>
    <text x="582.68" y="154" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="10" fill="#475569" text-anchor="middle">(Heap)</text>
  </g>
<!--================== PARADEDB INDEX PRISM ==================-->
  <g filter="url(#indigo-glow)">
    <polygon points="600,304 842.48,444 842.48,364 600,224" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.75"/>
    <polygon points="1015.68,344 842.48,444 842.48,364 1015.68,264" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.75"/>
    <polygon points="773.2,124 1015.68,264 842.48,364 600,224" fill="url(#indigo-top)" stroke="#4f46e5" stroke-width="2"/>
  </g>
<!--ParadeDB logomark, subtle 3D. Scale 0.8, depth 0.12 world units (screen offset -4.16, +2.4). Closer to left edge of face. Same palette: top indigo-400 #818cf8, front indigo-500 #7c83f6, right indigo-600 (brand) #4f46e5.-->
  <g shape-rendering="geometricPrecision">
<!--Bar 3 (leftmost, logo x=[0, 19.7315])-->
    <polygon points="615,243.2 628.67,251.09 624.51,253.49 610.84,245.6" fill="#818cf8"/>
    <polygon points="628.67,251.09 628.67,310.54 624.51,312.94 624.51,253.49" fill="#4f46e5"/>
    <polygon points="610.84,245.6 624.51,253.49 624.51,312.94 610.84,305.05" fill="#7c83f6"/>
<!--Bar 2 (middle, logo x=[22.7393, 42.4707])-->
    <polygon points="630.75,252.3 644.42,260.19 640.26,262.59 626.59,254.7" fill="#818cf8"/>
    <polygon points="644.42,260.19 644.42,319.64 640.26,322.04 640.26,262.59" fill="#4f46e5"/>
    <polygon points="626.59,254.7 640.26,262.59 640.26,322.04 626.59,314.15" fill="#7c83f6"/>
<!--Bar 1 (rightmost of bars, logo x=[45.4775, 65.209])-->
    <polygon points="646.51,261.39 660.18,269.28 656.02,271.68 642.35,263.79" fill="#818cf8"/>
    <polygon points="660.18,269.28 660.18,328.73 656.02,331.13 656.02,271.68" fill="#4f46e5"/>
    <polygon points="642.35,263.79 656.02,271.68 656.02,331.13 642.35,323.24" fill="#7c83f6"/>
<!--Curved DB element: 5 stacked wall copies (#818cf8) + front face (#7c83f6). Steps (-0.832, +0.48) from back (615,240) to front (610.84,242.4).-->
    <g transform="matrix(0.6928 0.4 0 0.8 615 240)" fill="#818cf8">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M68.2168 4.0061V52.1171C68.2168 59.0833 70.9821 65.7023 75.9045 70.626C80.8269 75.5484 87.4472 78.3137 94.4134 78.3137H105.947V58.5822H94.4134C92.6958 58.5822 91.0669 57.8866 89.8554 56.6751C88.6439 55.4635 87.9483 53.8346 87.9483 52.1171V24.203C87.9483 13.2501 79.1118 4.2585 68.2168 4.00733V4.0061Z"/>
    </g>
    <g transform="matrix(0.6928 0.4 0 0.8 614.168 240.48)" fill="#818cf8">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M68.2168 4.0061V52.1171C68.2168 59.0833 70.9821 65.7023 75.9045 70.626C80.8269 75.5484 87.4472 78.3137 94.4134 78.3137H105.947V58.5822H94.4134C92.6958 58.5822 91.0669 57.8866 89.8554 56.6751C88.6439 55.4635 87.9483 53.8346 87.9483 52.1171V24.203C87.9483 13.2501 79.1118 4.2585 68.2168 4.00733V4.0061Z"/>
    </g>
    <g transform="matrix(0.6928 0.4 0 0.8 613.336 240.96)" fill="#818cf8">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M68.2168 4.0061V52.1171C68.2168 59.0833 70.9821 65.7023 75.9045 70.626C80.8269 75.5484 87.4472 78.3137 94.4134 78.3137H105.947V58.5822H94.4134C92.6958 58.5822 91.0669 57.8866 89.8554 56.6751C88.6439 55.4635 87.9483 53.8346 87.9483 52.1171V24.203C87.9483 13.2501 79.1118 4.2585 68.2168 4.00733V4.0061Z"/>
    </g>
    <g transform="matrix(0.6928 0.4 0 0.8 612.504 241.44)" fill="#818cf8">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M68.2168 4.0061V52.1171C68.2168 59.0833 70.9821 65.7023 75.9045 70.626C80.8269 75.5484 87.4472 78.3137 94.4134 78.3137H105.947V58.5822H94.4134C92.6958 58.5822 91.0669 57.8866 89.8554 56.6751C88.6439 55.4635 87.9483 53.8346 87.9483 52.1171V24.203C87.9483 13.2501 79.1118 4.2585 68.2168 4.00733V4.0061Z"/>
    </g>
    <g transform="matrix(0.6928 0.4 0 0.8 611.672 241.92)" fill="#818cf8">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M68.2168 4.0061V52.1171C68.2168 59.0833 70.9821 65.7023 75.9045 70.626C80.8269 75.5484 87.4472 78.3137 94.4134 78.3137H105.947V58.5822H94.4134C92.6958 58.5822 91.0669 57.8866 89.8554 56.6751C88.6439 55.4635 87.9483 53.8346 87.9483 52.1171V24.203C87.9483 13.2501 79.1118 4.2585 68.2168 4.00733V4.0061Z"/>
    </g>
    <g transform="matrix(0.6928 0.4 0 0.8 610.84 242.4)" fill="#7c83f6">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M68.2168 4.0061V52.1171C68.2168 59.0833 70.9821 65.7023 75.9045 70.626C80.8269 75.5484 87.4472 78.3137 94.4134 78.3137H105.947V58.5822H94.4134C92.6958 58.5822 91.0669 57.8866 89.8554 56.6751C88.6439 55.4635 87.9483 53.8346 87.9483 52.1171V24.203C87.9483 13.2501 79.1118 4.2585 68.2168 4.00733V4.0061Z"/>
    </g>
  </g>
<!--Index top face label, horizontal, in the front strip below all tile bottoms-->
  <g transform="matrix(0.866 0.5 -0.866 0.5 773.2 264)">
    <text x="0" y="0" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="22" fill="#4f46e5" text-anchor="middle" font-weight="700">ParadeDB Index</text>
  </g>
<!--================== WORKLOAD: FULL-TEXT  (x=[6,8], y=[1,3], z=[2.4,2.8]) ==================-->
  <g>
<!--Front-left face (y=3)-->
    <polygon points="703.92,164 773.2,204 773.2,188 703.92,148" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.25"/>
<!--Right face (x=8)-->
    <polygon points="842.48,164 773.2,204 773.2,188 842.48,148" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.25"/>
<!--Top face (z=2.8)-->
    <polygon points="773.2,108 842.48,148 773.2,188 703.92,148" fill="url(#tile-top)" stroke="#4f46e5" stroke-width="1.5"/>
<!--Label centered on back-side x, lifted above the tile so it doesn't overlap-->
    <text x="840" y="120" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" fill="#4f46e5" text-anchor="middle" font-weight="700">Full-Text</text>
<!--Icon on top face-->
    <text x="773.2" y="155" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="20" fill="#4f46e5" text-anchor="middle" font-weight="800">Aa</text>
  </g>
<!--================== WORKLOAD: VECTORS  (x=[8.5,10.5], y=[1,3]) ==================-->
  <g>
    <polygon points="790.52,214 859.8,254 859.8,238 790.52,198" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.25"/>
    <polygon points="929.08,214 859.8,254 859.8,238 929.08,198" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.25"/>
    <polygon points="859.8,158 929.08,198 859.8,238 790.52,198" fill="url(#tile-top)" stroke="#4f46e5" stroke-width="1.5"/>
    <text x="926.6" y="170" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" fill="#4f46e5" text-anchor="middle" font-weight="700">Vectors</text>
<!--Dot matrix icon on top face-->
    <g fill="#4f46e5">
      <circle cx="846" cy="193" r="3"/>
      <circle cx="860" cy="193" r="3"/>
      <circle cx="874" cy="193" r="3"/>
      <circle cx="846" cy="207" r="3"/>
      <circle cx="860" cy="207" r="3"/>
      <circle cx="874" cy="207" r="3"/>
    </g>
  </g>
<!--================== WORKLOAD: AGGREGATES  (x=[11,13], y=[1,3]) ==================-->
  <g>
    <polygon points="877.12,264 946.4,304 946.4,288 877.12,248" fill="#a5b4fc" stroke="#4f46e5" stroke-width="1.25"/>
    <polygon points="1015.68,264 946.4,304 946.4,288 1015.68,248" fill="#c7d2fe" stroke="#4f46e5" stroke-width="1.25"/>
    <polygon points="946.4,208 1015.68,248 946.4,288 877.12,248" fill="url(#tile-top)" stroke="#4f46e5" stroke-width="1.5"/>
    <text x="1020" y="220" font-family="ui-monospace, SFMono-Regular, Menlo, monospace" font-size="14" fill="#4f46e5" text-anchor="middle" font-weight="700">Aggregates</text>
<!--Bar chart icon on top face-->
    <g fill="#4f46e5">
      <rect x="929.9" y="247" width="5" height="8" rx="1"/>
      <rect x="936.9" y="241" width="5" height="14" rx="1"/>
      <rect x="943.9" y="235" width="5" height="20" rx="1"/>
      <rect x="950.9" y="243" width="5" height="12" rx="1"/>
      <rect x="957.9" y="239" width="5" height="16" rx="1"/>
    </g>
  </g>
</svg>

