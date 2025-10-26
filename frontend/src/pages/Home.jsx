import { Link } from "react-router";

import { Button, Section } from "../components/Elements"
import { LogoIcon } from "../assets/icons";

import "./Home.css";

export default function Home() {
	const features = [
		{
			title: "Дружелюбное сообщество",
			desc: "Место, где люди общаются с уважением и поддержкой — новые знакомства и глубокие беседы.",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden>
					<path
						d="M12 12a4 4 0 100-8 4 4 0 000 8z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M21 21a8 8 0 10-18 0"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
		{
			title: "Тёплая атмосфера",
			desc: "Мы ценим взаимопомощь и вдохновение — здесь легко начать разговор и остаться надолго.",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden>
					<path
						d="M12 21s-6-4.35-8-7.5C1.7 10 5 5 12 5s10.3 5 8 8.5C18 16.65 12 21 12 21z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
		{
			title: "Простота и безопасность",
			desc: "Интуитивный интерфейс и понятные правила — мы заботимся о приватности и чистоте общения.",
			icon: (
				<svg viewBox="0 0 24 24" fill="none" aria-hidden>
					<path
						d="M12 2l3 3v4a3 3 0 11-6 0V5l3-3z"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
					<path
						d="M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7"
						stroke="currentColor"
						strokeWidth="1.5"
						strokeLinecap="round"
						strokeLinejoin="round"
					/>
				</svg>
			),
		},
	];

	const samplePosts = [
		{
			id: 1,
			title: "Добро пожаловать в Sora Lume!",
			excerpt:
				"Первый пост — познакомьтесь с нашим сообществом и правилами.",
		},
		{
			id: 2,
			title: "Как найти собеседника по интересам",
			excerpt:
				"Советы по созданию привлекательного профиля и поиску тематических комнат.",
		},
		{
			id: 3,
			title: "Онлайн-встречи и события",
			excerpt: "Анонсы мероприятий и краткое руководство по участию.",
		},
	];

	return (
		<div className="home-main-wrapper">
			<Section className="home-section home-main-section">
				<div className="home-main-left">
					<div className="home-main-top-content">
						<LogoIcon />

						<h1 className="home-main-top-title">
							Sora Lume — уголок света в цифровом мире
						</h1>
					</div>

					<p className="home-main-top-text">
						Добро пожаловать на Sora Lume — место, где общение
						становится светлым и вдохновляющим. Присоединяйтесь к
						нам, чтобы найти друзей, делиться идеями и вдохновляться
						каждый день.
					</p>
				</div>

				<Section className="home-main-right">
					<h3 className="home-main-right-title">
						Последние обсуждения
					</h3>

					<ul className="home-main-right-list">
						{samplePosts.map((p) => (
							<li
								key={p.id}
								className="home-main-right-list-block"
							>
								<h4>{p.title}</h4>
								<p>{p.excerpt}</p>
							</li>
						))}
					</ul>
				</Section>
				
				<div className="home-main-buttons">
					<Link to={"/auth"}>
						<Button color="primary" fontSize="md" block>
							Присоединиться
						</Button>
					</Link>
					<Link to="#about">
						<Button color="default" fontSize="md" variant="outlined" block>
							Узнать больше
						</Button>
					</Link>
				</div>
			</Section>

			<section id="about" className="home-section home-about-section">
				<div className="home-about-left">
					<h2 className="home-about-left-title">О нас</h2>

					<p>
						Добро пожаловать на <strong>Sora Lume</strong> — место,
						где общение становится светлым и вдохновляющим.
					</p>

					<p>
						Название нашего проекта несёт в себе особый смысл.{" "}
						<em>Sora</em> с японского переводится как “небо”,
						символизируя свободу, простор и безграничные
						возможности. <em>Lume</em> происходит от латинского
						слова <em>lumen</em> и означает “свет”, который освещает
						путь, согревает и объединяет людей.
					</p>

					<p>
						Объединив эти два слова, мы создали{" "}
						<strong>Sora Lume</strong> — пространство, где каждый
						может поделиться мыслями, найти новых друзей и
						почувствовать себя частью большой, дружелюбной и тёплой
						онлайн-среды. Наш сайт — это не просто платформа для
						общения, это уголок света в цифровом мире.
					</p>

					<p>
						Присоединяйтесь к нам, и давайте вместе создавать
						атмосферу дружбы, тепла и вдохновения!
					</p>
				</div>

				<Section className="home-about-right">
					<h3 className="home-about-right-title">Что вы найдёте</h3>

					<ul className="home-about-right-list">
						<li>Тематические комнаты и каналы</li>
						<li>Мероприятия и онлайн-встречи</li>
						<li>Личные чаты и приватные группы</li>
						<li>Поддержка и модерация</li>
					</ul>
				</Section>
			</section>

			<section className="home-section home-principles-section">
				<h2 className="home-principles-title">Наши принципы</h2>

				<div className="home-principles-list">
					{features.map((f) => (
						<Section
							key={f.title}
							className="home-principles-list-block"
						>
							<div className="home-principles-list-block-icon">{f.icon}</div>
							<div>
								<h4 className="home-principles-list-block-title">
									{f.title}
								</h4>
								<p>{f.desc}</p>
							</div>
						</Section>
					))}
				</div>
			</section>

			<Section className="home-footer-section">
				<div className="home-footer-left">
					<LogoIcon />

					<div>
						<h4 className="home-footer-left-title">
							SoraLume.net &copy;
						</h4>
						<p>Уголок света в цифровом мире</p>
					</div>
				</div>

				<nav className="home-footer-right">
					<Link to="/about">О нас</Link>
					<Link to="/rules">Правила</Link>
					<Link to="/contact">Контакты</Link>
				</nav>
			</Section>
		</div>
	);
}
