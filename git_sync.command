#!/bin/bash

# Pastikan script berjalan di folder tempat file ini berada
cd "$(dirname "$0")"

# Configuration
REPO_URL="https://github.com/rezamubarock/sebagian.git"

# Function to detect the current branch
get_current_branch() {
  git branch --show-current
}

# Check if .git directory exists
if [ ! -d ".git" ]; then
    echo "⚠️  Repo belum di-init atau di-clone."
    echo "🔄  Mencoba melakukan cloning..."
    
    # Coba clone biasa dulu
    if git clone "$REPO_URL" . 2>/dev/null; then
        echo "✅  Clone berhasil!"
    else
        echo "📂  Direktori tidak kosong (ada file script ini), melakukan inisialisasi manual..."
        
        # Init git manual
        git init
        git remote add origin "$REPO_URL"
        
        echo "⬇️  Mengambil data dari GitHub..."
        git fetch origin
        
        # Deteksi default branch dari remote (biasanya main atau master)
        REMOTE_BRANCH=$(git remote show origin | awk '/HEAD branch/ {print $NF}')
        if [ -z "$REMOTE_BRANCH" ]; then
            REMOTE_BRANCH="main"
        fi
        
        echo "🔗  Menghubungkan ke branch $REMOTE_BRANCH..."
        git checkout -b "$REMOTE_BRANCH" 2>/dev/null || git checkout "$REMOTE_BRANCH"
        
        # Pull dengan allow-unrelated-histories untuk menggabungkan file lokal (script) dengan repo
        git pull origin "$REMOTE_BRANCH" --allow-unrelated-histories
        
        # Set tracking information
        git branch --set-upstream-to=origin/"$REMOTE_BRANCH" "$REMOTE_BRANCH"
    fi
else
    echo "✅  Git repository terdeteksi."
fi

# Get current branch (after clone or if verified)
BRANCH=$(get_current_branch)
if [ -z "$BRANCH" ]; then
    BRANCH="main" # Default fallback
fi

echo "=========================================="
echo "   S E B A G I A N  -  G I T  S Y N C"
echo "   Branch Saat Ini: $BRANCH"
echo "=========================================="
echo ""
echo "Pilih operasi:"
echo "  [1] ⬇️  PULL (Ambil perubahan dari GitHub)"
echo "  [2] ⬆️  PUSH (Upload perubahan ke GitHub)"
echo ""
read -p "Masukkan pilihan (1 atau 2): " choice

case $choice in
    1)
        echo ""
        echo "🔄  Melakukan git pull..."
        git pull origin "$BRANCH"
        ;;
    2)
        echo ""
        read -p "📝  Masukkan pesan commit: " commit_msg
        if [ -z "$commit_msg" ]; then
            commit_msg="Update otomatis: $(date)"
            echo "ℹ️  Pesan kosong, menggunakan: '$commit_msg'"
        fi
        
        echo "➕  Staging semua file..."
        git add .
        
        echo "💾  Committing..."
        git commit -m "$commit_msg"
        
        echo "🚀  Pushing ke origin/$BRANCH..."
        git push origin "$BRANCH"
        ;;
    *)
        echo "❌  Pilihan tidak valid."
        ;;
esac

echo ""
echo "Selesai. Script akan tertutup dalam 5 detik..."
sleep 5
