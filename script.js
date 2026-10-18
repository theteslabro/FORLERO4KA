// Отключаем автоматическое восстановление позиции скролла браузером при обновлении
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

document.addEventListener("DOMContentLoaded", () => {
    // Принудительно скроллим на самый верх при загрузке страницы
    window.scrollTo(0, 0);

    // ==================================================================== //
    // 1. Анимации при скролле (Наблюдатель Intersection Observer)
    // ==================================================================== //
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4 // Чуть уменьшил порог для телефонов, чтобы срабатывало надежнее
    };

    const heartWrapper = document.getElementById('unfolding-heart');
    const hugScene = document.getElementById('hug-scene');
    const hugSceneM3 = document.getElementById('hug-scene-m3');

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                if (entry.target.id === 'unfolding-heart') {
                    entry.target.classList.add('open');
                }
                if (entry.target.id === 'hug-scene' || entry.target.id === 'hug-scene-m3') {
                    entry.target.classList.add('hugging');
                }
            } else {
                if (entry.target.id === 'unfolding-heart') {
                    entry.target.classList.remove('open');
                }
                if (entry.target.id === 'hug-scene' || entry.target.id === 'hug-scene-m3') {
                    entry.target.classList.remove('hugging');
                }
            }
        });
    }, observerOptions);

    if (heartWrapper) observer.observe(heartWrapper);
    if (hugScene) observer.observe(hugScene);
    if (hugSceneM3) observer.observe(hugSceneM3);


    // ==================================================================== //
    // 2. Интерактивные карточки-причины (Клик для переворота)
    // ==================================================================== //
    const cards = document.querySelectorAll('.reason-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('flipped');
        });
    });

    // ==================================================================== //
    // 2.5. ИНТЕРАКТИВНЫЙ КОНВЕРТ (Открытие по клику)
    // ==================================================================== //
    const envelopeWrapper = document.getElementById('envelope-wrapper');
    if (envelopeWrapper) {
        envelopeWrapper.addEventListener('click', () => {
            // Переключает класс .is-open, который запускает CSS-анимацию выезда письма
            envelopeWrapper.classList.toggle('is-open');
        });
    }

    // ==================================================================== //
    // 3. Фон из летающих сердечек (Canvas)
    // ==================================================================== //
    const canvas = document.getElementById('particles-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particlesArray = [];

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        });

        class HeartParticle {
            constructor() {
                this.x = Math.random() * canvas.width;
                this.y = Math.random() * canvas.height;
                this.size = Math.random() * 8 + 8; // Сделал сердечки чуть меньше для аккуратности
                this.speedX = Math.random() * 1 - 0.5;
                this.speedY = Math.random() * 1 - 0.5;
                this.color = Math.random() > 0.5 ? 'rgba(255, 107, 139, 0.4)' : 'rgba(255, 182, 193, 0.6)';
            }
            update() {
                this.x += this.speedX;
                this.y += this.speedY;
                if (this.x < 0 || this.x > canvas.width) this.speedX *= -1;
                if (this.y < 0 || this.y > canvas.height) this.speedY *= -1;
            }
            draw() {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                let topCurveHeight = this.size * 0.3;
                ctx.moveTo(this.x, this.y + topCurveHeight);
                ctx.bezierCurveTo(this.x, this.y, this.x - this.size / 2, this.y, this.x - this.size / 2, this.y + topCurveHeight);
                ctx.bezierCurveTo(this.x - this.size / 2, this.y + this.size / 2, this.x, this.y + this.size * 0.8, this.x, this.y + this.size);
                ctx.bezierCurveTo(this.x, this.y + this.size * 0.8, this.x + this.size / 2, this.y + this.size / 2, this.x + this.size / 2, this.y + topCurveHeight);
                ctx.bezierCurveTo(this.x + this.size / 2, this.y, this.x, this.y, this.x, this.y + topCurveHeight);
                ctx.closePath();
                ctx.fill();
            }
        }

        function initParticles() {
            particlesArray = [];
            // Сокращаем плотность на мобилках для лучшей производительности
            const densityBase = window.innerWidth < 768 ? 25000 : 20000;
            const numberOfParticles = Math.floor((canvas.width * canvas.height) / densityBase);
            for (let i = 0; i < numberOfParticles; i++) {
                particlesArray.push(new HeartParticle());
            }
        }

        function animateParticles() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            for (let i = 0; i < particlesArray.length; i++) {
                particlesArray[i].update();
                particlesArray[i].draw();
            }
            requestAnimationFrame(animateParticles);
        }

        initParticles();
        animateParticles();
    }

    // ==================================================================== //
    // 4. Тумблер Темной / Светлой Темы
    // ==================================================================== //
    const themeBtn = document.getElementById('theme-toggle');
    const body = document.body;

    const sunSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
    const moonSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="theme-icon"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`;

    themeBtn.addEventListener('click', () => {
        body.classList.toggle('light-theme');
        if (body.classList.contains('light-theme')) {
            themeBtn.innerHTML = moonSVG;
        } else {
            themeBtn.innerHTML = sunSVG;
        }
    });

    // ==================================================================== //
    // 5. ИНТЕРАКТИВНАЯ РОМАШКА С КУЛАКОМ
    // ==================================================================== //
    const daisyContainer = document.getElementById('daisy-container');
    const daisyResult = document.getElementById('daisy-result');
    const fistAnimation = document.getElementById('fist-animation');

    // Подготовим SVG иконки для текста
    const heartSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--acc-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em; vertical-align: middle;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
    const smileSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em; vertical-align: middle;"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
    const sadSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em; vertical-align: middle;"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;

    if (daisyContainer) {
        const petalCount = 14;
        const angleStep = 360 / petalCount;
        let petalsLeft = petalCount;
        let isFistAnimating = false;

        let nextLoves = Math.random() > 0.5;

        for (let i = 0; i < petalCount; i++) {
            const p = document.createElement('div');
            p.classList.add('petal');
            p.style.transform = `rotate(${i * angleStep}deg)`;
            daisyContainer.appendChild(p);

            p.addEventListener('click', () => {
                if (isFistAnimating || p.classList.contains('fallen')) return;

                p.style.transform = `rotate(${i * angleStep}deg) translateY(-140px) scale(0.6) rotate(60deg)`;
                p.style.opacity = '0';
                p.classList.add('fallen');
                petalsLeft--;

                let loves = nextLoves;
                nextLoves = !nextLoves;

                if (loves) {
                    daisyResult.innerHTML = `<span>Любит! ${smileSVG}</span>`;

                    if (petalsLeft === 0) {
                        setTimeout(() => {
                            daisyResult.innerHTML = `<span>Моя любовь безусловна! ${heartSVG}</span>`;
                        }, 2500);
                    }
                } else {
                    if (petalsLeft === 0) {
                        isFistAnimating = true;
                        daisyResult.innerHTML = `<span class="not-word">Не&nbsp;</span><span class="loves-text">любит ${sadSVG}</span>`;

                        setTimeout(() => {
                            fistAnimation.classList.add('fist-punch');

                            setTimeout(() => {
                                const notWord = document.querySelector('.not-word');
                                if (notWord) notWord.classList.add('shattered');

                                const lovesText = document.querySelector('.loves-text');
                                if (lovesText) lovesText.innerHTML = `любит! ${smileSVG} <br><span style="font-size:1.2rem; opacity:0.8; display:block;">(а вариантов нет!)</span>`;

                                setTimeout(() => {
                                    fistAnimation.classList.remove('fist-punch');
                                    isFistAnimating = false;

                                    setTimeout(() => {
                                        daisyResult.innerHTML = `<span>Моя любовь безусловна! ${heartSVG}</span>`;
                                    }, 2500);
                                }, 800);

                            }, 250);
                        }, 500);
                    } else {
                        daisyResult.innerHTML = `<span>Не любит ${sadSVG}</span>`;
                    }
                }
            });
        }
    }

    // ==================================================================== //
    // 6. ИНТЕРАКТИВНАЯ МИНИ-ИГРА (КЛИКЕР-СЕРДЕЧКО)
    // ==================================================================== //
    const pinata = document.getElementById('love-pinata');
    const pinataCounter = document.getElementById('pinata-counter');
    const pinataResult = document.getElementById('pinata-result');
    const pinataContainer = document.getElementById('pinata-container');

    let clicks = 0;
    const maxClicks = 20;
    let hasExploded = false;

    if (pinata) {
        const starSVG = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 1em; height: 1em; vertical-align: middle;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

        pinata.addEventListener('click', (e) => {
            if (hasExploded) return;

            clicks++;

            pinata.classList.add('pop');
            setTimeout(() => pinata.classList.remove('pop'), 50);

            let scale = 1 + (clicks * 0.05);
            let percent = Math.floor((clicks / maxClicks) * 100);

            pinataCounter.textContent = percent + '%';
            pinata.style.transform = `scale(${scale})`;

            if (clicks >= maxClicks) {
                hasExploded = true;
                pinataCounter.textContent = '∞%';
                pinataResult.innerHTML = `Моя любовь к тебе бесконечна! ${starSVG} ${heartSVG}`;
                // Меняем центральное сердце на закрашенное
                pinata.innerHTML = `<svg viewBox="0 0 24 24" fill="var(--acc-color)" stroke="none" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width: 120px; height: 120px; filter: drop-shadow(0 0 25px rgba(255, 107, 139, 0.8));"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

                for (let i = 0; i < 30; i++) {
                    createMiniHeart();
                }

                pinata.style.transform = 'scale(1.2)';
            }
        });

        function createMiniHeart() {
            const heart = document.createElement('div');
            heart.classList.add('mini-heart');
            // Вставляем случайное SVG
            const icons = [heartSVG, smileSVG, starSVG];
            heart.innerHTML = icons[Math.floor(Math.random() * icons.length)];

            const angle = Math.random() * Math.PI * 2;
            const velocity = 100 + Math.random() * 200;
            const tx = Math.cos(angle) * velocity;
            const ty = Math.sin(angle) * velocity;
            const rot = Math.random() * 360;

            heart.style.setProperty('--tx', `${tx}px`);
            heart.style.setProperty('--ty', `${ty}px`);
            heart.style.setProperty('--rot', `${rot}deg`);

            heart.style.animation = `explodeHeart ${0.6 + Math.random() * 0.5}s ease-out forwards`;

            pinataContainer.appendChild(heart);

            setTimeout(() => {
                heart.remove();
            }, 1200);
        }
    }

    // Twemoji удален по просьбе пользователя (теперь используются SVG)

    // ==================================================================== //
    // 8. SPA НАВИГАЦИЯ (ПЕРЕКЛЮЧЕНИЕ МЕСЯЦЕВ)
    // ==================================================================== //
    const navLeft = document.getElementById('nav-left');
    const navRight = document.getElementById('nav-right');
    const month1View = document.getElementById('month1-view');
    const month2View = document.getElementById('month2-view');
    const month3View = document.getElementById('month3-view');
    const month4View = document.getElementById('month4-view');
    const month5View = document.getElementById('month5-view');
    const month6View = document.getElementById('month6-view');
    const month7View = document.getElementById('month7-view');
    const monthPickerOverlay = document.getElementById('month-picker-overlay');
    const monthPickerClose = document.getElementById('month-picker-close');
    const monthPickerCards = document.querySelectorAll('.month-picker-card');

    const totalMonths = 7;
    let currentMonth = 1;

    function setNavArrowVisibility(toMonth) {
        if (navLeft) navLeft.classList.remove('nav-hidden');
        if (navRight) navRight.classList.remove('nav-hidden');
        monthPickerCards.forEach(card => {
            card.classList.toggle('is-active', Number(card.dataset.month) === toMonth);
        });
    }

    setNavArrowVisibility(currentMonth);

    function openMonthPicker(origin = 'right') {
        if (!monthPickerOverlay) return;
        monthPickerOverlay.classList.toggle('from-left', origin === 'left');
        monthPickerOverlay.classList.toggle('from-right', origin !== 'left');
        monthPickerOverlay.classList.add('is-open');
        monthPickerOverlay.setAttribute('aria-hidden', 'false');
        document.body.classList.add('month-picker-open');
    }

    function closeMonthPicker() {
        if (!monthPickerOverlay) return;
        monthPickerOverlay.classList.remove('is-open');
        monthPickerOverlay.setAttribute('aria-hidden', 'true');
        document.body.classList.remove('month-picker-open');
    }

    function switchMonth(toMonth) {
        if (currentMonth === toMonth) {
            closeMonthPicker();
            return;
        }

        window.scrollTo({ top: 0, behavior: 'smooth' });
        closeMonthPicker();

        setTimeout(() => {
            const views = [month1View, month2View, month3View, month4View, month5View, month6View, month7View];
            views.forEach(v => { if (v) v.classList.remove('active', 'exit-left', 'exit-right'); });

            const direction = currentMonth < toMonth ? 'exit-left' : 'exit-right';
            const prevView = views[currentMonth - 1];
            if (prevView) prevView.classList.add(direction);

            const nextView = views[toMonth - 1];
            if (nextView) nextView.classList.add('active');

            setNavArrowVisibility(toMonth);

            currentMonth = toMonth;

            const monthTitles = {
                1: '1 месяц котя 💕',
                2: '2 месяца котя 💕',
                3: '3 месяца котя 💕',
                4: '4 месяца котя 💕',
                5: '5 месяцев котя 💕',
                6: 'С полугодием, любимая! 💕',
                7: '7 месяцев любви 💕'
            };
            if (monthTitles[toMonth]) {
                document.title = monthTitles[toMonth];
            }

            // Инициализация месяцев при первом переходе
            if (toMonth === 4) initMonth4();
            if (toMonth === 5) initMonth5();
            if (toMonth === 6) initMonth6();
            if (toMonth === 7) initMonth7();
        }, 150);
    }

    if (navRight) navRight.addEventListener('click', () => {
        openMonthPicker('right');
    });
    if (navLeft) navLeft.addEventListener('click', () => {
        openMonthPicker('left');
    });

    monthPickerCards.forEach(card => {
        card.addEventListener('click', () => {
            const toMonth = Number(card.dataset.month);
            if (toMonth >= 1 && toMonth <= totalMonths) switchMonth(toMonth);
        });
    });

    if (monthPickerClose) monthPickerClose.addEventListener('click', closeMonthPicker);
    if (monthPickerOverlay) {
        monthPickerOverlay.addEventListener('click', (event) => {
            if (event.target === monthPickerOverlay) closeMonthPicker();
        });
    }

    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') closeMonthPicker();
    });

    // ==================================================================== //
    // 9. МОДУЛЬ ТЕСТА (QUIZ)
    // ==================================================================== //
    const quizData = [
        {
            question: "Какой мой любимый цвет?",
            options: [
                "Арбузный сок",
                "Цвет твоих глаз",
                "Шлакоблочный",
                "Запах асфальта после дождя"
            ],
            correct: 1
        },
        {
            question: "Какая моя любимая игра?",
            options: [
                "Прятки с дедлайнами",
                "Dota 2",
                "Перекати-поле",
                "Кидать пельмени в вентилятор"
            ],
            correct: 1
        },
        {
            question: "Что я выберу на идеальном свидании?",
            options: [
                "Украсть трактор и уехать в закат",
                "Считать голубей",
                "Съесть ведро майонеза",
                "Построить шалаш из одеял с тобой"
            ],
            correct: 3
        },
        {
            question: "Что меня растраивает больше всего?",
            options: [
                "Когда ты грустишь",
                "Теплый унитаз",
                "Когда чайник слишком долго кипит",
                "Лысые кошки"
            ],
            correct: 0
        },
        {
            question: "Кто я для тебя?",
            options: [
                "Человек-паук",
                "Внеземной разум",
                "Твой котик",
                "Арбуз"
            ],
            correct: 2
        }
    ];

    const quizQuestionBox = document.getElementById('quiz-question-box');
    const quizQuestion = document.getElementById('quiz-question');
    const quizOptions = document.getElementById('quiz-options');
    const quizResult = document.getElementById('quiz-result');
    const quizNextBtn = document.getElementById('quiz-next-btn');
    const quizFinal = document.getElementById('quiz-final');

    let currentQuizIndex = 0;

    if (quizQuestionBox) {
        function loadQuestion() {
            const q = quizData[currentQuizIndex];
            quizQuestion.textContent = `${currentQuizIndex + 1}. ${q.question}`;
            quizOptions.innerHTML = '';
            quizResult.style.display = 'none';
            quizNextBtn.style.display = 'none';

            q.options.forEach((opt, index) => {
                const btn = document.createElement('button');
                btn.className = 'quiz-option';
                btn.textContent = opt;
                btn.addEventListener('click', () => selectAnswer(btn, index, q.correct));
                quizOptions.appendChild(btn);
            });
        }

        function selectAnswer(btn, selectedIndex, correctIndex) {
            // Блокируем повторные нажатия, если кнопка "Дальше" уже появилась
            if (quizNextBtn.style.display === 'block') return;

            const optionsBtns = quizOptions.querySelectorAll('.quiz-option');

            if (selectedIndex === correctIndex) {
                btn.classList.add('correct');
                quizResult.innerHTML = `Угадала, моя умничка! ${smileSVG}`;
            } else {
                btn.classList.add('wrong');
                // Подсвечиваем правильный (или 그냥 оставляем так, как будто ее ответ и есть правильный)
                // optionsBtns[correctIndex].classList.add('correct');
                btn.classList.add('correct'); // Трюк: подсвечиваем ее ответ как правильный
                quizResult.innerHTML = `Не угадала, но любимая всегда права, так что ответ правильный! ${heartSVG}`;
            }

            quizResult.style.display = 'block';
            quizNextBtn.style.display = 'block';
        }

        quizNextBtn.addEventListener('click', () => {
            currentQuizIndex++;
            if (currentQuizIndex < quizData.length) {
                loadQuestion();
            } else {
                quizQuestionBox.style.display = 'none';
                quizFinal.style.display = 'block';
            }
        });

        // Запуск первого вопроса
        loadQuestion();
    }

    // ==================================================================== //
    // 10. МОДУЛЬ КОСМОС (ПЛАНЕТЫ И СУПЕРНОВА)
    // ==================================================================== //
    const spaceContainer = document.getElementById('space-container');
    const planetMe = document.getElementById('planet-me');
    const planetYou = document.getElementById('planet-you');
    const flashOverlay = document.getElementById('flash-overlay');
    const supernovaContainer = document.getElementById('supernova-container');

    if (spaceContainer && planetMe && planetYou) {
        let distance = 40;
        let hasCollided = false;

        planetMe.style.left = '10%';
        planetYou.style.right = '10%';

        spaceContainer.addEventListener('click', () => {
            if (hasCollided) return;

            distance -= 2;
            if (distance < 0) distance = 0;

            let currentPos = 10 + (40 - distance);

            planetMe.style.left = `${currentPos}%`;
            planetYou.style.right = `${currentPos}%`;

            if (distance === 0 && !hasCollided) {
                hasCollided = true;

                // 1. Включаем белую вспышку
                flashOverlay.classList.add('flash');

                // 2. Прячем планеты
                setTimeout(() => {
                    planetMe.style.display = 'none';
                    planetYou.style.display = 'none';

                    // Показываем супернову под белым экраном
                    supernovaContainer.classList.add('active');

                    const hint = spaceContainer.querySelector('.space-hint');
                    if (hint) hint.style.display = 'none';
                }, 1500);

                // 3. Убираем вспышку через 3 секунды
                setTimeout(() => {
                    flashOverlay.classList.remove('flash');
                }, 3000);
            }
        });
    }

    // ==================================================================== //
    // 11. СЛАЙДЕР КАРТОЧЕК ЛЮБВИ
    // ==================================================================== //
    const loveCards = document.querySelectorAll('.cards-wrapper .love-card');
    const prevCardBtn = document.getElementById('prev-card-btn');
    const nextCardBtn = document.getElementById('next-card-btn');
    let currentLoveCard = 0;

    if (loveCards.length > 0 && prevCardBtn && nextCardBtn) {
        function showLoveCard(index) {
            loveCards.forEach(card => card.classList.remove('active'));
            loveCards[index].classList.add('active');
        }

        prevCardBtn.addEventListener('click', () => {
            currentLoveCard--;
            if (currentLoveCard < 0) currentLoveCard = loveCards.length - 1;
            showLoveCard(currentLoveCard);
        });

        nextCardBtn.addEventListener('click', () => {
            currentLoveCard++;
            if (currentLoveCard >= loveCards.length) currentLoveCard = 0;
            showLoveCard(currentLoveCard);
        });
    }

    // ==================================================================== //
    // 12. МОДУЛЬ "ЕСЛИ ГРУСТНО"
    // ==================================================================== //
    const sadBtn = document.getElementById('sad-btn');
    const sadMessageContainer = document.getElementById('sad-message-container');

    if (sadBtn && sadMessageContainer) {
        const svgHeart = `<svg viewBox="0 0 24 24" fill="var(--acc-color)" stroke="none" style="width:1.2em; height:1.2em; vertical-align:middle; margin-left:5px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
        const svgSun = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--acc-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.2em; height:1.2em; vertical-align:middle; margin-left:5px;"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>`;
        const svgSmile = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.2em; height:1.2em; vertical-align:middle; margin-left:5px; color:var(--acc-color);"><circle cx="12" cy="12" r="10"/><path d="M8 14s1.5 2 4 2 4-2 4-2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;
        const svgSparkle = `<svg viewBox="0 0 24 24" fill="none" stroke="var(--acc-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.2em; height:1.2em; vertical-align:middle; margin-left:5px;"><path d="M12 2l3 7 7 3-7 3-3 7-3-7-7-3 7-3z"/></svg>`;

        const sadMessages = [
            `Эй... ну ты чего? Улыбнись, пожалуйста! Ты самое дорогое, что у меня есть. ${svgHeart}`,
            `Даже когда небо затянуто тучами, помни: над ними всегда светит солнце. И ты — мое солнце! ${svgSun}`,
            `Я всегда рядом, даже если мы не держимся за руки прямо сейчас. Я крепко-крепко тебя обнимаю! ${svgSmile}`,
            `Грусть — это временно. А моя любовь к тебе — навсегда! ${svgSparkle}`,
            `Закрой глаза, сделай глубокий вдох... Представь, что я целую тебя в носик. Легче? ${svgHeart}`,
            `Всё будет хорошо, котя. Мы со всем справимся вместе. Я в тебя верю! ${svgSparkle}`,
            `Если бы я мог, я бы забрал всю твою грусть себе, чтобы ты только радовалась! ${svgSmile}`
        ];

        let lastIndex = -1;

        sadBtn.addEventListener('click', () => {
            sadBtn.style.transform = 'scale(0.9)';
            setTimeout(() => sadBtn.style.transform = '', 150);

            let existingCard = sadMessageContainer.querySelector('.sad-message-card');
            if (existingCard) {
                existingCard.classList.remove('show');
                existingCard.style.transform = 'rotateX(-40deg) translateY(-30px) scale(0.8)';
                setTimeout(() => {
                    sadMessageContainer.innerHTML = '';
                    createNewMessage();
                }, 400);
            } else {
                createNewMessage();
            }

            function createNewMessage() {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * sadMessages.length);
                } while (randomIndex === lastIndex);
                lastIndex = randomIndex;

                const card = document.createElement('div');
                card.className = 'sad-message-card glass-panel';
                card.innerHTML = sadMessages[randomIndex];

                sadMessageContainer.appendChild(card);

                // Триггерим анимацию
                setTimeout(() => {
                    card.classList.add('show');
                }, 50);
            }
        });
    }

    // ==================================================================== //
    // 13. МОДУЛЬ "ХОЧУ ИЗВИНИТЬСЯ"
    // ==================================================================== //
    const sorryBtn = document.getElementById('sorry-btn');
    const sorryMessageContainer = document.getElementById('sorry-message-container');

    if (sorryBtn && sorryMessageContainer) {
        const svgSadFace = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:1.2em; height:1.2em; vertical-align:middle; margin-left:5px; color:var(--acc-color);"><circle cx="12" cy="12" r="10"/><path d="M16 16s-1.5-2-4-2-4 2-4 2"/><line x1="9" y1="9" x2="9.01" y2="9"/><line x1="15" y1="9" x2="15.01" y2="9"/></svg>`;

        const sorryMessages = [
            `...за то, что доводил тебя до слез. Прости меня, пожалуйста ${svgSadFace}`,
            `...за то, что заставлял тебя грустить. Я не хотел ${svgSadFace}`,
            `...за то, что все тебе порчу. Ты заслуживаешь лучшего ${svgSadFace}`,
            `...за то, что напоминаю про "сученыш". Прости дурака ${svgSadFace}`
        ];

        let lastSorryIndex = -1;

        sorryBtn.addEventListener('click', () => {
            sorryBtn.style.transform = 'scale(0.9)';
            setTimeout(() => sorryBtn.style.transform = '', 150);

            let existingCard = sorryMessageContainer.querySelector('.sad-message-card');
            if (existingCard) {
                existingCard.classList.remove('show');
                existingCard.style.transform = 'rotateX(-40deg) translateY(-30px) scale(0.8)';
                setTimeout(() => {
                    sorryMessageContainer.innerHTML = '';
                    createSorryMessage();
                }, 400);
            } else {
                createSorryMessage();
            }

            function createSorryMessage() {
                let randomIndex;
                do {
                    randomIndex = Math.floor(Math.random() * sorryMessages.length);
                } while (randomIndex === lastSorryIndex);
                lastSorryIndex = randomIndex;

                const card = document.createElement('div');
                card.className = 'sad-message-card glass-panel';
                card.innerHTML = sorryMessages[randomIndex];

                sorryMessageContainer.appendChild(card);

                setTimeout(() => {
                    card.classList.add('show');
                }, 50);
            }
        });
    }

    // ==================================================================== //
    // 14. ТАЙМЕР ОТНОШЕНИЙ
    // ==================================================================== //
    // ⬇️ ДАТА НАЧАЛА ОТНОШЕНИЙ — меняй здесь
    // Формат: 'ГГГГ-ММ-ДД' (год-месяц-день)
    // Например: '2026-03-24' = 24 марта 2026
    function updateLoveTimer() {
        const startDate = new Date('2026-03-24T00:00:00');
        const now = new Date();
        const diff = now - startDate;

        if (diff < 0) return; // на случай если дата ещё не наступила

        const totalSeconds = Math.floor(diff / 1000);
        const seconds = totalSeconds % 60;
        const totalMinutes = Math.floor(totalSeconds / 60);
        const minutes = totalMinutes % 60;
        const totalHours = Math.floor(totalMinutes / 60);
        const hours = totalHours % 24;
        const days = Math.floor(totalHours / 24);

        const pad = (n) => String(n).padStart(2, '0');

        const dEl = document.getElementById('timer-days');
        const hEl = document.getElementById('timer-hours');
        const mEl = document.getElementById('timer-minutes');
        const sEl = document.getElementById('timer-seconds');

        if (dEl) dEl.textContent = days;
        if (hEl) hEl.textContent = pad(hours);
        if (mEl) mEl.textContent = pad(minutes);
        if (sEl) sEl.textContent = pad(seconds);
    }

    updateLoveTimer();
    setInterval(updateLoveTimer, 1000);

    // ==================================================================== //
    // 15. ИНТЕРАКТИВНЫЙ СВИТОК (ПИСЬМО С ПЕЧАТЬЮ)
    // ==================================================================== //
    const scrollSeal = document.getElementById('scroll-seal');
    const scrollBody = document.getElementById('scroll-body');
    const scrollContent = document.getElementById('scroll-content');

    if (scrollSeal && scrollBody) {
        function openScroll() {
            if (scrollBody.classList.contains('is-open')) return;
            scrollBody.classList.add('is-open');
            scrollSeal.classList.add('seal-broken');

            // Показываем строки письма одну за другой с задержкой
            const lines = scrollContent.querySelectorAll('.scroll-line, .scroll-divider, .scroll-sig');
            lines.forEach((el, i) => {
                setTimeout(() => {
                    el.classList.add('visible');
                }, 400 + i * 120);
            });
        }

        scrollSeal.addEventListener('click', openScroll);
        // Поддержка клавиатуры (Enter / Space)
        scrollSeal.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') openScroll();
        });
    }

    // ==================================================================== //
    // 16. КРЕСТИКИ-НОЛИКИ ЛЮБВИ (T3 GAME)
    // ==================================================================== //
    const tttBoard = document.getElementById('ttt-board');
    const tttCells = document.querySelectorAll('.ttt-cell');
    const tttStatus = document.getElementById('ttt-status');
    const tttReset = document.getElementById('ttt-reset');

    let tttActive = true;
    let tttState = ["", "", "", "", "", "", "", "", ""]; // "" or "X" (player) or "O" (computer)
    const winConditions = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Cols
        [0, 4, 8], [2, 4, 6]             // Diagonals
    ];

    if (tttBoard && tttCells.length > 0) {
        function checkTTTWinner() {
            let win = null;
            winConditions.forEach(cond => {
                if (tttState[cond[0]] && tttState[cond[0]] === tttState[cond[1]] && tttState[cond[0]] === tttState[cond[2]]) {
                    win = tttState[cond[0]];
                }
            });
            if (win) return win;
            if (!tttState.includes("")) return "Draw";
            return null;
        }

        function computerMove() {
            if (!tttActive) return;

            // 1. Попробовать выиграть
            for (let i = 0; i < 9; i++) {
                if (tttState[i] === "") {
                    tttState[i] = "O";
                    if (checkTTTWinner() === "O") {
                        makeComputerMove(i);
                        return;
                    }
                    tttState[i] = "";
                }
            }

            // 2. Заблокировать выигрыш игрока
            for (let i = 0; i < 9; i++) {
                if (tttState[i] === "") {
                    tttState[i] = "X";
                    if (checkTTTWinner() === "X") {
                        tttState[i] = "O";
                        makeComputerMove(i);
                        return;
                    }
                    tttState[i] = "";
                }
            }

            // 3. Занять центр
            if (tttState[4] === "") {
                tttState[4] = "O";
                makeComputerMove(4);
                return;
            }

            // 4. Занять случайный угол или сторону
            const emptyIndices = [];
            tttState.forEach((val, idx) => {
                if (val === "") emptyIndices.push(idx);
            });
            if (emptyIndices.length > 0) {
                const randomIdx = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
                tttState[randomIdx] = "O";
                makeComputerMove(randomIdx);
            }
        }

        const flowerSVG = `<svg class="svg-emoji bloom" viewBox="0 0 24 24" width="1.2em" height="1.2em" style="vertical-align: middle; display: inline-block; color: var(--acc-color); filter: drop-shadow(0 0 4px rgba(255,107,139,0.25));">
            <circle cx="12" cy="6" r="2.8" fill="currentColor" />
            <circle cx="12" cy="18" r="2.8" fill="currentColor" />
            <circle cx="6" cy="12" r="2.8" fill="currentColor" />
            <circle cx="18" cy="12" r="2.8" fill="currentColor" />
            <circle cx="7.5" cy="7.5" r="2.5" fill="currentColor" />
            <circle cx="16.5" cy="7.5" r="2.5" fill="currentColor" />
            <circle cx="7.5" cy="16.5" r="2.5" fill="currentColor" />
            <circle cx="16.5" cy="16.5" r="2.5" fill="currentColor" />
            <circle cx="12" cy="12" r="3.5" fill="#ffe066" />
        </svg>`;
        const heartSVG = `<svg class="svg-emoji" viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="var(--acc-color)" style="vertical-align: middle; display: inline-block; filter: drop-shadow(0 0 3px rgba(255,107,139,0.5));"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;

        function makeComputerMove(index) {
            const cell = tttCells[index];
            cell.innerHTML = heartSVG;

            const result = checkTTTWinner();
            if (result) {
                endTTTGame(result);
            } else {
                tttStatus.textContent = "Твой ход! Выбери ячейку.";
            }
        }

        function endTTTGame(result) {
            tttActive = false;
            tttReset.style.display = "block";
            if (result === "X") {
                tttStatus.innerHTML = `Ты победила! Но моя любовь к тебе всё равно побеждает! ${flowerSVG} ${heartSVG}`;
            } else if (result === "O") {
                tttStatus.innerHTML = `Я выиграл! Но в любви проигравших нет — держи обнимашку! ${heartSVG}`;
            } else {
                tttStatus.innerHTML = `Ничья! Наша любовь абсолютно равна и бесконечна! ${flowerSVG} ${heartSVG}`;
            }
        }

        function handleCellClick(e) {
            // Ищем ячейку, даже если кликнули по вложенному SVG
            const cell = e.target.closest('.ttt-cell');
            if (!cell) return;
            const index = parseInt(cell.getAttribute('data-index'));

            if (tttState[index] !== "" || !tttActive) return;

            tttState[index] = "X";
            cell.innerHTML = flowerSVG;

            const result = checkTTTWinner();
            if (result) {
                endTTTGame(result);
            } else {
                tttStatus.textContent = "Мой ход...";
                setTimeout(computerMove, 600);
            }
        }

        tttCells.forEach(cell => {
            cell.addEventListener('click', handleCellClick);
        });

        tttReset.addEventListener('click', () => {
            tttState = ["", "", "", "", "", "", "", "", ""];
            tttActive = true;
            tttCells.forEach(cell => {
                cell.innerHTML = "";
            });
            tttStatus.textContent = "Твой ход! Выбери ячейку.";
            tttReset.style.display = "none";
        });
    }

    // ==================================================================== //
    // 17. КУПОНЫ ЛЮБВИ (ОБРАБОТЧИК)
    // ==================================================================== //
    window.activateCoupon = function (id) {
        const btn = document.querySelector(`#coupon-${id} .coupon-btn`);
        const code = document.getElementById(`coupon-code-${id}`);
        if (btn && code) {
            btn.style.display = 'none';
            code.style.display = 'block';

            const card = document.getElementById(`coupon-${id}`);
            for (let i = 0; i < 15; i++) {
                createMiniHeartAt(card);
            }
        }
    };

    function createMiniHeartAt(element) {
        const heart = document.createElement('div');
        heart.classList.add('mini-heart');
        heart.innerHTML = `<svg viewBox="0 0 24 24" fill="var(--acc-color)" stroke="none" style="width: 24px; height: 24px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;

        const rect = element.getBoundingClientRect();
        const startX = Math.random() * rect.width;
        const startY = Math.random() * rect.height;

        heart.style.left = `${startX}px`;
        heart.style.top = `${startY}px`;
        heart.style.position = 'absolute';

        const angle = Math.random() * Math.PI * 2;
        const velocity = 40 + Math.random() * 80;
        const tx = Math.cos(angle) * velocity;
        const ty = Math.sin(angle) * velocity;
        const rot = Math.random() * 360;

        heart.style.setProperty('--tx', `${tx}px`);
        heart.style.setProperty('--ty', `${ty}px`);
        heart.style.setProperty('--rot', `${rot}deg`);

        heart.style.animation = `explodeHeart 0.8s ease-out forwards`;

        element.appendChild(heart);

        setTimeout(() => {
            heart.remove();
        }, 800);
    }

    // ==================================================================== //
    // 18. ГЕНЕРАТОР СВИДАНИЙ (ИНТЕРАКТИВ)
    // ==================================================================== //
    const dateIdeas = [
        {
            title: "Вечер кино по видеозвонку",
            desc: "Включаем один и тот же фильм, созваниваемся и смотрим вместе. Заранее готовим попкорн и горячий шоколад. Как будто рядом!",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="#ff7da3" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/><line x1="17" y1="17" x2="22" y2="17"/></svg>`
        },
        {
            title: "Онлайн-готовка на двоих",
            desc: "Выбираем один рецепт, покупаем одинаковые продукты и готовим одновременно по видеосвязи. В конце — совместный ужин через экран!",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="#fcd34d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>`
        },
        {
            title: "Письма-сюрпризы почтой",
            desc: "Отправляем друг другу настоящие бумажные письма с рисунками, стикерами и духами. Милан → Бремен — примерно 3-4 дня! Сюрприз гарантирован.",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
        },
        {
            title: "Совместная игра онлайн",
            desc: "Доту, Stardew Valley, It Takes Two или любую ко-оп игру. Главное — вместе кричать в микрофон и смеяться до слёз!",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="#34d399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><rect x="2" y="6" width="20" height="12" rx="2" ry="2"/><line x1="6" y1="12" x2="10" y2="12"/><line x1="8" y1="10" x2="8" y2="14"/><line x1="15" y1="13" x2="15.01" y2="13"/><line x1="18" y1="11" x2="18.01" y2="11"/></svg>`
        },
        {
            title: "Виртуальное путешествие",
            desc: "Открываем Google Earth VR или просто Maps и вместе гуляем по улицам Парижа, Токио или нашего будущего города. Мечтаем и планируем!",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="#a78bfa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>`
        },
        {
            title: "Засыпаем вместе по звонку",
            desc: "Ложимся спать с включённым звонком, шепчем друг другу приятные слова, рассказываем о своём дне. Последнее, что слышу — твой голос.",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="#f0abfc" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>`
        },
        {
            title: "Обратный отсчёт до встречи",
            desc: "Открываем календарь, ставим дату нашей следующей встречи и каждый день вычёркиваем день. А потом — самые крепкие объятия в мире!",
            icon: `<svg viewBox="0 0 24 24" width="3em" height="3em" fill="none" stroke="var(--acc-color)" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01"/></svg>`
        }
    ];

    const generateBtn = document.getElementById("generate-date-btn");
    const dateDisplay = document.getElementById("date-card-display");
    let lastDateIndex = -1;

    if (generateBtn && dateDisplay) {
        generateBtn.addEventListener("click", () => {
            const inner = dateDisplay.querySelector(".date-card-inner");
            if (inner) {
                inner.classList.add("changing");

                // Эффект нажатия кнопки
                generateBtn.style.transform = "scale(0.95)";
                setTimeout(() => generateBtn.style.transform = "", 150);

                setTimeout(() => {
                    let index;
                    do {
                        index = Math.floor(Math.random() * dateIdeas.length);
                    } while (index === lastDateIndex);
                    lastDateIndex = index;

                    const idea = dateIdeas[index];

                    const iconEl = inner.querySelector(".date-card-icon");
                    const titleEl = inner.querySelector(".date-card-title");
                    const descEl = inner.querySelector(".date-card-desc");

                    if (iconEl) iconEl.innerHTML = idea.icon;
                    if (titleEl) titleEl.textContent = idea.title;
                    if (descEl) descEl.textContent = idea.desc;

                    inner.classList.remove("changing");

                    // Легкий взрыв частичек
                    for (let i = 0; i < 12; i++) {
                        createMiniHeartAt(dateDisplay);
                    }
                }, 300);
            }
        });
    }

    // ==================================================================== //
    // 19. КОЛЬЦО ОБЕЩАНИЯ (ЛОГИКА)
    // ==================================================================== //
    const ringBoxContainer = document.getElementById("ring-box-container");
    const proposalMessage = document.getElementById("proposal-message");
    const btnYes = document.querySelector(".btn-yes");
    const btnAbsolutely = document.querySelector(".btn-absolutely");

    if (ringBoxContainer && proposalMessage) {
        ringBoxContainer.addEventListener("click", () => {
            if (!ringBoxContainer.classList.contains("is-open")) {
                ringBoxContainer.classList.add("is-open");

                // Взрыв сердечек из коробки
                for (let i = 0; i < 25; i++) {
                    setTimeout(() => {
                        createMiniHeartAt(ringBoxContainer);
                    }, i * 30);
                }

                // Показываем сообщение с задержкой
                setTimeout(() => {
                    proposalMessage.classList.add("show");
                    proposalMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }, 800);
            }
        });

        const handleProposalAccept = (btn) => {
            // Анимация кнопки
            btn.style.transform = "scale(0.9)";
            setTimeout(() => btn.style.transform = "", 150);

            // Большой взрыв любви
            for (let i = 0; i < 60; i++) {
                setTimeout(() => {
                    createMiniHeartAt(proposalMessage);
                }, i * 20);
            }

            // Изменяем текст на супер-романтичный
            const title = proposalMessage.querySelector(".proposal-text-title");
            const desc = proposalMessage.querySelector(".proposal-text-desc");
            const question = proposalMessage.querySelector(".proposal-question");
            const buttonsContainer = proposalMessage.querySelector(".proposal-buttons");

            const svgHeartFilled = `<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="var(--acc-color)" stroke="none" style="vertical-align: middle; display: inline-block; filter: drop-shadow(0 0 3px rgba(255,107,139,0.5));"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`;
            const svgRing = `<svg viewBox="0 0 24 24" width="1.2em" height="1.2em" fill="none" stroke="#FFD700" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; display: inline-block;"><circle cx="12" cy="14" r="6"/><path d="M12 2l2 6h-4l2-6z" fill="#B9F2FF" stroke="#FFD700" stroke-width="1"/></svg>`;

            if (title) title.innerHTML = `Ура-а-а! ${svgHeartFilled}`;
            if (desc) desc.innerHTML = `Я самый счастливый человек на свете! Обещаю любить тебя вечно, заботиться о тебе каждую секунду и делать тебя самой счастливой девочкой! ${svgRing}`;
            if (question) question.style.display = "none";
            if (buttonsContainer) {
                buttonsContainer.innerHTML = `<div style="font-size: 1.5rem; color: var(--acc-color); font-weight: bold; margin-top: 1rem; animation: pulse 1.5s infinite;">Будущие Муж & Жена! ${svgHeartFilled} ${svgRing}</div>`;
            }
        };

        if (btnYes) btnYes.addEventListener("click", () => handleProposalAccept(btnYes));
        if (btnAbsolutely) btnAbsolutely.addEventListener("click", () => handleProposalAccept(btnAbsolutely));
    }

    // ==================================================================== //
    // 20. ВИРТУАЛЬНЫЙ УЮТНЫЙ УГОЛОК (COZY ROOM)
    // ==================================================================== //
    const cozyItems = document.querySelectorAll('.cozy-item');
    const cozyMessageBox = document.getElementById('cozy-message-box');

    const cozyMessages = {
        'cozy-fireplace': {
            text: 'Представь: мы сидим вместе у камина, укрытые одним пледом. Я обнимаю тебя, а огонь тихо потрескивает. Тепло... Спокойно... Идеально.',
            icon: `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="#ff5e36" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>`
        },
        'cozy-cat': {
            text: 'Мр-р-р... Наш воображаемый котик свернулся калачиком у тебя на коленках. Он мурчит и напоминает тебе, что ты самая нежная и любимая на свете!',
            icon: `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="#ffb6c1" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><path d="M12 5c.67 0 1.35.09 2 .26 1.78-2 5.03-2.84 6.42-2.26 1.4.58-.42 7-.42 7 .57 1.07 1 2.24 1 3.44C21 17.9 16.97 21 12 21s-9-3.1-9-7.5c0-1.2.43-2.37 1-3.44 0 0-1.82-6.42-.42-7 1.39-.58 4.64.26 6.42 2.26.65-.17 1.33-.26 2-.26z"/></svg>`
        },
        'cozy-window': {
            text: 'Посмотри в окно... Видишь ту самую звезду? Я тоже на неё смотрю прямо сейчас из Милана. Пусть она будет нашей — через 1150 км мы видим одну и ту же.',
            icon: `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="#60a5fa" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`
        },
        'cozy-frame': {
            text: 'Каждый наш скриншот, каждое голосовое — это наша фотография. Скоро у нас будут настоящие совместные фото, и мы повесим их по всей квартире!',
            icon: `<svg viewBox="0 0 24 24" width="1.5em" height="1.5em" fill="none" stroke="#fcd34d" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align: middle; margin-right: 8px;"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>`
        }
    };

    if (cozyItems.length > 0 && cozyMessageBox) {
        cozyItems.forEach(item => {
            item.addEventListener('click', () => {
                const id = item.id;
                const data = cozyMessages[id];
                if (!data) return;

                // Анимация клика
                item.style.transform = 'scale(0.95)';
                setTimeout(() => item.style.transform = '', 200);

                // Обновляем сообщение
                cozyMessageBox.style.opacity = '0';
                cozyMessageBox.style.transform = 'translateY(10px)';

                setTimeout(() => {
                    cozyMessageBox.innerHTML = `<p>${data.icon} ${data.text}</p>`;
                    cozyMessageBox.style.transition = 'all 0.5s ease';
                    cozyMessageBox.style.opacity = '1';
                    cozyMessageBox.style.transform = 'translateY(0)';

                    // Сердечки
                    for (let i = 0; i < 8; i++) {
                        createMiniHeartAt(item);
                    }
                }, 250);

                // Подсветка активного
                cozyItems.forEach(ci => ci.classList.remove('cozy-active'));
                item.classList.add('cozy-active');
            });
        });
    }

    // ==================================================================== //
    // 21. КНОПКА ОТПРАВКИ ЛЮБВИ (SEND LOVE)
    // ==================================================================== //
    const sendLoveBtn = document.getElementById('send-love-btn');
    const sendLoveStatus = document.getElementById('send-love-status');

    const loveResponses = [
        'Обнимашка получена! Крепко-крепко обнимаю в ответ!',
        'Чувствую твоё тепло даже через 1150 км!',
        'Моё сердце забилось быстрее! Люблю тебя!',
        'Получил! Отправляю 100 поцелуев обратно!',
        'Ты только что сделала мой день лучше!',
        'Принято! Храню твои обнимашки в сердечке!',
        'Мур-р-р... самая лучшая обнимашка в мире!'
    ];
    let lastLoveIdx = -1;

    if (sendLoveBtn && sendLoveStatus) {
        sendLoveBtn.addEventListener('click', () => {
            // Анимация кнопки
            sendLoveBtn.classList.add('love-btn-pressed');
            setTimeout(() => sendLoveBtn.classList.remove('love-btn-pressed'), 600);

            // Взрыв сердечек
            const container = sendLoveBtn.parentElement;
            for (let i = 0; i < 20; i++) {
                setTimeout(() => createMiniHeartAt(container), i * 25);
            }

            // Выбираем случайный ответ
            let idx;
            do {
                idx = Math.floor(Math.random() * loveResponses.length);
            } while (idx === lastLoveIdx);
            lastLoveIdx = idx;

            sendLoveStatus.style.opacity = '0';
            setTimeout(() => {
                sendLoveStatus.textContent = loveResponses[idx];
                sendLoveStatus.style.transition = 'opacity 0.4s ease';
                sendLoveStatus.style.opacity = '1';
            }, 200);
        });
    }

    // ==================================================================== //
    // 22. МЕСЯЦ 4 — ВСЯ ИНТЕРАКТИВНОСТЬ
    // ==================================================================== //
    let month4Initialized = false;

    function initMonth4() {
        if (month4Initialized) return;
        month4Initialized = true;

        // ---- 22a. БЛОК "ЛЮБЛЮ ТЕБЯ" ----
        const loveHeart = document.getElementById('love-decl-heart');
        const loveFill = document.getElementById('love-decl-fill');
        const loveHint = document.getElementById('love-decl-hint');
        const loveText = document.getElementById('love-decl-text');
        let loveClickCount = 0;
        const loveTotal = 7;

        if (loveHeart) {
            loveHeart.addEventListener('click', () => {
                loveClickCount = Math.min(loveClickCount + 1, loveTotal);
                const pct = (loveClickCount / loveTotal) * 100;
                if (loveFill) loveFill.style.height = pct + '%';

                loveHeart.classList.add('love-heart-pop');
                setTimeout(() => loveHeart.classList.remove('love-heart-pop'), 300);

                for (let i = 0; i < 5; i++) {
                    setTimeout(() => createMiniHeartAt(loveHeart), i * 40);
                }

                if (loveClickCount >= loveTotal) {
                    if (loveHint) loveHint.style.display = 'none';
                    if (loveText) loveText.classList.add('love-text-visible');
                    const lines = loveText ? loveText.querySelectorAll('.love-line') : [];
                    lines.forEach((l, i) => {
                        setTimeout(() => l.classList.add('love-line-show'), i * 200);
                    });
                }
            });
        }

        // ---- 22b. СОЗВЕЗДИЕ ----
        const cnvs = document.getElementById('constellation-canvas');
        const cStatus = document.getElementById('constellation-status');
        const cReset = document.getElementById('constellation-reset');

        if (cnvs) {
            const cCtx = cnvs.getContext('2d');
            const panel = cnvs.parentElement;
            const canvasWidth = Math.min(720, Math.max(320, panel.clientWidth - 32));
            cnvs.width = canvasWidth;
            cnvs.height = 320;

            const W = cnvs.width, H = cnvs.height;

            // Звёзды нашего созвездия (нормализованные 0..1)
            const starPoints = [
                { x: 0.5, y: 0.1 },
                { x: 0.75, y: 0.25 },
                { x: 0.85, y: 0.55 },
                { x: 0.65, y: 0.75 },
                { x: 0.5, y: 0.85 },
                { x: 0.35, y: 0.75 },
                { x: 0.15, y: 0.55 },
                { x: 0.25, y: 0.25 },
            ].map(p => ({ x: p.x * W, y: p.y * H, hit: false }));

            // Фоновые звёзды
            const bgStars = Array.from({ length: 60 }, () => ({
                x: Math.random() * W, y: Math.random() * H,
                r: Math.random() * 1.5 + 0.3,
                a: Math.random() * 0.5 + 0.2
            }));

            let nextStar = 0;
            const lines = [];

            function drawConstellation() {
                cCtx.clearRect(0, 0, W, H);

                // Фоновые звёздочки
                bgStars.forEach(s => {
                    cCtx.beginPath();
                    cCtx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
                    cCtx.fillStyle = `rgba(255,255,255,${s.a})`;
                    cCtx.fill();
                });

                // Соединительные линии
                cCtx.strokeStyle = 'rgba(255,125,163,0.5)';
                cCtx.lineWidth = 1.5;
                cCtx.setLineDash([4, 4]);
                lines.forEach(l => {
                    cCtx.beginPath();
                    cCtx.moveTo(l.x1, l.y1);
                    cCtx.lineTo(l.x2, l.y2);
                    cCtx.stroke();
                });
                cCtx.setLineDash([]);

                // Звёзды
                starPoints.forEach((s, i) => {
                    const label = i + 1;
                    const hit = s.hit;
                    const glow = hit ? 15 : 0;

                    if (hit) {
                        const grad = cCtx.createRadialGradient(s.x, s.y, 0, s.x, s.y, 26);
                        grad.addColorStop(0, 'rgba(255,125,163,0.6)');
                        grad.addColorStop(1, 'rgba(255,125,163,0)');
                        cCtx.beginPath();
                        cCtx.arc(s.x, s.y, 26, 0, Math.PI * 2);
                        cCtx.fillStyle = grad;
                        cCtx.fill();
                    }

                    cCtx.beginPath();
                    cCtx.arc(s.x, s.y, hit ? 9 : 7, 0, Math.PI * 2);
                    cCtx.fillStyle = hit ? '#ff7da3' : 'rgba(255,255,255,0.9)';
                    cCtx.shadowColor = hit ? '#ff7da3' : 'white';
                    cCtx.shadowBlur = hit ? 12 : 4;
                    cCtx.fill();
                    cCtx.shadowBlur = 0;

                    // Номер
                    if (!hit) {
                        cCtx.fillStyle = 'rgba(255,255,255,0.6)';
                        cCtx.font = '12px Montserrat, sans-serif';
                        cCtx.textAlign = 'center';
                        cCtx.fillText(label, s.x, s.y - 13);
                    }
                });
            }

            drawConstellation();

            const isTouchFriendly = window.matchMedia('(pointer: coarse)').matches;
            const hitRadius = isTouchFriendly ? 42 : 30;
            let isConnecting = false;

            function tryConnectStar(clientX, clientY, showMiss) {
                if (nextStar >= starPoints.length) return;
                const rect = cnvs.getBoundingClientRect();
                const scaleX = W / rect.width;
                const scaleY = H / rect.height;
                const mx = (clientX - rect.left) * scaleX;
                const my = (clientY - rect.top) * scaleY;
                const s = starPoints[nextStar];
                const dist = Math.hypot(mx - s.x, my - s.y);

                if (dist < hitRadius) {
                    if (nextStar > 0) {
                        const prev = starPoints[nextStar - 1];
                        lines.push({ x1: prev.x, y1: prev.y, x2: s.x, y2: s.y });
                    }
                    s.hit = true;
                    nextStar++;
                    drawConstellation();

                    if (nextStar < starPoints.length) {
                        cStatus.textContent = `Отлично! Теперь нажми на звезду #${nextStar + 1}`;
                    } else {
                        // Р—Р°РјС‹РєР°РµРј СЃРѕР·РІРµР·РґРёРµ
                        lines.push({ x1: starPoints[starPoints.length - 1].x, y1: starPoints[starPoints.length - 1].y, x2: starPoints[0].x, y2: starPoints[0].y });
                        drawConstellation();
                        cStatus.innerHTML = '✨ Созвездие Любви — наше с тобой навсегда! ✨';
                        cReset.style.display = 'flex';
                    }
                } else if (showMiss) {
                    cStatus.textContent = `Промазала! Ищи звезду #${nextStar + 1} — она рядом!`;
                    cnvs.classList.add('cnvs-shake');
                    setTimeout(() => cnvs.classList.remove('cnvs-shake'), 400);
                }
            }

            cnvs.addEventListener('pointerdown', (e) => {
                e.preventDefault();
                isConnecting = true;
                cnvs.setPointerCapture?.(e.pointerId);
                tryConnectStar(e.clientX, e.clientY, true);
            });

            cnvs.addEventListener('pointermove', (e) => {
                if (!isConnecting) return;
                e.preventDefault();
                tryConnectStar(e.clientX, e.clientY, false);
            });

            cnvs.addEventListener('pointerup', (e) => {
                isConnecting = false;
                cnvs.releasePointerCapture?.(e.pointerId);
            });

            cnvs.addEventListener('pointercancel', () => {
                isConnecting = false;
            });

            if (cReset) {
                cReset.addEventListener('click', () => {
                    nextStar = 0;
                    lines.length = 0;
                    starPoints.forEach(s => s.hit = false);
                    cStatus.textContent = 'Нажми на звезду #1, чтобы начать!';
                    cReset.style.display = 'none';
                    drawConstellation();
                });
            }
        }

        // ---- 22c. КОЛЕСО ЭМОЦИЙ ----
        const emotionBtns = document.querySelectorAll('.emotion-btn');
        const emotionResponse = document.getElementById('emotion-response');

        const emotionData = {
            happy: { color: '#fbbf24', text: 'Твоя улыбка — это лучшее, что я когда-либо видел. Когда ты счастлива, счастлив весь мой мир. Так держать, котя!' },
            love: { color: '#f43f5e', text: 'Знаешь, влюблённая ты — это что-то особенное. Твои глаза светятся как-то по-другому. Я тебя люблю ещё сильнее!' },
            miss: { color: '#818cf8', text: 'Я тоже скучаю. Каждую секунду. Но это значит, что нам есть ради чего встречаться — и эта встреча будет лучшей!' },
            tired: { color: '#94a3b8', text: 'Иди сюда, я тебя обниму. Ложись, отдыхай. Ты сделала уже так много. Ты молодец, и я горжусь тобой!' },
            excited: { color: '#f97316', text: 'Ааа я люблю тебя восторженную! Расскажи мне всё! Твои эмоции заряжают меня лучше любого кофе!' },
            cozy: { color: '#10b981', text: 'Уютно нам вдвоём — это моё любимое состояние. Представь, что я рядом, накрываю тебя пледом и говорю: всё хорошо...' }
        };

        if (emotionBtns.length && emotionResponse) {
            emotionBtns.forEach(btn => {
                btn.addEventListener('click', () => {
                    emotionBtns.forEach(b => b.classList.remove('emotion-active'));
                    btn.classList.add('emotion-active');

                    const key = btn.dataset.emotion;
                    const d = emotionData[key];

                    emotionResponse.style.opacity = '0';
                    emotionResponse.style.display = 'block';
                    emotionResponse.style.borderColor = d.color;
                    setTimeout(() => {
                        emotionResponse.innerHTML = `<p style="font-size:1.15rem;line-height:1.7;">${d.text}</p>`;
                        emotionResponse.style.transition = 'opacity 0.4s';
                        emotionResponse.style.opacity = '1';
                    }, 200);

                    for (let i = 0; i < 10; i++) setTimeout(() => createMiniHeartAt(btn), i * 30);
                });
            });
        }

        // ---- 22d. ОБЕЩАНИЯ (ЗАМКИ) ----
        for (let i = 1; i <= 4; i++) {
            const item = document.getElementById(`promise-${i}`);
            const lock = document.getElementById(`promise-lock-${i}`);
            const content = document.getElementById(`promise-content-${i}`);

            if (item && lock && content) {
                item.addEventListener('click', () => {
                    if (item.classList.contains('promise-unlocked')) return;
                    item.classList.add('promise-unlocked');
                    lock.style.opacity = '0';
                    lock.style.transform = 'scale(0.5) translateY(-20px)';
                    setTimeout(() => {
                        lock.style.display = 'none';
                        content.style.display = 'flex';
                        setTimeout(() => content.classList.add('promise-show'), 30);
                    }, 350);
                    for (let j = 0; j < 12; j++) setTimeout(() => createMiniHeartAt(item), j * 35);
                });
            }
        }

        // ---- 22e. БИЕНИЕ СЕРДЦА ----
        const hbBtn = document.getElementById('heartbeat-btn');
        const hbCanvas = document.getElementById('heartbeat-canvas');
        const hbCaption = document.getElementById('heartbeat-caption');

        if (hbBtn && hbCanvas) {
            const hbCtx = hbCanvas.getContext('2d');
            hbCanvas.width = hbCanvas.parentElement.clientWidth || 300;
            hbCanvas.height = 80;
            const hbW = hbCanvas.width;
            const hbH = hbCanvas.height;

            let isHolding = false;
            let hbPoints = [];
            let hbX = 0;
            let hbAnimId = null;
            const hbMessages = [
                'Тук... тук... это для тебя',
                'Быстрее — думаю о тебе!',
                'Вот так оно бьётся, когда ты пишешь...',
                'Ты слышишь? Это моё сердце говорит: люблю!',
                'Тук-тук — кто там? Это моя любовь к тебе!'
            ];
            let hbMsgIdx = 0;

            function drawHeartbeat() {
                hbCtx.clearRect(0, 0, hbW, hbH);

                if (hbPoints.length < 2) return;

                const grad = hbCtx.createLinearGradient(0, 0, hbW, 0);
                grad.addColorStop(0, 'rgba(255,125,163,0)');
                grad.addColorStop(0.5, 'rgba(255,125,163,0.9)');
                grad.addColorStop(1, 'rgba(255,125,163,0)');

                hbCtx.beginPath();
                hbCtx.moveTo(hbPoints[0].x, hbPoints[0].y);
                for (let i = 1; i < hbPoints.length; i++) {
                    hbCtx.lineTo(hbPoints[i].x, hbPoints[i].y);
                }
                hbCtx.strokeStyle = grad;
                hbCtx.lineWidth = 2.5;
                hbCtx.shadowColor = '#ff7da3';
                hbCtx.shadowBlur = 8;
                hbCtx.stroke();
                hbCtx.shadowBlur = 0;
            }

            function hbTick() {
                if (!isHolding) return;

                const mid = hbH / 2;
                const beat = [0, 0, -30, 25, -40, 30, -15, 5, 0];
                const segment = Math.floor((hbX / hbW) * 8) % beat.length;
                const y = mid + beat[segment] + (Math.random() * 4 - 2);

                hbPoints.push({ x: hbX, y });
                hbX += 3;

                if (hbX > hbW) {
                    hbX = 0;
                    hbPoints = [];
                }

                // Обрезаем видимое окно
                hbPoints = hbPoints.filter(p => p.x >= hbX - hbW && p.x <= hbX);

                drawHeartbeat();
                hbAnimId = requestAnimationFrame(hbTick);
            }

            const startHold = () => {
                if (isHolding) return;
                isHolding = true;
                document.getElementById('heartbeat-svg').style.animation = 'hbPulse 0.4s ease infinite';
                hbCaption.textContent = hbMessages[hbMsgIdx % hbMessages.length];
                hbMsgIdx++;
                hbAnimId = requestAnimationFrame(hbTick);
            };

            const stopHold = () => {
                isHolding = false;
                document.getElementById('heartbeat-svg').style.animation = '';
                if (hbAnimId) cancelAnimationFrame(hbAnimId);
                // Затухание линии
                let fade = 1;
                const fadeOut = setInterval(() => {
                    fade -= 0.05;
                    if (fade <= 0) { clearInterval(fadeOut); hbCtx.clearRect(0, 0, hbW, hbH); hbPoints = []; hbX = 0; return; }
                    hbCtx.clearRect(0, 0, hbW, hbH);
                    hbCtx.globalAlpha = fade;
                    if (hbPoints.length > 1) {
                        hbCtx.beginPath();
                        hbCtx.moveTo(hbPoints[0].x, hbPoints[0].y);
                        for (let i = 1; i < hbPoints.length; i++) hbCtx.lineTo(hbPoints[i].x, hbPoints[i].y);
                        hbCtx.strokeStyle = '#ff7da3';
                        hbCtx.lineWidth = 2.5;
                        hbCtx.stroke();
                    }
                    hbCtx.globalAlpha = 1;
                }, 50);
                hbCaption.textContent = 'Удерживай нажатие...';
            };

            hbBtn.addEventListener('mousedown', startHold);
            hbBtn.addEventListener('touchstart', (e) => { e.preventDefault(); startHold(); }, { passive: false });
            document.addEventListener('mouseup', stopHold);
            document.addEventListener('touchend', stopHold);
        }

        // ---- 22f. ФИНАЛЬНЫЕ ЗВЁЗДЫ ----
        const m4Stars = document.getElementById('m4-final-stars');
        if (m4Stars) {
            for (let i = 0; i < 20; i++) {
                const star = document.createElement('div');
                star.className = 'm4-star';
                star.style.left = (Math.random() * 100) + '%';
                star.style.top = (Math.random() * 100) + '%';
                star.style.animationDelay = (Math.random() * 3) + 's';
                star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
                m4Stars.appendChild(star);
            }
        }
    }

    // ==================================================================== //
    // 23. МЕСЯЦ 5 — ВСЯ ИНТЕРАКТИВНОСТЬ
    // ==================================================================== //
    let month5Initialized = false;

    function initMonth5() {
        if (month5Initialized) return;
        month5Initialized = true;

        // ---- 23a. НЕОНОВАЯ ВЫВЕСКА ----
        const neonContainer = document.getElementById('neon-container');
        const neonText = document.getElementById('neon-text');
        if (neonContainer && neonText) {
            let neonOn = false;
            neonContainer.addEventListener('click', () => {
                neonOn = !neonOn;
                neonContainer.classList.toggle('neon-active', neonOn);
                if (neonOn) {
                    const letters = neonText.querySelectorAll('.neon-letter');
                    letters.forEach((l, i) => {
                        setTimeout(() => l.classList.add('neon-lit'), i * 80);
                    });
                    // Сердечки
                    const hearts = document.querySelectorAll('.neon-heart-svg');
                    hearts.forEach((h, i) => {
                        setTimeout(() => h.classList.add('neon-heart-lit'), 900 + i * 150);
                    });
                } else {
                    neonText.querySelectorAll('.neon-letter').forEach(l => l.classList.remove('neon-lit'));
                    document.querySelectorAll('.neon-heart-svg').forEach(h => h.classList.remove('neon-heart-lit'));
                }
            });
        }

        // ---- 23b. ГАЛАКТИКА ЛЮБВИ ----
        const galaxyRing = document.getElementById('galaxy-ring');
        const galaxyMessage = document.getElementById('galaxy-message');

        const galaxyMemories = [
            { color: '#c084fc', text: 'Первое сообщение, от которого захватило дух. Я перечитывал его 10 раз.' },
            { color: '#ff7da3', text: 'Наш первый звонок. Я так нервничал, но твой голос успокоил всё.' },
            { color: '#fbbf24', text: 'Когда мы проговорили до 5 утра и не заметили как рассвело.' },
            { color: '#34d399', text: 'Первый раз когда ты сказала что скучаешь. Мое сердце взорвалось.' },
            { color: '#60a5fa', text: 'Момент когда я понял — ты не просто девушка. Ты моя вселенная.' },
            { color: '#f0abfc', text: 'Каждое "спокойной ночи" от тебя — как тёплое одеяло для души.' },
            { color: '#fb923c', text: 'Наш первый общий плейлист. Каждая песня — про нас.' },
            { color: '#a78bfa', text: 'Пять месяцев. И каждый день я люблю тебя сильнее, чем вчера.' }
        ];

        if (galaxyRing) {
            galaxyMemories.forEach((mem, i) => {
                const angle = (i / galaxyMemories.length) * 360;
                const radius = 110;
                const rad = (angle - 90) * Math.PI / 180;
                const x = Math.cos(rad) * radius;
                const y = Math.sin(rad) * radius;

                const star = document.createElement('div');
                star.className = 'galaxy-star';
                star.style.cssText = `--sc: ${mem.color}; left: calc(50% + ${x}px); top: calc(50% + ${y}px);`;
                star.style.animationDelay = `${i * 0.3}s`;
                star.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:16px;height:16px;"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;

                star.addEventListener('click', () => {
                    galaxyRing.querySelectorAll('.galaxy-star').forEach(s => s.classList.remove('galaxy-star-active'));
                    star.classList.add('galaxy-star-active');
                    galaxyMessage.style.opacity = '0';
                    galaxyMessage.style.transform = 'translateY(10px)';
                    setTimeout(() => {
                        galaxyMessage.innerHTML = `<p style="color:${mem.color};font-weight:600;font-size:1.15rem;line-height:1.7;">${mem.text}</p>`;
                        galaxyMessage.style.transition = 'all 0.5s ease';
                        galaxyMessage.style.opacity = '1';
                        galaxyMessage.style.transform = 'translateY(0)';
                        galaxyMessage.style.borderColor = mem.color;
                    }, 250);
                    for (let j = 0; j < 6; j++) setTimeout(() => createMiniHeartAt(star), j * 40);
                });

                galaxyRing.appendChild(star);
            });
        }

        // ---- 23c. ВОЛШЕБНЫЙ ШАР ----
        const magicBall = document.getElementById('magic-ball');
        const ballTriangle = document.getElementById('ball-triangle');
        const ballAnswer = document.getElementById('ball-answer');
        const magicHint = document.getElementById('magic-ball-hint');

        const ballAnswers = [
            'Мы будем вместе навсегда!',
            'Скоро ты окажешься в моих объятиях',
            'Наша любовь переживёт всё',
            'Впереди — лучшие дни нашей жизни',
            'Скоро будем жить в одном городе!',
            'Ты станешь самой счастливой',
            'Нас ждёт незабываемое путешествие вдвоём',
            'Каждый день будет лучше предыдущего',
            'Бесконечная любовь — гарантирована',
            'Скоро увидимся, и я тебя не отпущу'
        ];
        let ballShaking = false;

        if (magicBall) {
            magicBall.addEventListener('click', () => {
                if (ballShaking) return;
                ballShaking = true;

                magicBall.classList.add('ball-shake');
                ballTriangle.style.opacity = '0';

                setTimeout(() => {
                    magicBall.classList.remove('ball-shake');
                    const answer = ballAnswers[Math.floor(Math.random() * ballAnswers.length)];
                    ballAnswer.textContent = answer;
                    ballTriangle.style.opacity = '1';
                    ballTriangle.style.animation = 'fadeInDown 0.6s ease';
                    if (magicHint) magicHint.textContent = 'Нажми ещё раз для нового предсказания!';
                    ballShaking = false;
                }, 1200);
            });
        }

        // ---- 23d. ДОСТИЖЕНИЯ ----
        const achCards = document.querySelectorAll('.achievement-card');
        achCards.forEach((card, i) => {
            setTimeout(() => {
                card.classList.add('ach-unlocked');
            }, i * 300);

            card.addEventListener('click', () => {
                card.classList.add('ach-bounce');
                setTimeout(() => card.classList.remove('ach-bounce'), 600);
                for (let j = 0; j < 8; j++) setTimeout(() => createMiniHeartAt(card), j * 30);
            });
        });

        // ---- 23e. РУЛЕТКА ПЛЕЙЛИСТА ----
        const rouletteWheel = document.getElementById('roulette-wheel');
        const rouletteLabels = document.getElementById('roulette-labels');
        const rouletteSpin = document.getElementById('roulette-spin');
        const songTitle = document.getElementById('roulette-song-title');
        const songDesc = document.getElementById('roulette-song-desc');
        const spotifyPlayer = document.getElementById('roulette-spotify-player');

        const songs = [
            {
                title: 'baby my type - TAKETAKE',
                desc: 'Трек выпал тебе на сейчас',
                color: '#1db954',
                spotifyEmbed: 'https://open.spotify.com/embed/track/4N97hCnUZAeWaUAwYS0uPy?utm_source=generator&theme=0&si=2fc14b480fa54ad9'
            },
            {
                title: 'Секс по-питерски - KlouKoma',
                desc: 'Трек выпал тебе на сейчас',
                color: '#fb7185',
                spotifyEmbed: 'https://open.spotify.com/embed/track/3mMXGxnS6OFkKtqzSYgL0T?utm_source=generator&theme=0&si=4de440e2773d48bb'
            },
            {
                title: 'Блестки - FSYCH',
                desc: 'Трек выпал тебе на сейчас',
                color: '#a78bfa',
                spotifyEmbed: 'https://open.spotify.com/embed/track/2EUj6joAFzycqW8imNfQla?utm_source=generator&theme=0&si=33a64ab97bf84789'
            },
            {
                title: 'кимоно (2021) - zhanulka',
                desc: 'Трек выпал тебе на сейчас',
                color: '#38bdf8',
                spotifyEmbed: 'https://open.spotify.com/embed/track/13hYA0TURPc4paqYECpsJW?utm_source=generator&theme=0&si=bd6bad126ed7447a'
            },
            {
                title: 'crush - 2hollis',
                desc: 'Трек выпал тебе на сейчас',
                color: '#f97316',
                spotifyEmbed: 'https://open.spotify.com/embed/track/2h7vLf7jv2KsRb7fV77w5H?utm_source=generator&theme=0&si=68a035e741a74ef3'
            },
            {
                title: '1000-7 - shadowraze, GENJUTSU',
                desc: 'Трек выпал тебе на сейчас',
                color: '#ef4444',
                spotifyEmbed: 'https://open.spotify.com/embed/track/2IMrzJTRHGndoUbM39QIJ7?utm_source=generator&theme=0&si=398dec3e74dd43ca'
            },
            {
                title: 'Деготь - Full Smena',
                desc: 'Трек выпал тебе на сейчас',
                color: '#14b8a6',
                spotifyEmbed: 'https://open.spotify.com/embed/track/1jG3t4U7Fq0imxUShxehTv?utm_source=generator&theme=0&si=b8457f297a5f4ad4'
            }
        ];

        let isSpinning = false;
        let currentRotation = 0;
        const rouletteLabelRefs = [];

        function getElementRotationDeg(el) {
            if (!el) return 0;
            const transform = window.getComputedStyle(el).transform;
            if (!transform || transform === 'none') return 0;
            const matrix = new DOMMatrix(transform);
            return Math.atan2(matrix.b, matrix.a) * (180 / Math.PI);
        }

        function syncRouletteLabels() {
            const rot = getElementRotationDeg(rouletteLabels || rouletteWheel);
            rouletteLabelRefs.forEach(({ span, midAngle, labelRadius }) => {
                span.style.transform = `translateY(-${labelRadius}px) rotate(${-midAngle - rot}deg)`;
            });
        }

        function setRouletteRotation(deg) {
            const value = `rotate(${deg}deg)`;
            if (rouletteWheel) rouletteWheel.style.transform = value;
            if (rouletteLabels) rouletteLabels.style.transform = value;
            syncRouletteLabels();
        }

        function runRouletteLabelSync() {
            syncRouletteLabels();
            if (isSpinning) requestAnimationFrame(runRouletteLabelSync);
        }

        function renderRouletteSpotify(song) {
            if (!spotifyPlayer) return;

            spotifyPlayer.classList.remove('is-visible');
            spotifyPlayer.innerHTML = '';

            setTimeout(() => {
                if (!song.spotifyEmbed) {
                    const placeholder = document.createElement('div');
                    placeholder.className = 'roulette-spotify-empty';
                    placeholder.textContent = 'Spotify-ссылка для этого слота пока пустая';
                    spotifyPlayer.appendChild(placeholder);
                    spotifyPlayer.classList.add('is-visible');
                    return;
                }

                const iframe = document.createElement('iframe');
                iframe.dataset.testid = 'embed-iframe';
                iframe.src = song.spotifyEmbed;
                iframe.width = '100%';
                iframe.height = '152';
                iframe.frameBorder = '0';
                iframe.allowFullscreen = true;
                iframe.allow = 'autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture';
                iframe.loading = 'lazy';
                iframe.title = song.title;

                spotifyPlayer.appendChild(iframe);
                spotifyPlayer.classList.add('is-visible');
            }, 80);
        }

        function shortenSongTitle(title) {
            const parts = title.split(' - ');
            const main = parts.length > 1 ? parts[0] : title;
            return main.length > 18 ? `${main.slice(0, 16)}…` : main;
        }

        // Создаём сегменты рулетки
        if (rouletteWheel) {
            const segmentSize = 360 / songs.length;
            const wheelGradient = songs.map((song, i) => {
                const start = i * segmentSize;
                const end = (i + 1) * segmentSize;
                return `${song.color} ${start}deg ${end}deg`;
            }).join(', ');

            rouletteWheel.style.background = `conic-gradient(from -${90 + segmentSize / 2}deg, ${wheelGradient})`;

            for (let i = 0; i < songs.length; i++) {
                const divider = document.createElement('div');
                divider.className = 'roulette-divider';
                divider.style.transform = `rotate(${i * segmentSize - segmentSize / 2}deg)`;
                rouletteWheel.appendChild(divider);
            }

            songs.forEach((song, i) => {
                if (!rouletteLabels) return;

                const labelWrap = document.createElement('div');
                labelWrap.className = 'roulette-label-wrap';
                const midAngle = i * segmentSize;
                const labelRadius = Math.round(rouletteWheel.offsetWidth * 0.28);
                labelWrap.style.transform = `rotate(${midAngle}deg)`;

                const span = document.createElement('span');
                span.className = 'seg-label';
                span.textContent = shortenSongTitle(song.title);
                labelWrap.appendChild(span);
                rouletteLabels.appendChild(labelWrap);

                rouletteLabelRefs.push({ span, midAngle, labelRadius });
            });

            syncRouletteLabels();
        }

        if (rouletteSpin) {
            rouletteSpin.addEventListener('click', () => {
                if (isSpinning) return;
                isSpinning = true;

                const spins = 3 + Math.random() * 3;
                const extraDeg = Math.random() * 360;
                currentRotation += spins * 360 + extraDeg;

                const spinTransition = 'transform 3s cubic-bezier(0.15, 0.75, 0.12, 0.99)';
                if (rouletteWheel) rouletteWheel.style.transition = spinTransition;
                if (rouletteLabels) rouletteLabels.style.transition = spinTransition;
                setRouletteRotation(currentRotation);
                requestAnimationFrame(runRouletteLabelSync);

                songTitle.textContent = 'Крутится...';
                songDesc.textContent = '🎵';
                if (spotifyPlayer) {
                    spotifyPlayer.classList.remove('is-visible');
                    spotifyPlayer.innerHTML = '';
                }

                // Взрывы сердечек в процессе кручения
                const spinInterval = setInterval(() => {
                    if (!isSpinning) {
                        clearInterval(spinInterval);
                        return;
                    }
                    createMiniHeartAt(rouletteWheel.parentElement);
                }, 200);

                setTimeout(() => {
                    const normalizedDeg = currentRotation % 360;
                    const segSize = 360 / songs.length;
                    const idx = Math.floor(((360 - normalizedDeg + segSize / 2) % 360) / segSize) % songs.length;
                    const song = songs[idx];

                    songTitle.textContent = song.title;
                    songTitle.style.color = song.color;
                    songDesc.textContent = song.desc;
                    renderRouletteSpotify(song);

                    isSpinning = false;
                    syncRouletteLabels();

                    for (let j = 0; j < 15; j++) {
                        setTimeout(() => createMiniHeartAt(rouletteWheel.parentElement), j * 30);
                    }
                }, 3200);
            });
        }

        // ---- 23f. ШАРИКИ-СЕРДЦЕ ----
        const launchBalloonsBtn = document.getElementById('launch-balloons-btn');
        const balloonsOverlay = document.getElementById('balloons-overlay');
        const balloonColors = ['#ff7da3', '#c084fc', '#fbbf24', '#34d399', '#60a5fa', '#f472b6', '#a78bfa', '#fb923c'];
        const activeBalloons = new Set();
        let balloonAnimFrame = null;

        function heartPoint(t) {
            const x = 16 * Math.pow(Math.sin(t), 3);
            const y = 13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t);
            return { x, y };
        }

        function buildHeartTargets(count) {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const scale = Math.min(vw * 0.34, vh * 0.22, 180);
            const centerX = vw / 2;
            const centerY = vh * 0.48;
            const points = [];

            for (let i = 0; i < count; i++) {
                const t = (Math.PI * 2 * i) / count;
                const p = heartPoint(t);
                points.push({
                    x: centerX + (p.x / 16) * scale,
                    y: centerY - (p.y / 16) * scale
                });
            }

            return points;
        }

        function popBalloon(balloon, state) {
            if (state.popped) return;
            state.popped = true;
            activeBalloons.delete(state);

            const rect = balloon.getBoundingClientRect();
            const cx = rect.left + rect.width / 2;
            const cy = rect.top + rect.height / 2;

            for (let i = 0; i < 10; i++) {
                const particle = document.createElement('div');
                particle.className = 'balloon-pop-particle';
                particle.style.left = `${cx}px`;
                particle.style.top = `${cy}px`;
                particle.style.background = state.color;
                const angle = (Math.PI * 2 * i) / 10;
                const dist = 28 + Math.random() * 24;
                particle.style.setProperty('--px', `${Math.cos(angle) * dist}px`);
                particle.style.setProperty('--py', `${Math.sin(angle) * dist}px`);
                balloonsOverlay.appendChild(particle);
                setTimeout(() => particle.remove(), 600);
            }

            balloon.classList.add('popping');
            setTimeout(() => balloon.remove(), 450);
        }

        function animateBalloons() {
            let alive = false;

            activeBalloons.forEach((state) => {
                if (state.popped) return;
                alive = true;

                const wobble = Math.sin(state.time * 2.4 + state.wobbleOffset) * 5;

                if (state.phase === 'forming') {
                    state.progress += state.speed;
                    const t = Math.min(state.progress, 1);
                    const easeOut = 1 - Math.pow(1 - t, 3);
                    state.x = state.startX + (state.targetX - state.startX) * easeOut + wobble;
                    state.y = state.startY + (state.targetY - state.startY) * easeOut;

                    if (state.progress >= 1) {
                        state.phase = 'rising';
                    }
                } else {
                    state.x += wobble * 0.08;
                    state.y -= state.riseSpeed;
                }

                state.balloon.style.left = `${state.x}px`;
                state.balloon.style.top = `${state.y}px`;
                state.balloon.querySelector('.flying-balloon-string').style.transform = `rotate(${wobble * 2}deg)`;

                state.time += 0.016;

                if (state.y <= 8) {
                    popBalloon(state.balloon, state);
                }
            });

            if (alive) {
                balloonAnimFrame = requestAnimationFrame(animateBalloons);
            } else {
                balloonAnimFrame = null;
            }
        }

        function launchHeartBalloons() {
            if (!balloonsOverlay) return;

            const targets = buildHeartTargets(28);
            const startY = window.innerHeight + 70;

            targets.forEach((target, index) => {
                setTimeout(() => {
                    const balloon = document.createElement('div');
                    balloon.className = 'flying-balloon';
                    const color = balloonColors[index % balloonColors.length];
                    balloon.style.setProperty('--balloon-color', color);
                    balloon.innerHTML = `
                        <div class="flying-balloon-body"></div>
                        <div class="flying-balloon-string"></div>
                    `;

                    const startX = target.x - 23 + (Math.random() * 10 - 5);
                    const state = {
                        balloon,
                        color,
                        startX,
                        startY,
                        targetX: target.x - 23,
                        targetY: target.y - 29,
                        x: startX,
                        y: startY,
                        phase: 'forming',
                        progress: 0,
                        speed: 0.018 + Math.random() * 0.006,
                        riseSpeed: 2.2 + Math.random() * 0.8,
                        wobbleOffset: Math.random() * Math.PI * 2,
                        time: 0,
                        popped: false
                    };

                    balloon.style.left = `${state.x}px`;
                    balloon.style.top = `${state.y}px`;
                    balloon.addEventListener('click', (e) => {
                        e.stopPropagation();
                        popBalloon(balloon, state);
                    });
                    balloon.addEventListener('touchstart', (e) => {
                        e.preventDefault();
                        popBalloon(balloon, state);
                    }, { passive: false });

                    balloonsOverlay.appendChild(balloon);
                    activeBalloons.add(state);

                    if (!balloonAnimFrame) {
                        balloonAnimFrame = requestAnimationFrame(animateBalloons);
                    }
                }, index * 55);
            });
        }

        if (launchBalloonsBtn) {
            launchBalloonsBtn.addEventListener('click', () => {
                launchBalloonsBtn.disabled = true;
                launchHeartBalloons();
                setTimeout(() => {
                    launchBalloonsBtn.disabled = false;
                }, 3200);
            });
        }

        // ---- 23g. ПОРТАЛ ТЕЛЕПОРТАЦИИ ----
        const portalBtn = document.getElementById('portal-btn');
        const portalContainer = document.getElementById('portal-container');
        const teleportStatus = document.getElementById('teleport-status');

        const teleportMessages = [
            'Телепортация любви отправлена! Расстояние: 0 км в сердце ♡',
            'Портал активирован! Чувствуешь моё тепло прямо сейчас?',
            'Любовь доставлена за 0.001 секунду через измерения!',
            'Пространство между нами сжалось до размера объятия!',
            'Телепортация завершена! Я уже рядом в твоих мыслях!',
            'Портал закрылся, но любовь осталась навсегда!'
        ];
        let lastTeleportIdx = -1;

        if (portalBtn && teleportStatus) {
            portalBtn.addEventListener('click', () => {
                portalContainer.classList.add('portal-active');
                portalBtn.classList.add('portal-btn-pulse');

                // Взрыв частиц
                for (let i = 0; i < 25; i++) {
                    setTimeout(() => createMiniHeartAt(portalContainer), i * 20);
                }

                let idx;
                do { idx = Math.floor(Math.random() * teleportMessages.length); } while (idx === lastTeleportIdx);
                lastTeleportIdx = idx;

                teleportStatus.style.opacity = '0';
                setTimeout(() => {
                    teleportStatus.textContent = teleportMessages[idx];
                    teleportStatus.style.transition = 'opacity 0.5s ease';
                    teleportStatus.style.opacity = '1';
                }, 300);

                setTimeout(() => {
                    portalContainer.classList.remove('portal-active');
                    portalBtn.classList.remove('portal-btn-pulse');
                }, 2000);
            });
        }

        // ---- 23g. ШКАТУЛКА КОМПЛИМЕНТОВ ----
        const complimentBox = document.getElementById('compliment-box');
        const complimentText = document.getElementById('compliment-text');
        const complimentCard = document.getElementById('compliment-card');

        const compliments = [
            'Ты самая красивая девушка во всех вселенных одновременно',
            'Твой смех — мой любимый звук на планете',
            'С тобой даже молчание становится уютным',
            'Ты делаешь меня лучшей версией себя каждый день',
            'Твои глаза — как два маленьких космоса, в которых я потерялся навсегда',
            'Если бы любовь измерялась в звёздах — ты была бы целой галактикой',
            'Ты заслуживаешь все цветы этого мира и ещё один букет сверху',
            'Я бы нажал "мне повезло" в Google каждый день, если бы это привело к тебе',
            'Ты — лучший комбо: красота + ум + нежность + моя',
            'Когда ты улыбаешься, где-то зажигается новая звезда',
            'Ты настолько идеальная, что даже баги в матрице восхищаются',
            'Если бы я мог выбрать кого угодно — я бы снова выбрал тебя'
        ];
        let lastComplimentIdx = -1;

        if (complimentBox && complimentText) {
            complimentBox.addEventListener('click', () => {
                complimentBox.classList.add('compliment-box-open');
                setTimeout(() => complimentBox.classList.remove('compliment-box-open'), 600);

                let idx;
                do { idx = Math.floor(Math.random() * compliments.length); } while (idx === lastComplimentIdx);
                lastComplimentIdx = idx;

                complimentCard.style.opacity = '0';
                complimentCard.style.transform = 'translateY(15px) scale(0.95)';
                setTimeout(() => {
                    complimentText.textContent = compliments[idx];
                    complimentCard.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
                    complimentCard.style.opacity = '1';
                    complimentCard.style.transform = 'translateY(0) scale(1)';
                }, 300);

                for (let j = 0; j < 10; j++) setTimeout(() => createMiniHeartAt(complimentBox), j * 30);
            });
        }

        // ---- 23i. НЕБЕСНЫЕ ФОНАРИКИ ----
        const lanternsSky = document.getElementById('lanterns-sky');
        const lanternWishes = [
            'Мы будем вместе навсегда ♡',
            'Люблю тебя до луны и обратно ✨',
            'Ты моё самое заветное желание 🌟',
            'Каждая минута с тобой — счастье 💕',
            'Наши сердца бьются в унисон 💓',
            'Ты моё солнце и мои звёзды ☀️🌙',
            'Никогда не отпущу твою руку 🤝',
            'Впереди у нас целая вечность 💞',
            'Обещаю делать тебя счастливой каждый день 🧸'
        ];

        if (lanternsSky) {
            lanternsSky.addEventListener('click', (e) => {
                if (e.target.closest('.lantern')) return;

                const rect = lanternsSky.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const lantern = document.createElement('div');
                lantern.className = 'lantern';

                const size = Math.random() * 20 + 35;
                lantern.style.width = `${size}px`;
                lantern.style.height = `${size * 1.3}px`;
                lantern.style.left = `${x - size / 2}px`;
                lantern.style.top = `${y - (size * 1.3) / 2}px`;

                const wishText = lanternWishes[Math.floor(Math.random() * lanternWishes.length)];

                lantern.innerHTML = `
                    <svg viewBox="0 0 40 52" fill="none" xmlns="http://www.w3.org/2000/svg" style="width:100%; height:100%;">
                        <path d="M4 14C4 6.26801 11.1634 0 20 0C28.8366 0 36 6.26801 36 14C36 29 32 44 28 48H12C8 44 4 29 4 14Z" fill="url(#lantern-grad)"/>
                        <rect x="15" y="48" width="10" height="2" rx="1" fill="#FF5E36"/>
                        <circle cx="20" cy="46" r="3" fill="#FFE066" filter="drop-shadow(0 0 4px #FF9E2C)"/>
                        <defs>
                            <linearGradient id="lantern-grad" x1="20" y1="0" x2="20" y2="48" gradientUnits="userSpaceOnUse">
                                <stop offset="0%" stop-color="#FFD685"/>
                                <stop offset="40%" stop-color="#FF8A3D"/>
                                <stop offset="90%" stop-color="#FF3E2C"/>
                            </linearGradient>
                        </defs>
                    </svg>
                    <div class="lantern-wish">${wishText}</div>
                `;

                const hint = lanternsSky.querySelector('.lanterns-hint');
                if (hint) {
                    hint.style.opacity = '0';
                    setTimeout(() => hint.remove(), 500);
                }

                lanternsSky.appendChild(lantern);

                setTimeout(() => {
                    lantern.classList.add('floating');
                }, 50);

                setTimeout(() => {
                    lantern.remove();
                }, 8500);
            });
        }

        // ---- 23h. ФИНАЛЬНЫЕ ЗВЁЗДЫ М5 ----
        const m5Stars = document.getElementById('m5-final-stars');
        if (m5Stars) {
            for (let i = 0; i < 25; i++) {
                const star = document.createElement('div');
                star.className = 'm4-star';
                star.style.left = (Math.random() * 100) + '%';
                star.style.top = (Math.random() * 100) + '%';
                star.style.animationDelay = (Math.random() * 3) + 's';
                star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
                m5Stars.appendChild(star);
            }
        }
    }

    // ==================================================================== //
    // 30. МЕСЯЦ 6 — КАЗИНО ЛЮБВИ + КЛИКЕР + TG
    // ==================================================================== //
    let month6Initialized = false;

    function initMonth6() {
        if (month6Initialized) return;
        month6Initialized = true;

        // ---- Web Audio API для звуков настоящего казино ----
        let audioCtx = null;
        function getAudioContext() {
            if (!audioCtx) {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (AudioContext) audioCtx = new AudioContext();
            }
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            return audioCtx;
        }

        function playTone(freq, type = 'sine', duration = 0.12, gainValue = 0.08) {
            try {
                const ctx = getAudioContext();
                if (!ctx) return;
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = type;
                osc.frequency.setValueAtTime(freq, ctx.currentTime);
                gain.gain.setValueAtTime(gainValue, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + duration);
            } catch (e) { }
        }

        function playReelTick() {
            playTone(320 + Math.random() * 80, 'triangle', 0.05, 0.04);
        }

        function playReelStop(idx) {
            playTone(420 + idx * 50, 'sine', 0.14, 0.09);
        }

        function playWinSound() {
            const notes = [523.25, 659.25, 783.99, 1046.50];
            notes.forEach((note, i) => {
                setTimeout(() => playTone(note, 'triangle', 0.22, 0.12), i * 90);
            });
        }

        function playClickSound() {
            playTone(720, 'sine', 0.06, 0.06);
        }

        // Состояние экономики
        let hearts = parseInt(localStorage.getItem('casino-hearts') || '10');
        let currentBet = 1;
        let isSpinning = false;
        let clickerCount = parseInt(localStorage.getItem('clicker-count') || '0');

        const heartsBalanceEl = document.getElementById('hearts-balance');
        const betDisplay = document.getElementById('bet-display');
        const betMinus = document.getElementById('bet-minus');
        const betPlus = document.getElementById('bet-plus');
        const spinBtn = document.getElementById('spin-btn');
        const slotResult = document.getElementById('slot-result');
        const clickerBtn = document.getElementById('clicker-btn');
        const clickerBar = document.getElementById('clicker-bar');
        const clickerCountEl = document.getElementById('clicker-count');
        const claimTgHearts = document.getElementById('claim-tg-hearts');

        // ---- SVG СИМВОЛЫ СЛОТОВ ----
        const SYMBOLS = [
            {
                id: 'heart',
                name: 'Сердечко',
                multiplier: 10,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-heart"><defs><radialGradient id="hG_s" cx="35%" cy="30%" r="70%"><stop offset="0%" stop-color="#ff758f"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#881337"/></radialGradient></defs><path d="M32 54 C32 54 10 40 10 24 C10 14 18 8 26 12 C29 13.5 31 16 32 18 C33 16 35 13.5 38 12 C46 8 54 14 54 24 C54 40 32 54 32 54 Z" fill="url(#hG_s)"/><path d="M18 16 C23 12 28 15 29 18 C26 17 21 18 17 23 C15 25 14 28 14 27 C13 23 15 19 18 16 Z" fill="#fff" opacity="0.65"/></svg>`
            },
            {
                id: 'crown',
                name: 'Корона',
                multiplier: 8,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-crown"><defs><linearGradient id="crG_s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fef08a"/><stop offset="45%" stop-color="#eab308"/><stop offset="100%" stop-color="#a16207"/></linearGradient></defs><path d="M10 46 L14 18 L24 30 L32 10 L40 30 L50 18 L54 46 Z" fill="url(#crG_s)" stroke="#78350f" stroke-width="1.5" stroke-linejoin="round"/><rect x="10" y="44" width="44" height="8" rx="3" fill="#ca8a04" stroke="#78350f" stroke-width="1.2"/><circle cx="14" cy="18" r="3.5" fill="#fef08a" stroke="#a16207" stroke-width="1"/><circle cx="32" cy="10" r="4.5" fill="#fef08a" stroke="#a16207" stroke-width="1"/><circle cx="50" cy="18" r="3.5" fill="#fef08a" stroke="#a16207" stroke-width="1"/><circle cx="32" cy="34" r="3.5" fill="#ef4444"/><circle cx="22" cy="48" r="2" fill="#38bdf8"/><circle cx="32" cy="48" r="2.5" fill="#ef4444"/><circle cx="42" cy="48" r="2" fill="#38bdf8"/></svg>`
            },
            {
                id: 'diamond',
                name: 'Бриллиант',
                multiplier: 7,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-diamond"><defs><linearGradient id="diaG_s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#e0f2fe"/><stop offset="50%" stop-color="#38bdf8"/><stop offset="100%" stop-color="#0284c7"/></linearGradient></defs><polygon points="18,18 46,18 56,30 32,54 8,30" fill="url(#diaG_s)" stroke="#0369a1" stroke-width="1.5" stroke-linejoin="round"/><polygon points="18,18 26,30 32,18" fill="#bae6fd" opacity="0.9"/><polygon points="32,18 38,30 46,18" fill="#bae6fd" opacity="0.9"/><polygon points="26,30 38,30 32,54" fill="#0284c7" opacity="0.7"/><polygon points="8,30 26,30 32,54" fill="#0369a1" opacity="0.85"/><polygon points="56,30 38,30 32,54" fill="#0ea5e9" opacity="0.85"/></svg>`
            },
            {
                id: 'seven',
                name: 'Семёрка',
                multiplier: 6,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-seven"><defs><linearGradient id="sevG_s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#ff3b6c"/><stop offset="50%" stop-color="#c026d3"/><stop offset="100%" stop-color="#7c3aed"/></linearGradient></defs><path d="M12 14 L52 14 L52 24 L34 54 L22 54 L38 24 L12 24 Z" fill="url(#sevG_s)" stroke="#fdf2f8" stroke-width="1.8" stroke-linejoin="round"/><path d="M16 17 L48 17" stroke="#fff" stroke-width="2" stroke-linecap="round" opacity="0.8"/><circle cx="48" cy="18" r="2.5" fill="#fde047"/></svg>`
            },
            {
                id: 'lips',
                name: 'Поцелуй',
                multiplier: 5,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-lips"><defs><linearGradient id="lipG_s" x1="0%" y1="0%" x2="0%" y2="100%"><stop offset="0%" stop-color="#fb7185"/><stop offset="50%" stop-color="#e11d48"/><stop offset="100%" stop-color="#881337"/></linearGradient></defs><path d="M8 32 C14 22 24 20 32 25 C40 20 50 22 56 32 C48 30 40 33 32 30 C24 33 16 30 8 32 Z" fill="url(#lipG_s)"/><path d="M8 32 C16 46 48 46 56 32 C44 38 20 38 8 32 Z" fill="url(#lipG_s)"/><path d="M22 24 C26 22 30 23 31 25" stroke="#fff" stroke-width="1.5" stroke-linecap="round" opacity="0.6"/></svg>`
            },
            {
                id: 'rose',
                name: 'Роза',
                multiplier: 4,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-rose"><defs><radialGradient id="rosePet_s" cx="40%" cy="40%" r="60%"><stop offset="0%" stop-color="#ff4d6d"/><stop offset="60%" stop-color="#c9184a"/><stop offset="100%" stop-color="#590d22"/></radialGradient></defs><path d="M18 46 C12 40 16 30 26 34 C24 42 20 46 18 46 Z" fill="#22c55e" stroke="#15803d" stroke-width="1"/><path d="M46 46 C52 40 48 30 38 34 C40 42 44 46 46 46 Z" fill="#16a34a" stroke="#15803d" stroke-width="1"/><circle cx="32" cy="28" r="18" fill="url(#rosePet_s)"/><path d="M22 24 C24 16 40 16 42 24 C44 32 20 34 22 24 Z" fill="#a4133c" stroke="#ff758f" stroke-width="1.2"/><path d="M26 28 C28 22 36 22 38 28 C38 33 26 33 26 28 Z" fill="#800f2f" stroke="#ff758f" stroke-width="1"/><path d="M29 27 C30 24 34 24 35 27 C35 30 29 30 29 27 Z" fill="#590d22"/></svg>`
            },
            {
                id: 'star',
                name: 'Звезда',
                multiplier: 3,
                svg: `<svg viewBox="0 0 64 64" class="slot-svg svg-star"><defs><linearGradient id="starG_s" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fffbeb"/><stop offset="40%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#d97706"/></linearGradient></defs><polygon points="32,6 38,24 56,24 42,35 48,54 32,42 16,54 22,35 8,24 26,24" fill="url(#starG_s)" stroke="#b45309" stroke-width="1.2" stroke-linejoin="round"/><circle cx="32" cy="30" r="4" fill="#fff" opacity="0.85"/></svg>`
            }
        ];

        function updateBalance() {
            if (heartsBalanceEl) heartsBalanceEl.textContent = hearts;
            localStorage.setItem('casino-hearts', hearts.toString());
        }

        function addHearts(amount) {
            hearts += amount;
            updateBalance();
            if (heartsBalanceEl) {
                heartsBalanceEl.classList.add('balance-pop');
                setTimeout(() => heartsBalanceEl.classList.remove('balance-pop'), 400);
            }
        }

        updateBalance();

        function generateSlotSymbolsWithHigherOdds() {
            // 50% шанс гарантировать хотя бы одну выигрышную линию (с повышенными шансами на топ дропы)
            const forceWin = Math.random() < 0.50;
            let grid = Array(9).fill(null);

            if (forceWin) {
                const winningLines = [
                    [0, 1, 2], [3, 4, 5], [6, 7, 8], // строки
                    [0, 3, 6], [1, 4, 7], [2, 5, 8], // столбцы
                    [0, 4, 8], [2, 4, 6]          // диагонали
                ];
                const chosenLine = winningLines[Math.floor(Math.random() * winningLines.length)];

                // Веса в пользу хороших символов (Сердечко ×10, Корона ×8, Бриллиант ×7, Семёрка ×6)
                const goodSymbols = [
                    SYMBOLS[0], SYMBOLS[0], SYMBOLS[0], // Heart (×10)
                    SYMBOLS[1], SYMBOLS[1],             // Crown (×8)
                    SYMBOLS[2], SYMBOLS[2],             // Diamond (×7)
                    SYMBOLS[3], SYMBOLS[3],             // Seven (×6)
                    SYMBOLS[4]                          // Lips (×5)
                ];
                const winSym = goodSymbols[Math.floor(Math.random() * goodSymbols.length)];
                chosenLine.forEach(idx => grid[idx] = winSym);
            }

            // Заполняем остальные клетки взвешенными символами
            const weightedSymbols = [
                SYMBOLS[0], SYMBOLS[0], // Heart
                SYMBOLS[1], SYMBOLS[1], // Crown
                SYMBOLS[2], SYMBOLS[2], // Diamond
                SYMBOLS[3], SYMBOLS[3], // Seven
                SYMBOLS[4], SYMBOLS[4], // Lips
                SYMBOLS[5],             // Rose
                SYMBOLS[6]              // Star
            ];

            for (let i = 0; i < 9; i++) {
                if (!grid[i]) {
                    grid[i] = weightedSymbols[Math.floor(Math.random() * weightedSymbols.length)];
                }
            }
            return grid;
        }

        // ---- СТАВКИ ----
        if (betMinus) {
            betMinus.addEventListener('click', () => {
                if (currentBet > 1) {
                    currentBet--;
                    betDisplay.textContent = currentBet;
                    playTone(480, 'sine', 0.05, 0.05);
                }
            });
        }
        if (betPlus) {
            betPlus.addEventListener('click', () => {
                if (currentBet < hearts && currentBet < 50) {
                    currentBet++;
                    betDisplay.textContent = currentBet;
                    playTone(540, 'sine', 0.05, 0.05);
                }
            });
        }

        // ---- СЛОТЫ 3x3 ----
        function getSlotCells() {
            const cells = [];
            for (let i = 0; i < 9; i++) {
                cells.push(document.getElementById('slot-' + i));
            }
            return cells;
        }

        function clearPaylineLights() {
            for (let i = 1; i <= 3; i++) {
                const pL = document.getElementById('payline-' + i);
                const pR = document.getElementById('payline-r' + i);
                if (pL) pL.classList.remove('active');
                if (pR) pR.classList.remove('active');
            }
            const cells = getSlotCells();
            cells.forEach(c => {
                if (c) c.classList.remove('slot-winner');
            });
        }

        function highlightPayline(rowIdx) {
            const lineNum = rowIdx + 1;
            const pL = document.getElementById('payline-' + lineNum);
            const pR = document.getElementById('payline-r' + lineNum);
            if (pL) pL.classList.add('active');
            if (pR) pR.classList.add('active');
        }

        function spinSlots() {
            if (isSpinning) return;
            if (hearts < currentBet) {
                if (slotResult) {
                    slotResult.textContent = 'Недостаточно сердечек! Заработай ещё ниже ⬇️';
                    slotResult.style.color = '#ff5555';
                }
                playTone(200, 'sawtooth', 0.15, 0.06);
                return;
            }

            isSpinning = true;
            hearts -= currentBet;
            updateBalance();
            clearPaylineLights();

            const cells = getSlotCells();
            if (slotResult) {
                slotResult.textContent = 'Крутим... Удачи! ✨';
                slotResult.style.color = 'var(--acc-color)';
            }

            cells.forEach(cell => {
                if (cell) cell.classList.add('slot-spinning');
            });

            const tickInterval = setInterval(() => {
                playReelTick();
            }, 80);

            const finalSymbols = generateSlotSymbolsWithHigherOdds();

            cells.forEach((cell, index) => {
                setTimeout(() => {
                    if (cell) {
                        cell.classList.remove('slot-spinning');
                        cell.classList.add('slot-landing');
                        cell.innerHTML = finalSymbols[index].svg;
                        cell.dataset.sym = finalSymbols[index].id;
                        playReelStop(index);
                        setTimeout(() => cell.classList.remove('slot-landing'), 350);
                    }

                    if (index === 8) {
                        clearInterval(tickInterval);
                        setTimeout(() => {
                            checkWin(finalSymbols);
                            isSpinning = false;
                        }, 350);
                    }
                }, 250 + index * 160);
            });
        }

        function checkWin(symbols) {
            let totalMultiplier = 0;
            let winDetails = [];
            const cells = getSlotCells();
            const winningIndices = new Set();

            const rows = [[0, 1, 2], [3, 4, 5], [6, 7, 8]];
            const cols = [[0, 3, 6], [1, 4, 7], [2, 5, 8]];
            const diags = [[0, 4, 8], [2, 4, 6]];

            const allSame = symbols.every(s => s.id === symbols[0].id);
            if (allSame) {
                totalMultiplier += 50;
                winDetails.push('Все 9 одинаковых! x50');
            } else {
                // Строки
                rows.forEach((line, rowIdx) => {
                    const [a, b, c] = line;
                    if (symbols[a].id === symbols[b].id && symbols[b].id === symbols[c].id) {
                        const mult = symbols[a].multiplier;
                        totalMultiplier += mult;
                        winDetails.push(`Линия ${rowIdx + 1}: 3x ${symbols[a].name} (×${mult})`);
                        line.forEach(idx => winningIndices.add(idx));
                        highlightPayline(rowIdx);
                    } else if (symbols[a].id === symbols[b].id || symbols[b].id === symbols[c].id) {
                        totalMultiplier += 1;
                        winDetails.push(`Линия ${rowIdx + 1}: пара (×1)`);
                        if (symbols[a].id === symbols[b].id) { winningIndices.add(a); winningIndices.add(b); }
                        if (symbols[b].id === symbols[c].id) { winningIndices.add(b); winningIndices.add(c); }
                    }
                });

                // Столбцы
                cols.forEach((line, colIdx) => {
                    const [a, b, c] = line;
                    if (symbols[a].id === symbols[b].id && symbols[b].id === symbols[c].id) {
                        const mult = symbols[a].multiplier;
                        totalMultiplier += mult;
                        winDetails.push(`Столбец ${colIdx + 1}: 3x ${symbols[a].name} (×${mult})`);
                        line.forEach(idx => winningIndices.add(idx));
                    }
                });

                // Диагонали
                diags.forEach((line) => {
                    const [a, b, c] = line;
                    if (symbols[a].id === symbols[b].id && symbols[b].id === symbols[c].id) {
                        totalMultiplier += 5;
                        winDetails.push(`Диагональ: 3x ${symbols[a].name} (×5)`);
                        line.forEach(idx => winningIndices.add(idx));
                    }
                });
            }

            winningIndices.forEach(idx => {
                if (cells[idx]) cells[idx].classList.add('slot-winner');
            });

            if (totalMultiplier > 0) {
                const winAmount = currentBet * totalMultiplier;
                addHearts(winAmount);
                playWinSound();
                if (slotResult) {
                    slotResult.innerHTML = `<span style="color:#34d399;font-weight:bold;">🎉 +${winAmount} сердечек!</span><br><small>${winDetails.join(' | ')}</small>`;
                    slotResult.style.color = '#34d399';
                }
                // Праздничные сердечки
                const slotMachine = document.getElementById('slot-machine');
                if (slotMachine) {
                    for (let i = 0; i < Math.min(totalMultiplier * 2, 25); i++) {
                        setTimeout(() => createCasinoHeart(slotMachine), i * 35);
                    }
                }
            } else {
                if (slotResult) {
                    slotResult.textContent = 'Попробуй ещё! Удача рядом 🍀';
                    slotResult.style.color = 'rgba(255,255,255,0.6)';
                }
            }
        }

        function createCasinoHeart(container) {
            const h = document.createElement('div');
            h.className = 'casino-confetti-heart';
            h.textContent = ['❤️', '💕', '👑', '💎', '✨', '💖', '🌟'][Math.floor(Math.random() * 7)];
            const angle = Math.random() * Math.PI * 2;
            const dist = 80 + Math.random() * 120;
            h.style.setProperty('--tx', `${Math.cos(angle) * dist}px`);
            h.style.setProperty('--ty', `${Math.sin(angle) * dist}px`);
            h.style.left = '50%';
            h.style.top = '40%';
            container.appendChild(h);
            setTimeout(() => h.remove(), 1000);
        }

        if (spinBtn) {
            spinBtn.addEventListener('click', spinSlots);
        }

        // ---- КЛИКЕР ----
        function updateClicker() {
            if (clickerCountEl) clickerCountEl.textContent = `${clickerCount % 20} / 20`;
            if (clickerBar) clickerBar.style.width = `${((clickerCount % 20) / 20) * 100}%`;
            localStorage.setItem('clicker-count', clickerCount.toString());
        }

        updateClicker();

        if (clickerBtn) {
            clickerBtn.addEventListener('click', () => {
                clickerCount++;
                clickerBtn.classList.add('clicker-pop');
                playClickSound();
                setTimeout(() => clickerBtn.classList.remove('clicker-pop'), 150);

                if (clickerCount % 20 === 0) {
                    addHearts(1);
                    playWinSound();
                    if (clickerCountEl) {
                        clickerCountEl.innerHTML = '<span style="color:#34d399;font-weight:bold;">🎉 +1 сердечко!</span>';
                        setTimeout(() => updateClicker(), 1200);
                    }
                    const container = clickerBtn.parentElement;
                    if (container) {
                        for (let i = 0; i < 10; i++) {
                            setTimeout(() => createCasinoHeart(container), i * 30);
                        }
                    }
                } else {
                    updateClicker();
                }
            });
        }

        // ---- TG EARN ----
        // Очищаем старые оставшиеся флаги из localStorage/sessionStorage
        localStorage.removeItem('tg_link_clicked_flag');
        sessionStorage.removeItem('tg_link_clicked');
        window.tgHasClickedLink = false;

        const tgEarnBtn = document.getElementById('tg-earn-btn');
        const tgWarnMsg = document.getElementById('tg-warn-msg');

        if (tgEarnBtn && !tgEarnBtn.dataset.bound) {
            tgEarnBtn.dataset.bound = 'true';
            const recordTgClick = () => {
                window.tgHasClickedLink = true;
                if (tgWarnMsg) tgWarnMsg.style.display = 'none';
            };
            tgEarnBtn.addEventListener('click', recordTgClick);
            tgEarnBtn.addEventListener('mousedown', recordTgClick);
            tgEarnBtn.addEventListener('touchstart', recordTgClick, { passive: true });
        }

        if (claimTgHearts) {
            const lastTgClaim = parseInt(localStorage.getItem('last-tg-claim') || '0');
            const cooldownMs = 5 * 60 * 1000;
            const now = Date.now();

            const updateCooldownText = (rem) => {
                const mins = Math.floor(rem / 60);
                const secs = String(rem % 60).padStart(2, '0');
                claimTgHearts.innerHTML = `<span>Подожди ${mins}:${secs}</span>`;
            };

            const resetClaimButton = () => {
                claimTgHearts.innerHTML = '<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="margin-right:6px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path></svg><span>Я написал(а)! Получить 3 ❤️</span>';
                claimTgHearts.disabled = false;
            };

            if (now - lastTgClaim < cooldownMs) {
                const remaining = Math.ceil((cooldownMs - (now - lastTgClaim)) / 1000);
                updateCooldownText(remaining);
                claimTgHearts.disabled = true;

                const cooldownInterval = setInterval(() => {
                    const rem = Math.ceil((cooldownMs - (Date.now() - lastTgClaim)) / 1000);
                    if (rem <= 0) {
                        resetClaimButton();
                        clearInterval(cooldownInterval);
                    } else {
                        updateCooldownText(rem);
                    }
                }, 1000);
            }

            if (!claimTgHearts.dataset.bound) {
                claimTgHearts.dataset.bound = 'true';
                claimTgHearts.addEventListener('click', () => {
                    if (claimTgHearts.disabled) return;

                    // Строгая проверка: если не было клика по кнопке Telegram — НЕ ДАЁМ СЕРДЕЧКИ!
                    if (!window.tgHasClickedLink) {
                        if (tgWarnMsg) {
                            tgWarnMsg.style.display = 'flex';
                        }
                        if (tgEarnBtn) {
                            tgEarnBtn.classList.remove('shake-anim');
                            void tgEarnBtn.offsetWidth; // force reflow for CSS animation
                            tgEarnBtn.classList.add('shake-anim');
                        }
                        return;
                    }

                    // СБРАСЫВАЕМ ФЛАГ КЛИКА КНОПКИ ТЕЛЕГРАМА!
                    window.tgHasClickedLink = false;

                    if (tgWarnMsg) tgWarnMsg.style.display = 'none';

                    addHearts(3);
                    playWinSound();
                    localStorage.setItem('last-tg-claim', Date.now().toString());
                    claimTgHearts.innerHTML = '<span>✅ +3 сердечка!</span>';
                    claimTgHearts.disabled = true;

                    setTimeout(() => {
                        const cooldownInterval2 = setInterval(() => {
                            const start = parseInt(localStorage.getItem('last-tg-claim') || '0');
                            const rem = Math.ceil((cooldownMs - (Date.now() - start)) / 1000);
                            if (rem <= 0) {
                                resetClaimButton();
                                clearInterval(cooldownInterval2);
                            } else {
                                updateCooldownText(rem);
                            }
                        }, 1000);
                    }, 2000);
                });
            }
        }

        // ---- Звёзды на футере ----
        const m6Stars = document.getElementById('m6-final-stars');
        if (m6Stars) {
            for (let i = 0; i < 25; i++) {
                const star = document.createElement('div');
                star.className = 'm4-star';
                star.style.left = (Math.random() * 100) + '%';
                star.style.top = (Math.random() * 100) + '%';
                star.style.animationDelay = (Math.random() * 3) + 's';
                star.style.animationDuration = (1.5 + Math.random() * 2) + 's';
                m6Stars.appendChild(star);
            }
        }

        // ==================================================================== //
        // МАГАЗИН ЛЮБВИ
        // ==================================================================== //
        const shopHeartsDisplay = document.getElementById('shop-hearts-display');
        const shopItems = document.querySelectorAll('.shop-item');

        function updateShopBalance() {
            if (shopHeartsDisplay) shopHeartsDisplay.textContent = hearts;
        }
        updateShopBalance();

        const shopRewards = {
            hug: [
                '🤗 Обнимашка отправлена! Я обнимаю тебя крепко-крепко!',
                '🤗 Ловии! *обнимаю так сильно что хрустишь*',
                '🤗 Самые тёплые объятия летят к тебе! Не отпущу!'
            ],
            kiss: [
                '💋 Чмок! Нежный поцелуй прямо в губки!',
                '💋 *целует* Ммм, ты такая сладкая!',
                '💋 Поцелуйчик доставлен! И ещё один в лобик!'
            ],
            hickey: [
                '🔥 Засос поставлен! Теперь все знают — ты моя!',
                '🔥 *присасывается к шейке* Готово! Красивый получился!',
                '🔥 Теперь на твоей шее мой знак! Только моя!'
            ],
            cuddlenight: [
                '🌙 Ночь обнимашек активирована! Не отпущу до утра!',
                '🌙 Укутываю тебя в одеялко, обнимаю и шепчу на ушко...',
                '🌙 Целая ночь нежности! Буду гладить по головке до утра!'
            ],
            breakfast: [
                '☕ Завтрак готов! Блинчики с клубникой и горячий кофе в постель!',
                '🥞 Просыпайся, котик! Я приготовил твои любимые!',
                '☕ Кофе, тосты, фрукты и поцелуйчик — завтрак в постель!'
            ],
            dreamdate: [
                '✨ Свидание мечты забронировано! Свечи, музыка и звёзды!',
                '✨ Волшебный вечер ждёт! Оденься красиво, я заеду за тобой!',
                '✨ Самое романтичное свидание в мире — только для тебя!'
            ]
        };

        shopItems.forEach(item => {
            const buyBtn = item.querySelector('.shop-buy-btn');
            if (!buyBtn) return;

            buyBtn.addEventListener('click', () => {
                const shopType = item.dataset.shop;
                const price = parseInt(item.dataset.price);
                const rewardEl = document.getElementById('shop-reward-' + shopType);

                if (hearts < price) {
                    if (rewardEl) {
                        rewardEl.textContent = '❌ Недостаточно сердечек!';
                        rewardEl.style.color = '#ff5555';
                        rewardEl.classList.add('show');
                        setTimeout(() => rewardEl.classList.remove('show'), 2500);
                    }
                    return;
                }

                hearts -= price;
                updateBalance();
                updateShopBalance();

                const msgs = shopRewards[shopType] || ['❤️ Подарок получен!'];
                const msg = msgs[Math.floor(Math.random() * msgs.length)];

                if (rewardEl) {
                    rewardEl.textContent = msg;
                    rewardEl.style.color = '#34d399';
                    rewardEl.classList.add('show');
                    setTimeout(() => rewardEl.classList.remove('show'), 4000);
                }

                // Анимация покупки
                buyBtn.style.transform = 'scale(0.9)';
                setTimeout(() => buyBtn.style.transform = '', 200);

                if (typeof playWinSound === 'function') playWinSound();

                // Конфетти
                const container = item;
                for (let i = 0; i < 8; i++) {
                    setTimeout(() => createCasinoHeart(container), i * 40);
                }
            });
        });

        // ==================================================================== //
        // ЕЖЕДНЕВНЫЙ БОНУС
        // ==================================================================== //
        const dailyBonusBtn = document.getElementById('daily-bonus-btn');
        const dailyBonusStatus = document.getElementById('daily-bonus-status');
        const dailyBonusGift = document.getElementById('daily-bonus-gift');

        if (dailyBonusBtn) {
            const lastDailyBonus = parseInt(localStorage.getItem('last-daily-bonus') || '0');
            const dailyCooldown = 24 * 60 * 60 * 1000; // 24 часа
            const now = Date.now();

            if (now - lastDailyBonus < dailyCooldown) {
                dailyBonusBtn.disabled = true;
                const remaining = dailyCooldown - (now - lastDailyBonus);
                const hrs = Math.floor(remaining / 3600000);
                const mins = Math.floor((remaining % 3600000) / 60000);
                if (dailyBonusStatus) dailyBonusStatus.textContent = `Следующий бонус через ${hrs}ч ${mins}м`;
                dailyBonusBtn.textContent = '✅ Бонус уже получен сегодня';

                // Таймер обновления
                const dailyInterval = setInterval(() => {
                    const rem = dailyCooldown - (Date.now() - lastDailyBonus);
                    if (rem <= 0) {
                        dailyBonusBtn.disabled = false;
                        dailyBonusBtn.innerHTML = `<svg viewBox="0 0 24 24" fill="currentColor" stroke="none" style="width:20px;height:20px;margin-right:8px;"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg> Забрать бонус +5 ❤️`;
                        if (dailyBonusStatus) dailyBonusStatus.textContent = '';
                        clearInterval(dailyInterval);
                    } else {
                        const h = Math.floor(rem / 3600000);
                        const m = Math.floor((rem % 3600000) / 60000);
                        if (dailyBonusStatus) dailyBonusStatus.textContent = `Следующий бонус через ${h}ч ${m}м`;
                    }
                }, 60000);
            }

            dailyBonusBtn.addEventListener('click', () => {
                if (dailyBonusBtn.disabled) return;

                addHearts(5);
                updateShopBalance();
                localStorage.setItem('last-daily-bonus', Date.now().toString());

                dailyBonusBtn.disabled = true;
                dailyBonusBtn.textContent = '✅ +5 сердечек получено!';
                if (dailyBonusStatus) dailyBonusStatus.textContent = 'Приходи завтра за новым бонусом!';
                if (dailyBonusGift) dailyBonusGift.style.animation = 'none';

                if (typeof playWinSound === 'function') playWinSound();

                // Конфетти
                const panel = dailyBonusBtn.parentElement;
                if (panel) {
                    for (let i = 0; i < 15; i++) {
                        setTimeout(() => createCasinoHeart(panel), i * 40);
                    }
                }
            });
        }

        // ==================================================================== //
        // ФРИСПИНЫ
        // ==================================================================== //
        const freespinCount = document.getElementById('freespins-count');
        const freespinClaimBtn = document.getElementById('freespin-claim-btn');
        const freespinUseBtn = document.getElementById('freespin-use-btn');
        const freespinStatus = document.getElementById('freespin-status');

        let freeSpins = parseInt(localStorage.getItem('free-spins') || '0');

        function updateFreespins() {
            if (freespinCount) freespinCount.textContent = freeSpins;
            localStorage.setItem('free-spins', freeSpins.toString());
            if (freespinUseBtn) {
                freespinUseBtn.style.display = freeSpins > 0 ? 'inline-flex' : 'none';
            }
        }
        updateFreespins();

        if (freespinClaimBtn) {
            const lastFreespinClaim = parseInt(localStorage.getItem('last-freespin-claim') || '0');
            const freespinCooldown = 10 * 60 * 1000; // 10 минут
            const fsNow = Date.now();

            if (fsNow - lastFreespinClaim < freespinCooldown) {
                freespinClaimBtn.disabled = true;
                const updateFsCooldown = () => {
                    const rem = freespinCooldown - (Date.now() - lastFreespinClaim);
                    if (rem <= 0) {
                        freespinClaimBtn.disabled = false;
                        freespinClaimBtn.textContent = 'Получить 3 фриспина (раз в 10 мин)';
                        if (freespinStatus) freespinStatus.textContent = '';
                        clearInterval(fsInterval);
                    } else {
                        const m = Math.floor(rem / 60000);
                        const s = Math.floor((rem % 60000) / 1000);
                        freespinClaimBtn.textContent = `Подожди ${m}:${String(s).padStart(2, '0')}`;
                    }
                };
                updateFsCooldown();
                const fsInterval = setInterval(updateFsCooldown, 1000);
            }

            freespinClaimBtn.addEventListener('click', () => {
                if (freespinClaimBtn.disabled) return;

                freeSpins += 3;
                updateFreespins();
                localStorage.setItem('last-freespin-claim', Date.now().toString());

                freespinClaimBtn.disabled = true;
                if (freespinStatus) freespinStatus.textContent = '🎉 +3 фриспина получено!';

                if (typeof playWinSound === 'function') playWinSound();

                setTimeout(() => {
                    if (freespinStatus) freespinStatus.textContent = '';
                }, 3000);

                // Кулдаун
                const startClaim = Date.now();
                const fsInterval2 = setInterval(() => {
                    const rem = freespinCooldown - (Date.now() - startClaim);
                    if (rem <= 0) {
                        freespinClaimBtn.disabled = false;
                        freespinClaimBtn.textContent = 'Получить 3 фриспина (раз в 10 мин)';
                        clearInterval(fsInterval2);
                    } else {
                        const m = Math.floor(rem / 60000);
                        const s = Math.floor((rem % 60000) / 1000);
                        freespinClaimBtn.textContent = `Подожди ${m}:${String(s).padStart(2, '0')}`;
                    }
                }, 1000);
            });
        }

        if (freespinUseBtn) {
            freespinUseBtn.addEventListener('click', () => {
                if (freeSpins <= 0 || isSpinning) return;

                freeSpins--;
                updateFreespins();

                // Крутим слоты бесплатно (без списания сердечек)
                if (isSpinning) return;
                isSpinning = true;
                clearPaylineLights();

                const cells = getSlotCells();
                if (slotResult) {
                    slotResult.textContent = '🎰 ФРИСПИН! Удачи! ✨';
                    slotResult.style.color = '#fbbf24';
                }

                cells.forEach(cell => {
                    if (cell) cell.classList.add('slot-spinning');
                });

                const tickInterval = setInterval(() => {
                    if (typeof playReelTick === 'function') playReelTick();
                }, 80);

                const finalSymbols = [];
                for (let i = 0; i < 9; i++) {
                    finalSymbols.push(SYMBOLS[Math.floor(Math.random() * SYMBOLS.length)]);
                }

                cells.forEach((cell, index) => {
                    setTimeout(() => {
                        if (cell) {
                            cell.classList.remove('slot-spinning');
                            cell.classList.add('slot-landing');
                            cell.innerHTML = finalSymbols[index].svg;
                            cell.dataset.sym = finalSymbols[index].id;
                            if (typeof playReelStop === 'function') playReelStop(index);
                            setTimeout(() => cell.classList.remove('slot-landing'), 350);
                        }

                        if (index === 8) {
                            clearInterval(tickInterval);
                            setTimeout(() => {
                                checkWin(finalSymbols);
                                updateShopBalance();
                                isSpinning = false;
                            }, 350);
                        }
                    }, 250 + index * 160);
                });

                // Скроллим к слотам
                const slotMachine = document.getElementById('slot-machine');
                if (slotMachine) {
                    slotMachine.scrollIntoView({ behavior: 'smooth', block: 'center' });
                }
            });
        }

        // =============================================
        // ROBLOX МУСОР ДРОП (ROBUX КЕЙС РАЗ В 2 ДНЯ)
        // =============================================
        const ROBLOX_DROPS = [
            {
                id: 'robux_1',
                name: '1 Robux 🪙',
                amount: 1,
                badgeText: '1 R$ (Обычный)',
                badgeClass: 'rarity-gray',
                desc: 'Маленькая монетка Robux на удачу!',
                rewardHearts: 2,
                color: '#94a3b8',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#64748b" stroke="#94a3b8" stroke-width="2.5"/><polygon points="32,18 42,32 32,46 22,32" fill="#cbd5e1"/><rect x="27" y="27" width="10" height="10" transform="rotate(45 32 32)" fill="#f8fafc"/></svg>`
            },
            {
                id: 'robux_5',
                name: '5 Robux 🪙',
                amount: 5,
                badgeText: '5 R$ (Обычный)',
                badgeClass: 'rarity-gray',
                desc: 'Первые 5 Robux в копилочку Леры!',
                rewardHearts: 3,
                color: '#94a3b8',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#475569" stroke="#94a3b8" stroke-width="2.5"/><polygon points="32,18 42,32 32,46 22,32" fill="#e2e8f0"/><text x="32" y="36" font-size="12" font-weight="bold" fill="#0f172a" text-anchor="middle">5</text></svg>`
            },
            {
                id: 'robux_15',
                name: '15 Robux 💵',
                amount: 15,
                badgeText: '15 R$ (Необычный)',
                badgeClass: 'rarity-green',
                desc: 'Уже хватит на классную причёску или аксессуар!',
                rewardHearts: 5,
                color: '#22c55e',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#15803d" stroke="#4ade80" stroke-width="2.5"/><polygon points="32,16 44,32 32,48 20,32" fill="#86efac"/><rect x="26" y="26" width="12" height="12" transform="rotate(45 32 32)" fill="#15803d"/></svg>`
            },
            {
                id: 'robux_30',
                name: '30 Robux 💵',
                amount: 30,
                badgeText: '30 R$ (Необычный)',
                badgeClass: 'rarity-green',
                desc: 'Отличный куш! Можно купить стильный мерч!',
                rewardHearts: 8,
                color: '#22c55e',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#166534" stroke="#22c55e" stroke-width="2.5"/><polygon points="32,16 44,32 32,48 20,32" fill="#4ade80"/><text x="32" y="37" font-size="14" font-weight="bold" fill="#052e16" text-anchor="middle">30</text></svg>`
            },
            {
                id: 'robux_75',
                name: '75 Robux 💎',
                amount: 75,
                badgeText: '75 R$ (Редкий)',
                badgeClass: 'rarity-blue',
                desc: 'Серьёзный дроп! Хватит на крутой анимационный пак!',
                rewardHearts: 12,
                color: '#38bdf8',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#0369a1" stroke="#38bdf8" stroke-width="2.5"/><polygon points="32,14 46,32 32,50 18,32" fill="#bae6fd"/><rect x="25" y="25" width="14" height="14" transform="rotate(45 32 32)" fill="#0284c7"/></svg>`
            },
            {
                id: 'robux_150',
                name: '150 Robux 💜',
                amount: 150,
                badgeText: '150 R$ (Эпический)',
                badgeClass: 'rarity-purple',
                desc: 'Ух ты! Крутой VIP геймпасс в любой игре!',
                rewardHearts: 18,
                color: '#c084fc',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#6b21a8" stroke="#c084fc" stroke-width="2.5"/><polygon points="32,14 46,32 32,50 18,32" fill="#e9d5ff"/><text x="32" y="37" font-size="13" font-weight="bold" fill="#3b0764" text-anchor="middle">150</text></svg>`
            },
            {
                id: 'robux_300',
                name: '300 Robux 🔥',
                amount: 300,
                badgeText: '300 R$ (Мифический)',
                badgeClass: 'rarity-red',
                desc: 'Огромный выигрыш! Лера теперь богачка в Roblox!',
                rewardHearts: 25,
                color: '#ef4444',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><circle cx="32" cy="32" r="22" fill="#991b1b" stroke="#f87171" stroke-width="2.5"/><polygon points="32,12 48,32 32,52 16,32" fill="#fca5a5"/><rect x="24" y="24" width="16" height="16" transform="rotate(45 32 32)" fill="#b91c1c"/></svg>`
            },
            {
                id: 'robux_600',
                name: '600 Robux 👑',
                amount: 600,
                badgeText: '👑 СУПЕР ДЖЕКПОТ (600 R$)',
                badgeClass: 'rarity-gold',
                desc: 'МАКСИМАЛЬНЫЙ ДЖЕКПОТ 600 ROBUX! Самый редкий дроп!',
                rewardHearts: 50,
                color: '#fbbf24',
                svg: `<svg viewBox="0 0 64 64" width="56" height="56"><defs><linearGradient id="goldRobuxG" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" stop-color="#fffbeb"/><stop offset="50%" stop-color="#fbbf24"/><stop offset="100%" stop-color="#b45309"/></linearGradient></defs><circle cx="32" cy="32" r="23" fill="url(#goldRobuxG)" stroke="#fef08a" stroke-width="3"/><polygon points="32,10 50,32 32,54 14,32" fill="#fef08a" stroke="#b45309" stroke-width="1.5"/><rect x="23" y="23" width="18" height="18" transform="rotate(45 32 32)" fill="#d97706"/></svg>`
            }
        ];

        const openCaseBtn = document.getElementById('open-roblox-case-btn');
        const caseStatus = document.getElementById('roblox-case-status');
        const caseTape = document.getElementById('roblox-case-tape');
        const dropModal = document.getElementById('roblox-drop-modal');
        const dropRarity = document.getElementById('drop-modal-rarity');
        const dropIcon = document.getElementById('drop-modal-icon');
        const dropTitle = document.getElementById('drop-modal-title');
        const dropDesc = document.getElementById('drop-modal-desc');
        const dropReward = document.getElementById('drop-modal-reward');
        const closeDropBtn = document.getElementById('close-drop-modal-btn');
        const invGrid = document.getElementById('roblox-inventory-grid');
        const invCount = document.getElementById('roblox-inv-count');
        const totalRobuxEl = document.getElementById('roblox-total-robux');

        const ROBLOX_COOLDOWN_MS = 2 * 24 * 60 * 60 * 1000; // 48 часов (2 дня)

        function renderRobloxInventory() {
            if (!invGrid) return;
            const inv = JSON.parse(localStorage.getItem('roblox-inventory') || '[]');
            if (invCount) invCount.textContent = inv.length;

            const totalRobux = inv.reduce((sum, item) => sum + (item.amount || 0), 0);
            if (totalRobuxEl) totalRobuxEl.textContent = totalRobux;

            invGrid.innerHTML = '';
            if (inv.length === 0) {
                invGrid.innerHTML = '<p style="opacity:0.6;font-size:0.9rem;grid-column:1/-1;">История робаксов пуста! Открой кейс выше 📦</p>';
                return;
            }
            inv.slice().reverse().forEach(item => {
                const card = document.createElement('div');
                card.className = `inv-item-card glass-panel ${item.badgeClass || ''}`;
                card.innerHTML = `
                    <div class="inv-item-icon">${item.svg}</div>
                    <div class="inv-item-title">${item.name}</div>
                    <div class="inv-item-badge" style="color:${item.color}">${item.badgeText}</div>
                `;
                invGrid.appendChild(card);
            });
        }

        function populateRouletteTape() {
            if (!caseTape) return;
            caseTape.style.transition = 'none';
            caseTape.style.transform = 'translateX(0px)';
            caseTape.innerHTML = '';
            for (let i = 0; i < 40; i++) {
                const drop = ROBLOX_DROPS[Math.floor(Math.random() * ROBLOX_DROPS.length)];
                const itemEl = document.createElement('div');
                itemEl.className = `case-item-card ${drop.badgeClass || ''}`;
                itemEl.innerHTML = `
                    <div class="case-item-icon">${drop.svg}</div>
                    <div class="case-item-name" style="color:${drop.color}">${drop.name}</div>
                `;
                caseTape.appendChild(itemEl);
            }
        }

        populateRouletteTape();
        renderRobloxInventory();

        if (openCaseBtn) {
            const checkRobloxCooldown = () => {
                const lastClaim = parseInt(localStorage.getItem('last-roblox-case-claim') || '0');
                const now = Date.now();
                if (now - lastClaim < ROBLOX_COOLDOWN_MS) {
                    const remMs = ROBLOX_COOLDOWN_MS - (now - lastClaim);
                    const hours = Math.floor(remMs / (1000 * 60 * 60));
                    const mins = Math.floor((remMs % (1000 * 60 * 60)) / (1000 * 60));
                    const secs = Math.floor((remMs % (1000 * 60)) / 1000);
                    openCaseBtn.disabled = true;
                    if (caseStatus) caseStatus.textContent = `До следующего кейса: ${hours}ч ${mins}мин ${secs}сек`;
                    return true;
                } else {
                    openCaseBtn.disabled = false;
                    if (caseStatus) caseStatus.textContent = 'Кейс готов к открытию! 📦';
                    return false;
                }
            };

            checkRobloxCooldown();
            setInterval(checkRobloxCooldown, 1000);

            openCaseBtn.addEventListener('click', () => {
                if (openCaseBtn.disabled) return;
                if (checkRobloxCooldown()) return;

                openCaseBtn.disabled = true;
                if (caseStatus) caseStatus.textContent = 'Крутим кейс... 🎲';

                // Взвешенные шансы (1-5 R$ высший шанс, 600 R$ наименьший куш)
                const weightedPool = [
                    ROBLOX_DROPS[0], ROBLOX_DROPS[0], ROBLOX_DROPS[0], ROBLOX_DROPS[0], ROBLOX_DROPS[0], ROBLOX_DROPS[0], // 1 R$ (высший)
                    ROBLOX_DROPS[1], ROBLOX_DROPS[1], ROBLOX_DROPS[1], ROBLOX_DROPS[1], ROBLOX_DROPS[1], // 5 R$
                    ROBLOX_DROPS[2], ROBLOX_DROPS[2], ROBLOX_DROPS[2], ROBLOX_DROPS[2], // 15 R$
                    ROBLOX_DROPS[3], ROBLOX_DROPS[3], ROBLOX_DROPS[3], // 30 R$
                    ROBLOX_DROPS[4], ROBLOX_DROPS[4], // 75 R$
                    ROBLOX_DROPS[5], // 150 R$
                    ROBLOX_DROPS[6], // 300 R$
                    ROBLOX_DROPS[7]  // 600 R$ (Джекпот!)
                ];
                const winningDrop = weightedPool[Math.floor(Math.random() * weightedPool.length)];

                caseTape.style.transition = 'none';
                caseTape.style.transform = 'translateX(0px)';
                caseTape.innerHTML = '';

                for (let i = 0; i < 35; i++) {
                    const dropItem = (i === 28) ? winningDrop : ROBLOX_DROPS[Math.floor(Math.random() * ROBLOX_DROPS.length)];
                    const itemEl = document.createElement('div');
                    itemEl.className = `case-item-card ${dropItem.badgeClass || ''}`;
                    if (i === 28) itemEl.classList.add('winner-target');
                    itemEl.innerHTML = `
                        <div class="case-item-icon">${dropItem.svg}</div>
                        <div class="case-item-name" style="color:${dropItem.color}">${dropItem.name}</div>
                    `;
                    caseTape.appendChild(itemEl);
                }

                const cardWidth = 130;
                const containerEl = document.getElementById('roblox-roulette-container');
                const containerWidth = containerEl ? containerEl.offsetWidth : 340;
                const targetOffset = (28 * cardWidth) - (containerWidth / 2) + (cardWidth / 2);

                setTimeout(() => {
                    caseTape.style.transition = 'transform 4.5s cubic-bezier(0.15, 0.9, 0.2, 1)';
                    caseTape.style.transform = `translateX(-${targetOffset}px)`;
                }, 50);

                let soundTicks = 0;
                const tickTimer = setInterval(() => {
                    playReelTick();
                    soundTicks++;
                    if (soundTicks >= 25) clearInterval(tickTimer);
                }, 150);

                setTimeout(() => {
                    clearInterval(tickTimer);
                    playWinSound();
                    localStorage.setItem('last-roblox-case-claim', Date.now().toString());

                    const inv = JSON.parse(localStorage.getItem('roblox-inventory') || '[]');
                    inv.push(winningDrop);
                    localStorage.setItem('roblox-inventory', JSON.stringify(inv));
                    renderRobloxInventory();

                    addHearts(winningDrop.rewardHearts);

                    if (dropRarity) {
                        dropRarity.textContent = winningDrop.badgeText;
                        dropRarity.style.color = winningDrop.color;
                    }
                    if (dropIcon) dropIcon.innerHTML = winningDrop.svg;
                    if (dropTitle) dropTitle.textContent = winningDrop.name;
                    if (dropDesc) dropDesc.textContent = winningDrop.desc;
                    if (dropReward) dropReward.textContent = `+${winningDrop.rewardHearts} ❤️ в баланс!`;
                    if (dropModal) dropModal.style.display = 'flex';

                    checkRobloxCooldown();
                }, 4800);
            });
        }

        if (closeDropBtn && dropModal) {
            closeDropBtn.addEventListener('click', () => {
                dropModal.style.display = 'none';
            });
        }

        // Обновляем баланс магазина при каждом изменении основного баланса
        if (heartsBalanceEl) {
            const balanceObserver = new MutationObserver(() => {
                updateShopBalance();
            });
            balanceObserver.observe(heartsBalanceEl, { childList: true, characterData: true, subtree: true });
        }
    }

    // ==================================================================== //
    // ========================= МЕСЯЦ 7 — ТАЙМЛАЙН ====================== //
    // ==================================================================== //
    let month7Inited = false;
    function initMonth7() {
        if (month7Inited) return;
        month7Inited = true;

        const timeline = document.getElementById('m7-timeline');
        const lineFill = document.getElementById('m7-timeline-line-fill');
        const lightbox = document.getElementById('m7-lightbox');
        const lightboxImg = document.getElementById('m7-lightbox-img');
        const lightboxClose = document.getElementById('m7-lightbox-close');

        if (!timeline) return;

        // ---- Scroll reveal (IntersectionObserver) ----
        const tlItems = timeline.querySelectorAll('.m7-tl-item');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, i) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                    observer.unobserve(entry.target);
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -60px 0px'
        });

        tlItems.forEach(item => observer.observe(item));

        // ---- Timeline line fill on scroll ----
        function updateLineFill() {
            if (!lineFill || !timeline) return;
            const rect = timeline.getBoundingClientRect();
            const timelineTop = rect.top;
            const timelineHeight = rect.height;
            const viewportHeight = window.innerHeight;

            // Calculate how much we've scrolled through the timeline
            const scrolled = viewportHeight - timelineTop;
            const total = timelineHeight + viewportHeight;
            let progress = Math.max(0, Math.min(1, scrolled / total));

            // Ease out the progress
            progress = 1 - Math.pow(1 - progress, 2);

            lineFill.style.height = (progress * 100) + '%';
        }

        window.addEventListener('scroll', updateLineFill, { passive: true });
        updateLineFill();

        // ---- Lightbox ----
        if (lightbox && lightboxImg && lightboxClose) {
            const closeLightbox = () => {
                lightbox.classList.remove('is-open');
                lightbox.setAttribute('aria-hidden', 'true');
                document.body.style.overflow = '';
            };

            // Click on any image in the timeline to open lightbox
            const allImgs = timeline.querySelectorAll('.m7-tl-img-wrap img');
            allImgs.forEach(img => {
                img.addEventListener('click', (e) => {
                    e.stopPropagation();
                    lightboxImg.src = img.src;
                    lightbox.classList.add('is-open');
                    lightbox.setAttribute('aria-hidden', 'false');
                    document.body.style.overflow = 'hidden';
                });
            });

            lightboxClose.addEventListener('click', closeLightbox);

            lightbox.addEventListener('click', (e) => {
                if (e.target === lightbox) {
                    closeLightbox();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape' && lightbox.classList.contains('is-open')) {
                    closeLightbox();
                }
            });
        }

        // ---- Floating hearts in cards on hover ----
        const cards = timeline.querySelectorAll('.m7-tl-card');
        cards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                for (let i = 0; i < 3; i++) {
                    const heart = document.createElement('span');
                    heart.textContent = ['💕', '💖', '✨', '💗', '🌸'][Math.floor(Math.random() * 5)];
                    heart.style.cssText = `
                        position: absolute;
                        font-size: ${12 + Math.random() * 10}px;
                        left: ${20 + Math.random() * 60}%;
                        bottom: 10%;
                        pointer-events: none;
                        z-index: 20;
                        animation: m7HoverHeart ${1.5 + Math.random()}s ease-out forwards;
                        opacity: 0;
                    `;
                    card.style.position = 'relative';
                    card.appendChild(heart);
                    setTimeout(() => heart.remove(), 2500);
                }
            });
        });

        // Add the hover heart animation
        if (!document.getElementById('m7-hover-style')) {
            const style = document.createElement('style');
            style.id = 'm7-hover-style';
            style.textContent = `
                @keyframes m7HoverHeart {
                    0% { transform: translateY(0) scale(0.5); opacity: 0; }
                    20% { opacity: 1; }
                    100% { transform: translateY(-80px) scale(1.2) rotate(${Math.random() > 0.5 ? '' : '-'}15deg); opacity: 0; }
                }
            `;
            document.head.appendChild(style);
        }

        // ---- Stats counters animation (> 61 400 messages & ≈ 4 900 hours) ----
        const messagesCountEl = document.getElementById('m7-messages-count');
        const hoursCountEl = document.getElementById('m7-hours-count');
        const statsSectionEl = document.querySelector('.m7-stats-section') || messagesCountEl;

        if (statsSectionEl) {
            let counted = false;
            const targetMsgs = 61400;
            const targetHours = 4900;
            const countObserver = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting && !counted) {
                    counted = true;
                    const duration = 2200;
                    const startTime = performance.now();
                    function updateCount(now) {
                        const elapsed = now - startTime;
                        const progress = Math.min(1, elapsed / duration);
                        // Ease out quartic
                        const ease = 1 - Math.pow(1 - progress, 4);
                        if (messagesCountEl) {
                            const curMsgs = Math.floor(ease * targetMsgs);
                            messagesCountEl.textContent = curMsgs.toLocaleString('ru-RU');
                        }
                        if (hoursCountEl) {
                            const curHours = Math.floor(ease * targetHours);
                            hoursCountEl.textContent = curHours.toLocaleString('ru-RU');
                        }
                        if (progress < 1) {
                            requestAnimationFrame(updateCount);
                        } else {
                            if (messagesCountEl) messagesCountEl.textContent = '61 400';
                            if (hoursCountEl) hoursCountEl.textContent = '4 900';
                        }
                    }
                    requestAnimationFrame(updateCount);
                    countObserver.unobserve(statsSectionEl);
                }
            }, { threshold: 0.2 });
            countObserver.observe(statsSectionEl);
        }

        // ---- Footer stars ----
        const starsContainer = document.getElementById('m7-final-stars');
        if (starsContainer) {
            for (let i = 0; i < 30; i++) {
                const star = document.createElement('div');
                star.style.cssText = `
                    position: absolute;
                    width: ${2 + Math.random() * 3}px;
                    height: ${2 + Math.random() * 3}px;
                    background: rgba(192, 132, 252, ${0.3 + Math.random() * 0.5});
                    border-radius: 50%;
                    top: ${Math.random() * 100}%;
                    left: ${Math.random() * 100}%;
                    animation: m7StarTwinkle ${2 + Math.random() * 4}s ease-in-out infinite;
                    animation-delay: ${Math.random() * 3}s;
                `;
                starsContainer.appendChild(star);
            }
            if (!document.getElementById('m7-star-style')) {
                const style = document.createElement('style');
                style.id = 'm7-star-style';
                style.textContent = `
                    @keyframes m7StarTwinkle {
                        0%, 100% { opacity: 0.3; transform: scale(1); }
                        50% { opacity: 1; transform: scale(1.5); }
                    }
                `;
                document.head.appendChild(style);
            }
        }
    }

});
