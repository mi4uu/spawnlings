.PHONY: default wm install_cask_apps install_apps

default:
	make check_homebrew
	make install_apps
	make install_cask_apps
	make check_vscode
	make check_vscode_insiders
	curl -fsSL https://bun.sh/install | bash


wm:
	cd fliziarz-feliks
	bun install
	bun build



APPSCASK := karabiner-elements orbstack pika phoenix topnotch dbeaver-community the-unarchiver vitals tabby
APPS := htop mongodb-community ssh hyperfine curl freetype tmux xplr zenity imagemagick curl ffmpeg fswatch watch bash fish nvim fd lsd as-tree


install_cask_apps:
	@for app in $(APPSCASK); do \
		if ! command -v $$app &> /dev/null; then \
			echo "Installing $$app..."; \
			brew install --cask $$app; \
		else \
			echo "$$app is already installed."; \
		fi \
	done

install_apps:
	@for app in $(APPS); do \
		if ! command -v $$app &> /dev/null; then \
			echo "Installing $$app..."; \
			brew install $$app; \
		else \
			echo "$$app is already installed."; \
		fi \
	done
check_homebrew:
	@if ! command -v brew >/dev/null; then \
		echo "Homebrew is not installed. Installing..."; \
		/bin/bash -c "$$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"; \
	else \
		echo "Homebrew is already installed. Updating..."; \
		brew update; \
	fi

check_vscode:
    @if ! which code > /dev/null; then \
        echo "VSCode is not installed. Installing..."; \
        brew install --cask visual-studio-code; \
    else \
        echo "VSCode is already installed."; \
    fi
check_vscode_insiders:
    @if ! which code-insiders > /dev/null; then \
        echo "VSCode is not installed. Installing..."; \
        brew install --cask visual-studio-code-insiders; \
    else \
        echo "VSCode is already installed."; \
    fi

