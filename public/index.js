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

// ✅ Run once DOM is ready
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

    // 🔹 Form submission via Formspree (your endpoint)
    const form = document.getElementById('applicationForm');
    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            const btn = form.querySelector('.submit-button');
            const origText = btn.textContent;
            btn.disabled = true;
            btn.textContent = 'Submitting…';

            // Create or reuse feedback element
            let feedback = form.querySelector('.form-feedback');
            if (!feedback) {
                feedback = document.createElement('div');
                feedback.className = 'form-feedback';
                feedback.style.cssText = `
          margin-top: 1rem;
          padding: 1rem;
          border-radius: 8px;
          text-align: center;
          font-weight: 600;
        `;
                form.appendChild(feedback);
            }

            try {
                const formData = new FormData(form);
                // ✅ Your Formspree endpoint
                const response = await fetch('https://formspree.io/f/xojaaboo', {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                const result = await response.json();

                if (response.ok) {
                    feedback.textContent = '✅ Application submitted successfully! A representative will contact you soon.';
                    feedback.style.cssText += 'background: #d4edda; color: #155724; border: 1px solid #c3e6cb;';

                    // Auto-reset after 3 seconds
                    setTimeout(() => {
                        form.reset();
                        feedback.style.display = 'none';
                        btn.disabled = false;
                        btn.textContent = origText;
                    }, 3000);
                } else {
                    const errorMsg = result.error || 'Submission failed. Please try again.';
                    feedback.textContent = `❌ ${errorMsg}`;
                    feedback.style.cssText += 'background: #f8d7da; color: #721c24; border: 1px solid #f5c6cb;';
                    btn.disabled = false;
                    btn.textContent = origText;
                }
            } catch (err) {
                feedback.textContent = '⚠️ Network error. Please check your connection and try again.';
                feedback.style.cssText += 'background: #fff3cd; color: #856404; border: 1px solid #ffeaa7;';
                btn.disabled = false;
                btn.textContent = origText;
            }
        });
    }
});