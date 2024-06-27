window.addEventListener('load', loadDirectory);

function loadDirectory() {
	for(let dir of document.querySelectorAll('.directory'))
	{
		let section = document.querySelector('.'+dir.className.replace('directory','sitemap').replace(' ','.'));
		for(let title of section.querySelectorAll('.title'))
		{
			let glossary = document.createElement('div');
			glossary.classList.add('box');
			glossary.innerText = title.getAttribute('data-id');
			glossary.addEventListener('click', function() {
				document.querySelector('.'+section.className.replace(' ','.') + ' .title[data-id="' + event.target.innerText + '"]').scrollIntoView({ block: "center", inline: "center" });
			});
			dir.appendChild(glossary);
		}
	}
}