mkdir dist
cd userscript/
yarn install
yarn run build
# check if INSTALL=1
if [ "$INSTALL" = "1" ]; then
    # open new firefox tab with realpath of dist/SYNTAX+.user.js
    cd ../dist
    firefox -new-tab "file://$(realpath SYNTAX+.user.js)"
    echo "Installed SYNTAX+"
fi