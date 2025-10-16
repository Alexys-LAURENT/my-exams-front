const Page = () => {
	return (
		<div>
			Récupère la liste d’élève de la classe Affiche le status de l’élève sur l’examen (récupère l’exam_grade, si il existe on affiche le status de l’exam grade sinon si on recoit une erreur
			avec `exists : false` cela veut dire que l’élève ne l’a pas fait et dc on affiche ‘pas remis’.
		</div>
	);
};

export default Page;
