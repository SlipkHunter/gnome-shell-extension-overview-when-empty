BUNDLE_PATH = "overview-when-empty@slipkhunter.github.io.zip"
EXTENSION_DIR = "overview-when-empty@slipkhunter.github.io"

all: build install clean

build:
	rm -f $(BUNDLE_PATH)
	gnome-extensions pack --extra-source=LICENSE --force; \
	mv $(EXTENSION_DIR).shell-extension.zip $(BUNDLE_PATH)

install:
	gnome-extensions uninstall $(EXTENSION_DIR) || rm -rf ~/.local/share/gnome-shell/extensions/$(EXTENSION_DIR)/
	gnome-extensions install $(BUNDLE_PATH) --force

clean:
	@rm -fv $(BUNDLE_PATH)

follow-log:
	journalctl -f /usr/bin/gnome-shell