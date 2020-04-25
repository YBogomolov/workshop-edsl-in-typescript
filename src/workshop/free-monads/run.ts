import * as F from 'fp-ts-contrib/lib/Free';
import { flow } from 'fp-ts/lib/function';
import * as T from 'fp-ts/lib/Task';

import { coolPost, john } from '../../domain';

import { exampleProgram1, exampleProgram2, exampleProgram3 } from './examples';
import { getTaskInterpreter, logger } from './interpreters';

(async () => {
  const taskI = getTaskInterpreter();
  const interpreter = flow(logger, taskI);

  console.log('exampleProgram1');
  await F.foldFree(T.task)(interpreter, exampleProgram1(john.id))();
  console.log('exampleProgram2');
  await F.foldFree(T.task)(interpreter, exampleProgram2(coolPost))();
  console.log('exampleProgram3');
  await F.foldFree(T.task)(interpreter, exampleProgram3(1, coolPost))();
})();