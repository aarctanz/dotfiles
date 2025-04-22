#!/bin/bash

# List of your dotfile packages (folders inside ~/dotfiles)
DOTFILES_DIR="$HOME/dotfiles"
PACKAGES=(
  nvim
  fish
  hypr
  waybar
  starship
  git
alacritty
bottom
clipse
Code
dconf
fish
google-chrome
gopls
gtk-2.0
gtk-3.0
gtk-4.0
hypr
JetBrains
kitty
libreoffice
matplotlib
Meltytech
mimeapps.list
nautilus
nvim
obsidian
onlyoffice
pavucontrol.ini
pulse
QtProject.conf
starship.toml
swaync
Thunar
user-dirs.dirs
user-dirs.locale
vlc
waybar
waypaper
xfce4
xournalpp
yay
zed

)

echo "🔧 Starting dotfiles stow setup..."

cd "$DOTFILES_DIR" || { echo "❌ dotfiles directory not found!"; exit 1; }

for pkg in "${PACKAGES[@]}"; do
  echo -e "\n📦 Processing package: $pkg"

  # Do a dry run to find what will be linked
  while IFS= read -r line; do
    target="$HOME/$(echo "$line" | awk -F' -> ' '{print $2}')"

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
