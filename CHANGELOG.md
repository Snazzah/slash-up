# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]
## [1.3.0] - 2023-03-09
### Changed:
- slash-up can now be ran in ESM projects without error, using `@esbuild-kit/cjs-loader` instead of `ts-node` for module loading
## [1.2.1] - 2022-10-12
### Fixed:
- Call `process.exit` after syncing
- Print error stacktrace on command require errors
## [1.2.0] - 2022-06-14
### Changed:
- Updated `slash-create` to 5.6.1
### Added:
- `slash-up view` now shows DM permissions, default member permissions, and localizations. Default permission only shows if the value is false.
## [1.1.2] - 2022-05-06
### Changed:
- Updated `slash-create` to 5.5.3
### Fixed:
- Only transpile `.ts` files (should be faster)
- No longer logs invalid command errors
## [1.1.1] - 2022-04-29
### Changed:
- Updated `slash-create` to 5.5.2
### Fixed:
- Register errors now show the file's path
## [1.1.0] - 2022-04-03
### Added:
- slash-up will now find a `.env` file based on the env given in the CLI. For example, doing `slash-up list -e dev` will look for a `dev.env` file before finding `.env`.
## [1.0.11] - 2022-01-23
### Changed:
- Register command failures will now be logged with the debug flag is on
## [1.0.10] - 2022-01-06
### Fixed:
- `beforeSync` and `commandPath` flags not being used in config
- Requiring TypeScript files now uses `ts-node`. (This is a bit slow, it might be best to compile and set that as the path)
## [1.0.9] - 2022-01-02
### Fixed:
- Fix typescript importing again
- Fix some missing options in `slash-up local`
## [1.0.8] - 2021-12-31
### Fixed:
- Fix loading local commands in non-typescript environments
## [1.0.7] - 2021-12-29
### Fixed:
- Fixed dependencies for non-typescript environments
## [1.0.6] - 2021-12-26
### Fixed:
- Fix global to guild syncing to global aswell in `slash-up sync`
## [1.0.5] - 2021-12-21
### Fixed:
- Fixed a typo in `slash-up config`
## [1.0.4] - 2021-12-21
### Fixed:
- Fixed an error when a template is only provided in `slash-up init`
## [1.0.3] - 2021-12-21
### Fixed:
- Fixed comma and tabs in `slash-up config`
## [1.0.2] - 2021-12-21
### Added:
- `slash-up init` now installs packages and renames .env.example after cloning
### Fixed:
- Fixed creating a config file from `slash-up config`
## [1.0.1] - 2021-12-20
### Fixed:
- Fixed TS requiring config.
## [1.0.0] - 2021-12-20
- Initial release.

[Unreleased]: https://github.com/Snazzah/slash-up/compare/v1.3.0...HEAD
[1.0.0]: https://github.com/Snazzah/slash-up/releases/tag/v1.0.0
[1.0.1]: https://github.com/Snazzah/slash-up/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/Snazzah/slash-up/compare/v1.0.1...v1.0.2
[1.0.3]: https://github.com/Snazzah/slash-up/compare/v1.0.2...v1.0.3
[1.0.4]: https://github.com/Snazzah/slash-up/compare/v1.0.3...v1.0.4
[1.0.5]: https://github.com/Snazzah/slash-up/compare/v1.0.4...v1.0.5
[1.0.6]: https://github.com/Snazzah/slash-up/compare/v1.0.5...v1.0.6
[1.0.7]: https://github.com/Snazzah/slash-up/compare/v1.0.6...v1.0.7
[1.0.8]: https://github.com/Snazzah/slash-up/compare/v1.0.7...v1.0.8
[1.0.9]: https://github.com/Snazzah/slash-up/compare/v1.0.8...v1.0.9
[1.0.10]: https://github.com/Snazzah/slash-up/compare/v1.0.9...v1.0.10
[1.0.11]: https://github.com/Snazzah/slash-up/compare/v1.0.10...v1.0.11
[1.1.0]: https://github.com/Snazzah/slash-up/compare/v1.0.10...v1.1.0
[1.1.1]: https://github.com/Snazzah/slash-up/compare/v1.1.0...v1.1.1
[1.1.2]: https://github.com/Snazzah/slash-up/compare/v1.1.1...v1.1.2
[1.2.0]: https://github.com/Snazzah/slash-up/compare/v1.1.2...v1.2.0
[1.2.1]: https://github.com/Snazzah/slash-up/compare/v1.2.0...v1.2.1
[1.3.0]: https://github.com/Snazzah/slash-up/compare/v1.2.1...v1.3.0
