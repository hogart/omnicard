if (!locale) {
    var locale = {};
};

locale.ru = {
    q: {
        open: '«',
        close: '»'
    },

    license: 'Лицензия MIT',
    decksHeader: 'Колоды',
    newDeck: 'Добавить колоду',
    settings: 'Настройки',

    done: 'Готово',
    cancel: 'Отмена',
    save: 'Сохранить',
    invalidFormat: 'Некорректный формат',


    welcomeHeader: 'Добро пожаловать в OmniCard!',
    welcomeFirst: 'Мы помогаем изучать языки при помощи известного метода флэш-карточек.',
    welcomeSecond: 'OmniCard — не учебник и не руководство. Рассматривайте его как тетрадь для упражнений, которую вы сами создаете и наполняете (хотя мы и предоставляем несколько встроенных карточек).',
    welcomeChoose: 'Выберите свои языки:',
    welcomeSpeak: 'Мой родной язык…',
    welcomeLearn: 'Я изучаю…',
    welcomeInterface: 'Я хочу интерфейс на…',
    welcomeStart: 'Начать!',


    meditation: 'Медитация',
    meditationExplanation: 'Показываются обе стороны карточки, вопрос и ответ, позволяя изучать и запоминать материал.',
    test: 'Тест',
    testExplanation: 'Предполагает выбор одного правильного ответа из 4. Предназначается для дальнейшего фиксирования знаний. Не для всех колод.',
    exam: 'Экзамен',
    examExplanation: 'Самый сложный режим: ответы надо вводить вручную. Это особенно полезно для тренировки навыков письма.',


    helpHeader: 'Выбирайте колоду из списка слева и начинайте изучение!',
    helpFirst: 'Каждая колода предоставляет несколько режимов, в которых ее можно листать.',
    helpAlso: 'Также можно (и нужно) создавать свои колоды, что развивает навыки письма на изучаемом языке.',

    faq: 'ЧаВО',
    faqDeckQ: 'Что такое карточка? Что такое колода?',
    faqDeckA: 'Карточка это пара из вопроса (на родном языке) и ответа (на изучаемом). Колода — набор таких карточек, составленный по любому критерию.',
    faqEditQ: 'Как редактировать/удалить колоду?',
    faqEditA: 'Откройте ее и обратите внимание на две иконки в правом верхнем углу описания. ' +
        'Иконка с карандашом открывает редактирование, а мусорная корзина удаляет колоду. ' +
        'Встроенные колоды можно только скрыть (иконка с закрытым глазом).',
    faqCreateQ: 'Как создать колоду?',
    faqCreateA: 'Используйте кнопку <span class="badge">Добавить колоду…</span> под списком колод слева.',

    faqShareQ: 'Я создал/отредактировал колоды на моем главном компьютере, как их перенести на телефон/планшет/другой компьютер?',
    faqShareA1: 'Откройте колоду, которую хотите перенести, и нажмите на кнопку редактирования.',
    faqShareA2: 'Нажмите кнопку <span class="badge">Экспортировать колоду целиком</span>. Появится большое поле со странным текстом.',
    faqShareA3: 'Скопируйте этот текст в буфер обмена.',
    faqShareA4: 'Поскольку это просто текст, его можно вставить куда угодно. Сохраните на  \
                      <a href="https://drive.google.com" target="_blank">Google Drive</a>, пошлите самому себе электронное письмо, \
                      воспользуйтесь любым <a href="http://pastebin.com/">pastebin</a>-сервисом, и т.д.',
    faqShareA5: 'Откройте пересланный текст на том устройтве, на которое хотите перенести колоду, и скопируйте текст в буфер обмена.',
    faqShareA6: 'Откройте OmniCard, и кликните на <span class="badge">Добавить колоду…</span>. Кликните <span class="badge">Импортировать колоду</span>. Откроется поле для ввода текста.',
    faqShareA7: 'Вставьте текст из буфера обмена. Кликните <span class="badge">Готово</span>.',
    faqShareA8: 'Звучит сложнее, чем есть на самом деле:)',
    faqShareA9: 'Также можно импортировать/экспортировать только карточки отдельно от колоды, и все колоды полностью в <span class="badge">Настройках</span>.',

    faqManagementQ: 'Можно ли удалить несколько колод сразу?',
    faqManagementA: 'Кликните <span class="badge">Колоды</span> над списком колод. Там вы найдете эту и другие массовые операции.',

    faqFeedbackQ: 'Приложение ведет себя неправильно / Ошибка во встроенной колоде / У меня предложение / Опечатка / Я хочу помочь!',
    faqFeedbackA: 'Спокойствие, только спокойствие:) <a href="https://github.com/hogart/OmniCard/issues/new">Сообщите нам</a>. Спасибо!',

    helpHide: 'Не показывать это',
    helpShow: 'Показать подсказку',

    bulkTitle: 'Управление колодами',
    bulkSelectAll: 'Выбрать все',
    bulkName: 'Название',
    bulkDescription: 'Описание',
    bulkShow: 'Показывать выбранные',
    bulkHide: 'Скрыть/удалить выбранные',
    bulkExport: 'Экспорт',

    editDeck: 'Редактировать колоду',
    deleteDeck: 'Удалить колоду',
    deleteDeckConfirm: 'Вы действительно хотите удалить колоду?',
    hideDeck: 'Скрыть колоду',
    unhideDeck: 'Показывать колоду',
    hideDeckConfirm: 'Вы действительно хотите скрыть колоду?',
    showCorrections: 'Показывать правильные ответы',
    createDeck: 'Создать колоду',
    importDeck: 'Импортировать колоду',
    exportDeck: 'Экспортировать колоду целиком',
    pasteDeck: 'Вставьте колоду сюда',
    shareDeckHelp: 'Колода целиком',
    deckProperties: 'Свойства колоды',
    deckName: 'Название:',
    deckNamePlaceholder: 'Название колоды',
    deckDescr: 'Описание:',
    deckDescrPlaceholder: 'Описание колоды (необязательное поле)',
    deckTags: 'Метки:',
    deckTagsPlaceholder: 'Метки колоды (необязательное поле)',
    deckTagsHelp: 'Список, разделенный запятыми',
    deckTestable: 'Тесты',
    deckTestableHelp: 'Подходит ли колода для автоматического создания тестов? (Не работает на колодах меньше 5 карточек).',
    deckCards: 'Карточки в колоде',
    deckCardsImport: 'Импортировать карточки',
    deckCardsExport: 'Экспортировать карточки',
    deckCardsPaste: 'Вставьте карточки сюда',
    deckCardsHelp: 'Перевод строки разделяет карточки, табуляция или 4 пробела разделяет вопрос и ответ (вопрос идет первым)',
    deleteCard: 'Удалить карточки',
    addCard: 'Добавить карточку',
    deckSave: 'Сохранить колоду',

    answer: 'Ответ',
    question: 'Вопрос',
    next: 'Следующий',
    skip: 'Пропустить',


    learnedNew: 'Узнали что-то новое? Хотите повторить или готовы испытать себя?',
    wrongs: 'Неправильных ответов:',
    corrects: 'Правильных ответов:',

    congrats: 'Поздравляем! Ни единой ошибки!',
    doNotDespair: 'Не отчаивайтесь. В следующий раз получится!',
    moreWork: 'Неплохо, но нужно больше работать.',
    notBad: 'Совсем недурно! Продолжайте тренироваться!',


    importExport: 'Импорт/экспорт…',
    importExportHelp: 'Позволяет импортировать и экспортировать все колоды разом. Полезно для переноса с/на другое устройство.',
    clearAll: 'Полный сброс',
    clearAllHelp: 'Удаляет все колоды и стирает все настройки. Вы должны осознавать, что делаете.',
    confirmClearAll: 'Это сотрет все ваши колоды, сбросит настройки и перезагрузит приложение.\nВы уверены, что хотите сделать это?',

    changeLang: 'Изменить язык интерфейса',


    dumpHelp: 'Скопируйте содержимое этого поля и отправьте его по электронной почте, через <a href="http://pastebin.com/">pastebin</a>-сервис, и т.д.',
    dumpFormatting: 'С форматированием'
};