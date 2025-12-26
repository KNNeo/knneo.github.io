//--CONSTANTS--//
const isFirefox = /Firefox/i.test(navigator.userAgent);
const isLandscape = function () {
	return matchMedia('all and (orientation:landscape)').matches;
}
const config = {
	debug: false,
	masonry: {
		minColumns: 2,
		maxColumns: 6,
		columnSize: 200,
		delta: 150,
		index: 0
	},
	sort: {
		locale: 'ja'
	}
};
const sectionTypes = ['main', 'title', 'paragraph', 'image', 'images', 'gallery', 'masonry', 'tags', 'grid', 'fullgrid', 'title-gallery'];

//--DOM REFERENCES--//
const pageMain = document.querySelector("main.page");
const dataScript = document.querySelector("script#data");

//--EVENT HANDLERS--//
function onSectionSelect() {
	if (config.key) event.target.closest("section").focus();
	else if (isLandscape) event.target.closest("section").scrollIntoView({ behavior: "smooth" });
	document.querySelector("header")?.classList.add("hide");
}

function onNavSelect() {
	event.stopPropagation();
	let s = event.target.closest("button").getAttribute("data-index");
	if (config.key)
		pageMain.querySelector('section[data-index="' + s + '"]').focus();
	else
		pageMain
			.querySelector('section[data-index="' + s + '"]')
			.scrollIntoView({ behavior: "smooth" });
}

function onTopSelect() {
	if (config.key)
		pageMain
			.querySelector('section[data-index="' + config.data.main + '"]')
			.focus();
	else
		pageMain
			.querySelector('section[data-index="' + config.data.main + '"]')
			.scrollIntoView({ behavior: "smooth" });
}

function onScroll() {
	// toggle button display on scroll
	let pageDown =
		document.body.scrollTop > document.documentElement.clientHeight ||
		document.documentElement.scrollTop >
		document.documentElement.clientHeight;
	let pageRight =
		document.body.scrollLeft > document.documentElement.clientWidth ||
		document.documentElement.scrollTop >
		document.documentElement.clientHeight;
	// calculate scroll difference
	let st = window.pageYOffset || document.documentElement.scrollTop;
	let scrollDown = st > 0.3 * document.documentElement.clientHeight;
	let sr = window.pageXOffset || document.documentElement.scrollLeft;
	let scrollRight = sr > 0.3 * document.documentElement.clientWidth;
	// toggle action menus display on scroll
	if ((config.data.direction == "vertical" && (!scrollDown || !pageDown)) ||
		(config.data.direction == "horizontal" && (!pageRight || !scrollRight))) {
		document.querySelector("header")?.classList.add("hide");
		document.querySelector("button.top")?.classList.add("hide");
	} else if (!config.data.nav || config.data.nav == "static") {
		document.querySelector("header")?.classList.remove("hide");
		document.querySelector("button.top")?.classList.remove("hide");
	}
}

function onWheel(e) {
	let scrollDelta = isFirefox ? e.detail * 40 : -1 * e.wheelDelta;
	// technically no overflow, so have to scroll window
	window.scrollBy({
		top: 0,
		left: scrollDelta
	});
}

function onHistoryChange() {
	// if viewer open, close and return
	if (document.querySelector('.viewer')?.classList.contains('open') && window.location.hash != '#viewer') {
		// console.log('close viewer');
		closeViewer();
	}
}

//--NAVIGATION--//
function renderNav() {
	if (!config.data.nav) return;
	let container = document.querySelector("nav");
	container.style.setProperty("--position", config.data.nav);
	container.classList.add(config.data.nav);
	if (config.data.header)
		container.setAttribute("data-header", config.data.header);

	if (container) {
		let s = 1;
		if (config.nav) {
			for (let item of config.nav) {
				let nav = document.createElement("button");
				if (item.highlight) nav.setAttribute("data-emphasis", "");
				nav.setAttribute("data-index", s++);
				if (item.image) {
					let navImage = document.createElement("img");
					navImage.src = item.image;
					navImage.setAttribute("onclick", "onNavSelect()");
					navImage.setAttribute("onkeyup", "onKeyUp()");
					nav.appendChild(navImage);
				} else if (item.text) {
					nav.setAttribute("onclick", "onNavSelect()");
					nav.setAttribute("onkeyup", "onKeyUp()");
					nav.innerText = item.text;
				}
				container.appendChild(nav);
			}
		}
	}
}

function renderExit() {
	let container = document.querySelector("nav");
	let exit =
		document.querySelector(".exit") || document.createElement("a");
	exit.className = "exit material-icons";
	exit.innerText = "menu";
	exit.href = 'javascript:void(0);';
	exit.setAttribute('onclick', 'onExitClick()');
	if (!document.querySelector(".exit")) {
		if (container)
			container.insertBefore(exit, container.children[0]);
		else if (pageMain.querySelector('section'))
			pageMain.querySelector('section').insertBefore(exit, pageMain.querySelector('section').children[0]);
	}
}

function renderGoToTop() {
	let container = document.querySelector("nav");
	let top = document.querySelector(".top") || document.createElement("button");
	top.className = "top hide material-icons";
	top.innerText =
		config.data.direction == "horizontal"
			? "keyboard_return"
			: "keyboard_double_arrow_up";
	top.setAttribute(
		"onclick",
		"pageMain.scrollIntoView({ behavior: 'smooth' });"
	);
	if (!document.querySelector(".top")) {
		if (container)
			container.insertBefore(top, container.children[0]);
		else if (pageMain.querySelector('section'))
			pageMain.querySelector('section').insertBefore(top, pageMain.querySelector('section').children[0]);
	}
}

//--SECTION--//
function renderPages() {
	// types to filter, if mixed with hyphens must include in sectionTypes
	config.sections = config.sections.filter(s => sectionTypes.includes(s.type));
	for (let s = 0; s < config.sections.length; s++) renderSection(s);
}

function renderSection(index) {
	let data = config.sections[index];
	// console.log(index, data);

	let container = document.createElement("section");
	container.setAttribute("data-type", data.type);
	container.setAttribute("data-index", index);
	container.setAttribute("onclick", "onSectionSelect()");
	container.setAttribute("onkeyup", "onKeyUp()");
	container.tabIndex = 0;
	pageMain.appendChild(container);

	renderSectionData(data, container);
	// render main contents ahead of display elements
	if (typeof config.data.main == "number" && config.data.main == index)
		renderMain(data, container);
}

function renderMain(data, container) {
	container.classList.add("main");
	// render navigation element ahead of display elements
	if (config.data.nav) {
		let nav = document.createElement("nav");
		container.appendChild(nav);
	}
}

function renderDisplay() {
	for (let key of Object.keys(config.data)) {
		let value = config.data[key];
		switch (key) {
			case "direction":
				renderScrollDirection();
				break;
			case "header":
				renderHeader();
				break;
			case "footer":
				renderFooter();
				break;
			case "nav":
				renderNav();
				break;
			case "exit":
				renderExit();
				break;
			case "main":
				renderGoToTop();
				break;
			case "pages":
			default:
				break;
		}
	}
}

function renderScrollDirection() {
	pageMain.setAttribute("data-scroll", config.data.direction);
	if (config.data.direction == "horizontal")
		window.addEventListener(isFirefox ? "DOMMouseScroll" : "mousewheel", onWheel);
	else window.addEventListener("scroll", onScroll);
}

function renderHeader() {
	let header = document.createElement("header");
	header.className = "hide centered";
	header.innerText = config.data.header;
	if (config.data.header) {
		pageMain.appendChild(header);
		document.title = config.data.header;
	}
}

function renderFooter() {
	let footer = document.createElement("footer");
	footer.className = "centered";
	footer.innerText = config.data.footer;
	if (config.data.footer) pageMain.appendChild(footer);
}

function renderDisclaimer() {
	if (config.data.disclaimer && !window.data.ack) {
		if (pageMain) pageMain.innerText = "";
		let content = document.createElement('div');
		content.innerText = config.data.disclaimer.content;
		if (typeof popupNotice == 'function')
			popupNotice(config.data.disclaimer.title, 'no_adult_content', content, [
				{ title: 'Yes', click: 'onDisclaimerAction()' },
				{ title: 'No', click: 'onDisclaimerAction()' }
			]);
	}
	else
		render();
}

function onDisclaimerAction() {
	if (event.target.innerText == 'Yes') {
		// set global variable, do not use config as will reset on filter
		window.data.ack = true;
		if (typeof removeDialog == 'function')
			removeDialog();
		render();
	}
	else
		history.back();
}

//--SECTION ITEMS--//
function renderSectionData(data, container) {
	container.classList.add(data.type);
	// console.log("type", data.type);
	switch (data.type) {
		case "main":
		case "title":
			renderTitle(data, container);
			break;
		case "paragraph":
			renderParagraph(data, container);
			break;
		case "image":
			renderImage(data, container);
			break;
		case "images":
			renderImages(data, container);
			break;
		case "gallery":
			renderGallery(data, container);
			break;
		case "masonry":
			renderMasonry(data, container);
			break;
		case "tags":
			renderTags(data, container);
			break;
		case "grid":
		case "fullgrid":
			renderGrid(data, container);
			break;
		default:
			break;
	}
	// assuming properties do not overlap, and in order
	if (data.type.includes("-")) {
		for (let item of data.type.split("-"))
			renderSectionData({ ...data, type: item }, container);
	}
}

function renderTitle(data, container) {
	container.classList.add("centered");
	let width = container.getBoundingClientRect().width;
	let height = container.getBoundingClientRect().height;

	let prefixIcon = document.createElement("img");
	if (data.prefixIcon) {
		prefixIcon.src = data.prefixIcon;
		container.appendChild(prefixIcon);
	}

	let prefix = document.createElement("small");
	prefix.innerText = data.prefix;
	if (data.prefix) container.appendChild(prefix);

	let title = document.createElement("h1");
	title.innerText = data.title;
	if (data.title) container.appendChild(title);

	let suffixIcon = document.createElement("img");
	if (data.suffixIcon) {
		suffixIcon.src = data.suffixIcon;
		container.appendChild(suffixIcon);
	}

	let suffix = document.createElement("p");
	suffix.innerText = data.suffix;
	if (data.suffix) container.appendChild(suffix);

	if (suffix.closest(".dialog"))
		suffix.style.setProperty("--height", (height || 20) * 0.5 + "px");

	if (data.links) {
		let links = document.createElement("div");
		links.className = "links";
		for (let link of data.links) {
			let aLink = document.createElement("a");
			aLink.setAttribute("target", "_blank");
			aLink.href = typeof processLinkExtensions == "function"
				? processLinkExtensions(link.url)
				: link.url;
			aLink.innerText = link.text || link.url;
			if (link.url) links.appendChild(aLink);
		}
		container.appendChild(links);
	}
}

function renderParagraph(data, container) {
	if (data.align == "center") container.classList.add("centered");

	let paragraph = document.createElement(data.italics ? "em" : "div");
	paragraph.setAttribute(
		"onclick",
		'event.target.closest("em").classList.toggle("expanded");'
	);
	if (data.text) {
		container.appendChild(paragraph);
		paragraph.style.setProperty(
			"--width",
			paragraph.parentElement.getBoundingClientRect().width + "px"
		);
		paragraph.style.setProperty(
			"--height",
			paragraph.parentElement.getBoundingClientRect().height + "px"
		);
		if (data.text.includes("\n"))
			paragraph.innerHTML =
				"<p>" +
				data.text.replace(/\n\n/gi, "\n").split("\n").join("</p><p>") +
				"</p>";
		else paragraph.innerText = data.text;
	}
	if (paragraph.clientHeight > container.clientHeight)
		container.style.alignContent = 'normal';
}

function renderImage(data, container) {
	let width = container.getBoundingClientRect().width;
	let height = container.getBoundingClientRect().height;

	let image = document.createElement("img");
	if (data.tooltip) image.title = data.tooltip;
	if (data.link && (data.thumbnail || data.source)) {
		image.src = data.thumbnail || data.source;
		let wrapper = document.createElement("a");
		wrapper.tabIndex = 0;
		wrapper.href = typeof processLinkExtensions == "function"
			? processLinkExtensions(data.link)
			: data.link;
		wrapper.appendChild(image);
		container.appendChild(wrapper);
	} else if (data.thumbnail && data.source) {
		image.src = data.thumbnail;
		image.setAttribute("data-src", data.source);
		image.setAttribute("onclick", "popupImage()");
		container.appendChild(image);
	} else if (data.source) {
		image.src = data.source;
		container.appendChild(image);
	}
	// for single image, render fixed size
	if (container.classList.contains("image")) {
		container.classList.add("centered");
		// fixed height wrt container
		let imgWidth = image.getBoundingClientRect().width;
		let imgHeight = image.getBoundingClientRect().height;
		// logic is broken: image not rendered can't get dimensions
		if (imgHeight >= imgWidth) {
			if (config.debug) console.log('landscape image');
			image.style.setProperty("--height", "calc(" + height + "px - 1em)");
		}
		else {
			if (config.debug) console.log('portrait image');
			image.style.setProperty("--width", "calc(" + width + "px - 1em)");
		}
		// if height exceed dialog grid size
		if (container.closest("dialog") && imgHeight > height) {
			if (config.debug) console.log('in dialog', image);
			image.style.setProperty("--height", "calc(" + height + "px - 1em)");
		}
		else if (data.rows > 1) {
			if (config.debug) console.log('span rows', image);
			let totalRows = container.parentElement.style.getPropertyValue('--rows');
			if (totalRows && parseInt(totalRows) >= data.rows) {
				image.addEventListener('load', function () {
					let height = container.getBoundingClientRect().height;
					image.style.setProperty("max-height", "calc(" + 0.8 * height + "px - 1em)");
				});
			}
		}
		// fixed width wrt container
		if (height > width)
			image.style.setProperty("max-width", "calc(" + 0.8 * width + "px - 1em)");
	}
}

function renderImages(data, container) {
	let count = data.images.length;
	let width = container.getBoundingClientRect().width;
	let height = container.getBoundingClientRect().height;
	// render each image
	for (let image of data.images) renderImage(image, container);
	// arrange images by flex
	for (let image of container.querySelectorAll("img")) {
		if (width >= height && (data.rows > 1 || data.columns > 1)) {
			// landscape
			// image.style.setProperty('--width', 'calc(' + (width / count) + 'px - 1em)');
			image.style.setProperty("--height", "calc(" + height + "px - 1em)");
			container.style.setProperty("--wrap", "nowrap");
		} else if (isLandscape()) {
			// image.style.setProperty('--width', width + 'px');
			image.style.setProperty(
				"--height",
				"calc(" + height / count + "px - 1.5em)"
			);
			container.style.setProperty("--wrap", "wrap");
		}
		if (!isLandscape()) {
			image.style.setProperty("--height", "");
		}
	}
}

function renderGallery(data, container) {
	container.classList.add("centered");

	let gallery = document.createElement("div");
	gallery.classList.add("gallery");
	container.appendChild(gallery);

	if (data.images) {
		// filter images if notification detected (see startup)
		if (config.filter) data.images = data.images.filter((i) => !i.skip);
		if (typeof data.ratio == 'number') gallery.style.setProperty("--ratio", data.ratio);
		let count = 0;
		// sort items before render
		if (data.reverse) data.images.reverse();
		// allow shuffle
		if (data.shuffle && !data.reverse)
			data.images = data.images.sort(function (a, b) {
				return 2 * Math.random() - 1;
			});

		for (let item of data.images) {
			let image = document.createElement("img");
			image.tabIndex = 0;
			// set image width by size of content, as per config
			let thumbSize = 100;
			if (data.size == 'md') thumbSize = 150;
			if (data.size == 'lg') thumbSize = 200;
			image.style.setProperty("--width", "calc(90% / " + Math.floor(container.getBoundingClientRect().width / thumbSize) + ")");
			// set source by properties
			if (item.source) image.src = item.source;
			if (item.thumbnail) image.src = item.thumbnail;
			if (item.grid) {
				image.setAttribute("data-images", count++);
				image.setAttribute("data-type", data.type);
				image.setAttribute("onclick", "onClickGalleryImage()");
			} else if (item.thumbnail && item.source) {
				image.tabIndex = 0;
				image.src = item.thumbnail;
				image.setAttribute("data-src", item.source);
				image.setAttribute("onclick", "popupImage()");
				image.setAttribute("onkeyup", "onKeyUp()");
			}
			gallery.appendChild(image);
		}
	}

	if (data.caption) {
		let caption = document.createElement("div");
		caption.classList.add("caption");
		caption.innerText = data.caption;
		container.appendChild(caption);
	}
}

function popupImage() {
	let source = event.target.getAttribute("data-src");
	if (source) {
		let image = document.createElement("a");
		image.href = source;
		if (typeof openImageInViewer == 'function')
			openImageInViewer(image);
		else
			onClickGalleryImage(event);
	}
}

function renderMasonry(data, container) {
	// container.classList.add("centered");

	let masonry = document.createElement("div");
	masonry.className = "masonry";
	masonry.addEventListener('resize', function() {
		event.target.style.setProperty(
			"--height",
			"calc(" + event.target.parentElement.getBoundingClientRect().height + "px - 1em)"
		);
	});
	container.setAttribute('oncontextmenu', 'onMasonryContextMenu()');
	container.appendChild(masonry);

	if (data.config && data.config.length == 3) {
		config.masonry.minColumns = data.config[0];
		config.masonry.maxColumns = data.config[1];
		config.masonry.columnSize = data.config[2];
	}

	if (data.images) {
		let calcColumns = Math.floor(masonry.getBoundingClientRect().width / config.masonry.columnSize);
		let totalCol = Math.min(calcColumns, config.masonry.maxColumns);
		if (config.masonry.minColumns && totalCol < config.masonry.minColumns)
			totalCol = config.masonry.minColumns;
		// sort via order, else create order
		if(data.images.length && !data.images[0].order)
			data.images.map(function(i, index) { i.order = index });
		if (data.shuffle && !config.filter) {
			let newOrder = Array.from({length: data.images.length}, (v, i) => i).sort(function () { return 2 * Math.random() - 1 });
			data.images.map(function (i, index) { i.order = newOrder[index] });
		}
		if (data.reverse)
			data.images.map(function (i, index) { i.order = data.images.length - index - 1 });
		data.images.sort(function(a,b) { return b.order - a.order });
		// filter images if notification detected (see startup)
		let images = JSON.parse(JSON.stringify(data.images));
		if (config.filter) images = images.filter((i) => !i.skip);
		// create masonry columns
		for (let row = 0; row < totalCol; row++) {
			let colDiv = document.createElement("div");
			colDiv.className = "column";
			colDiv.style.flex = 100 / totalCol + "%";
			colDiv.style.maxWidth = colDiv.style.flex;
			masonry.appendChild(colDiv);
		}
		// render items to each column, round robin
		for (let d = 0; d < images.length; d++) {
			let item = images[d];
			// if(config.filter && item.skip) continue;
			if (item && typeof item == "object") {
				let image = document.createElement("img");
				image.setAttribute("loading", "lazy");
				image.setAttribute("tabIndex", 0);
				if (item.tooltip && item.tooltip.length > 0) image.title = item.tooltip;
				image.src = item.thumbnail || item.source;
				image.alt = item.tooltip;
				image.setAttribute("data-images", item.order);
				// data for recursion render
				if (item.grid)
					image.setAttribute("data-type", data.type);
				else if (item.source)
					image.setAttribute("data-src", item.source);
				// if have recursion render or source, display in viewer
				if (item.grid || item.source) {
					image.setAttribute("onclick", "onClickGalleryImage()");
				}
				if (item.width && item.height) {
					image.width = item.width;
					image.height = item.height;
					addMasonryItem(image, masonry);
				}
				else {
					image.setAttribute("onload", "shiftMasonryItems()");
					if (item.url && !item.grid && !item.source) {
						let wrapper = document.createElement('a');
						wrapper.href = item.url;
						wrapper.appendChild(image);
						masonry.querySelectorAll(".column")[d % totalCol].appendChild(wrapper);
					}
					else
						masonry.querySelectorAll(".column")[d % totalCol].appendChild(image);
				}
			} else masonry.innerHTML = "Masonry has no content";
		}
	}
}

function addMasonryItem(item, gallery) {
	// find all column heights
	let columns = gallery?.querySelectorAll(".column");
	if (!columns) return;
	let columnHeights = Array.from(columns).map(
		c => Array.from(c.querySelectorAll("img")).reduce((total, current) => total + current.height || current.getBoundingClientRect().height, 0)
	);
	let minHeight = Math.min(...columnHeights);
	// console.log(columnHeights, minHeight, config.masonry.index);
	// let diff = median - minHeight;
	let colNo = config.masonry.index;
	let nextColNo = colNo + 1 >= columns.length ? 0 : colNo + 1;
	// console.log('colNo', colNo);
	let lowRangeColumns = [];
	// marks within lowest range
	for (let d = 0; d < columns.length; d++) {
		let c = colNo + d >= columns.length ? colNo + d - columns.length : colNo + d;
		lowRangeColumns[c] = Math.abs(columnHeights[c] - minHeight) < config.masonry.delta ? 1 : 0;
	}
	// console.log('low range', lowRangeColumns);
	// check if single lowest
	let singleLowest = lowRangeColumns.filter(x => x == 1).length == 1;
	if (singleLowest) {
		let ind = lowRangeColumns.indexOf(1);
		// lowest is deviating from render order
		if (colNo != ind) {
			colNo = ind;
		}
	}
	else {
		// group of similar, start from initial col no
		for (let d = 0; d < columns.length; d++) {
			let c = colNo + d >= columns.length ? colNo + d - columns.length : colNo + d;
			if (lowRangeColumns[c]) {
				colNo = c;
				break;
			}
		}
	}
	// console.log('add to column', colNo, item);
	let destColumn = columns[colNo];
	if (item.getAttribute('data-url')) {
		let wrapper = document.createElement('a');
		wrapper.href = item.getAttribute('data-url');
		wrapper.appendChild(item);
		destColumn.appendChild(wrapper);
	}
	else
		destColumn.appendChild(item);
}

function shiftMasonryItems() {
	// shift items up if possible
	let gallery = event.target.closest(".masonry");
	let count = 10; // hard limit, no of tries
	// if all images loaded, stop
	if (
		gallery &&
		Array.from(gallery.querySelectorAll("img")).filter((i) => i.complete)
			.length < gallery.querySelectorAll("img").length
	)
		return;
	// find all column heights
	let columns = gallery?.querySelectorAll(".column");
	if (!columns) return;
	let columnHeights = Array.from(columns).map(
		(g) => g.height || g.getBoundingClientRect().height
	);
	// worst case: tallest and shortest columns are tallest image height
	let tallestImage = Math.max(...Array.from(gallery.querySelectorAll("img")).map(
		(g) => g.height || g.getBoundingClientRect()?.height || 0
	));
	let minHeight = Math.min(...columnHeights);
	let maxHeight = Math.max(...columnHeights);
	let diff = Math.floor(maxHeight - minHeight);
	// if have empty column, ignore
	if (minHeight < 1) return;
	if (tallestImage < 1) return;
	// console.log(count, diff, 'tallest', Math.floor(tallestImage));
	while (diff > Math.floor(0.9 * tallestImage) && count-- > 0) {
		// console.log(count, diff, Math.floor(tallestImage));
		// destination: shortest height column
		let destColumn = columns[columnHeights.indexOf(minHeight)];
		// console.log(destColumn);
		// source: tallest height column that isn't destination
		let sourceColumn = Array.from(columns).filter(
			(c) => c.getBoundingClientRect().height == maxHeight && c != destColumn
		);
		if (sourceColumn.length > 0) {
			sourceColumn = sourceColumn[0];
			// console.log(sourceColumn);
			// move image from source to dest column
			let source = sourceColumn.querySelectorAll("img")[
				sourceColumn.querySelectorAll("img").length - 1
			];
			let clone = source.cloneNode(true);
			clone.setAttribute("onload", "");
			clone.setAttribute("onclick", "onClickGalleryImage()");
			source.remove();
			destColumn.appendChild(clone);
		}
		// re-calculate
		columnHeights = Array.from(columns).map(
			(g) => g.height || g.getBoundingClientRect().height
		);
		minHeight = Math.min(...columnHeights);
		maxHeight = Math.max(...columnHeights);
		diff = maxHeight - minHeight;
	}
}

function renderTags(data, container) {
	container.classList.add("centered");

	let tags = document.createElement("div");
	tags.className = "tags";
	if (typeof data.values == "string") tags.innerHTML = component.values;
	else {
		for (let tagValue of data.values) {
			let tagSpan = document.createElement("button");
			tagSpan.className = "tags-value";
			tagSpan.innerText = (data.prefix ?? "") + tagValue;
			tagSpan.title = tagValue;
			if (data.filter) {
				tagSpan.setAttribute("data-filter", tagSpan.innerText);
				tagSpan.setAttribute("onclick", "filterPages()");
			}
			tags.appendChild(tagSpan);
		}
	}
	if (tags.childElementCount < 1) tags.innerHTML = "No tags found";
	container.appendChild(tags);
}

function filterPages() {
	let filterValue = event.target.getAttribute("data-filter") || "";
	let allSections = JSON.parse(JSON.stringify(config.data.pages));
	if (filterValue) {
		// hide all images in GALLERY or MASONRY not in filter
		let pagesToFilter = allSections.filter(
			(e) =>
				e.items &&
				e.items.filter((cd) => cd.type == "gallery" || cd.type == "masonry")
					.length > 0
		);
		for (let page of pagesToFilter) {
			for (let gallery of page.items) {
				if (gallery.images)
					for (let data of gallery.images) {
						for (let innerComp of data.grid.items) {
							// reset first
							// data.skip = false;
							if (
								innerComp.type == "tags" &&
								!innerComp.values
									.map((v) => (innerComp.prefix ?? "") + v)
									.includes(filterValue)
							)
								data.skip = true;
						}
						if (data.grid.items.filter((data) => data.type == "tags").length < 1) {
							data.skip = true;
						}
					}
			}
		}
		// duplicate for local storage
		config.filter = allSections;
		removeDialog();
		startup();
		showSnackbar('Filtered by: "' + filterValue + '"');
	}
}

function renderGrid(data, container) {
	let gridContainer = document.createElement("div");
	gridContainer.className = "grid-container";
	gridContainer.style.setProperty("--cols", data.columns);
	gridContainer.style.setProperty("--rows", data.rows);
	gridContainer.style.setProperty("--items", data.items.length);
	container.appendChild(gridContainer);

	let col = 1;
	let row = 1;
	let count = 0;
	let skips = [];
	// console.log(data.items);
	if (data.items)
		for (let item of data.items.filter(i => sectionTypes.includes(i.type))) {
			// console.log(item);
			// console.log("before", col, row);
			while (skips.filter((x) => x[0] == col && x[1] == row).length > 0) {
				col += 1;
				if (col > data.columns) {
					if (row > data.rows) {
						console.error("max row span exceeded. stopping.");
						continue;
					}
					row += 1;
					col = 1;
				}
			}
			// console.log("mid", col, row);

			let gridDiv = document.createElement("span");
			gridDiv.className = "grid-item";
			gridDiv.style.setProperty("--col", col);
			gridDiv.style.setProperty("--row", row);
			gridDiv.style.setProperty("--idx", ++count);
			gridContainer.appendChild(gridDiv);

			let rowSpan = item.rows || 1;
			let colSpan = item.columns || 1;
			if (row + rowSpan - 1 > data.rows)
				console.warn("max row span exceeded. grid item will be shrunk down.");
			if (col + colSpan - 1 > data.columns)
				console.warn("max column span exceeded. grid item will be shrunk down.");
			// these taken from item
			gridDiv.style.setProperty("--rowspan", rowSpan);
			gridDiv.style.setProperty("--colspan", colSpan);
			// console.log("span", colSpan, rowSpan);
			// add cells to skip if row/col span specified
			if (rowSpan > 1 || colSpan > 1) {
				for (let r = row; r < row + rowSpan; r++) {
					for (let c = col; c < col + colSpan; c++) skips.push([c, r]);
				}
			}
			// console.log("skip", skips);
			// these values need to iterate
			if (colSpan) col += colSpan;
			if (col > data.columns) {
				if (row > data.rows) {
					console.error("max row span exceeded. stopping.");
					continue;
				}
				row += 1;
				col = 1;
			}
			// console.log("after", col, row);
			renderSectionData(item, gridDiv);
		}
}

//--HELPER FUNCTIONS--//
function onKeyUp() {
	config.key = event.key;
	// assume enter key, assume is to click on element, implement focus on click event
	if (event.key == "Enter") event.target.click();
}

function onClickGalleryImage() {
	event.stopPropagation();
	if (
		event.target.getAttribute("data-src") &&
		typeof popupImage == "function"
	)
		return popupImage(event.target);
	if (
		event.target.getAttribute("data-images") &&
		typeof openGridInDialog == "function"
	)
		return openGridInDialog(
			event.target.closest("section").getAttribute("data-index"),
			event.target.getAttribute("data-images"),
			event.target.getAttribute("data-type")
		);
}

function openGridInDialog(sectionIndex, galleryIndex, type) {
	// add section container
	let container = document.createElement("section");
	if (typeof popupContent == "function") popupContent(container);
	else return;
	let isGalleryContained = type == 'masonry' || type == 'gallery';
	if (isGalleryContained && document.querySelector("dialog")) // create fixed container size
		document.querySelector("dialog").classList.add('full');
	let itemsOfType = config.sections[parseInt(sectionIndex)].items.filter(
		(i) => i.type == type
	);
	if (itemsOfType && itemsOfType.length > 0) {
		// render grid of first item type
		let data = itemsOfType[0].images.find(x => x.order == parseInt(galleryIndex));
		// console.log(data.grid);
		let section = document.querySelector("dialog section") || container;
		section.setAttribute("data-type", data.grid.type);
		renderGrid(data.grid, section);
		if (!isGalleryContained && document.querySelector("dialog")) // remove fixed container size
			document.querySelector("dialog").classList.remove('full');
	}
}

function addHistoryState(property) {
	// add to history state to allow browser back action
	if (history.state && history.state[property]) {
		let currentState = history.state;
		currentState[property] = true;
		history.replaceState(currentState, null, ' ');
	}
	else {
		let newState = {};
		newState[property] = true;
		history.pushState(newState, null, ' ');
	}
}

function updateMasonryDimensions(item) {
	if (item.type != 'masonry') return alert('wrong type!');
	if (item.images && item.images.length)
		item.images.forEach(function (x) {
			let img = document.querySelector('img[src="' + x.thumbnail + '"]');
			x.width = img.naturalWidth;
			x.height = img.naturalHeight;
		});
}

//--SNACKBAR--//
function showSnackbar(filterValue) {
	let active =
		document.querySelector(".snackbar") ?? document.createElement("div");
	if (active.childElementCount > 0) active.innerHTML = "";
	active.className = "snackbar";
	let message = document.createElement("div");
	message.innerText = filterValue;
	active.appendChild(message);

	let action = document.createElement("button");
	action.className = "action";
	action.href = "javascript:void(0)";
	action.innerText = "Reset";
	action.setAttribute("onclick", "resetSnackbar()");
	active.appendChild(action);
	document.body.appendChild(active);
}

function resetSnackbar() {
	event.target.closest(".snackbar").remove();
	config.filter = null;
	startup();
}

//--CONTEXT MENU--//
function showContextMenu(options) {
	event.preventDefault();
	event.stopPropagation();
	let contextDiv = document.querySelector('.context') || document.createElement('div');
	if (!document.querySelector('.context')) {
		contextDiv.className = 'context hidden';
		document.body.appendChild(contextDiv);
	}
	if (!contextDiv.classList.contains('hidden'))
		return contextDiv.classList.add('hidden');
	document.context = event.target;
	document.addEventListener('click', hideContextMenu);
	//positioning
	let x = event.clientX;
	let y = event.clientY;
	contextDiv.style.top = y + 'px';
	contextDiv.style.left = x + 'px';
	contextDiv.classList.remove('hidden');
	contextDiv.innerHTML = '';
	//render menu
	let submenu = document.createElement('div');
	submenu.className = 'menu-options';
	//render tags
	if (!options || !options.length) return;
	options.sort(function (a, b) {
		if (typeof a.order == 'number' && typeof b.order == 'number')
			return a.order - b.order;
		if (typeof a.title == 'string' && typeof b.title == 'string')
			return a.title.localeCompare(b.title);
	})
	for (let option of options) {
		if (option.disabled) continue;
		let menuItem = document.createElement('div');
		menuItem.onclick = option.onclick;
		menuItem.innerText = option.title;
		submenu.appendChild(menuItem);
	}
	contextDiv.appendChild(submenu);
	let targetParent = event.target.closest('section');
	if (targetParent) {
		//adjust context if exceed window bottom
		if (y + contextDiv.getBoundingClientRect().height + 40 >= targetParent.getBoundingClientRect().height) {
			contextDiv.style.top = (y - contextDiv.getBoundingClientRect().height) + 'px';
			if (y - contextDiv.getBoundingClientRect().height < 0)
				contextDiv.style.top = 0;
		}
		//adjust context if exceed window right
		if (x + contextDiv.getBoundingClientRect().width + 40 >= targetParent.getBoundingClientRect().x + targetParent.getBoundingClientRect().width) {
			contextDiv.style.left = (x - contextDiv.getBoundingClientRect().width) + 'px';
			if (x - contextDiv.getBoundingClientRect().width < targetParent.getBoundingClientRect().x + targetParent.getBoundingClientRect().width + contextDiv.getBoundingClientRect().width)
				contextDiv.style.left = targetParent.getBoundingClientRect().width - contextDiv.getBoundingClientRect().width + 'px';
		}
	}
}

function hideContextMenu() {
	if (document.querySelector('.context'))
		document.querySelector('.context').classList.add('hidden');
	document.removeEventListener('click', hideContextMenu);
}

//--STARTUP--//
function startup() {
	if (pageMain) pageMain.innerText = "Loading...";
	// load data
	if (document.querySelector(".snackbar"))
		console.log(document.querySelector(".snackbar").getAttribute("data-filter"));
	else if (localStorage.getItem(window.btoa(window.location.href))) {
		config.data = JSON.parse(localStorage.getItem(window.btoa(window.location.href)));
		console.log("using local storage");
	}
	else if (dataScript?.innerText) {
		// script json in HTML DOM
		config.data = JSON.parse(dataScript?.innerText || []);
		console.log("using inline html embedded json");
	} else if (dataScript?.src && typeof getJson == 'function') {
		getJson(dataScript?.src, function(contents) {
			config.data = contents;
			init();
		});
		return console.log("using external data source");
	} else console.error("no data source found");
	// render if not empty
	if (config.data && typeof config.data == "object")
		init();
}

function init() {
	config.sections = config.filter || config.data.pages.filter((e) => e.type);
	// mobile to overwrite direction
	config.data.direction = (window.matchMedia("(max-aspect-ratio: 4 / 5)")?.matches ? "vertical" : "")
		|| config.data.direction
		|| "vertical";
	config.nav = config.sections
		.filter((e) => e.type && e.type != "main")
		.map((s) => {
			return {
				image: s.image,
				text: s.text,
				highlight: s.highlight
			};
		});
	renderDisclaimer();
}

function render() {
	pageMain.innerHTML = "";
	// close any dialogs, if open
	if (typeof removeDialog == 'function')
		removeDialog();
	// show disclaimer if in data
	renderPages();
	renderDisplay();
	if (typeof initializeViewer == 'function') initializeViewer();
	setTimeout(function () {
		pageMain
			.querySelector('section[data-index="' + (config.main || 0) + '"]')
			.scrollIntoView();
	}, 0);
}

function save() {
	localStorage.setItem(window.btoa(window.location.href), JSON.stringify(config.data));
}

window.addEventListener("load", startup);
// window.addEventListener("resize", startup);
window.addEventListener('popstate', onHistoryChange);
