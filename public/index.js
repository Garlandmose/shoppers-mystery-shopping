// ✅ Global function — accessible to onclick="..."
function showApplicationForm() {
    const applicationSection = document.querySelector('.application-section');
    if (!applicationSection) {
        console.error('❌ .application-section not found — is DOM loaded?');
        return;
    }
    applicationSection.classList.add('active');
    setTimeout(() => {
        applicationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
}

document.addEventListener('DOMContentLoaded', () => {
    // 🔹 Mobile menu
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');
    if (hamburger && mobileMenu) {
        hamburger.addEventListener('click', () => {
            mobileMenu.classList.toggle('open');
            hamburger.classList.toggle('open');
        });

        mobileMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenu.classList.remove('open');
                hamburger.classList.remove('open');
            });
        });
    }

    // 🔹 Smooth scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#apply') {
                e.preventDefault();
                showApplicationForm();
                return;
            }
            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 🔹 Form submission (Formspree: mbdrregd)
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-button');
            const orig = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Submitting…';

            let feedback = form.querySelector('.form-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'form-feedback';
                Object.assign(feedback.style, {
                    marginTop: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    textAlign: 'center',
                    fontWeight: '600'
                });
                form.appendChild(feedback);
            }

            try {
                const res = await fetch('https://formspree.io/f/mbdrregd', {
                    method: 'POST',
                    body: new FormData(form),
                    headers: { 'Accept': 'application/json' }
                });

                const data = await res.json();
                const isSuccess = res.ok;

                feedback.textContent = isSuccess
                    ? '✅ Application submitted! A representative will contact you soon.'
                    : `❌ ${data.error || 'Submission failed. Please try again.'}`;

                Object.assign(feedback.style, {
                    backgroundColor: isSuccess ? '#d4edda' : '#f8d7da',
                    color: isSuccess ? '#155724' : '#721c24',
                    border: `1px solid ${isSuccess ? '#c3e6cb' : '#f5c6cb'}`
                });

                if (isSuccess) {
                    setTimeout(() => {
                        form.reset();
                        feedback.style.display = 'none';
                        btn.disabled = false;
                        btn.textContent = orig;
                    }, 3000);
                } else {
                    btn.disabled = false;
                    btn.textContent = orig;
                }
            } catch {
                feedback.textContent = '⚠️ Network error. Check your connection and try again.';
                Object.assign(feedback.style, {
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                    border: '1px solid #ffeaa7'
                });
                btn.disabled = false;
                btn.textContent = orig;
            }
        });
    }
});