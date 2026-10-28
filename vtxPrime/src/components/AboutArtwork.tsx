import { useId } from 'react';

function Person({ x, y, scale = 1, color = '#0b3462' }: { x: number; y: number; scale?: number; color?: string }) {
  return <g transform={`translate(${x} ${y}) scale(${scale})`}><circle cy="-28" r="7" fill={color} /><path d="M-10-17Q0-25 10-17L15 9 7 12 7 43H1L-1 13-4 43H-10L-9 10-16 8Z" fill={color} /><path d="M-3-20 0-10 4-20 2 3-2 3Z" fill="#afebff" /></g>;
}

const continents = 'M116 104 143 83 174 89 184 111 170 129 179 144 164 160 147 153 137 168 122 151 103 145 91 124Z M165 171 187 180 201 204 189 234 170 257 161 242 163 217 151 196Z M242 103 264 94 282 104 304 99 326 114 345 139 330 159 309 156 291 178 279 157 264 149 249 127 233 126Z M235 145 264 146 278 169 267 198 249 216 235 195 224 169Z M309 217 331 206 350 223 341 240 316 242 301 230Z M207 80 221 70 235 75 224 90Z';

export function AboutArtwork({ variant, className = '' }: { variant: 'technology' | 'global' | 'collaboration' | 'vision' | 'growth' | 'leadership'; className?: string }) {
  const id = useId().replace(/:/g, '');
  const tech = variant === 'technology';
  return <svg className={`about-artwork ${className}`} viewBox={tech ? '0 0 400 600' : '0 0 440 360'} preserveAspectRatio="xMidYMid slice" role="img" aria-label={{ technology: 'Illustration of a connected technology core', global: 'Illustration of global connectivity and business collaboration', collaboration: 'Illustration of a team bringing an idea together', vision: 'Illustration of a path towards a shared vision', growth: 'Illustration of a team progressing together', leadership: 'Illustration of leadership unlocking new possibilities' }[variant]}>
    <defs>
      <linearGradient id={`${id}-bg`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#07172f" /><stop offset="1" stopColor="#126994" /></linearGradient>
      <radialGradient id={`${id}-glow`}><stop stopColor="#5ee9ff" stopOpacity=".38" /><stop offset="1" stopColor="#31b9ff" stopOpacity="0" /></radialGradient>
      <linearGradient id={`${id}-earth`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#1968bb" /><stop offset="1" stopColor="#a0edff" /></linearGradient>
      <linearGradient id={`${id}-light`} x1="0" y1="1" x2="1" y2="0"><stop stopColor="#f7b84f" /><stop offset="1" stopColor="#fff6ad" /></linearGradient>
      <clipPath id={`${id}-globe`}><circle cx="220" cy="165" r="132" /></clipPath>
    </defs>
    <rect width="440" height={tech ? 600 : 360} fill={`url(#${id}-bg)`} />
    <circle cx={tech ? 200 : 230} cy={tech ? 290 : 160} r={tech ? 235 : 210} fill={`url(#${id}-glow)`} />
    {tech ? <>
      <g stroke="#63caff" strokeOpacity=".1">{Array.from({ length: 12 }, (_, i) => <path key={i} d={`M0 ${i * 50}H400 M${i * 40} 0V600`} />)}</g>
      <g transform="translate(200 280)"><circle r="128" fill="#09243e" stroke="#328cc1" /><ellipse rx="66" ry="128" fill="none" stroke="#389ecf" strokeOpacity=".5" /><ellipse rx="106" ry="128" fill="none" stroke="#389ecf" strokeOpacity=".25" /><ellipse rx="128" ry="45" fill="none" stroke="#389ecf" strokeOpacity=".6" /><ellipse rx="128" ry="93" fill="none" stroke="#389ecf" strokeOpacity=".3" /><path d="M-128 0H128M0-128V128" stroke="#389ecf" strokeOpacity=".6" /><circle r="150" fill="none" stroke="#42bfff" strokeDasharray="2 12" strokeOpacity=".4" /><circle r="170" fill="none" stroke="#42bfff" strokeOpacity=".15" />
        <g stroke="#61d7ff" strokeWidth="1.3">{[[-150, -146], [145, -95], [-163, 68], [144, 145], [36, -193], [-50, 197]].map(([x, y], i) => <g key={i}><path d={`M${x} ${y} 0 0`} opacity=".5" /><circle cx={x} cy={y} r="7" fill="#113e5e" /><circle cx={x} cy={y} r="2" fill="#7be5ff" /></g>)}</g>
        <rect x="-36" y="-42" width="72" height="84" rx="13" fill="#0c1931" stroke="#82dfff" /><rect x="-23" y="-28" width="46" height="56" rx="6" fill="#12658c" /><path d="m-13 0 9 10 18-23" fill="none" stroke="#b5f5ff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      </g>
      <path d="M0 507Q100 436 200 487T400 487V600H0Z" fill="#07182d" opacity=".6" /><path d="M0 527Q120 482 230 526T400 526" fill="none" stroke="#3eafdc" strokeOpacity=".3" />
      <g fill="#93dcf5" fontFamily="monospace" fontSize="8" letterSpacing="2"><text x="28" y="47">VTX / CONNECTED INFRASTRUCTURE</text><text x="28" y="556">DESIGN. CONNECT. EVOLVE.</text></g>
    </> : variant === 'global' ? <>
      <circle cx="220" cy="165" r="146" fill="none" stroke="#7fdefb" strokeOpacity=".17" /><circle cx="220" cy="165" r="132" fill={`url(#${id}-earth)`} />
      <g clipPath={`url(#${id}-globe)`}><path d={continents} fill="#114175" /><g fill="none" stroke="#b8efff" strokeOpacity=".26"><ellipse cx="220" cy="165" rx="67" ry="132" /><ellipse cx="220" cy="165" rx="110" ry="132" /><ellipse cx="220" cy="165" rx="132" ry="47" /><ellipse cx="220" cy="165" rx="132" ry="96" /></g><path d="M100 160Q220 40 344 153M103 190Q250 285 338 138" fill="none" stroke="#e7faff" strokeDasharray="3 5" strokeOpacity=".65" />{[[133,139],[256,118],[298,164],[177,205]].map(([x,y]) => <g key={x}><circle cx={x} cy={y} r="9" fill="#7ee6ff" opacity=".2" /><circle cx={x} cy={y} r="3" fill="#e3fbff" /></g>)}</g>
      <path d="M0 306Q220 265 440 306V360H0Z" fill="#a1e7fb" opacity=".85" />{Array.from({ length: 9 }, (_, i) => <Person key={i} x={35 + i * 46} y={302 + (i % 2 ? -8 : 4)} scale={i === 4 ? 1.13 : .8} color={i % 2 ? '#0e4d80' : '#082d54'} />)}
    </> : variant === 'collaboration' ? <>
      <circle cx="222" cy="126" r="79" fill="#c0eced" opacity=".09" /><path d="M181 115a42 42 0 1 1 82 0c-3 18-22 24-24 42h-35c-2-18-20-26-23-42" fill={`url(#${id}-light)`} /><path d="M204 166h36m-34 9h32m-29 9h26" stroke="#e5aa56" strokeWidth="5" strokeLinecap="round" /><path d="m212 153-5-38 15 10 15-10-6 38" fill="none" stroke="#d99339" strokeWidth="2" /><ellipse cx="222" cy="291" rx="154" ry="28" fill="#0b294b" /><path d="M79 260Q221 214 366 260L345 284H101Z" fill="#5ba9d2" /><Person x={123} y={238} scale={1.25} color="#102f54" /><Person x={183} y={260} scale={1.3} color="#17608d" /><Person x={276} y={239} scale={1.25} color="#0a3155" /><Person x={326} y={259} scale={1.1} color="#247ba4" /><path d="m137 222 44-19m80 16-31-19" stroke="#9edcf1" strokeWidth="10" strokeLinecap="round" />
    </> : variant === 'vision' ? <>
      <path d="M59 360 197 100H244L390 360Z" fill="#12395a" /><g fill="#65ccef">{Array.from({ length: 10 }, (_, i) => <rect key={i} x={197 - i * 13} y={106 + i * 25} width={47 + i * 26} height={5 + i * .7} opacity={.45 + i * .04} />)}</g><path d="M207 101V66h25v35" fill={`url(#${id}-light)`} /><Person x={222} y={262} scale={1.1} /><Person x={136} y={331} scale={1.2} /><Person x={303} y={321} scale={1.5} color="#0d2c50" /><path d="m214 65-25-20m42 18 20-20M222 51V29" stroke="#93dcfb" strokeOpacity=".4" />
    </> : variant === 'growth' ? <>
      <path d="M0 303 64 256 114 268 174 184 218 202 292 123 339 138 414 58 440 74V360H0Z" fill="#42a6d0" opacity=".16" /><path d="M30 285 104 229 155 244 213 163 269 179 365 74" fill="none" stroke="#7cddf5" strokeWidth="14" /><path d="m335 74 41-11-6 41" fill="none" stroke="#7cddf5" strokeWidth="14" strokeLinejoin="round" /><Person x={100} y={257} scale={1.1} /><Person x={190} y={220} scale={.9} color="#0d3759" /><Person x={280} y={149} scale={.8} color="#194c73" /><path d="M0 338h440" stroke="#2587b1" strokeOpacity=".5" />
    </> : <>
      <circle cx="278" cy="111" r="89" fill="#28bcf1" opacity=".12" /><path d="m280 57 5-23m17 29 15-18m-55 19-13-19m56 41 23-5m-70 2-25-7" stroke="#8ae9ff" strokeOpacity=".5" /><path d="M164 306h139v-30H188v-30h89v-30h-64v-30h41" fill="none" stroke="#78cfe9" strokeWidth="18" /><Person x={229} y={171} scale={1.2} color="#092c50" /><g transform="rotate(-22 266 104)" fill={`url(#${id}-light)`}><circle cx="280" cy="99" r="20" fill="none" stroke="#ffe69a" strokeWidth="9" /><path d="M264 94h-56v12h11v13h10v-13h35Z" /></g>
    </>}
  </svg>;
}
