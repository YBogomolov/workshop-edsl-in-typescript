import { coolPost, john } from '../../domain';

import { exampleProgram1, exampleProgram2, exampleProgram3 } from './examples';
import { getTaskInterpreter, logger } from './interpreters';

(async () => {
  const taskI = getTaskInterpreter();
  const interpreter = logger(taskI);

  console.log('exampleProgram1');
  await exampleProgram1(interpreter)(john.id)();
  console.log('exampleProgram2');
  await exampleProgram2(interpreter)(coolPost)();
  console.log('exampleProgram3');
  await exampleProgram3(interpreter)(1, coolPost)();
})();