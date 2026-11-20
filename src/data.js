// ====== Mes informations ======
export const ME = { nom: 'ADELAKUN', prenom: 'TAIWO SIMON ADELANI', email: 'adelani55@icloud.com', tel: '07 88 99 98 17', telIntl: '+2250788999817', lieu: 'Cocody Faya, Abidjan, Côte d’Ivoire' }
export const ROLES = ['DÉVELOPPEUR', 'INGÉNIEUR LOGICIEL']

export const ABOUT = 'Je suis diplômé en Informatique, option Génie Logiciel (Licence et BTS Développeur d’Application). Je m’intéresse au développement d’applications, aux bases de données et à la modélisation de systèmes d’information. Curieux et rigoureux, j’aime transformer un vrai besoin en une application claire et solide, et je souhaite poursuivre mes études vers un niveau supérieur.'

export const DO = [
  { t: 'DÉVELOPPER', d: 'Applications web full-stack en Python avec Django et PostgreSQL, interfaces en JavaScript, authentification JWT et par session : je construis des outils complets, du clic de l’utilisateur jusqu’à la base de données.' },
  { t: 'CONCEVOIR', d: 'Avant de coder, je modélise avec MERISE et je découpe les besoins par rôle (patient, médecin, secrétaire, administrateur) pour obtenir une base de données propre et structurée.' },
  { t: 'ORGANISER', d: 'Plan de projet structuré, réunions de suivi et avancement partagé avec l’équipe : j’aime qu’un projet avance de façon claire et mesurable.' },
]

export const CAREER = [
  { r: 'CEPE', o: '', y: '2015-2016', d: '.' },
  { r: 'BEPC', o: 'LYCÉE MODERNE DE DIDIÉVI', y: '2019-2020', d: '.' },
  { r: 'BACCALAURÉAT Série D', o: 'LYCÉE MODERNE DE DIDIÉVI', y: '2022-2023', d: '.' },
  { r: 'BTS 1 Informatique Développeur d’Application (IDA)', o: 'IIPEA, Abidjan', y: '2023-2024', d: 'Premier pas dans l’univers du développement informatique.' },
  { r: 'BTS 2 Informatique Développeur d’Application (IDA)', o: 'IIPEA, Abidjan', y: '2024-2025', d: 'Approfondissement du développement d’applications et de la modélisation MERISE.' },
  { r: 'Licence 3 Informatique Génie Logiciel (IGL)', o: 'IIPEA, Abidjan', y: '2025-2026', d: 'Projet de fin d’études : SMART-RDV, une plateforme de gestion de rendez-vous médicaux.' },
]

// demo / repo / img sont optionnels : un champ vide n'affiche rien.
export const WORKS = [
  { n: '01', t: 'SMART-RDV', c: 'Plateforme web · Projet de fin d’études', tools: 'Python, Django, PostgreSQL, JavaScript (FullCalendar.js), Celery/Redis. Quatre rôles (patient, médecin, secrétaire, administrateur), authentification JWT et par session par numéro de téléphone ivoirien, rappels SMS automatiques, salle d’attente et backoffice.', demo: '', repo: '', imgs: ['/projects/smart-rdv-1-prise-rdv.jpg', '/projects/smart-rdv-2-tableau-de-bord.jpg', '/projects/smart-rdv-3-historique.jpg', '/projects/smart-rdv-4-administration.jpg'] },
  { n: '02', t: 'Gestion des employés et des salaires', c: 'Application web · Projet académique', tools: 'Python, Django, PostgreSQL, MERISE. Enregistrement des employés et de leurs informations salariales, modification et suppression des données du personnel.', demo: '', repo: '', img: '' },
  { n: '03', t: 'PORTFOLIO', c: 'Site vitrine', tools: 'React, Three.js, React Three Fiber, animations au scroll.', demo: 'https://simon-adelakun.github.io', repo: 'https://github.com/simon-adelakun/simon-adelakun.github.io', img: '' },
]

export const TECH = [
  ['Python', '#3b82f6'], ['Django', '#059669'], ['PostgreSQL', '#0369a1'], ['JS', '#ca8a04'], ['HTML', '#ea580c'],
  ['CSS', '#2563eb'], ['MERISE', '#65a30d'], ['SQL', '#1d4ed8'], ['JWT', '#c026d3'], ['Celery', '#16a34a'],
  ['Redis', '#dc2626'], ['REST', '#9333ea'], ['JSON', '#52525b'], ['Git', '#dc2626'], ['GitHub', '#27272a'],
  ['React', '#0e7490'], ['Vite', '#7c3aed'], ['Fetch', '#9333ea'],
]

// n = touche, c = couleur, t = texte, tip = phrase affichée au survol
export const KEYS = [
  { n: 'Python', c: '#60a5fa', t: '#0c1e3d', tip: 'Mon langage pour structurer la logique et les algorithmes.' },
  { n: 'Django', c: '#10b981', t: '#022c22', tip: 'Mon framework web pour des applications complètes.' },
  { n: 'PostgreSQL', c: '#38bdf8', t: '#082f49', tip: 'Là où vivent les rendez-vous, les patients et les agendas.' },
  { n: 'JS', c: '#facc15', t: '#27210a', tip: 'Le langage du navigateur, partout.' },
  { n: 'HTML', c: '#fb923c', t: '#2a1204', tip: 'Le squelette de chaque page.' },
  { n: 'CSS', c: '#3b82f6', t: '#fff', tip: 'Là où l’interface prend des couleurs.' },
  { n: 'MERISE', c: '#84cc16', t: '#1a2e05', tip: 'On modélise d’abord, on code ensuite.' },
  { n: 'SQL', c: '#60a5fa', t: '#0c1e3d', tip: 'Poser les bonnes questions à la base.' },
  { n: 'JWT', c: '#e879f9', t: '#2e0a33', tip: 'Authentification par jetons, simple et sûre.' },
  { n: 'Celery', c: '#4ade80', t: '#052e16', tip: 'Les tâches planifiées, comme les rappels SMS.' },
  { n: 'Redis', c: '#ef4444', t: '#fff', tip: 'Le courtier de messages qui fait tourner les tâches.' },
  { n: 'REST', c: '#c084fc', t: '#2e1065', tip: 'Le langage commun entre le front et le back.' },
  { n: 'JSON', c: '#d4d4d8', t: '#18181b', tip: 'Le format des échanges avec l’API.' },
  { n: 'Git', c: '#ef4444', t: '#fff', tip: 'Ma machine à remonter le temps.' },
  { n: 'GitHub', c: '#3f3f46', t: '#fff', tip: 'Le code en lieu sûr, et en équipe.' },
  { n: 'React', c: '#22d3ee', t: '#042f2e', tip: 'Des interfaces vivantes, composant par composant.' },
  { n: 'Vite', c: '#a78bfa', t: '#1e1038', tip: 'Un serveur de dev instantané.' },
  { n: 'Fetch', c: '#c084fc', t: '#2e1065', tip: 'Appeler l’API depuis le navigateur.' },
]

export const EXP = [
  { r: 'Développeur full-stack', o: 'SMART-RDV · projet de fin d’études', date: '2026',
    b: ['Conçu une plateforme de gestion de rendez-vous médicaux à quatre rôles utilisateurs.', 'Mis en place l’authentification JWT et par session basée sur les numéros de téléphone ivoiriens.', 'Intégré la prise de rendez-vous interactive avec FullCalendar.js et des disponibilités codées par couleur.', 'Ajouté les rappels SMS automatiques (Celery Beat), les notifications en temps réel, la salle d’attente et le backoffice.'],
    tags: ['Python', 'Django', 'PostgreSQL', 'JavaScript', 'Celery', 'Redis'] },
]

// ====== Liens & CV ======
export const SOCIALS = {
  github: 'https://github.com/simon-adelakun',
  linkedin: '',
  instagram: '',
  whatsapp: 'https://wa.me/2250788999817',
}
export const CV = { url: '/CV-Adelakun-Simon.pdf', label: 'Télécharger mon CV' }

// ====== Compétences (version lisible, en complément des sphères 3D) ======
export const SKILLS = [
  { g: 'Développement', t: ['Python', 'Django', 'HTML', 'CSS', 'JavaScript', 'Algorithmique'] },
  { g: 'Données & conception', t: ['PostgreSQL', 'SQL', 'MERISE', 'Bases de données'] },
  { g: 'Tâches & sécurité', t: ['JWT', 'Celery', 'Redis', 'API REST'] },
  { g: 'Gestion de projet', t: ['Plan de projet', 'Réunions de suivi', 'Travail en équipe', 'Git', 'GitHub'] },
]

// ====== Réalisations graphiques (affiches) ======
export const DESIGNS = [
  { t: 'SiMo Restaurant', c: 'Affiche publicitaire', img: '/designs/simo-restaurant.jpg' },
  { t: 'Kadjoum Nail Art Studio', c: 'Affiche de présentation', img: '/designs/kadjoum-nail-art.jpg' },
]
