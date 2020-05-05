import { notImplemented } from '../../utils/throw';

(async () => {
  console.log('exampleProgram1: first run');
  await notImplemented();
  console.log('exampleProgram1: second run');
  await notImplemented();
  console.log('exampleProgram2');
  await notImplemented();
  console.log('exampleProgram3');
  await notImplemented();
})();