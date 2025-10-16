const Page = () => {
	return (
		<div>
			<p>Est ce que l’user qui accède à cette page est prof ou eleve ?</p>
			<p>Si prof :</p>
			<ul>
				<li>Récupère les infos de l’examen</li>
				<li>Récupère les questions de l’examen (avec les réponses si qcm)</li>
				<li>Récupère les réponses des élèves</li>
				<li>Récupère les évaluations des réponses des élèves</li>
			</ul>
			<p>Page récapitulatif de l’examen pour l’user (avec possibilité de corriger si c’est un prof)</p>
			<br />
			<p>Si eleve :</p>
			<p>Est ce que l’eleve à déjà fait cet examen ?</p>
			<p>si oui : </p>
			<ul>
				<li>Récupère les infos de l&apos;examen</li>
				<li>Récupère les questions de l&apos;examen (avec les réponses si qcm)</li>
				<li>Récupère les réponses de l&apos;user</li>
				<li>Récupère les évaluations des réponses de l&apos;user</li>
			</ul>
			<p>Page récapitulatif de l’examen pour l’user (avec possibilité de corriger si c’est un prof)</p>
			<br />
			<p>si non :</p>
			<p>Récupère les infos de l’examen</p>
			<p>Page Start commencer l’examen</p>
		</div>
	);
};

export default Page;
