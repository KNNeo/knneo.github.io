#!/bin/bash
# cleanup_install.sh
# This script cleans up Zorin OS and adds apps, imports config etc for install setup
# Before run: Put all this in local folder, allow execution (chmod +x), and run using bash <filename>
set -e
echo "=========================================================================================="
echo "Note: This is based on Zorin OS 18.0 and may have discrapencies if used on newer versions."
echo "Press Ctrl+C to stop now, starting in 10s..."
sleep 10
echo "=================================="
echo "Removing all pre-installed apps..."
sleep 3
sudo apt purge -y brasero
sudo apt purge -y cheese
sudo apt purge -y deja-dup
sudo apt purge -y evolution
sudo apt purge -y libreoffice* && sudo apt install libreoffice-gtk3 && sudo apt install -y libreoffice-calc
sudo apt purge -y remmina
sudo apt purge -y totem
sudo apt purge -y gnome-calendar
sudo apt purge -y gnome-clocks
sudo apt purge -y gnome-contacts
sudo apt purge -y gnome-photos
sudo apt purge -y gnome-power-manager
sudo apt purge -y gnome-weather
sudo apt purge -y gnome-snapshot
sudo apt purge -y gnome-sound-recorder
sudo apt purge -y rhythmbox*
sudo apt purge -y brave-browser
sudo apt purge -y malcontent
sudo apt autoremove -y
echo "==============================================================================================="
echo "Note: Apps that are unable to remove that appear in menu, use Edit Menu via Start Menu to hide."
echo "Add to this list for more pre-installed apps to remove."
sleep 5
echo "======================================"
echo "Adding UI for flatpak access rights..."
sleep 3
flatpak install -y flathub com.github.tchx84.Flatseal
echo "========================================="
echo "Adding video player and custom scripts..."
sleep 3
sudo apt install -y celluloid
# add mpv-gif.lua script to be able to capture frames and export as gif on video dir
mkdir -p ~/.config/mpv/scripts
cp ./config/mpv-crop.lua ~/.config/mpv/scripts/
cp ./config/mpv-gif.lua ~/.config/mpv/scripts/
cp ./config/persist-mute.lua ~/.config/mpv/scripts/
cp ./config/theme-system.lua ~/.config/mpv/scripts/
echo "==================================="
echo "Adding apps for image processing..."
sleep 3
# install GIMP
sudo flatpak remote-add --if-not-exists flathub https://flathub.org/repo/flathub.flatpakrepo
sudo flatpak install -y flathub org.gimp.GIMP
sudo flatpak install -y flathub com.xnview.XnConvert
sudo apt install -y gthumb
# cwkawka for similar image search and fix, onefolder also has this feature but less strict
echo "======================================"
echo "Adding cwkawka and importing config..."
sleep 3
sudo flatpak install -y flathub com.github.qarmin.czkawka
# cwkawka settings: gaussian, hash size 16, gradient, similarity 20"
echo "====================================================================="
echo "Note: If find similar images in cwkawka, use symlink to exclude pair."
echo "ACTION REQUIRED!! Import config from ./config/czkawka_gui_config_4.txt in app."
read -n 1 -s -r -p "Press any key to continue...
"
echo "=============================="
echo "Adding apps for blog export..."
sleep 3
# use mono to compile and run via terminal (see note)
# use sqlitebrowser to run index script (see note)
sudo apt install -y mono-complete
sudo apt install -y sqlitebrowser
flatpak install -y flathub com.vscodium.codium
mkdir -p ~/Documents/Repositories
flatpak override --user com.vscodium.codium --filesystem=~/Documents/Repositories
echo "==================================="
echo "Adding apps for audio processing..."
sleep 3
sudo apt install -y puddletag
sudo apt install -y audacity
sudo apt install -y pavucontrol
echo "=============================="
echo "Adding apps for general use..."
sleep 3
sudo apt install -y qbittorrent
sudo apt install -y winff
sudo apt install -y input-remapper
flatpak install -y flathub com.github.finefindus.eyedropper
flatpak install -y flathub net.codelogistics.clicker
flatpak install -y flathub io.github.seadve.Kooha
flatpak install -y flathub org.telegram.desktop
flatpak install -y flathub com.vivaldi.Vivaldi
flatpak install -y flathub app.zen_browser.zen
flatpak install -y flathub io.github.quantum_mutnauq.pictures_converter_gtk
echo "=============================="
echo "Install logitech device manager..."
sleep 3
flatpak install -y flathub io.github.pwr_solaar.solaar
sudo wget https://raw.githubusercontent.com/pwr-Solaar/Solaar/master/rules.d-uinput/42-logitech-unify-permissions.rules -O /etc/udev/rules.d/42-logitech-unify-permissions.rules
sudo udevadm control --reload-rules && sudo udevadm trigger
echo "======================"
echo "Add debian packages..."
sleep 3
# chrome browser
sudo dpkg -i ./packages/google-chrome-stable_current_amd64.deb
# to host klassicnoteweb locally
sudo dpkg -i ./packages/fileserve_amd64.deb
# fix any missing dependencies
sudo apt install -f -y
echo "======================================="
echo "Extract and install download manager..."
sleep 3
TMPDIR=$(mktemp -d)
tar -xf ./packages/xdm-setup-7.2.11.tar.xz -C "$TMPDIR"
chmod +x "$TMPDIR"/install.sh
sudo "$TMPDIR"/install.sh
rm -rf "$TMPDIR"
echo "========================"
echo "Add extension manager..."
sleep 3
flatpak install -y flathub com.mattjakeman.ExtensionManager
echo "=========================================================="
echo "ACTION REQUIRED!! Search and add the following extensions:"
echo "[unblank lock screen] [qstweak] [tiling shell, import tilingshell-layouts.json] [blur my shell, enable lockscreen blur] [notification banner position] [smile]"
read -n 1 -s -r -p "Press any key to continue...
"
echo "============================"
echo "Adding emoji selector app..."
sleep 3
flatpak install -y flathub it.mijorus.smile
echo "=============================================================="
echo "ACTION REQUIRED!! To make it work on custom keyboard shortcut:"
echo "Open Settings -> Keyboard -> Custom Shortcuts -> Add name [smile emoji picker] command [flatpak run it.mijorus.smile] shortcut [Super] + [.] and save"
read -n 1 -s -r -p "Press any key to continue...
"
echo "========================================="
echo "Add Brother 1610W laser printer driver (manual input required)..."
sleep 3
sudo bash ./packages/linux-brprinter-installer-2.2.4-1
echo "====================================================="
echo "Note: Use built-in Document Scanner to detect printer"
read -n 1 -s -r -p "Press any key to continue...
"
echo "==========================="
echo "Adding AppImage packages..."
sleep 3
mkdir -p ~/.local/bin ~/.local/share/applications ~/.local/share/icons
# If compression does not work, do using terminal: tar -cJf OneFolder-<ver>.tar.xz OneFolder-<ver>.AppImage
TMPDIR=$(mktemp -d)
tar -xf ./packages/OneFolder-1.1.2.tar.xz -C "$TMPDIR"
chmod +x "$TMPDIR"/OneFolder-1.1.2.AppImage
mv "$TMPDIR"/OneFolder-1.1.2.AppImage ~/.local/bin/OneFolder.AppImage
rm -rf "$TMPDIR"
# icon get from official github, at https://github.com/allusion-app/Allusion/tree/master/resources/logo/png/full-color
cp ./config/onefolder.png ~/.local/share/icons/onefolder.png
mkdir -p /.local/share/applications
HOMEDIR="$HOME"
cat > ~/.local/share/applications/onefolder.desktop <<EOF
[Desktop Entry]
Name=OneFolder
Comment=Lightweight image annotation tool
Exec=$HOMEDIR/.local/bin/OneFolder.AppImage
Icon=$HOMEDIR/.local/share/icons/onefolder.png
Terminal=false
Type=Application
Categories=Graphics;
EOF
# refresh menu
update-desktop-database ~/.local/share/applications
echo "========================"
echo "Fetching github repos..."
sleep 3
sudo apt install git -y
echo "=================="
echo "Clone knreports..."
git clone https://github.com/KNNeo/knreports.git ~/Documents/Repositories
echo "========================"
echo "Clone knneo.github.io..."
git clone https://github.com/KNNeo/knneo.github.io.git ~/Documents/Repositories
echo "======================="
echo "Clone klassicnoteweb..."
git clone https://github.com/KNNeo/klassicnoteweb.git ~/Documents/Repositories
mv ./config/knneo.code-workspace ~/Documents/Repositories
echo "==================================="
echo "Setup complete. Restarting in 5s..."
sleep 5
reboot

