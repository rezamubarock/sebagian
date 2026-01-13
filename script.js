document.addEventListener('DOMContentLoaded', () => {
    // Parallax Mouse Effect for background orbs
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;

        const orb1 = document.querySelector('.background-glob');
        const orb2 = document.querySelector('.background-glob-2');

        if (orb1 && orb2) {
            orb1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            orb2.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
        }
    });

    // Dynamic Content Loading
    // Dynamic Content Loading
    fetch('/api/content')
        .then(res => res.json())
        .then(data => {
            // 1. Global Global Settings
            if (data.global) {
                const heroTitle = document.getElementById('hero-title');
                const heroDesc = document.getElementById('hero-desc');
                const footerText = document.getElementById('footer-text');

                if (heroTitle && data.global.hero_title) heroTitle.innerHTML = data.global.hero_title;
                if (heroDesc && data.global.hero_desc) heroDesc.textContent = data.global.hero_desc;
                if (footerText && data.global.footer_text) footerText.textContent = data.global.footer_text;
            }

            // 2. Services Rendering
            const servicesContainer = document.getElementById('services-grid');
            if (servicesContainer && data.services) {
                servicesContainer.innerHTML = data.services.map(svc => `
                    <div class="service-card">
                        <div class="service-icon">
                            <i class="${svc.icon}"></i>
                        </div>
                        <h3>${svc.title}</h3>
                        <p class="prose">${svc.desc}</p>
                    </div>
                `).join('');
            }

            // 3. Team Rendering
            const teamContainer = document.getElementById('team-grid');
            if (teamContainer && data.team) {
                teamContainer.innerHTML = data.team.map(member => `
                    <div class="service-card" style="text-align: center;">
                        <div style="width: 80px; height: 80px; background: #fff; border-radius: 50%; margin: 0 auto 1rem; display:flex; align-items:center; justify-content:center; color:#333; font-weight:bold; font-size:1.5rem;">
                            ${member.name.charAt(0)}
                        </div>
                        <h3>${member.name}</h3>
                        <p style="color: var(--accent-1);">${member.role}</p>
                    </div>
                `).join('');
            }
        })
        .catch(err => console.log('Using static content or error loading', err));

    // Button Click Effect
    const notifyBtn = document.getElementById('notifyBtn');
    if (notifyBtn) {
        notifyBtn.addEventListener('click', () => {
            notifyBtn.innerHTML = '✨ Tersimpan!';
            notifyBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';
            setTimeout(() => {
                notifyBtn.innerHTML = 'Bergabung Sekarang';
                notifyBtn.style.background = ''; // revert to CSS defined
            }, 3000);
        });
    }

    // Scroll reveal (if we add more content later)
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    });

    document.querySelectorAll('.glass-card').forEach((el) => observer.observe(el));
});
