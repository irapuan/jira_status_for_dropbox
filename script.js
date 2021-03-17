const port = chrome.runtime.connect({ name: "fetcher" })
let anchors = []

function whilenot(condition, resolve) {
	let repeat = 0
	setTimeout(function x() {
		repeat++
		if (repeat == 10) return false
		if (condition()) resolve()
		else setTimeout(x, 300)
	}, 500)
}

function main() {
	let new_anchors = document.querySelectorAll("a[href*='.atlassian.']")

	new_anchors = Array.from(new_anchors, a => a.href)
		.filter(a => !anchors.includes(a))

	if (new_anchors.length == 0) return

	new_anchors.forEach(a => {
		anchors.push(a)
		port.postMessage({ link: a })
	})
}

function init() {
	main()

	document.querySelector(".editor-viewport , .kix-paginateddocumentplugin").addEventListener('change', main, false)


	port.onMessage.addListener(function (msg) {
		if (msg.status) {
			document.styleSheets[0].addRule(
				`a[href="${msg.status[2]}"]:after`,
				`
				content: "${msg.status[0]}";
				padding:0 9px;
				margin: 0 3px;
				border-radius:3px;
				color:black;
				background-color: ${msg.status[1]};
				font-size: 75%;
				`
			)
		} else if (msg.percent) {
			document.styleSheets[0].addRule(
				`a[href="${msg.percent[1]}"]:after`,
				`
				content: "${msg.percent[0]}";
				padding:0 9px;
				margin: 0 3px;
				border-radius:3px;
				color:white;
				background-color: blue;
				font-size: 75%;
				`
			)
		} else return
	});

}

whilenot(
	() => document.querySelector(".editor-viewport , .kix-paginateddocumentplugin") != null,
	init
)