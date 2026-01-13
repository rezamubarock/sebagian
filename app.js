// ========================================
// FIREBASE CONFIGURATION
// ========================================

const firebaseConfig = {
    apiKey: "AIzaSyDnehs_q4onSxnzfqRrK-yS8IaK48ep2dk",
    authDomain: "sebagian-platform.firebaseapp.com",
    projectId: "sebagian-platform",
    storageBucket: "sebagian-platform.firebasestorage.app",
    messagingSenderId: "40404300194",
    appId: "1:40404300194:web:6fbfb34d3d3daad966c2fb"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Shortcuts for commonly used services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// ========================================
// AUTH UTILITIES
// ========================================

const Auth = {
    // Get current user (waits for auth state to be determined)
    getCurrentUser: () => {
        return new Promise((resolve) => {
            const unsubscribe = auth.onAuthStateChanged(user => {
                unsubscribe(); // Stop listening after first result
                resolve(user);
            });
        });
    },

    // Get user data from Firestore
    getUserData: async (uid) => {
        try {
            const doc = await db.collection('users').doc(uid).get();
            return doc.exists ? doc.data() : null;
        } catch (error) {
            console.error('Error getting user data:', error);
            return null;
        }
    },

    // Check if current user is admin
    isAdmin: async () => {
        const user = await Auth.getCurrentUser();
        if (!user) return false;
        const userData = await Auth.getUserData(user.uid);
        return userData?.role === 'admin';
    },

    // Logout
    logout: async () => {
        await auth.signOut();
        window.location.href = '/login.html';
    },

    // Send email verification
    sendVerification: async () => {
        const user = auth.currentUser;
        if (user && !user.emailVerified) {
            await user.sendEmailVerification();
        }
    }
};

// ========================================
// ROUTE PROTECTION (BLOCKING)
// ========================================

const RouteGuard = {
    // Show loading overlay while checking auth
    _showLoading: () => {
        // Create loading overlay if not exists
        if (!document.getElementById('auth-loading')) {
            const overlay = document.createElement('div');
            overlay.id = 'auth-loading';
            overlay.style.cssText = `
                position: fixed;
                top: 0; left: 0; right: 0; bottom: 0;
                background: #0a0a0a;
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 9999;
                color: white;
                font-family: Inter, sans-serif;
            `;
            overlay.innerHTML = '<div style="text-align: center;"><div style="font-size: 2rem; margin-bottom: 1rem;">⏳</div>Memverifikasi akun...</div>';
            document.body.prepend(overlay);
        }
    },

    _hideLoading: () => {
        const overlay = document.getElementById('auth-loading');
        if (overlay) overlay.remove();
    },

    // Require user to be logged in AND email verified
    requireAuth: async (redirectTo = '/login.html') => {
        RouteGuard._showLoading();

        const user = await Auth.getCurrentUser();

        if (!user) {
            window.location.href = redirectTo;
            return false;
        }

        // Check email verification
        if (!user.emailVerified) {
            window.location.href = '/verify-email.html';
            return false;
        }

        RouteGuard._hideLoading();
        return true;
    },

    // Require user to be admin
    requireAdmin: async (redirectTo = '/member/index.html') => {
        const isAdmin = await Auth.isAdmin();
        if (!isAdmin) {
            alert('Akses ditolak. Anda bukan admin.');
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Redirect if already logged in
    redirectIfLoggedIn: async (redirectTo = '/member/index.html') => {
        const user = await Auth.getCurrentUser();
        if (user && user.emailVerified) {
            const isAdmin = await Auth.isAdmin();
            window.location.href = isAdmin ? '/admin/index.html' : redirectTo;
            return true;
        }
        return false;
    }
};

// ========================================
// UI UTILITIES
// ========================================

const UI = {
    // Show loading state on button
    setButtonLoading: (btn, isLoading, originalText = null) => {
        if (isLoading) {
            btn.dataset.originalText = btn.innerHTML;
            btn.innerHTML = '<span class="spinner"></span> Loading...';
            btn.disabled = true;
        } else {
            btn.innerHTML = originalText || btn.dataset.originalText;
            btn.disabled = false;
        }
    },

    // Show toast notification
    showToast: (message, type = 'info') => {
        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;
        toast.textContent = message;
        document.body.appendChild(toast);

        setTimeout(() => toast.classList.add('show'), 100);
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 3000);
    },

    // Format currency (IDR)
    formatCurrency: (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    },

    // Format date
    formatDate: (timestamp) => {
        const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
        return new Intl.DateTimeFormat('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        }).format(date);
    }
};

// ========================================
// PRODUCTS UTILITIES
// ========================================

const Products = {
    // Get all active products
    getAll: async () => {
        const snapshot = await db.collection('products')
            .where('isActive', '==', true)
            .orderBy('createdAt', 'desc')
            .get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },

    // Get single product
    getById: async (id) => {
        const doc = await db.collection('products').doc(id).get();
        return doc.exists ? { id: doc.id, ...doc.data() } : null;
    },

    // Check if user has access to product
    hasAccess: async (userId, productId) => {
        const userData = await Auth.getUserData(userId);
        return userData?.purchasedProducts?.includes(productId) || false;
    }
};

// ========================================
// SITE CONFIG (CMS)
// ========================================

const SiteConfig = {
    // Get site config
    get: async () => {
        try {
            const doc = await db.collection('config').doc('site').get();
            return doc.exists ? doc.data() : {
                hero_title: 'Platform Tools Digital',
                hero_desc: 'Akses berbagai tools dan software premium untuk bisnis Anda.',
                footer_text: '© 2026 Sebagian. All rights reserved.'
            };
        } catch (error) {
            console.error('Error getting site config:', error);
            return {};
        }
    },

    // Update site config (Admin only)
    update: async (data) => {
        await db.collection('config').doc('site').set(data, { merge: true });
    }
};

console.log('🔥 Firebase & App initialized');
