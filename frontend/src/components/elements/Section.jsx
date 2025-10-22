import './Section.css'

export function Section({ className, children }) {
	return (
		<section className={`m-section ${className}`}>
			{children}
		</section>
	)
}