import './Section.css'

export function Section({ className, style, children }) {
	return (
		<section style={style} className={`m-section ${className ? className : ''}`}>
			{children}
		</section>
	)
}