var time = 1000,
meNotFirst,
myBirthDay = "12/25/1991";

$(function(){
	var filter = window.location.hash.substring(1).split("/")[0],
	workFilter = window.location.hash.substring(1).split("/")[1],
	$form = $(".message");
	extraClick();
	showExtra(filter, false, workFilter);

	changeStar(filter); // сменим фотку и сразу загрузим другие
	function preloadImages() {
		for (var i = 0; i < arguments.length; i++) {
			new Image().src = arguments[i];
		}
	}

	preloadImages(
		"me/1.jpg","me/2.jpg","me/3.jpg","me/4.jpg","me/5.jpg","me/6.jpg","me/7.jpg","me/8.jpg","me/9.jpg","me/10.jpg","me/11.jpg","me/12.jpg","me/13.jpg","me/14.jpg"
	);

	$form.submit(function(e) {
		//устанавливаем событие отправки для формы с id=form
		e.preventDefault ? e.preventDefault() : e.returnValue = false;
		var form_data = $(this).serialize(); //собераем все данные из формы
		$.ajax({
			type: "POST", //Метод отправки
			url: "php/send.php", //путь до php файла отправителя
			data: form_data,
			success: function() {
				alert("Ваше сообщение отправлено!");
				$form.find("textarea").val("")
			}
		});
	});
	setTimeout(function() {
		animateH1($("#xxx").text().charCodeAt(0), true);
	}, 300);

	/* Просмотр картинок */
	$('.image-popup-no-margins').magnificPopup({
		type: 'image',
		closeOnContentClick: true,
		closeOnBgClick: false,
		closeBtnInside: false,
		fixedContentPos: true,
		mainClass: 'mfp-no-margins mfp-with-zoom', 
		image: {
			verticalFit: true,
			tError: 'С этой <a href="%url%">картинкой</a> что-то пошло не так:( Попробуйте <span class="link mpf-repeat" tabindex="0">еще раз</span>, а если не получится — <span class="link mpf-tell-me" d-href="#contacts" tabindex="0">сообщите</span>, пожалуйста, мне.' // Error message
		},
		zoom: {
			enabled: true,
			duration: 300 // don't foget to change the duration also in CSS
		},
		tLoading: "Еще секунду...",
		tClose: "Закрыть",
		callbacks: {
			open: function() {
				if (!$(".mfp-full").length) {
					this.wrap.append('<button title="Полноразмерное изображение" type="button" class="mfp-full"><i class="fa fa-expand"></i></button>');
					$(".mfp-full").on("click", function(e) {
						$(this).find("i").toggleClass("fa-expand fa-compress");
						$(".mfp-wrap").toggleClass("mfp-overflow-auto");
					});
				}
			},
			updateStatus: function(data) {
				if (data.status == "error") {
					$(".mpf-tell-me").off("click");
					$(".mfp-preloader").on("click", ".mpf-tell-me", function(e) {
						$.magnificPopup.close();
						window.location.hash = $(this).attr("d-href");
					});
					$(".mfp-preloader").on("click", ".mpf-repeat", function(e) {
						var magnificPopup = $.magnificPopup.instance;
						magnificPopup.updateItemHTML();
					});
				}
			}
		}
	});

	/* Скролл правого блока по событиям со всей страницы */
	$("html").on("wheel keydown swipeup swipedown", function(e) {
		if (e.which == 40) {
			$(".extra-block > .current")[0].scrollTop += 40;
		} else if (e.which == 38) {
			$(".extra-block > .current")[0].scrollTop -= 40;
		} else if (!$(e.target).closest(".extra-block, .mfp-wrap").length) {
			$(".extra-block > .current")[0].scrollTop += e.originalEvent.deltaY;
		}
	});

});

/* Обрабатывает клик по ссылкам на правый блок + обработка клавиш вперед/назад */

function extraClick() {
	$(".center-block .link, .menu-block li a, .works-menu li a").on("click", function(e) {
		var thisFilter = $(this).attr("href").substring(1);
		extraClickHandler(e, thisFilter)
	});
/*	$(window).on("hashchange", function(e) {
		var thisFilter = e.originalEvent.newURL.split("#")[1];
		extraClickHandler(e, thisFilter, true)
	});*/
	$(window).on('hashchange', hashchange);
}

function hashchange(e) {
	var thisFilter = window.location.hash.slice(1).split("/")[0],
		workFilter = window.location.hash.slice(1).split("/")[1];
	extraClickHandler(e, thisFilter, true, workFilter)
};

function extraClickHandler(e, thisFilter, isBackOrForward, workFilter) {
	e.preventDefault ? e.preventDefault() : e.returnValue = false;
	showExtra(thisFilter, isBackOrForward, workFilter);
};

/* Меняет мою фотку */

function changeStar(filter) {
	if (filter == "me") {
		$(".star img").attr("src", "me/" + (Math.floor(Math.random()*14) + 1) + ".jpg");
	}
/*	var $starImg = $(".star img");
	if (filter == "me") {
		$starImg.css({"opacity": 0})
			.attr("src", "me/" + (Math.floor(Math.random()*14) + 1) + ".jpg");
		setTimeout(function() {
			$starImg.animate({"opacity" : "1"}, time);
		}, time/4);
	} else {
		setTimeout(function() {
			$starImg.attr("src", "robot.svg");
		}, time);
	}*/
}

/* Анимирует домен */

function animateH1(chr, first) {
	if (first) {
		$("#xxx").text("a");
		$("#yyy").text("b");
		$("#zzz").text("c");
	};
	if (chr - 97 < 23) {
		$("h1").find(".domain-top").each(function(i, el) {
			$(el).text(String.fromCharCode($(el).text().charCodeAt(0) + 1));
			if ($(el).text() == "h" || $(el).text() == "i") {
				$(el).addClass("hi");
			} else {
				$(el).removeClass("hi");
			}
		});
		setTimeout(function() {
			animateH1($("#xxx").text().charCodeAt(0), false);
		}, time/10);
	}
}

/* Вычисляет возраст по дате рождения */

function birthDateToAge(birthDate) {
	birthDate = new Date(birthDate);
	var now = new Date(),
		age = now.getFullYear() - birthDate.getFullYear();
	return now.setFullYear(1972) < birthDate.setFullYear(1972) ? age - 1 : age;
}

/* Анимирует числа */
function aliveNumber(el, start, final) {
	var k = 1,
	kArr = $(el).attr("data-k").split("-");
	if (kArr[0] == "k") {
		k = kArr[1];
	}
	if (start < final) {
		$(el).text((start + 1).toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1\u00A0'));
		if ($(el).attr("id") == "centers") {
			var word = (((start%10 == 0)&&((start/10)%10 != 1)) ? "центра" : "центров");
			$("#centers-word").text(word);
		};
		if ($(el).hasClass("alive-number-plus")) {
			//start = +$(el).text().split(" ").join("") - 1;
			final = start + 2;
			if (kArr[0] == "m") {
				k = +(Math.random()*kArr[1]).toFixed(1);
			}
		};
		if ($(el).hasClass("alive-number-hold")) {
			$.cookie($(el).attr("id"), start, { expires: 7, path: "/"});
		};
		setTimeout(function() {
			aliveNumber($(el), start + 1, final);
		}, time/k);
	}
}

/* Показывает правый блок со всеми вытекающими */

function showExtra(filter, isBackOrForward, workFilter) {

	if (filter != "me" && filter != "contacts") {
		var extra = "works",
		$extraBlock = $(".works-block");
		filter = (filter == "" ? "works" : filter);
	} else {
		var extra = filter;
	}

	var $extraBlock = $("." + extra + "-block");

	/* Первая часть происходит, если мы кликаем по кнопке, меняющей или правый блок, или хотя бы фильтр работ... */
	if ((filter != window.location.hash.slice(1)) || !$extraBlock.hasClass("current") || isBackOrForward) {

		var $notExtra = $(".extra-block > div").not($extraBlock),
		shiftTop, shiftLeft;

		$(".center-block .link, .menu-block li a, .works-menu li a").off("click");
		$(window).off("hashchange", hashchange);

		if (typeof hideOldExtra !== "undefined"){
			clearTimeout(hideOldExtra);
		}

		/* Работы фильтруются */
		if (extra == "works") {

			/* Смещается фон фильтра */
			var $worksCurrent = $extraBlock.find(".works-menu .current"),
			$newCurrentA = $extraBlock.find(".works-menu a[href *= '" + filter + "']"),
			$newCurrent = $newCurrentA.parent(),
			$newCurrentSpan = $newCurrent.find("span"),
			$worksCurrentSpan = $worksCurrent.find("span"),
			$worksCurrentA = $worksCurrent.find("a"),
			$allWorks = $(".works-list > li"),
			$filteredWorks = filter != "works" ? $(".works-list > li").has("[href*= '" + filter + "']") : $(".works-list > li");

			if (filter != $worksCurrentA.attr("href").slice(1)) {
				$newCurrentSpan.attr("style", "");
				$worksCurrentSpan.attr("style", "");
				if ($newCurrent[0].offsetParent) {
					$worksCurrentSpan.animate({
						"left" : $newCurrent[0].offsetLeft - $worksCurrent[0].offsetLeft,
						"top" : $newCurrent[0].offsetTop - $worksCurrent[0].offsetTop,
						"width" : $newCurrentSpan.css("width")
					}, time/3, "easeOutCirc");
				}
				setTimeout(function() {
					$worksCurrent.removeClass("current");
					$newCurrent.addClass("current");
				}, time/3);
			}

			/* Прячутся все работы и вылезают нужные */
			var i = 0, k = 0;
			(function() {
				if ((i < $allWorks.length)/* && $(".works-block").hasClass("current")*/) {
					if ($(".works-block").hasClass("current")) {
						$allWorks.eq(i).animate({"left" : "100%", "right" : "100%"}, time/12, "easeOutCirc");
						i++;
						setTimeout(function() {
							i != $allWorks.length ? "" : $allWorks.hide();
						}, time/24);
						if (i < 4) {
							setTimeout(arguments.callee, time/12);
						} else {
							setTimeout(arguments.callee, time/24);
						}
					} else if (i == 0) {
						$allWorks.css({"left" : "100%", "right" : "100%"})
							.hide();
						i = $allWorks.length;
						setTimeout(arguments.callee, time/3);
					}
				} else if (k < $filteredWorks.length) {
					$filteredWorks.eq(k).show()
						.animate({"left" : "0", "right" : "0"}, time/3, "easeOutCirc")
						.find(".work-link").attr("href", "#" + filter + "/" + $filteredWorks.eq(k).attr("id"));
					k++;
					if ((k == 1) && (!workFilter)) {
						$extraBlock.animate({"scrollTop" : "0"}, time, "easeInOutQuart");
					}
					if (k < 4) {
						setTimeout(arguments.callee, time/6);
					} else {
						setTimeout(arguments.callee, time/30);
					}
					if (k == $filteredWorks.length && workFilter) {
						$(".extra-block > div.current").scrollTo($("#" + workFilter), time, {axis: "y", easing: "easeOutCirc"});
					}
				}
			})();
		}

		var activateButtonsTime = extra == "works" ? $allWorks.length * (time/24) + time/12 : time;

		hideOldExtra = setTimeout(function() {
			$notExtra.css({"left" : "100%", "right" : "-100%", "display" : "none"});
			window.location.hash = filter;
			setTimeout(function() {
				extraClick();
			}, 4);
		}, activateButtonsTime);

		/* ... а все остальное — если мы кликаем по кнопке, которая точно сменит весь правый блок */
		if ($(".extra-block > div.current")[0] != $extraBlock[0]) {

			/* Запускаем анимацию чисел, если надо */
			if (filter == "me" && !meNotFirst) {
				var start = 0, final;
				meNotFirst = true;
				$("#age").text(birthDateToAge(myBirthDay));
				$(".alive-number-hold").each(function(i, el) {
					$(el).text($.cookie($(el).attr("id")));
				});
				$(".alive-number").each(function(i, el) {
					if ($(el).hasClass("alive-number-plus")) {
						start = +$(el).text().split(" ").join("");
						final = start + 2;
					} else {
						final = +$(el).text();
					};
					aliveNumber($(el), start, final);
				});
			}

			/* Запускаем смену фотки */
			changeStar(filter);

			/* Меняем правый блок, двигаем маркер */
			$notExtra.css({"z-index" : "1"});
			$extraBlock.addClass("current").css({"z-index" : "2", "display" : "block"})
				//.scrollTop($extraBlock.height())  // Здесь и ниже закомментирован автоскрол экстраблока вверх. Это было эффектно, но тормознуто
				.animate({/*"scrollTop" : "0",*/ "left" : "0", "right" : "0"}, time, "easeInOutQuart")
				.find("h2").css({"margin-left" : "100%"})
					.animate({"margin-left" : "0"}, time*1.2, "easeInOutQuart");
			$notExtra.removeClass("current");

			if ($(".menu-block li.current").length) {
				if (typeof shiftMenuMarker !== "undefined"){
					clearTimeout(shiftMenuMarker);
				}

				shiftTop = $(".menu-block li a[href='#" + extra + "']").parent("li").offset().top - $(".menu-block li.current").offset().top;
				shiftLeft = $(".menu-block li a[href='#" + extra + "']").parent("li").offset().left - $(".menu-block li.current").offset().left;
				$(".menu-block li.current").find("span").animate({"margin-top" : shiftTop + "px", "margin-left" : shiftLeft + "px"}, time, "easeOutCirc");

				shiftMenuMarker = setTimeout(function() {
					$(".menu-block li a[href='#" + extra + "']").parent("li").addClass("current");
					$(".menu-block li a:not([href='#" + extra + "'])").parent("li").removeClass("current");
					$(".menu-block li span").css({"margin-top" : "0px", "margin-left" : "0px"});
				}, time);
			} else {
				$(".menu-block li a[href='#" + extra + "']").parent("li").addClass("current");
				$(".menu-block li span").animate({"width" : "5px"}, time/4);
			}
		}
	}
};