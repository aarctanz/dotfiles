#!/bin/bash

# List of your dotfile packages (folders inside ~/dotfiles)
DOTFILES_DIR="$HOME/dotfiles"
HOME_DIR="$HOME"
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
  # Actually stow it
  mkdir -p "$DOTFILES_DIR/$pkg/.config"
  mv "$HOME_DIR/.config/$pkg" "$DOTFILES_DIR/$pkg/.config"
  stow -v "$pkg" 2>&1 | grep 'LINK:'
  # Check if stow was successful
  if [ $? -ne 0 ]; then
    echo "❌ Stow failed for $pkg. Please check the output above."
    exit 1
  fi
  stow "$pkg"
done

echo -e "\n✅ All done! Your configs are safely stowed."
