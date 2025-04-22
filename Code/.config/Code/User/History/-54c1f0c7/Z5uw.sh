#!/bin/bash

# List of your dotfile packages (folders inside ~/dotfiles)
DOTFILES_DIR="$HOME/dotfiles"
PACKAGES=(
alacritty
bottom
clipse
Code
dconf
fish
hypr
JetBrains
kitty
nvim
obsidian
pulse
swaync
Thunar
waybar
waypaper
yay
zed

)

echo "🔧 Starting dotfiles stow setup..."

cd "$DOTFILES_DIR" || { echo "❌ dotfiles directory not found!"; exit 1; }

for pkg in "${PACKAGES[@]}"; do
  echo -e "\n📦 Processing package: $pkg"
    # Backup if file/folder exists and is NOT a symlink
    if [ -e "$target" ] && [ ! -L "$target" ]; then
      echo "⚠️  $target exists, backing it up to ${target}.bak"
      mv "$target" "${target}.bak"
    fi
  done < <(stow -nv "$pkg" 2>&1 | grep 'LINK:')

  # Actually stow it
  stow "$pkg"
done

echo -e "\n✅ All done! Your configs are safely stowed."
