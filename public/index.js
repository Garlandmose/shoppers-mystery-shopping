// ✅ Global function — accessible to onclick="..."
function showApplicationForm() {
    const applicationSection = document.querySelector('.application-section');
    if (!applicationSection) {
        console.error('❌ .application-section not found — is DOM loaded?');
        return;
    }

    // Reveal form
    applicationSection.classList.add('active');

    // Scroll after tiny delay
    setTimeout(() => {
        applicationSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 50);
}

// ✅ Run once DOM is ready — set up listeners, but NOT the function itself
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

    // 🔹 Smooth scroll for all # links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href === '#apply') {
                e.preventDefault();
                showApplicationForm(); // ✅ Now uses the global function
                return;
            }

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // 🔹 Form submit (AJAX)
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const btn = form.querySelector('.submit-button');
            const orig = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Submitting…';

            // Reuse or create feedback
            let feedback = form.querySelector('.form-feedback');
            if (!feedback) {
                feedback = Object.assign(document.createElement('div'), {
                    className: 'form-feedback',
                    style: 'margin-top:1rem;padding:1rem;border-radius:8px;text-align:center;font-weight:600;'
                });
                form.appendChild(feedback);
            }

            try {
                const res = await fetch('/submit-application', {
                    method: 'POST',
                    body: new URLSearchParams(new FormData(form))
                });
                const data = await res.json();

                feedback.textContent = data.message;
                feedback.style.backgroundColor = data.success ? '#d4edda' : '#f8d7da';
                feedback.style.color = data.success ? '#155724' : '#721c24';
                feedback.style.border = '1px solid ' + (data.success ? '#c3e6cb' : '#f5c6cb');

            } catch {
                feedback.textContent = '⚠️ Network error. Check connection and try again.';
                feedback.style.cssText = 'margin-top:1rem;padding:1rem;border-radius:8px;text-align:center;font-weight:600;background:#fff3cd;color:#856404;border:1px solid #ffeaa7';
            } finally {
                btn.disabled = false;
                btn.textContent = orig;
            }
        });
    }
});