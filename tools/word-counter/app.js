const textInput = document.getElementById('textInput');
const wordCountEl = document.getElementById('wordCount');
const charCountEl = document.getElementById('charCount');
const charNoSpaceCountEl = document.getElementById('charNoSpaceCount');
const sentenceCountEl = document.getElementById('sentenceCount');
const readTimeEl = document.getElementById('readTime');
const copyBtn = document.getElementById('copyBtn');
const clearBtn = document.getElementById('clearBtn');

function analyzeText() {
    const text = textInput.value;
    
    // Characters
    const charCount = text.length;
    charCountEl.textContent = charCount;
    
    // Characters without spaces
    const charNoSpaceCount = text.replace(/\s+/g, '').length;
    charNoSpaceCountEl.textContent = charNoSpaceCount;
    
    // Words
    const words = text.trim().split(/\s+/).filter(word => word.length > 0);
    const wordCount = words.length;
    wordCountEl.textContent = wordCount;
    
    // Sentences
    const sentences = text.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0);
    sentenceCountEl.textContent = sentences.length;
    
    // Read Time (avg 200 words per min)
    const readTime = Math.ceil(wordCount / 200);
    readTimeEl.textContent = wordCount === 0 ? 0 : readTime;
}

textInput.addEventListener('input', analyzeText);

copyBtn.addEventListener('click', () => {
    textInput.select();
    navigator.clipboard.writeText(textInput.value);
    const orig = copyBtn.textContent;
    copyBtn.textContent = 'Copied!';
    setTimeout(() => { copyBtn.textContent = orig; }, 2000);
});

clearBtn.addEventListener('click', () => {
    textInput.value = '';
    analyzeText();
});
