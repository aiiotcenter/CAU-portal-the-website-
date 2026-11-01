(() => {
  document.addEventListener('DOMContentLoaded', () => {
    const startBtn = document.getElementById('aiNavigatorStartBtn');
    const flowOverlay = document.getElementById('aiNavigatorFlow');
    const closeBtn = document.getElementById('aiNavigatorCloseBtn');
    const optionsContainer = document.getElementById('aiNavigatorOptions');
    const inputArea = document.getElementById('aiNavigatorInputArea');
    const chatMessages = document.getElementById('aiNavigatorMessages');
    const inputField = document.getElementById('aiNavigatorInput');
    const sendBtn = document.getElementById('aiNavigatorSendBtn');

    let currentMode = null;

    if (startBtn && flowOverlay && closeBtn) {
      startBtn.addEventListener('click', () => {
        flowOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
      });

      closeBtn.addEventListener('click', () => {
        flowOverlay.style.display = 'none';
        document.body.style.overflow = '';
      });
    }

    function appendMessage(text, isUser = false) {
      const msgDiv = document.createElement('div');
      msgDiv.className = `navigator-msg ${isUser ? 'user-msg' : 'ai-msg'}`;
      msgDiv.innerHTML = text;
      chatMessages.appendChild(msgDiv);
      chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    async function callBackend(action, payload) {
      try {
        const response = await fetch('/api/trpc/assistant.navigator', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ action, payload })
        });
        const json = await response.json();
        return json.result.data;
      } catch (err) {
        console.error('Navigator API error', err);
        return null;
      }
    }

    // Handle initial options
    document.querySelectorAll('.navigator-option-btn').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        const action = e.target.getAttribute('data-action');
        const text = e.target.textContent;

        appendMessage(text, true);
        optionsContainer.style.display = 'none';
        
        if (action === 'program_finder') {
          currentMode = 'program_finder';
          appendMessage("Great! Let's find the perfect program. What are you interested in? (e.g. Technology, Business, Healthcare, Arts...)");
          inputArea.style.display = 'flex';
        } else if (action === 'tuition_calculator') {
          currentMode = 'tuition_calculator';
          appendMessage("I can calculate that for you. Which program are you considering, and what is your scholarship expectation?");
          inputArea.style.display = 'flex';
        } else if (action === 'check_admissions') {
          currentMode = 'check_admissions';
          appendMessage("Sure. What degree level (Bachelor's, Master's) and language (English, Turkish) are you applying for?");
          inputArea.style.display = 'flex';
        } else if (action === 'application_process') {
          currentMode = 'application_process';
          appendMessage("I can guide you through the application. Are you applying as an international student? Which country are you from?");
          inputArea.style.display = 'flex';
        } else if (action === 'cyprus_life') {
          currentMode = 'cyprus_life';
          appendMessage("Living in Kyrenia is amazing! What would you like to know? (e.g., cost of living, dormitories, safety, climate)");
          inputArea.style.display = 'flex';
        } else {
          appendMessage("I am routing you to our general assistant...");
          setTimeout(() => {
            appendMessage("This feature is still being integrated. Check back soon!");
            optionsContainer.style.display = 'flex';
          }, 1500);
        }
      });
    });

    // Handle user input
    async function handleSend() {
      const val = inputField.value.trim();
      if (!val) return;

      appendMessage(val, true);
      inputField.value = '';
      inputField.disabled = true;
      sendBtn.disabled = true;

      appendMessage("<span class='typing-indicator'>Thinking...</span>");
      const tempMsg = chatMessages.lastElementChild;

      const data = await callBackend(currentMode, val);

      tempMsg.remove();
      inputField.disabled = false;
      sendBtn.disabled = false;
      inputField.focus();

      if (!data) {
        appendMessage("Sorry, I encountered an error connecting to the CAU database. Please try again.");
        return;
      }

      if (currentMode === 'program_finder') {
        if (data.matches && data.matches.length > 0) {
          let html = `<p>Based on your interests, here are the top matching programs at CAU:</p>`;
          data.matches.forEach(m => {
            html += `<div class="program-match-card">
              <div class="program-match-title">
                <a href="/programs.html?search=${encodeURIComponent(m.slug)}" target="_blank" style="color: inherit; text-decoration: none;">${m.name}</a>
                <span>${m.matchPercentage}% Match</span>
              </div>
              <div class="program-match-reason">${m.reason}</div>
            </div>`;
          });
          html += `<p style="margin-top: 12px; font-size: 0.9em;">Tell me more about your background to refine this, or ask another question.</p>`;
          appendMessage(html);
        } else {
          appendMessage("I couldn't find a direct match. Could you tell me more about your career goals?");
        }
      } else if (currentMode === 'tuition_calculator') {
        if (data.estimatedTotal) {
          let html = `<strong>Tuition Estimate:</strong><br/>
          Estimated Tuition: ${data.estimatedTuition}<br/>
          <strong>Estimated Total: ${data.estimatedTotal}</strong><br/>
          <p>${data.explanation}</p>`;
          appendMessage(html);
        } else {
          appendMessage("I'm sorry, I couldn't calculate that. Could you provide the specific program name and your scholarship amount?");
        }
      } else if (currentMode === 'check_admissions') {
        if (data.requirements) {
          let html = `<strong>Admission Requirements:</strong><ul>`;
          data.requirements.forEach(r => html += `<li>${r}</li>`);
          html += `</ul><p>${data.summary}</p>`;
          appendMessage(html);
        } else {
          appendMessage("I couldn't find requirements for that. Could you clarify your degree level?");
        }
      } else if (currentMode === 'application_process') {
        if (data.steps) {
          let html = `<strong>Application Steps:</strong><ol>`;
          data.steps.forEach(s => html += `<li>${s}</li>`);
          html += `</ol><p><a href="${data.portalLink}" target="_blank" class="btn btn-coral" style="color:#fff; text-decoration:none; display:inline-block; margin-top:8px;">Apply Now <i class="system-arrow ms-1" aria-hidden="true"></i></a></p>`;
          appendMessage(html);
        }
      } else if (currentMode === 'cyprus_life') {
        if (data.details) {
          let html = `<p>${data.details}</p>
          <strong>Cost of Living:</strong> ${data.costOfLiving}<br/>
          <strong>Safety & Community:</strong> ${data.safety}`;
          appendMessage(html);
        }
      }
    }

    sendBtn?.addEventListener('click', handleSend);
    inputField?.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') handleSend();
    });

    // Program Explainer UI
    if (window.location.pathname.includes('/programs.html')) {
      const urlParams = new URLSearchParams(window.location.search);
      const programSlug = urlParams.get('search') || urlParams.get('faculty');
      
      if (programSlug) {
        const explainerBtn = document.createElement('button');
        explainerBtn.className = 'btn btn-coral';
        explainerBtn.innerHTML = '<i class="fa-solid fa-sparkles me-2"></i> Explain This Program with AI';
        explainerBtn.style.position = 'fixed';
        explainerBtn.style.bottom = '24px';
        explainerBtn.style.left = '24px';
        explainerBtn.style.zIndex = '1000';
        explainerBtn.style.boxShadow = '0 10px 20px rgba(240,68,50,0.3)';
        
        document.body.appendChild(explainerBtn);

        explainerBtn.addEventListener('click', () => {
          currentMode = 'course_explainer';
          flowOverlay.style.display = 'flex';
          document.body.style.overflow = 'hidden';
          appendMessage(`I'm your AI Explainer for <strong>${programSlug}</strong>. What would you like to know about the curriculum, careers, or faculty?`);
          inputArea.style.display = 'flex';
          optionsContainer.style.display = 'none';
        });

        // Override backend call to include slug if mode is course_explainer
        const originalCallBackend = callBackend;
        callBackend = async function(action, payload) {
          if (action === 'course_explainer') {
            payload = { query: payload, slug: programSlug };
          }
          return await originalCallBackend(action, payload);
        };

        // Add handling for course_explainer response
        const originalHandleSend = handleSend;
        handleSend = async function() {
          if (currentMode === 'course_explainer') {
            const val = inputField.value.trim();
            if (!val) return;
      
            appendMessage(val, true);
            inputField.value = '';
            inputField.disabled = true;
            sendBtn.disabled = true;
      
            appendMessage("<span class='typing-indicator'>Thinking...</span>");
            const tempMsg = chatMessages.lastElementChild;
      
            const data = await callBackend(currentMode, val);
      
            tempMsg.remove();
            inputField.disabled = false;
            sendBtn.disabled = false;
            inputField.focus();

            if (data && data.explanation) {
              let html = `<p>${data.explanation}</p><ul>`;
              data.highlights.forEach(h => html += `<li>${h}</li>`);
              html += `</ul>`;
              appendMessage(html);
            } else {
              appendMessage("Sorry, I couldn't load details for this program.");
            }
          } else {
            await originalHandleSend();
          }
        };
      }
    }

    // AI Semantic Search Integration
    const searchForm = document.getElementById('cauHeaderSearchForm');
    const searchInput = document.getElementById('cauHeaderSearchInput');
    const searchPanelDynamic = document.getElementById('searchPanel-dynamic');
    const searchDynamicList = document.getElementById('searchDynamicList');
    const searchDrawer = document.getElementById('cauSearchDrawer');

    if (searchForm && searchInput && searchPanelDynamic && searchDynamicList) {
      searchForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const query = searchInput.value.trim();
        if (!query) return;

        // Hide other panels
        document.querySelectorAll('.cau-search-panel').forEach(p => p.classList.remove('is-active'));
        document.querySelectorAll('.cau-search-tab').forEach(t => t.classList.remove('is-active'));
        
        searchPanelDynamic.style.display = 'block';
        searchPanelDynamic.classList.add('is-active');
        searchDrawer.classList.add('open');

        searchDynamicList.innerHTML = '<div style="padding: 16px; color: var(--cau-chat-muted);">Searching with AI...</div>';

        const data = await callBackend('search', query);

        if (data && data.links && data.answer) {
          let html = `<div style="grid-column: 1 / -1; padding: 12px 16px; background: var(--sys-surface-2); border-radius: 8px; margin-bottom: 12px; font-size: 0.95rem;"><strong>AI Summary:</strong> ${data.answer}</div>`;
          data.links.forEach(link => {
            html += `<a href="${link.url}" class="cau-search-item">
              <span class="cau-search-item__title">${link.title} <i class="fa-solid fa-sparkles ms-2" style="color: var(--cau-chat-primary); font-size: 0.8em;"></i></span>
              <span class="cau-badge-counter">AI Suggestion</span>
            </a>`;
          });
          searchDynamicList.innerHTML = html;
        } else {
          searchDynamicList.innerHTML = '<div style="padding: 16px; color: var(--cau-chat-muted);">No results found or AI is unavailable. Please try standard search.</div>';
        }
      });
    }

  });
})();
