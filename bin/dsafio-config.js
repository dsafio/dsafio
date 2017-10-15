#!/usr/bin/env node

/* eslint-disable no-multi-spaces */
const program = require('commander');
const pkg = require('../package.json');
const config = require('../lib/config');
/* eslint-enable no-multi-spaces */

program.version(pkg.version).parse(process.argv);

// const operation = program.args.shift();

if (!['get', 'set'].includes(operation)) {
  console.error('Invalid config operation. See --help for more info.');
  process.exit(1);
}

// switch (operation) {
//   case 'get':
//     var args;
//
//     if (program.args.length) args = program.args;
//
//     config
//       .get(args)
//       .then(entries =>
//         Object.keys(entries)
//           .map(key => `${key}=${entries[key]}`)
//           .join('\n')
//       )
//       .then(console.info.bind(console))
//       .catch(error => {
//         ['EACCES', 'ENOENT'].includes(error.code)
//           ? console.error('Inaccessible or inexistent configuration file')
//           : console.error(
//               'Something went wrong while reading configuration file'
//             );
//         process.exit(1);
//       });
//     break;
//
//   case 'set':
//     // Promise.resolve()
//     //   .then(() => {
//     //     if (!program.args[0] || !program.args[1]) {
//     //       throw new Error('Invalid key/value');
//     //     }
//     //
//     //     return { [program.args[0]]: program.args[1] };
//     //   })
//     //   .then(config.set)
//     //   .catch(error => {
//     //     ['EACCES', 'ENOENT'].includes(error.code)
//     //       ? console.error('Inaccessible or inexistent configuration file')
//     //       : console.error(
//     //           'Something went wrong while reading configuration file'
//     //         );
//     //     process.exit(1);
//     //   });
//     break;
// }
