(function () {
	var gameStarted = false;

	/*
     Two main purposes:
      - Keep alive to track active players
      - Redirect if embedded and not via permitted URL
     */
	window.PlayGame = {
		init: function () {
			PlayGame.startGame();
		},
		// Last step to load the game, includes required scripts
		startGame: function () {
			if (gameStarted === true) return;

			// Add javascript tags
			let promiseArray = [];
			for (let i = 0; i < constructNet_scriptURLs.length; i++) {
				promiseArray.push(
					PlayGame.addScript(constructNet_scriptURLs[i])
				);
			}

			Promise.all(promiseArray).then(function (values) {
				if (constructNet_madeInC2) {
					jQuery(document).ready(function () {
						cr_createRuntime("c2canvas");
					});
					document.addEventListener(
						"visibilitychange",
						PlayGame.c2onVisibilityChanged,
						false
					);
					document.addEventListener(
						"mozvisibilitychange",
						PlayGame.c2onVisibilityChanged,
						false
					);
					document.addEventListener(
						"webkitvisibilitychange",
						PlayGame.c2onVisibilityChanged,
						false
					);
					document.addEventListener(
						"msvisibilitychange",
						PlayGame.c2onVisibilityChanged,
						false
					);
				}

				gameStarted = true;
			});
		},
		c2onVisibilityChanged: function () {
			if (
				document.hidden ||
				document.mozHidden ||
				document.webkitHidden ||
				document.msHidden
			)
				cr_setSuspended(true);
			else cr_setSuspended(false);
		},

		addScript: function (src) {
			return new Promise(function (resolve, reject) {
				const s = document.createElement("script");
				s.setAttribute("src", src);
				s.onload = resolve;
				s.onerror = reject;
				s.async = false;
				document.body.appendChild(s);
			});
		},
	};
	PlayGame.init();
})();
