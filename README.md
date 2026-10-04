# pi-show-command-list-above

## Overview

Render Pi's slash-command autocomplete list above the editor.

## Requirements

Requires a Pi version whose `CustomEditor` internals match this package. It patches editor rendering for the active process and restores the original renderer on session shutdown.

## Installation

```sh
pi install npm:@yukikisaku/pi-show-command-list-above
```

## Usage

Start Pi normally. Slash-command autocomplete is moved above the editor; if compatible internals cannot be read, Pi keeps its standard layout.

## Configuration

No configuration.

## Uninstallation

```sh
pi uninstall npm:@yukikisaku/pi-show-command-list-above
```

Remove any package-specific configuration described above if you no longer need it.

## Pull requests

This repository includes a policy for automatic AI review and merge of incoming pull requests. It becomes active when the CI and merge workflows are on `main` and the maintainer's GitHub event automation is enabled; a draft setup PR does not activate it.

Once active, AI reviews each non-draft PR and it is merged automatically only when the review has no findings, required CI succeeds, and there are no conflicts or unresolved review threads. New commits require a new review. Changes to the automation itself require manual merge. See [AI review and merge operations](docs/ai-review-operations.md).

## License

MIT © yuki-kisaku. See [LICENSE](LICENSE).
