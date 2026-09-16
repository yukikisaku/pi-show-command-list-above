# pi-command-list-above

## Overview

Render Pi's slash-command autocomplete list above the editor.

## Requirements

Requires a Pi version whose `CustomEditor` internals match this package. It patches editor rendering for the active process and restores the original renderer on session shutdown.

## Installation

```sh
pi install npm:@yukikisaku/pi-command-list-above
```

## Usage

Start Pi normally. Slash-command autocomplete is moved above the editor; if compatible internals cannot be read, Pi keeps its standard layout.

## Configuration

No configuration.

## Uninstallation

```sh
pi uninstall npm:@yukikisaku/pi-command-list-above
```

Remove any package-specific configuration described above if you no longer need it.

## License

MIT © yuki-kisaku. See [LICENSE](LICENSE).
