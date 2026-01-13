// ========================================
// FIREBASE CONFIGURATION
// ========================================
// PENTING: Ganti nilai-nilai di bawah dengan konfigurasi Firebase project kamu sendiri
// Dapatkan dari: Firebase Console > Project Settings > Your apps > Web app

const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
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
    // Get current user
    getCurrentUser: () => {
        return new Promise((resolve) => {
            auth.onAuthStateChanged(user => resolve(user));
        });
    },

    // Get user data from Firestore
    getUserData: async (uid) => {
        const doc = await db.collection('users').doc(uid).get();
        return doc.exists ? doc.data() : null;
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
    }
};

// ========================================
// ROUTE PROTECTION
// ========================================

const RouteGuard = {
    // Require user to be logged in
    requireAuth: async (redirectTo = '/login.html') => {
        const user = await Auth.getCurrentUser();
        if (!user) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Require user to be admin
    requireAdmin: async (redirectTo = '/member/index.html') => {
        const isAdmin = await Auth.isAdmin();
        if (!isAdmin) {
            window.location.href = redirectTo;
            return false;
        }
        return true;
    },

    // Redirect if already logged in
    redirectIfLoggedIn: async (redirectTo = '/member/index.html') => {
        const user = await Auth.getCurrentUser();
        if (user) {
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
        const doc = await db.collection('config').doc('site').get();
        return doc.exists ? doc.data() : {
            hero_title: 'Platform Tools Digital',
            hero_desc: 'Akses berbagai tools dan software premium untuk bisnis Anda.',
            footer_text: '© 2026 Sebagian. All rights reserved.'
        };
    },

    // Update site config (Admin only)
    update: async (data) => {
        await db.collection('config').doc('site').set(data, { merge: true });
    }
};

console.log('🔥 Firebase & App initialized');
