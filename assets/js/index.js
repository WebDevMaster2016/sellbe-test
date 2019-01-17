document.addEventListener('DOMContentLoaded', function () {

	function findMostReaptedWord(str){
		var counts = {}, mr, mc;
		str.match(/\w+/g).forEach(function(w){ counts[w]=(counts[w]||0)+1 });
		for (var w in counts) {
			if (!(counts[w]<mc)) {
				mc = counts[w];
				mr = w;
			}
		}
		return mr;
	}

	String.prototype.replaceAll = function (find, replace) {
		var str = this;
		return str.replace(new RegExp(find.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&'), 'g'), replace);
	};

	var tabItems = [].slice.call(document.querySelectorAll('.tabs__item'));
	var contentOverlay = document.querySelector('.tabs__content');

	tabItems.forEach(function (elem ) {

		elem.addEventListener('click', function() {

			if(!this.classList.contains('active')) {

				// set active state
				tabItems.forEach(function (item) {
					item.classList.remove('active')
				});
				this.classList.add('active');

				var dataUrl = this.getAttribute('data-url');

				var xhr = new XMLHttpRequest();
				xhr.onreadystatechange = function () {
					if (xhr.readyState === 4 && xhr.status === 200) {
						try {
							var json = JSON.parse(xhr.responseText);
							contentOverlay.innerHTML += '<div class="tabs__content-item" data-id="' + json.id + '"><h2 class="tabs__headline">' + json.title + '</h2><p class="tabs__text">' + json.content + '</p></div>';
							[].slice.call(document.querySelectorAll('.tabs__content-item')).forEach(function (el) {
								el.classList.remove('is-visible');
							});
							document.querySelector('.tabs__content-item[data-id="' + json.id + '"]').classList.add('is-visible');

							string = document.querySelector('.is-visible .tabs__text').innerHTML;
							string = string.replaceAll(findMostReaptedWord(json.content), '<span class="highlight">' + findMostReaptedWord(json.content) + '</span>');

							document.querySelector('.is-visible .tabs__text').innerHTML = string;
						}
						catch (err) {
							return 'not data';
						}
					}
				};
				xhr.open('GET', dataUrl, true);
				xhr.send();

			}
		});


	});

});