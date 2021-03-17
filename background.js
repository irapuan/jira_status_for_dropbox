chrome.runtime.onConnect.addListener(function (port) {
	port.onMessage.addListener(function (msg) {
		if (msg.link) {
			if (msg.link.includes("browse")) {
				let url = msg.link.replace("browse", "rest/api/2/issue")
				fetch(url).then(resp => resp.json()).then(json => {
					let status = json.fields?.status.name || "No access"
					let color = json.fields?.status.statusCategory.colorName || "gray"
					if (color) { } else { color = "gray" }
					port.postMessage({ status: [status, color, msg.link] })
				})
			} else if (msg.link.includes("issues/?jql=")) {
				let url = msg.link.replace("issues/?jql=", "rest/api/2/search?jql=")
				fetch(url).then(resp => resp.json()).then(json => {
					let status = json.fields?.status.name || "No access"
					
					let sumTotal = 0;
					let sumResolved = 0;
					json.issues.forEach(issue => {
						if (issue.fields.resolution) sumResolved++;
						sumTotal++;
					});
					let percentage = Math.round(((sumResolved/sumTotal) + Number.EPSILON) * 10000) / 100;
					let percent = { percent: [`${percentage}%`, msg.link] }
					port.postMessage(percent)
				})
			} else return

		}
	})
})