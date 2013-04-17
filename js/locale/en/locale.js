if (!locale) {
    var locale = {};
};

locale.en = {
    q: {
        open: '‘',
        close: '’'
    },

    license: 'MIT license',
    decksHeader: 'Decks',
    newDeck: 'Add deck…',
    settings: 'Settings',

    done: 'Done',
    cancel: 'Cancel',
    save: 'Save',
    invalidFormat: 'Invalid format',

    welcomeHeader: 'Welcome to OmniCard!',
    welcomeFirst: 'We help you learn languages via famous flash-card method.',
    welcomeSecond: 'OmniCard is not a textbook or manual. Take it as exercise book, which you must create yourself (although we provide some predefined cards).',
    welcomeChoose: 'Choose your tongues:',
    welcomeSpeak: 'I speak…',
    welcomeLearn: 'I learn…',
    welcomeInterface: 'I prefer interface in…',
    welcomeStart: 'Start!',


    meditation: 'Meditation',
    meditationExplanation: 'Shows you both sides of card, question and answer, allowing you to learn and remember.',
    test: 'Test',
    testExplanation: 'Forces you to choose correct answer, intended for further fixing. Not all decks are capable of this mode.',
    exam: 'Exam',
    examExplanation: 'Hardest mode. You should enter answers manually. This is particularly useful in writing training.',


    helpHeader: 'Choose a deck on your left and start learning!',
    helpFirst: 'Each deck provides several modes in which it can be discovered.',
    helpAlso: 'You can (and should) also create your own deck, which is great because it forces you to train in writing.',

    faq: 'FAQ',
    faqEditQ: 'How do I edit deck?',
    faqEditA: 'Open that deck and note two icons in the top right corner of description. Clicking pencil icon brings up deck editing mode, and trash can deletes this deck.',
    faqCreateQ: 'How do I create new deck?',
    faqCreateA: 'Use <span class="badge">Add deck…</span> button located beneath deck list.',

    faqShareQ: 'I created/edited deck(s) to work on my primary PC, how do I get it on my phone/tablet/other PC?',
    faqShareA1: 'Open deck you need to transfer and click pencil icon in top left corner.',
    faqShareA2: 'Click <span class="badge">Export whole deck</span> button. You\'ll see big text field with lot of strange text.',
    faqShareA3: 'Copy that text.',
    faqShareA4: 'That\'s just text, so you can paste it around. Store it to the \
                      <a href="https://drive.google.com" target="_blank">Google Drive</a>, send yourself email, \
                      use a <a href="http://pastebin.com/">pastebin</a> service, etc.',
    faqShareA5: 'Open the location of your pasted text on device to which you want to transfer your work, and copy that text.',
    faqShareA6: 'Open the OmniCard, and click <span class="badge">New deck…</span>. Click <span class="badge">Import deck</span>. Text input field would open.',
    faqShareA7: 'Paste copied text into that field. Click<span class="badge">Done</span> button.',
    faqShareA8: 'Sounds more hard then it really is:)',
    faqShareA9: 'Additionally you can import/export cards only, and import/export all decks at once in <span class="badge">Settings</span>.',

    faqFeedbackQ: 'Application misbehaves / error in built-in deck / I have a suggestion / typo / I want to help.',
    faqFeedbackA: 'Keep calm and <a href="https://github.com/hogart/OmniCard/issues/new">contact us</a>. Thanks!',

    helpHide: 'Don\'t show me this',
    helpShow: 'Show help',


    editDeck: 'Edit deck',
    deleteDeck: 'Delete deck',
    deleteDeckConfirm: 'Are you sure you want to delete this deck?',
    showCorrections: 'Show correct answers',
    createDeck: 'Create new deck',
    importDeck: 'Import deck',
    exportDeck: 'Export whole deck',
    pasteDeck: 'Paste deck here',
    shareDeckHelp: 'Entire deck for sharing',
    deckProperties: 'Deck properties',
    deckName: 'Name:',
    deckNamePlaceholder: 'Deck name',
    deckDescr: 'Description:',
    deckDescrPlaceholder: 'Deck description (optional)',
    deckTags: 'Tags:',
    deckTagsPlaceholder: 'Deck tags (optional)',
    deckTagsHelp: 'Comma-separated list',
    deckTestable: 'Testable',
    deckTestableHelp: 'If deck is suitable for creating test automatically? (Won\'t work on deck shorter than 5 cards).',
    deckCards: 'Deck cards',
    deckCardsImport: 'Import cards',
    deckCardsExport: 'Export cards',
    deckCardsPaste: 'Paste cards here',
    deckCardsHelp: 'Newline separates cards; tab or 4 spaces separates question form answer (question first)',
    deleteCard: 'Delete card',
    addCard: 'Add card',
    deckSave: 'Save deck',

    answer: 'Answer',
    question: 'Question',
    next: 'Next',
    skip: 'Skip',


    learnedNew: 'Feeling like learned something new? Care to repeat or ready to testify yourself?',
    wrongs: 'Wrong answers:',
    corrects: 'Correct answers:',

    congrats: 'Congratulations! You\'ve performed excellent!',
    doNotDespair: 'Do not despair. Next time you will do better!',
    moreWork: 'You definitely need more work, but so far so good.',
    notBad: 'Not bad. Keep training!',


    importExport: 'Import/export…',
    importExportHelp: 'Lets import and export all your decks as a whole. Useful when transferring them to other device.',
    clearAll: 'Clear all',
    clearAllHelp: 'Deletes all decks and settings entirely. You must know what you\'re doing.',
    confirmClearAll: 'This will erase all your decks, reset all settings and reload entire application.\nAre you sure you want to do this?',


    dump: 'Share decks',
    dumpHelp: 'Copy contents of this field and send it as text via email, any <a href="http://pastebin.com/">pastebin</a>, etc.',
    dumpFormatting: 'Nice formatting'
};