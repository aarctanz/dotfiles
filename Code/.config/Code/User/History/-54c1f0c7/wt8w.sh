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

  # Do a dry run to find what will be linked
#   while IFS= read -r line; do
#     target="$HOME/$(echo "$line" | awk -F' -> ' '{print $2}')"

#     # Backup if file/folder exists and is NOT a symlink
#     if [ -e "$target" ] && [ ! -L "$target" ]; then
#       echo "⚠️  $target exists, backing it up to ${target}.bak"
#       mv "$target" "${target}.bak"
#     fi
#   done < <(stow -nv "$pkg" 2>&1 | grep 'LINK:')

  # Actually stow it
  mkdir -p "$DOTFILES_DIR/$pkg/.config"
  mv "~/.config/$pkg" "$DOTFILES_DIR/$pkg/.config"
  stow -v "$pkg" 2>&1 | grep 'LINK:'
  # Check if stow was successful
  if [ $? -ne 0 ]; then
    echo "❌ Stow failed for $pkg. Please check the output above."
    exit 1
  fi
  stow "$pkg"
done

echo -e "\n✅ All done! Your configs are safely stowed."
