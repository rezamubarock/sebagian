document.addEventListener('DOMContentLoaded', () => {
    // Parallax Mouse Effect for background orbs
    document.addEventListener('mousemove', (e) => {
        const x = e.clientX / window.innerWidth;
        const y = e.clientY / window.innerHeight;
        
        const orb1 = document.querySelector('.background-glob');
        const orb2 = document.querySelector('.background-glob-2');
        
        if(orb1 && orb2) {
            orb1.style.transform = `translate(${x * 30}px, ${y * 30}px)`;
            orb2.style.transform = `translate(${-x * 30}px, ${-y * 30}px)`;
        }
    });

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
