#!/bin/bash
# setup_aliases.sh
# This script adds all custom aliases to the current shell and optionally appends them to .bashrc
# Before run: Put all this in local folder, allow execution (chmod +x), and run using bash <filename>

# custom aliases
alias import='sudo mcs -out:/home/kaineng/Documents/Workspaces/import.exe -r:System.Drawing.dll,System.Net.Http.dll,System.Xml.Linq.dll,/home/kaineng/Documents/Workspaces/Newtonsoft.Json.dll,/home/kaineng/Documents/Workspaces/NUglify.dll /home/kaineng/Documents/Repositories/knreports/resources/import.cs && f(){ mono /home/kaineng/Documents/Workspaces/import.exe "$@"; }; f'
alias blog0='sudo nano /home/kaineng/Documents/Repositories/knreports/posts/content.txt && import --posts --create'
alias blog1='import --posts'
alias blog2='import --images'
alias blog3='import --sitemap'
alias blog4='import --searchindex'
alias blog5='sudo mcs -out:/home/kaineng/Documents/Workspaces/export.exe -r:System.Drawing.dll,System.Net.Http.dll,System.Xml.Linq.dll,/home/kaineng/Documents/Workspaces/Newtonsoft.Json.dll,/home/kaineng/Documents/Workspaces/NUglify.dll /home/kaineng/Documents/Repositories/knreports/resources/export.cs && mono /home/kaineng/Documents/Workspaces/export.exe'
alias blog123='import --posts --images --sitemap'
alias blog135='import --posts --sitemap && blog5'
alias blog1234='import --posts --images --sitemap --searchindex'
alias blog1235='import --posts --images --sitemap && blog5'
alias blog12345='import --posts --images --sitemap --searchindex && blog5'
alias sync='gthumb && notify-send "Backup Started" "$(date "+%d %b %Y %I:%M:%S %p")" && rsync --times --group --owner --perms --links --update --delete --recursive --verbose /media/kaineng/PORTABLE/RBKN/ /media/kaineng/BACKUP/RBKN && notify-send "Backup Complete" "$(date "+%d %b %Y %I:%M:%S %p")" & exit'
alias knweb='fileserve /media/kaineng/PORTABLE/knweb --port 8003 & xdg-open http://localhost:8003 & exit'
alias knreports='fileserve /home/kaineng/Documents/Repositories/knreports --port 8004 & xdg-open http://localhost:8004 & exit'
# initial images must be in file format [<name>_<zero padded number>.jpeg]
alias magickmerge='mkdir -p merged && for odd in *_*.jpeg; do num="${odd##*_}"; ext="${num#*.}"; num="${num%.*}"; width="${#num}"; num=$((10#${num})); if ((num % 2 == 1)); then even="${odd%_*}_$(printf "%0${width}d" $((num + 1))).$ext"; echo "$odd [merge with]$even"; [ -f "$even" ] && convert "$odd" "$even" -append "merged/$odd"; fi; done'
alias gphotos='sudo mcs -out:/home/kaineng/Documents/Workspaces/99_Process_Google_Photo_Metadata.exe -r:/home/kaineng/Documents/Workspaces/Newtonsoft.Json.dll /home/kaineng/Documents/Repositories/knneo.github.io/csharp/Process_Google_Photo_Metadata.cs && mono /home/kaineng/Documents/Workspaces/99_Process_Google_Photo_Metadata.exe'
alias doaxvv='sudo mcs -out:/home/kaineng/Documents/Workspaces/Generate_ImageCollageV3Data_FromJSON.exe -r:System.Drawing.dll,System.Net.Http.dll,/home/kaineng/Documents/Workspaces/Newtonsoft.Json.dll /home/kaineng/Documents/Repositories/knneo.github.io/csharp/Generate_ImageCollageV3Data_FromJSON.cs && mono /home/kaineng/Documents/Workspaces/Generate_ImageCollageV3Data_FromJSON.exe'
alias gthumb='rsync --times --group --owner --perms --links --update --recursive --verbose /home/kaineng/.local/share/gthumb/catalogs /media/kaineng/PORTABLE/RBKN/My\ Workplace/Workplace/BACKUPS/GTHUMB'
alias recents='find /media/kaineng/PORTABLE/RBKN/Pictures/IDOLS/SEIYUU/ -type f \( -iname "*.jpg" -o -iname "*.jpeg" \) -newermt "1 week ago" | awk -F/ '\''NF>1{print $(NF-1)}'\'' | sort | uniq -c | sort -nr | head -n 20'
alias starred='grep -oP '\''/media/kaineng/PORTABLE/RBKN/Pictures/IDOLS/SEIYUU/\K[^/]*'\'' /home/kaineng/.local/share/gthumb/catalogs/Starred.catalog | sed '\''s/%20/ /g'\'' | sort | uniq -c | sort -nr | head -n 20'
alias disk='awk '\''{printf "Estimated writes (based on 600TBW): %.8f%%\n", ($10*512/1024/1024/1024)/600*100}'\'' /sys/block/sda/stat'
alias feed='unzip -j "$(ls -t /home/kaineng/Downloads/*.zip | head -n 1)" "Takeout/Blogger/Blogs/Klassic Note Reports/feed.atom" -d /home/kaineng/Downloads'

# --- Append to ~/.bashrc if not already present ---
BASHRC="$HOME/.bashrc"
SCRIPT_PATH="$(realpath "$0")"
if ! grep -Fxq "# Added by setup_aliases.sh" "$BASHRC"; then
    echo "" >> "$BASHRC"
    echo "# Added by setup_aliases.sh" >> "$BASHRC"
    tail -n +4 "$SCRIPT_PATH" >> "$BASHRC"  # skip the shebang and comment
fi

echo "Aliases loaded for current session. Restart your shell to persist."

