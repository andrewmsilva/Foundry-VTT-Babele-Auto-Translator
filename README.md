# Foundry VTT Compendium Translator

This project is a script designed to translate Foundry VTT compendiums from English. It takes Babele JSON files as input, translates them, and outputs the translated JSON files.

## Features

- Translate any Foundry VTT compendium.
- Supports multiple output languages.
- Converts measures to metric system.
- Easy to use and integrate into your workflow.

## Language Support

Please note that this script currently only supports translation from English. This is because the conversion of measurement units from the imperial system to the metric system is done using English-specific regular expressions. You can contribute by improving this feature.

## How to Use

1. Clone this repository to your local machine.
2. Install the dependencies by running `npm install` in the project root directory.
3. Place the JSON files you want to translate in the [`src/data/input`](command:_github.copilot.openRelativePath?%5B%22src%2Fdata%2Finput%22%5D "src/data/input") directory.
4. Run the script with `npm start`.
5. The translated JSON files will be output in the [`src/data/output`](command:_github.copilot.openRelativePath?%5B%22src%2Fdata%2Foutput%22%5D "src/data/output") directory.

## Dependencies

This project uses the following dependencies:

- Node.js
- npm

## Contributing

Contributions are welcome! Please read the contributing guide for more information.

## License

This project is licensed under the [MIT License](https://github.com/yourusername/yourrepository/blob/main/LICENSE).

## Contact

If you have any questions or issues, please open an issue on this repository.
