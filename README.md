
## Clone This Dotfiles Repository

Start by cloning your dotfiles repository to your home directory:

git clone git@github.com:aarctanz/dotfiles.git ~/dotfiles

## Install Stow
```sh
sudo pacman -Syu      
sudo pacman -S stow   
```

## Backup Existing Configs (Optional but Recommended)

If there are existing configuration files or directories that will be overwritten by stowing your dotfiles, back them up before proceeding:
```sh
mv ~/.config/nvim ~/.config/nvim.bak
mv ~/.config/fish ~/.config/fish.bak
```
Repeat for any other important files you want to back up.
## Stow Your Dotfiles


Run the following commands to stow your dotfiles:
```sh
cd ~/dotfiles
stow nvim        # For Neovim configurations
stow fish        # For Fish shell configurations
stow starship    # For Starship prompt configuration
```

### script to automate this
```sh
#!/bin/bash

DOTFILES_DIR="$HOME/dotfiles"

if [ ! -d "$DOTFILES_DIR" ]; then
  echo "❌ $DOTFILES_DIR not found! Please clone your dotfiles repo first."
  exit 1
fi

for pkg in "$DOTFILES_DIR"/*/; do
  if [ -d "$pkg" ]; then
    pkg_name=$(basename "$pkg")

    echo -e "\n📦 Stowing package: $pkg_name"

    stow "$pkg_name"
  fi
done

echo -e "\n✅ All dotfiles have been successfully stowed!"
```

## Done!

