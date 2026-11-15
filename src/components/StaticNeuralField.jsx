export default function StaticNeuralField() {
  return (
    <svg className="static-neural-field" viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice"
      fill="none" aria-hidden="true">
      <g stroke="currentColor" strokeWidth="0.7">
        <path d="m660 145 130 80 130-80 110 125-80 135 110 125-170 70-130-85-110 55-100-135 110-145 130 55 150-135" />
        <path d="m790 225-30 245 190-65-190-35-110-80m110 180 130 130 60-195m-160-180 240 45m-370-125 100 225" />
      </g>
      {[ [660, 145], [790, 225], [920, 145], [1030, 270], [950, 405], [1060, 530], [890, 600],
        [760, 470], [650, 525], [550, 390], [650, 290], [760, 370] ].map(([x, y]) => (
        <g key={`${x}-${y}`}>
          <circle cx={x} cy={y} r="10" stroke="currentColor" strokeWidth="0.5" />
          <circle cx={x} cy={y} r="2.5" fill="currentColor" />
        </g>
      ))}
    </svg>
  );
}
