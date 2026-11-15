export default function SectionHeading({ id, index, copy }) {
  return (
    <div className="content-section-heading">
      <p className="section-kicker"><span aria-hidden="true">{String(index).padStart(2, '0')}</span>{copy.eyebrow}</p>
      <h2 id={`${id}-heading`}>{copy.heading}</h2>
      {copy.description && <p className="section-description">{copy.description}</p>}
    </div>
  );
}
