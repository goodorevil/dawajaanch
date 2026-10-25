async function requestGemini(mode, query, targetId = 'ai-result', extra = {}) {
  const output = document.getElementById(targetId);
  output.classList.remove('hidden');
  if (location.protocol === 'file:') {
    output.textContent = 'Run this project with Vercel to connect to the Gemini API. Opening an HTML file directly does not start the API.';
    return;
  }
  output.textContent = 'Loading…';
  try {
    const response = await fetch('/api/medicine', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mode, query, language: document.documentElement.lang === 'hi' ? 'Hindi' : 'English', ...extra })
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.error || 'Request failed.');
    if (mode === 'voice') {
      const transcript = data.transcript?.trim();
      if (transcript && !/^unclear$/i.test(transcript)) document.getElementById('medicine-search-input').value = transcript;
      output.textContent = `${transcript ? `Heard: ${transcript}\n\n` : ''}${data.answer}`;
      const status = document.getElementById('voice-status');
      if (status) status.textContent = transcript ? `Heard: ${transcript}` : 'Could not identify the medicine name. Please try again.';
      return;
    }
    const safetyNote = document.documentElement.lang === 'hi'
      ? 'यह AI द्वारा बनाई गई जानकारी है। दवा और निर्णय की पुष्टि फार्मासिस्ट या डॉक्टर से करें।'
      : 'AI-generated information. Confirm medicine identity and decisions with a pharmacist or prescriber.';
    output.textContent = `${data.answer}\n\n${safetyNote}`;
  } catch (error) {
    output.textContent = error.message || 'Could not complete the request. Please try again.';
  }
}
