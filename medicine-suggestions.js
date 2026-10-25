document.addEventListener('input', event => {
  const input = event.target.closest('[data-medicine-suggest]');
  if (!input) return;

  clearTimeout(input.suggestTimer);
  const box = [...document.querySelectorAll('[data-medicine-suggestions]')].find(item => item.dataset.medicineSuggestions === input.id);
  if (!box) return;
  const query = input.value.trim();
  box.replaceChildren();
  if (query.length < 3) {
    box.classList.add('hidden');
    input.setAttribute('aria-expanded', 'false');
    return;
  }

  box.classList.remove('hidden');
  input.setAttribute('aria-expanded', 'true');
  box.textContent = 'Finding possible spellings…';
  const requestId = input.suggestRequest = (input.suggestRequest || 0) + 1;
  input.suggestTimer = setTimeout(async () => {
    if (location.protocol === 'file:') {
      box.textContent = 'Run this project with Vercel to get spelling suggestions.';
      return;
    }
    try {
      const response = await fetch('/api/medicine', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode: 'suggest', query, language: document.documentElement.lang === 'hi' ? 'Hindi' : 'English' })
      });
      const data = await response.json();
      if (requestId !== input.suggestRequest || input.value.trim() !== query) return;
      if (!response.ok) throw new Error(data.error || 'Could not load suggestions.');

      box.replaceChildren();
      const title = document.createElement('p');
      title.className = 'px-3 py-2 text-xs font-bold text-slate-500';
      title.textContent = document.documentElement.lang === 'hi'
        ? (data.suggestions.length ? 'क्या आपका मतलब यह था?' : 'कोई मिलान नहीं मिला। आप लिखना जारी रख सकते हैं।')
        : (data.suggestions.length ? 'Did you mean this?' : 'No likely matches. You can keep typing.');
      box.append(title);
      for (const name of data.suggestions) {
        const button = document.createElement('button');
        button.type = 'button';
        button.className = 'suggestion-choice block w-full px-3 py-2 text-left hover:bg-blue-50 text-sm font-semibold';
        button.dataset.suggestion = name;
        button.textContent = name;
        box.append(button);
      }
    } catch (error) {
      if (requestId === input.suggestRequest) box.textContent = error.message;
    }
  }, 500);
});

document.addEventListener('click', event => {
  const button = event.target.closest('.suggestion-choice');
  if (!button) return;
  const box = button.closest('[data-medicine-suggestions]');
  const input = document.getElementById(box.dataset.medicineSuggestions);
  input.value = button.dataset.suggestion;
  box.classList.add('hidden');
  input.setAttribute('aria-expanded', 'false');
  input.focus();
});

document.addEventListener('click', event => {
  if (event.target.closest('[data-medicine-suggest], [data-medicine-suggestions]')) return;
  document.querySelectorAll('[data-medicine-suggestions]').forEach(box => {
    box.classList.add('hidden');
    const input = document.getElementById(box.dataset.medicineSuggestions);
    if (input) input.setAttribute('aria-expanded', 'false');
  });
});
